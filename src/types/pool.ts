import { TokenItemType } from 'config/bridgeTokens';

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
