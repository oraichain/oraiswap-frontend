import { TokenItemType } from '@oraichain/oraidex-common';

export type TokenVault = {
  decimals: number;
  symbol: string;
  addr: string;
};

export type VaultInfoContract = {
  vaultAddress: string;
  oraiBalance: string;
  totalSupply: string;
  tvlByToken1: string;
};

export type VaultInfoBackend = {
  vaultAddr: string;
  aprAllTime: number;
  aprDaily: number;
  description: string;
  token0: string;
  token1: string;
  lpToken: string;
  strategyExplain: string;
  howItWork: string;
  network: string;
};

export type VaultInfo = VaultInfoBackend &
  VaultInfoContract & {
    sharePrice: number;
    tvl: string;
    token0: TokenVault;
    token1: TokenVault;
    lpToken: TokenVault;
    tokenInfo0: TokenItemType;
    tokenInfo1: TokenItemType;
  };

export type ModalDepositWithdrawProps = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  vaultDetail: VaultInfo;
  totalShare?: bigint;
};
