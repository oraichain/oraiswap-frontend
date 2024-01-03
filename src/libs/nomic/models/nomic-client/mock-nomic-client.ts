// import { Validator } from "../validator";
// import { makeAutoObservable } from "mobx";
// import { DepositAddress } from "../deposit-address";
// import { IbcChain, NomicChain } from "../ibc-chain";
// import { Wallet } from "../wallet/wallet";
// import {
//   UnbondingValidator,
// } from "../unbonding-validator";
// import {
//   StakedValidator,
// } from "../staked-validator";
// import { NomicClientInterface } from "./nomic-client-interface";
// import { delay } from "@nomic-ui/utils";
// import { MockValidator, MockValidators } from "../../models/mock-validator";
// import { Airdrop } from "../reward";
// import { MockWallet } from "../wallet/mock-wallet";

// export class MockNomicClient implements NomicClientInterface {
//   readonly modifier = BigInt(1e6);
//   readonly nbtcModifier = BigInt(1e14);

//   initialized = false;
//   built = false;

//   wallet?: Wallet = undefined;

//   nomBalance: bigint | null = null;
//   nbtcBalance: bigint | null = null;

//   nomRewardBalance: bigint | null = null;
//   nbtcRewardBalance: bigint | null = null;
//   incomingIbcNbtcBalance: bigint | null = null;

//   airdropBalances: Airdrop | null = null;

//   validators: Validator[] = [];

//   depositAddress: DepositAddress | null = null;
//   btcBlockHeight: number | null = null;
//   latestCheckpointHash: string | null = null;
//   valueLocked: bigint | null = null;

//   kujiNbtcBalance = 3600000000n;

//   constructor() {
//     makeAutoObservable(this);
//   }

//   public async init() {
//     await delay(1000);
//     this.initialized = true;
//   }

//   public async build() {
//     if (this.built) {
//       return;
//     }
//     this.validators = MockValidators;
//     this.nomBalance = 10000000n;
//     (this.getValidator("0x0") as StakedValidator).amountStaked += 1000000n;
//     this.nbtcBalance = 42000000000n;
//     this.nomRewardBalance = 0n;
//     this.nbtcRewardBalance = 0n;
//     this.incomingIbcNbtcBalance = 0n;
//     this.airdropBalances = {
//       airdrop1: {
//         locked: 0n,
//         amount: 100000n,
//         claimable: 100000n,
//         claimed: 0n
//       },
//       btcDeposit: {
//         locked: 0n,
//         amount: 100000n,
//         claimable: 100000n,
//         claimed: 0n
//       },
//       btcWithdraw: {
//         locked: 0n,
//         amount: 100000n,
//         claimable: 100000n,
//         claimed: 0n
//       },
//       ibcTransfer: {
//         locked: 0n,
//         amount: 100000n,
//         claimable: 100000n,
//         claimed: 0n
//       },
//       airdropTotal: () => {
//         return this.airdropBalances.airdrop1.amount
//         + this.airdropBalances.btcDeposit.amount
//         + this.airdropBalances.btcWithdraw.amount
//         + this.airdropBalances.ibcTransfer.amount;
//       },
//       claimedTotal: () => {
//         return this.airdropBalances.airdrop1.claimed
//         + this.airdropBalances.btcDeposit.claimed
//         + this.airdropBalances.btcWithdraw.claimed
//         + this.airdropBalances.ibcTransfer.claimed;
//       }
//     };
//     // this.getBtcBlockHeight();
//     // this.getLatestCheckpointHash();
//     // this.getValueLocked();
//     this.built = true;
//   }

//   getCurrentWallet(): Wallet | null {
//     return new MockWallet() as Wallet;
//   }

//   disconnectWallet() {
//     this.wallet = null;
//     this.clearUserState();
//     this.built = false;
//   }

//   async clearUserState() {
//     this.nomBalance = null;
//     this.nbtcBalance = null;
//     this.airdropBalances = null;
//     this.nomRewardBalance = null;
//     this.nbtcRewardBalance = null;
//     this.incomingIbcNbtcBalance = null;
//     this.depositAddress = null;
//   }

//   public async claimStakingRewards() {
//     await delay(1000);
//     this.nomBalance += this.nomRewardBalance;
//     this.nomRewardBalance = 0n;
//     this.nbtcBalance += this.nbtcRewardBalance;
//     this.nbtcRewardBalance = 0n;

//     this.stakedValidators.forEach((validator) => {
//       validator.pendingNomRewards = 0n;
//       validator.pendingNbtcRewards = 0n;
//     })
//   }

//   public async claimAirdrop1() {
//     this.nomBalance += this.airdropBalances.airdrop1.claimable;
//     this.airdropBalances.airdrop1.claimed += this.airdropBalances.airdrop1.claimable;
//     this.airdropBalances.airdrop1.claimable = 0n;
//   }

//   public async claimBtcDepositAirdrop() {
//     this.nomBalance += this.airdropBalances.btcDeposit.claimable;
//     this.airdropBalances.btcDeposit.claimed += this.airdropBalances.btcDeposit.claimable;
//     this.airdropBalances.btcDeposit.claimable = 0n;
//   }

//   public async claimBtcWithdrawAirdrop() {
//     this.nomBalance += this.airdropBalances.btcWithdraw.claimable;
//     this.airdropBalances.btcWithdraw.claimed += this.airdropBalances.btcWithdraw.claimable;
//     this.airdropBalances.btcWithdraw.claimable = 0n;
//   }

//   public async claimIbcTransferAirdrop() {
//     this.nomBalance += this.airdropBalances.ibcTransfer.claimable;
//     this.airdropBalances.ibcTransfer.claimed += this.airdropBalances.ibcTransfer.claimable;
//     this.airdropBalances.ibcTransfer.claimable = 0n;
//   }

//   public async joinAirdropAccounts() {
//     this.airdropBalances.airdrop1.amount += 100000n;
//     this.airdropBalances.airdrop1.claimable += 100000n;
//     this.airdropBalances.btcDeposit.amount += 100000n
//     this.airdropBalances.btcDeposit.claimable += 100000n;
//     this.airdropBalances.btcWithdraw.amount += 100000n;
//     this.airdropBalances.btcWithdraw.claimable += 100000n;
//     this.airdropBalances.ibcTransfer.amount += 100000n;
//     this.airdropBalances.ibcTransfer.claimable += 100000n;
//   }

//   public async updateValidators() {
//     return;
//   }

//   public getValidator(
//     address: string
//   ): Validator | StakedValidator | undefined {
//     return this.validators.find((validator) => validator.address === address);
//   }

//   public async delegate(validatorAddress: string, uNom: bigint) {
//     if (this.nomBalance < uNom) {
//       throw new Error("Insufficient balance");
//     }
//     await delay(1000);
//     const targetVal = this.getValidator(validatorAddress) as StakedValidator;
//     this.nomBalance -= uNom;
//     targetVal.amountStaked += uNom;
//   }

//   public async undelegate(address: string, uNom: bigint) {
//     const targetVal = this.getValidator(address) as StakedValidator;
//     if (targetVal.amountStaked < uNom) {
//       throw new Error("Insufficient balance");
//     }
//     await delay(1000);
//     targetVal.amountStaked -= uNom;
//     this.nomBalance += uNom;
//     const unbondingVal = {
//       ...targetVal,
//       unbondInfo: [{
//         amount: uNom,
//         startSeconds: BigInt(Math.floor(Date.now() / 1000))
//       }]

//     }
//     this.unbondingValidators.push(unbondingVal);
//   }

//   public async redelegate(from: string, to: string, uNom: bigint) {
//     const fromVal = this.getValidator(from) as StakedValidator;
//     if (fromVal.amountStaked < uNom) {
//       throw new Error("Insufficient Balance");
//     }
//     await delay(1000);
//     const toVal = this.getValidator(to) as StakedValidator;
//     fromVal.amountStaked -= uNom;
//     toVal.amountStaked += uNom;
//   }

//   public async generateAddress() {
//     this.depositAddress = {
//       address: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//       expiration: 1000000000n
//     };
//     this.nbtcBalance += 42000000000n;
//   }

//   public async withdrawBitcoin(address: string, sats: bigint) {
//     if (this.nbtcBalance < sats) {
//       throw new Error("Insufficient balance")
//     }
//     await delay(1000);
//     this.nbtcBalance -= sats;
//   }

//   public async getBtcBlockHeight() {
//     this.btcBlockHeight = 12345;
//   }

//   public async getLatestCheckpointHash() {
//     this.latestCheckpointHash = "661d111f8f63ba94a46b92aec4b2f854f150260c6e2d9532d8f069933b613088"
//   }

//   public async getValueLocked() {
//     this.valueLocked = 326000000000n;
//   }

//   async claimIncomingIbc() {
//     await delay(1000);
//     this.nbtcBalance += this.incomingIbcNbtcBalance;
//     this.incomingIbcNbtcBalance = 0n;
//   };

//   public async ibcTransferIn(amount: bigint, destinationAddress: string, senderChain: IbcChain) {
//     if (this.kujiNbtcBalance < amount) {
//       throw new Error("Insufficient Balance")
//     }
//     await delay(1000);
//     this.incomingIbcNbtcBalance += amount;
//     this.kujiNbtcBalance -= amount;
//   }

//   public async ibcTransferOut(
//     amount: bigint,
//     denom: string,
//     destinationAddress: string,
//     channelId: string,
//     portId: string,
//   ): Promise<void> {
//     if (amount > this.nbtcBalance) {
//       throw new Error("Insufficient Balance")
//     }
//     await delay(1000);
//     this.kujiNbtcBalance += amount;
//     this.nbtcBalance -= amount;
//   }

//   public getChainBalance(ibcChain: IbcChain): Promise<bigint> {
//     if (ibcChain.chainId !== NomicChain.chainId) {
//       return Promise.resolve(this.kujiNbtcBalance)
//     }
//     return Promise.resolve(this.nbtcBalance)
//   }

//   public get unbondingValidators(): UnbondingValidator[] {
//     return this.validators.filter((validator: MockValidator) => {
//         return validator.unbondInfo.length > 0;
//     }) as UnbondingValidator[];
//   }

//   public get stakedValidators(): StakedValidator[] {
//     return this.validators.filter((validator: MockValidator) => {
//       return validator.amountStaked > 0n
//     }) as StakedValidator[];
//   }

//   public get totalStaked() {
//     if (!this.init || !this.built) return null;
//     return this.stakedValidators.reduce((totalStaked, validator) => {
//       totalStaked += validator.amountStaked
//       return totalStaked;
//     }, 0n);
//   }

//   public getAirdropBalances() {
//     return Promise.resolve(this.airdropBalances);
//   }
// }

export class MockNomicClient {}