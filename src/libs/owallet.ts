import { isAndroid, isMobile } from '@walletconnect/browser-utils';
import { mobileBlacklistNetworks, network } from 'config/networks';
import { embedChainInfos } from 'config/chainInfos';
import WalletConnect from '@walletconnect/client';
import { OWalletWalletConnectV1 } from '@owallet/wc-client';
import { IJsonRpcRequest, IRequestOptions } from '@walletconnect/types';
import { BroadcastMode, StdTx } from '@cosmjs/launchpad';
import Axios from 'axios';
import { OWalletQRCodeModalV1 } from '@owallet/wc-qrcode-modal';
import { filteredTokens } from 'config/bridgeTokens';
import createHash from 'create-hash';
import { Bech32Address } from '@owallet/cosmos';
import { Key } from '@owallet/types';

const hash160 = (buffer: Uint8Array) => {
  var t = createHash('sha256').update(buffer).digest();
  return createHash('rmd160').update(t).digest();
};

const sendTx = async (
  chainId: string,
  tx: StdTx | Uint8Array,
  mode: BroadcastMode
): Promise<Uint8Array> => {
  const restInstance = Axios.create({
    baseURL: filteredTokens.find((token) => token.chainId === chainId)!.lcd
  });

  const isProtoTx = Buffer.isBuffer(tx) || tx instanceof Uint8Array;

  const params = isProtoTx
    ? {
        tx_bytes: Buffer.from(tx as any).toString('base64'),
        mode: (() => {
          switch (mode) {
            case 'async':
              return 'BROADCAST_MODE_ASYNC';
            case 'block':
              return 'BROADCAST_MODE_BLOCK';
            case 'sync':
              return 'BROADCAST_MODE_SYNC';
            default:
              return 'BROADCAST_MODE_UNSPECIFIED';
          }
        })()
      }
    : {
        tx,
        mode: mode
      };

  const result = await restInstance.post(
    isProtoTx ? '/cosmos/tx/v1beta1/txs' : '/txs',
    params
  );

  const txResponse = isProtoTx ? result.data['tx_response'] : result.data;

  if (txResponse.code != null && txResponse.code !== 0) {
    throw new Error(txResponse['raw_log']);
  }

  return Buffer.from(txResponse.txhash, 'hex');
};
export default class OWallet {
  private walletConnector: WalletConnect | undefined;
  constructor() {}

  suggestChain = async (chainId: string) => {
    if (!window.owallet) return;
    const chainInfo = embedChainInfos.find(
      (chainInfo) => chainInfo.chainId === chainId
    );
    if (!isMobile()) {
      // if there is chainInfo try to suggest, otherwise enable it
      if (chainInfo) {
        await window.owallet.experimentalSuggestChain(chainInfo);
      }
      await window.owallet.enable(chainId);
    } else if (!mobileBlacklistNetworks.includes(chainId)) {
      await window.owallet.enable(chainId);
    }
  };

  onWalletConnectDisconnected = (error: Error | null) => {
    if (error) {
      console.log(error);
    } else {
      this.disconnect();
    }
  };

  /**
   * Disconnect the wallet regardless of wallet type (extension, wallet connect)
   */
  disconnect() {
    if (this.walletConnector) {
      if (this.walletConnector.connected) {
        this.walletConnector.killSession();
      }
      this.walletConnector = undefined;
    }
  }

  async getMobileOWallet(): Promise<owalletType | undefined> {
    if (!this.walletConnector) {
      this.walletConnector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        storageId: 'owallet',
        signingMethods: [],
        qrcodeModal: new OWalletQRCodeModalV1()
      });
      // XXX: I don't know why they designed that the client meta options in the constructor should be always ingored...
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.walletConnector._clientMeta = {
        name: 'Oraichain',
        description: 'Oraichain is the first IBC-native Cosmos interchain AMM',
        url: 'https://oraidex.io',
        icons: ['https://dhj8dql1kzq2v.cloudfront.net/owallet-256x256.png']
      };

      this.walletConnector!.on('disconnect', this.onWalletConnectDisconnected);
    }

    // console.log(this.walletConnector);
    if (!this.walletConnector.connected) {
      try {
        await this.walletConnector!.connect();
      } catch (e) {
        console.log(e);
        // XXX: Due to the limitation of cureent account store implementation.
        //      We shouldn't throw an error (reject) on the `getOWallet()` method.
        //      So return the `undefined` temporarily.
        //      In this case, the wallet will be considered as `NotExist`
        return undefined;
      }
    }

    return new OWalletWalletConnectV1(this.walletConnector!, {
      sendTx,
      onBeforeSendRequest: this.onBeforeSendRequest
    });
  }

  protected onBeforeSendRequest = (request: Partial<IJsonRpcRequest>): void => {
    if (!isMobile()) {
      return;
    }

    const deepLink = isAndroid()
      ? 'intent://wcV1#Intent;package=com.chainapsis.owallet;scheme=owalletwallet;end;'
      : 'owalletwallet://wcV1';

    switch (request.method) {
      case 'owallet_enable_wallet_connect_v1':
        // OWallet mobile requests another per-chain permission for each wallet connect session.
        // By the current logic, `enable()` is requested immediately after wallet connect is connected.
        // However, in this case, two requests are made consecutively.
        // So in ios, the deep link modal pops up twice and confuses the user.
        // To solve this problem, enable on the osmosis chain does not open deep links.
        if (
          request.params &&
          request.params.length === 1 &&
          request.params[0] === network.chainId
        ) {
          break;
        }
        window.location.href = deepLink;
        break;
      case 'owallet_sign_amino_wallet_connect_v1':
        window.location.href = deepLink;
        break;
    }

    return;
  };

  async getOWallet(): Promise<owalletType | undefined> {
    if (isMobile()) {
      if (!window.owallet) {
        const owallet = await this.getMobileOWallet();
        if (owallet) window.owallet = owallet;
      }
      return window.owallet;
    }

    if (document.readyState === 'complete') {
      return window.owallet;
    }

    return new Promise((resolve) => {
      const documentStateChange = (event: Event) => {
        if (
          event.target &&
          (event.target as Document).readyState === 'complete'
        ) {
          resolve(window.owallet);
          document.removeEventListener('readystatechange', documentStateChange);
        }
      };

      document.addEventListener('readystatechange', documentStateChange);
    });
  }

  private async getOWalletKey(chainId?: string): Promise<Key | undefined> {
    chainId = chainId ?? network.chainId;
    if (!chainId) return undefined;
    const owallet = await this.getOWallet();
    if (owallet) {
      return owallet.getKey(chainId);
    }
    return undefined;
  }

  async getOWalletAddr(chainId?: string): Promise<string | undefined> {
    // not support network.chainId (Oraichain)
    chainId = chainId ?? network.chainId;
    const token = filteredTokens.find((token) => token.chainId === chainId);
    if (!token) return;
    if (isMobile() && mobileBlacklistNetworks.includes(token.chainId)) {
      const address = await this.getOWalletBech32Address('osmosis-1');
      return address?.toBech32(token.prefix!);
    }

    const key = await this.getOWalletKey(chainId);
    return key?.bech32Address;
  }

  async getOWalletPubKey(chainId?: string): Promise<Uint8Array | undefined> {
    const key = await this.getOWalletKey(chainId);
    return key?.pubKey;
  }

  async getOWalletBech32Address(
    chainId?: string
  ): Promise<Bech32Address | undefined> {
    const pubkey = await this.getOWalletPubKey(chainId);

    if (!pubkey) return undefined;
    const address = hash160(pubkey);
    return new Bech32Address(address);
  }
}
