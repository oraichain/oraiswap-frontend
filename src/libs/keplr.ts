import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { ChainInfo, FeeCurrency, Keplr as keplr, Key } from '@keplr-wallet/types';
import { isMobile } from '@walletconnect/browser-utils';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { cosmosTokens, TokenItemType } from 'config/bridgeTokens';
import { chainInfos, NetworkChainId } from 'config/chainInfos';
import { WalletType } from 'config/constants';
import { network } from 'config/networks';
export default class Keplr {
  typeWallet: WalletType;
  constructor(type: WalletType = 'keplr') {
    this.typeWallet = type;
  }

  disconnect() {
    // clear data?
  }

  // priority with owallet
  private get keplr(): keplr {
    return this.typeWallet === 'owallet' ? window.owallet : window.keplr;
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
    if (isMobile()) return;
    const keplrChainInfos = await this.keplr.getChainInfosWithoutEndpoints();
    const keplrChain = keplrChainInfos.find((keplrChain) => keplrChain.chainId === chainInfo.chainId);
    if (!keplrChain) return;

    // check to update newest chain info
    if (keplrChain.bip44.coinType !== chainInfo.bip44.coinType || !keplrChain.feeCurrencies?.[0]?.gasPriceStep) {
      displayToast(TToastType.TX_INFO, {
        message: `Keplr recently sent out an update that affected the current flow of ${keplrChain.chainName}, please delete ${keplrChain.chainName} in Keplr and add it again`
      });
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
