import { AssetInfo } from '@oraichain/common-contracts-sdk';
import { TokenItemType } from 'config/bridgeTokens';
import { Type } from 'rest/api';

export type PairInfoData = {
  firstAssetInfo: string;
  secondAssetInfo: string;
  commissionRate: string;
  pairAddr: string;
  liquidityAddr: string;
  oracleAddr: string;
  symbols: string;
  fromIconUrl: string;
  toIconUrl: string;
};

export type PoolInfoResponse = PairInfoData & {
  apr: number;
  totalLiquidity: number;
  volume24Hour: string;
  volume24hChange: string;
  fee7Days: string;
  rewardPerSec: string;
};

export type PoolDetail = {
  info: PoolInfoResponse;
  token1: TokenItemType;
  token2: TokenItemType;
};

export type BaseMining = {
  type: Type;
  assetInfo: AssetInfo;
  sender: string;
};
export type BondLP = BaseMining & {
  lpAddress: string;
  amount: number | string;
};
export type WithdrawLP = BaseMining;
export type UnbondLP = BaseMining & { amount: number | string };
export type MiningLP = BondLP | WithdrawLP | UnbondLP;