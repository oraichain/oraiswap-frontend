import { Key } from '@keplr-wallet/types';

import { ChainIdEnum } from '@oraichain/oraidex-common';
import { network } from 'config/networks';
import { bitcoinChainId } from 'helper/constants';
export type BitcoinMode = 'core' | 'extension' | 'mobile-web' | 'walletconnect';
// import { CosmosChainId, BitcoinWallet } from '@oraichain/oraidex-common';
type BtcChainId = 'bitcoin' | 'bitcoinTestnet';
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

  async getAddress(chainId: BtcChainId = bitcoinChainId): Promise<string | undefined> {
    try {
      const key = await this.getBitcoinKey(chainId);
      return key?.bech32Address;
    } catch (ex) {
      console.log(ex, chainId);
    }
  }
  async signAndBroadCast(
    chainId: BtcChainId = bitcoinChainId,
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
