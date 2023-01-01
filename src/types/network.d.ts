import { NetworkKey } from 'config/networks';

interface ExtNetworkConfig {
  chainId: string;
  rpc: string;
  lcd: string;
  explorer: string;
  coinType?: number;
}

export interface NetworkConfig extends ExtNetworkConfig {
  /** Chain ID */
  id: NetworkKey;

  /** Fixed fee */
  fee: { gasPrice: string; amount: string; gas: string };
  factory: string;
  factory_v2: string;
  oracle: string;
  staking: string;
  router: string;
  router_v2: string;
  denom: string;
  prefix: string;
  rewarder: string;
  converter: string;
}
