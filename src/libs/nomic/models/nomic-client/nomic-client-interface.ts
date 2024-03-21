// export interface DepositAddress {
//   address: string;
//   expiration: bigint;
// }

import { DepositSuccess } from '@oraichain/orai-bitcoin';
export type AuthAccount = {
  account: any;
};
export interface ResConfigOraiBTC {
  capacity_limit: number;
  max_offline_checkpoints: number;
  max_withdrawal_amount: number;
  max_withdrawal_script_length: number;
  min_checkpoint_confirmations: number;
  min_confirmations: number;
  min_deposit_amount: number;
  min_withdrawal_amount: number;
  min_withdrawal_checkpoints: number;
  transfer_fee: number;
  units_per_sat: number;
}
export interface DepositPending {
  deposit: Deposit;
  confirmations: number;
}

export interface Deposit {
  txid: string;
  vout: number;
  amount: number;
  height: any;
}
export abstract class NomicClientInterface {
  readonly modifier = BigInt(1e6);
  readonly nbtcModifier = BigInt(1e14);

  // initialized: boolean;

  depositAddress: DepositSuccess | null = null;

  // init: () => Promise<void>;

  generateAddress: (destination?: string) => Promise<void>;

  getRecoveryAddress: () => Promise<string>;
  getAccountInfo: (addressAcc: string) => Promise<AuthAccount>;
  getConfig: () => Promise<ResConfigOraiBTC>;
  getDepositsPending: (oraiAddress: string) => Promise<DepositPending[]>;
}
