export interface CheckpointQueueInterface {
  confirmed_index: number;
  first_unhandled_confirmed_cp_index: number;
  index: number;
}

export interface TotalValueLockedInterface {
  value: number;
}

export interface BitcoinConfigInterface {
  capacity_limit: number;
  fee_pool_reward_split: number[];
  fee_pool_target_balance: number;
  max_deposit_age: number;
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

export interface DepositFeeInterface {
  deposit_fees: number;
}

export interface WithdrawalFeeInterface {
  withdrawal_fees: number;
}
