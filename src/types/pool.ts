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
