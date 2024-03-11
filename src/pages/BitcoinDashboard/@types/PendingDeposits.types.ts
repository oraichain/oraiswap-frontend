export interface PendingDeposit {
  deposit: {
    txid: string;
    vout: number;
    amount: number;
    height: number | null;
  };
  confirmations: number;
}

export interface DepositInfo {
  txid: string;
  vout: number;
  amount: number;
  height: number | null;
  confirmations: number;
}
