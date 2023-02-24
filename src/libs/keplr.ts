import { network } from 'config/networks';
import { embedChainInfos } from 'config/chainInfos';
import { filteredTokens, TokenItemType } from 'config/bridgeTokens';
import createHash from 'create-hash';
import { Bech32Address } from '@keplr-wallet/cosmos';
import { Key, Keplr as keplr, FeeCurrency } from '@keplr-wallet/types';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { isMobile } from '@walletconnect/browser-utils';
import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';

const hash160 = (buffer: Uint8Array) => {
  var t = createHash('sha256').update(buffer).digest();
  return createHash('rmd160').update(t).digest();
};

export default class Keplr {
  constructor() {}

  disconnect() {
    // clear data?
  }

  // priority with owallet
  private get keplr(): keplr {
    return window.keplr;
  }

  async getOfflineSigner(
    chainId: string
  ): Promise<OfflineSigner | OfflineDirectSigner> {
    return this.keplr.getOfflineSignerAuto(chainId);
  }

  async getChainInfosWithoutEndpoints(): Promise<Array<{
    chainId: string,
    feeCurrencies: FeeCurrency[]
  }>> {
    return this.keplr.getChainInfosWithoutEndpoints();
  }

  async suggestChain(chainId: string) {
    if (!window.keplr) return;
    const chainInfo = embedChainInfos.find(
      (chainInfo) => chainInfo.chainId === chainId
    );

    // do nothing without chainInfo
    if (!chainInfo) return;

    // if there is chainInfo try to suggest, otherwise enable it
    if (!isMobile() && chainInfo) {
      await this.keplr.experimentalSuggestChain(chainInfo);
    }
    await this.keplr.enable(chainId);
  }

  async suggestToken(token: TokenItemType) {
    // suggestToken is for cosmosBased only
    if (token.cosmosBased && token.contractAddress) {
      const keplr = await this.getKeplr();
      if (!keplr) {
        return displayToast(TToastType.KEPLR_FAILED, {
          message: 'You need to install Keplr to continue'
        });
      }

      await keplr.suggestToken(String(token.chainId), token.contractAddress);
    }
  }

  async getKeplr(): Promise<keplrType | undefined> {
    if (document.readyState === 'complete') {
      return this.keplr;
    }

    return new Promise((resolve) => {
      const documentStateChange = (event: Event) => {
        if (
          event.target &&
          (event.target as Document).readyState === 'complete'
        ) {
          resolve(this.keplr);
          document.removeEventListener('readystatechange', documentStateChange);
        }
      };

      document.addEventListener('readystatechange', documentStateChange);
    });
  }

  async getKeplrKey(chainId?: string): Promise<Key | undefined> {
    chainId = chainId ?? network.chainId;
    if (!chainId) return undefined;
    const keplr = await this.getKeplr();
    if (keplr) {
      return keplr.getKey(chainId);
    }
    return undefined;
  }

  async getKeplrAddr(chainId?: string): Promise<string | undefined> {
    // not support network.chainId (Oraichain)
    chainId = chainId ?? network.chainId;
    const token = filteredTokens.find((token) => token.chainId === chainId);
    if (!token) return;
    const key = await this.getKeplrKey(chainId);
    return key?.bech32Address;
  }

  async getKeplrPubKey(chainId?: string): Promise<Uint8Array | undefined> {
    const key = await this.getKeplrKey(chainId);
    return key?.pubKey;
  }

  async getKeplrBech32Address(
    chainId?: string
  ): Promise<Bech32Address | undefined> {
    const pubkey = await this.getKeplrPubKey(chainId);

    if (!pubkey) return undefined;
    const address = hash160(pubkey);
    return new Bech32Address(address);
  }
}
