import { OfflineSigner } from '@cosmjs/proto-signing';
import { ChainInfo, FeeCurrency, Keplr as keplr, Key } from '@keplr-wallet/types';
import { CosmosChainId, CosmosWallet, NetworkChainId, TokenItemType, WalletType } from '@oraichain/oraidex-common';
import { isMobile } from '@walletconnect/browser-utils';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { cosmosTokens } from 'config/bridgeTokens';
import { OraiBTCBridgeNetwork, chainInfos } from 'config/chainInfos';
import { network } from 'config/networks';
import { getAddress, getAddressByEIP191 } from 'helper';
import { EIP_EIP_STORAGE_KEY_ACC, MetamaskOfflineSigner } from './eip191';

export default class Keplr extends CosmosWallet {
  async createCosmosSigner(chainId: CosmosChainId): Promise<OfflineSigner> {
    const keplr = await this.getKeplr();
    if (keplr) return await keplr.getOfflineSignerAuto(chainId);
    if (window.ethereum) return await MetamaskOfflineSigner.connect(window.ethereum, network.denom);
    throw new Error('You have to install Cosmos wallet first if you do not use a mnemonic to sign transactions');
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
    const isKeplr = await this.getKeplr();
    if (isKeplr) return this.keplr.getChainInfosWithoutEndpoints();
  }

  async suggestChain(chainId: string) {
    const isEnableKeplr = await this.getKeplr();
    if (isEnableKeplr) {
      if (!window.keplr) return;
      // TODO: hotfix add oraiBTC bridge network
      const chainInfo = [...chainInfos, OraiBTCBridgeNetwork].find((chainInfo) => chainInfo.chainId === chainId);

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

        // use for universal swap from oraichain to EVM
        if (chainId === 'oraibridge-subnet-2') {
          const result = localStorage.getItem(EIP_EIP_STORAGE_KEY_ACC);
          const parsedResult = JSON.parse(result);
          const oraiAddress = parsedResult ? parsedResult.accounts[0].address : null;
          return getAddress(oraiAddress, 'oraib');
        }
        return getAddressByEIP191();
      }

      const isEnableKeplr = await this.getKeplr();
      if (isEnableKeplr && ['keplr', 'owallet'].includes(this.typeWallet)) {
        if (!this.keplr) throw new Error('Error: get window cosmos!');
        const { bech32Address } = await this.getKeplrKey(chainId);
        if (!bech32Address) throw Error('Not found address from keplr!');
        return bech32Address;
      }
      return null;
    } catch (ex) {
      console.log(ex, chainId);
    }
  }
}
