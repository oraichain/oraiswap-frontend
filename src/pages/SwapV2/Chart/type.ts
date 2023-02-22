export interface InfoMove {
  value: number;
  time: number;
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

export interface InfoToken {
  circulatingSupply: number,
  decimals: number,
  derivedETH: number,
  id: number,
  image: string,
  liquidity: number,
  liquidity24hChange: number,
  marketCap: number,
  name: string,
  price: number,
  price24hChange: number,
  symbol: string,
  totalSupply: number,
  tradeVolume: number,
  txCount24h: string,
  untrackedVolumeUSD: number,
  volume24hChange: number,
}
export interface DataChart {
  time: string,
  open: number, 
  high: number, 
  low: number, 
  close: number
}