import { OfflineSigner } from '@cosmjs/proto-signing';
import { ChainInfo, FeeCurrency, Keplr as keplr, Key } from '@keplr-wallet/types';
import { isMobile } from '@walletconnect/browser-utils';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { chainInfos } from 'config/chainInfos';
import { NetworkChainId, TokenItemType, WalletType } from '@oraichain/oraidex-common';
import { network } from 'config/networks';
import { suggestChain as suggestChainLeap } from '@leapwallet/cosmos-snap-provider';
import { CosmjsOfflineSigner, ChainInfo as ChainInfoLeap } from '@leapwallet/cosmos-snap-provider';
import { getSnap } from '@leapwallet/cosmos-snap-provider';
import { CosmosChainId, CosmosWallet } from '@oraichain/oraidex-common';
import { chainInfoWithoutIcon, checkSnapExist, getAddressByEIP191, getAddressBySnap, getChainSupported } from 'helper';
import { MetamaskOfflineSigner } from './eip191';

export default class Keplr extends CosmosWallet {
  async createCosmosSigner(chainId: CosmosChainId): Promise<OfflineSigner> {
    const keplr = await this.getKeplr();
    const snapInstalled = await checkSnapExist();
    if (keplr) return await keplr.getOfflineSignerAuto(chainId);
    if (snapInstalled) return new CosmjsOfflineSigner(chainId);
    return await MetamaskOfflineSigner.connect(window.ethereum, network.denom);
  }

  typeWallet: WalletType | 'eip191';
  constructor(type: WalletType | 'eip191' = 'keplr') {
    super();
    this.typeWallet = type;
  }

  disconnect() {
    // clear data?
  }

  // priority with owallet
  private get keplr(): keplr {
    if (this.typeWallet === 'owallet') {
      return window.owallet;
    } else if (this.typeWallet === 'keplr') {
      return window.keplr;
    }
    return null;
  }

  async getChainInfosWithoutEndpoints(chainId): Promise<
    Array<{
      chainId: string;
      feeCurrencies: FeeCurrency[];
    }>
  > {
    // TODO: need check
    const isSnap = await checkSnapExist();
    const isKeplr = await this.getKeplr();
    if (isKeplr) return this.keplr.getChainInfosWithoutEndpoints();
    if (isSnap) {
      const rs = await getChainSupported();
      return [rs[chainId]];
    }
  }

  async suggestChain(chainId: string) {
    const isEnableKeplr = await this.getKeplr();
    const isLeapSnap = await checkSnapExist();
    if (isEnableKeplr) {
      if (!window.keplr) return;
      const chainInfo = chainInfos.find((chainInfo) => chainInfo.chainId === chainId);

      // do nothing without chainInfo
      if (!chainInfo) return;
      // if there is chainInfo try to suggest, otherwise enable it
      if (!isMobile()) {
        await this.keplr.experimentalSuggestChain(chainInfo as ChainInfo);
      }
      await this.keplr.enable(chainId);
      if (isMobile()) return;
      const keplrChainInfos = await this.keplr.getChainInfosWithoutEndpoints();
      const keplrChain = keplrChainInfos.find((keplrChain) => keplrChain.chainId === chainInfo.chainId);
      if (!keplrChain) return;

      const findFeeCurrencies = keplrChain.feeCurrencies.find((fee) => fee.gasPriceStep);
      // check to update newest chain info
      if (keplrChain.bip44.coinType !== chainInfo.bip44.coinType || !keplrChain.feeCurrencies?.[0]?.gasPriceStep) {
        // displayToast(TToastType.TX_INFO, {
        //   message: `${keplrChain.chainName} has Keplr cointype ${keplrChain.bip44.coinType}, while the chain info config cointype is ${chainInfo.bip44.coinType}. Please reach out to the developers regarding this problem!`
        // });
      }
    } else if (isLeapSnap) {
      const chainInfo: ChainInfoLeap = chainInfoWithoutIcon().find((chainInfo) => chainInfo.chainId === chainId);

      // // do nothing without chainInfo
      if (!chainInfo || chainInfo.bip44.coinType !== 118) return;
      const rs = await getChainSupported();
      if (!rs?.[chainId] || !rs?.[chainId]?.networkType) {
        await suggestChainLeap(chainInfo, { force: true });
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
    try {
      chainId = chainId ?? network.chainId;
      if (!chainId) return undefined;

      const keplr = await this.getKeplr();
      if (keplr) {
        return keplr.getKey(chainId);
      }
    } catch (error) {
      console.log('🚀 ~ file: keplr.ts:112 ~ Keplr ~ getKeplrKey ~ error:', error);
    }
  }

  async getKeplrAddr(chainId?: NetworkChainId): Promise<string | undefined> {
    // not support network.chainId (Oraichain)
    chainId = chainId ?? network.chainId;
    try {
      if (this.typeWallet === ('eip191' as any)) {
        // TODO: cache if type wallet is eip191 ( metamask cosmos )
        if (chainId !== 'Oraichain') return null;
        return getAddressByEIP191(chainId);
      }

      const isEnableKeplr = await this.getKeplr();
      const isEnableLeapSnap = await getSnap();
      if (isEnableKeplr && ['keplr', 'owallet'].includes(this.typeWallet)) {
        if (!this.keplr) throw new Error('Error: get window cosmos!');
        const { bech32Address } = await this.getKeplrKey(chainId);
        if (!bech32Address) throw Error('Not found address from keplr!');
        return bech32Address;
      }
      if (isEnableLeapSnap && this.typeWallet === 'leapSnap') {
        return getAddressBySnap(chainId);
      }
      return null;
    } catch (ex) {
      console.log(ex, chainId);
    }
  }
}
