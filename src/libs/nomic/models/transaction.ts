// import { makeAutoObservable } from "mobx";
import { DepositAddress } from './deposit-address';

export interface TransactionModel {
  amount: bigint;
  type: TransactionType;
  status: TransactionStatus;
  depositAddr: DepositAddress | null;
  confirmations: number;
  date: Date;
  hash: string;
  blockHeight: number | null;
}

export enum TransactionStatus {
  CONFIRMED,
  PENDING,
  REJECTED
}

enum TransactionType {
  DEPOSIT,
  WITHDRAWAL
}

export class Transaction implements TransactionModel {
  static btcDepositFee = BigInt(200 * 1e6);
  static nomicBridgeFee = 0.2;
  static numConfirmations = 4;

  amount = BigInt(0);
  type: TransactionType = TransactionType.DEPOSIT;
  status: TransactionStatus = TransactionStatus.PENDING;
  depositAddr: DepositAddress | null = null;
  confirmations = 0;
  date: Date = new Date();
  hash = '';
  blockHeight: number | null = null;

  constructor() {
    // makeAutoObservable(this);
  }

  async getTransactionBlockHeight() {
    try {
      const res = await fetch('https://blockchain.info/rawtx/' + this.hash, {
        mode: 'cors'
      }).then((response) =>
        response.json().then((json) => {
          return json;
        })
      );
      this.blockHeight = res.block_height;
    } catch (e) {
      console.log(e);
    }
  }

  public static async deposit(sats: bigint, depositAddr: DepositAddress, hash: string): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.amount = sats;
    transaction.type = TransactionType.DEPOSIT;
    transaction.depositAddr = depositAddr;
    transaction.hash = hash;
    return transaction;
  }

  static withdrawal(amount: bigint): Transaction {
    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.type = TransactionType.WITHDRAWAL;
    return transaction;
  }

  public getStatus(): string {
    switch (this.status) {
      case TransactionStatus.CONFIRMED:
        return 'Confirmed';
      case TransactionStatus.PENDING:
        return 'Pending';
      case TransactionStatus.REJECTED:
        return 'Rejected';
    }
  }

  public getType(): string {
    switch (this.type) {
      case TransactionType.DEPOSIT:
        return 'Deposit';
      case TransactionType.WITHDRAWAL:
        return 'Withdrawal';
    }
  }

  public static fromJSON(tx: Transaction) {
    const transaction = new Transaction();
    transaction.amount = BigInt(tx.amount);
    transaction.type = tx.type;
    transaction.status = tx.status;
    transaction.hash = tx.hash;
    transaction.blockHeight = tx.blockHeight;
    transaction.depositAddr = tx.depositAddr;
    transaction.confirmations = tx.confirmations;
    transaction.date = new Date(tx.date);
    return transaction;
  }

  public toJSON(): TransactionModel {
    return {
      amount: this.amount,
      type: this.type,
      status: this.status,
      depositAddr: this.depositAddr,
      confirmations: this.confirmations,
      date: this.date,
      hash: this.hash,
      blockHeight: this.blockHeight
    };
  }

  public resolveAmount(): bigint {
    if (this.type === TransactionType.DEPOSIT) {
      return BigInt(Number(this.amount) * (1 - Transaction.nomicBridgeFee)) - Transaction.btcDepositFee;
    } else {
      return this.amount;
    }
  }

  public resolveFeeAmount(): bigint {
    if (this.type === TransactionType.DEPOSIT) {
      return BigInt(Number(this.amount) * Transaction.nomicBridgeFee);
    } else {
      return 0n;
    }
  }

  public async updateConfirmations(latestHeight: number) {
    if (this.blockHeight == null) {
      this.confirmations = 0;
      this.status = TransactionStatus.PENDING;
      return;
    }
    this.confirmations = latestHeight - this.blockHeight;
    if (this.confirmations >= Transaction.numConfirmations) {
      this.status = TransactionStatus.CONFIRMED;
    }
  }
}
