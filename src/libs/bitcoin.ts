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
  constructor() {}

  disconnect() {
    // clear data?
  }

  async getBitcoinKey(chainId?: string): Promise<Key | undefined> {
    try {
      chainId = chainId ?? network.chainId;
      if (!chainId) return undefined;

      const bitcoin = await window.owallet;
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
      //TODO: hotfix for wallet connect to DApp
      const rs = await window.bitcoin.signAndBroadcast(chainId, data);
      return rs;
    } catch (ex) {
      console.log(ex, chainId);
    }
  }
}
