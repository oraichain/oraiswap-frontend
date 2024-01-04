import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { ChainInfo, FeeCurrency, Keplr as keplr, Key } from '@keplr-wallet/types';
import { isMobile } from '@walletconnect/browser-utils';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { chainInfos } from 'config/chainInfos';
import { BtcChainId, ChainIdEnum, NetworkChainId, TokenItemType, WalletType } from '@oraichain/oraidex-common';
import { network } from 'config/networks';
export type BitcoinMode = 'core' | 'extension' | 'mobile-web' | 'walletconnect';
import { CosmosChainId, BitcoinWallet } from '@oraichain/oraidex-common';
export interface IBitcoin {
  readonly version: string;
  /**
   * mode means that how Ethereum is connected.
   * If the connected Ethereum is browser's extension, the mode should be "extension".
   * If the connected Ethereum is on the mobile app with the embeded web browser, the mode should be "mobile-web".
   */
  readonly mode: BitcoinMode;
  signAndBroadcast(
    chainId: string,
    data: object
  ): Promise<{
    rawTxHex: string;
  }>;
  getKey(chainId: string): Promise<Key>;
}

export default class Bitcoin {
  //   async createCosmosSigner(chainId: CosmosChainId): Promise<OfflineSigner> {
  //     const keplr = await window.Keplr.getKeplr();
  //     if (!keplr) {
  //       throw new Error('You have to install Keplr first if you do not use a mnemonic to sign transactions');
  //     }
  //     // use keplr instead
  //     return await keplr.getOfflineSignerAuto(chainId);
  //   }

  // typeWallet: WalletType;
  constructor() {
    // super();
    // this.typeWallet = type;
  }

  disconnect() {
    // clear data?
  }

  // priority with owallet
  private get bitcoin(): IBitcoin {
    return window.bitcoin;
  }

  //   async getChainInfosWithoutEndpoints(): Promise<
  //     Array<{
  //       chainId: string;
  //       feeCurrencies: FeeCurrency[];
  //     }>
  //   > {
  //     return this.bitcoin.getChainInfosWithoutEndpoints();
  //   }

  //   async suggestChain(chainId: string) {
  //     if (!window.keplr) return;
  //     const chainInfo = chainInfos.find((chainInfo) => chainInfo.chainId === chainId);

  //     // do nothing without chainInfo
  //     if (!chainInfo) return;

  //     // if there is chainInfo try to suggest, otherwise enable it
  //     if (!isMobile() && chainInfo) {
  //       await this.keplr.experimentalSuggestChain(chainInfo as ChainInfo);
  //     }
  //     await this.keplr.enable(chainId);
  //     if (isMobile()) return;
  //     const keplrChainInfos = await this.keplr.getChainInfosWithoutEndpoints();
  //     const keplrChain = keplrChainInfos.find((keplrChain) => keplrChain.chainId === chainInfo.chainId);
  //     if (!keplrChain) return;

  //     // check to update newest chain info
  //     if (keplrChain.bip44.coinType !== chainInfo.bip44.coinType || !keplrChain.feeCurrencies?.[0]?.gasPriceStep) {
  //       displayToast(TToastType.TX_INFO, {
  //         message: `${keplrChain.chainName} has Keplr cointype ${keplrChain.bip44.coinType}, while the chain info config cointype is ${chainInfo.bip44.coinType}. Please reach out to the developers regarding this problem!`
  //       });
  //     }
  //   }

  //   async suggestToken(token: TokenItemType) {
  //     // suggestToken is for cosmosBased only
  //     if (token.cosmosBased && token.contractAddress) {
  //       const keplr = await this.getKeplr();
  //       if (!keplr) {
  //         return displayToast(TToastType.KEPLR_FAILED, {
  //           message: 'You need to install Keplr to continue'
  //         });
  //       }

  //       await keplr.suggestToken(String(token.chainId), token.contractAddress);
  //     }
  //   }

  async getBitcoin(): Promise<IBitcoin | undefined> {
    if (document.readyState === 'complete') {
      return this.bitcoin;
    }

    return new Promise((resolve) => {
      const documentStateChange = (event: Event) => {
        if (event.target && (event.target as Document).readyState === 'complete') {
          resolve(this.bitcoin);
          document.removeEventListener('readystatechange', documentStateChange);
        }
      };

      document.addEventListener('readystatechange', documentStateChange);
    });
  }

  async getBitcoinKey(chainId?: string): Promise<Key | undefined> {
    try {
      chainId = chainId ?? network.chainId;
      if (!chainId) return undefined;

      const bitcoin = await this.getBitcoin();
      if (bitcoin) {
        return bitcoin.getKey(chainId);
      }
    } catch (error) {
      console.log('🚀 ~ file: keplr.ts:112 ~ Keplr ~ getKeplrKey ~ error:', error);
    }
  }

  async getAddress(chainId: BtcChainId = ChainIdEnum.BitcoinTestnet): Promise<string | undefined> {
    // not support network.chainId (Oraichain)
    // chainId = chainId ?? network.chainId;
    // const token = cosmosTokens.find((token) => token.chainId === chainId);
    // if (!token) return;
    try {
      const key = await this.getBitcoinKey(chainId);
      return key?.bech32Address;
    } catch (ex) {
      console.log(ex, chainId);
    }
  }
  async signAndBroadCast(
    chainId: BtcChainId = ChainIdEnum.BitcoinTestnet,
    data: object
  ): Promise<{
    rawTxHex: string;
  }> {
    try {
      const bitcoin = await this.getBitcoin();
      const rs = await bitcoin.signAndBroadcast(chainId, data);
      return rs;
    } catch (ex) {
      console.log(ex, chainId);
    }
  }
}
