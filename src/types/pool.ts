import { TokenItemType } from 'config/bridgeTokens';

export type PoolInfoResponse = {
  firstAssetInfo: string;
  secondAssetInfo: string;
  commissionRate: string;
  pairAddr: string;
  liquidityAddr: string;
  oracleAddr: string;
  symbols: string;
  fromIconUrl: string;
  toIconUrl: string;
  apr: number;
  totalLiquidity: number;
  volume24Hour: string;
  fee7Days: string;
};

export type PoolDetail = {
  info: PoolInfoResponse;
  token1: TokenItemType;
  token2: TokenItemType;
};
