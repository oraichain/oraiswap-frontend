export interface RewardDetails {
  locked: bigint;
  amount: bigint;
  claimable: bigint;
  claimed: bigint;
}

export abstract class Airdrop {
  airdrop1: RewardDetails;
  airdrop2: RewardDetails;
  total: () => bigint;
  claimedTotal: () => bigint;
}

export abstract class Incentives {
  testnetParticipation: RewardDetails;
  total: () => bigint;
  claimedTotal: () => bigint;
}

export enum RewardType {
  AIRDROP = "Airdrop",
  INCENTIVE = "Incentive",
}