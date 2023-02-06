export interface InfoMove {
  value: number;
  time: {
    day: number;
    month: number;
    year: number;
  };
}

export interface InfoPool {
  bonded: number;
  contract_address: string;
  fee: string;
  id: number;
  liquidity: number;
  liquidityChange24h: number;
  token0Id: number;
  token1Id: number;
  volume: number;
  volumeChange24h: number;
}

export interface GetPoolLiquidity {
  poolId: number,
  typeData: string,
  range: number,
}