import { ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';

export class ChainOWalletExtension extends ChainWalletBase {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
