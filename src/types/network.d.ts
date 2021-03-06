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
  oracle: string;
  staking: string;
  router: string;
  denom: string;
  prefix: string;
  rewarder: string;
  converter: string;
}

export interface Network extends NetworkConfig {
  /** Get finder link */
  finder: (address: string, path?: string) => string;

  /** Refresh the network from the extension */
  refresh: () => void;
}
