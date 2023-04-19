import { network } from 'config/networks';
import { chainInfos, NetworkChainId } from 'config/chainInfos';
import { TokenItemType, cosmosTokens } from 'config/bridgeTokens';
import { Key, Keplr as keplr, FeeCurrency, ChainInfo } from '@keplr-wallet/types';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { isMobile } from '@walletconnect/browser-utils';
import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import isEqual from 'lodash/isEqual';
export default class Keplr {
  constructor() {}

  disconnect() {
    // clear data?
  }

  // priority with owallet
  private get keplr(): keplr {
    return window.keplr;
  }

  async getOfflineSigner(chainId: string): Promise<OfflineSigner | OfflineDirectSigner> {
    return this.keplr.getOfflineSignerAuto(chainId);
  }

  async getChainInfosWithoutEndpoints(): Promise<
    Array<{
      chainId: string;
      feeCurrencies: FeeCurrency[];
    }>
  > {
    return this.keplr.getChainInfosWithoutEndpoints();
  }

  async suggestChain(chainId: string) {
    if (!window.keplr) return;
    const chainInfo = chainInfos.find((chainInfo) => chainInfo.chainId === chainId);

    // do nothing without chainInfo
    if (!chainInfo) return;

    // if there is chainInfo try to suggest, otherwise enable it
    if (!isMobile() && chainInfo) {
      await this.keplr.experimentalSuggestChain(chainInfo as ChainInfo);
    }
    await this.keplr.enable(chainId);

    // check to update newest Kawaiiverse chain info
    if (chainInfo.chainId === 'kawaii_6886-1') {
      const keplrChainInfos = await this.keplr.getChainInfosWithoutEndpoints();
      const keplrChain = keplrChainInfos.find((keplrChain) => keplrChain.chainId === chainInfo.chainId);
      if (
        keplrChain &&
        (keplrChain.bip44.coinType !== chainInfo.bip44.coinType ||
          !isEqual(keplrChain.feeCurrencies[0].gasPriceStep, chainInfo.feeCurrencies[0].gasPriceStep))
      ) {
        displayToast(TToastType.TX_INFO, {
          message:
            'Keplr recently sent out an update that affected the current flow of Kawaiiverse, please delete Kawaiiverse in Keplr and add it again'
        });
      }
    }
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
        if (event.target && (event.target as Document).readyState === 'complete') {
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
  }

  async getKeplrAddr(chainId?: NetworkChainId): Promise<string | undefined> {
    // not support network.chainId (Oraichain)
    chainId = chainId ?? network.chainId;
    const token = cosmosTokens.find((token) => token.chainId === chainId);
    if (!token) return;
    try {
      const key = await this.getKeplrKey(chainId);
      return key?.bech32Address;
    } catch (ex) {
      console.log(ex, chainId);
    }
  }
}
