import { UnbondInfo } from './unbond-info';

import { Coin, OraiBtc } from '@oraichain/oraibtc-wasm';

export interface Delegation {
  address: string;
  liquid: Array<Coin>;
  staked: bigint;
  unbonding: UnbondInfo[];
}

export function getDelegations(nomic: OraiBtc, address: string): Promise<Delegation[]> {
  return nomic.delegations(address);
}
