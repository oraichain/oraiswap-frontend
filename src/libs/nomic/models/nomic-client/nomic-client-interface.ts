// export interface DepositAddress {
//   address: string;
//   expiration: bigint;
// }

import { DepositSuccess } from '@oraichain/orai-bitcoin';
export type AuthAccount = {
  account: any;
};
export abstract class NomicClientInterface {
  readonly modifier = BigInt(1e6);
  readonly nbtcModifier = BigInt(1e14);

  // initialized: boolean;

  depositAddress: DepositSuccess | null = null;

  // init: () => Promise<void>;

  generateAddress: (destination?: string) => Promise<void>;

  getRecoveryAddress: () => Promise<string>;
  getAccountInfo: (addressAcc: string) => Promise<AuthAccount>;
}
