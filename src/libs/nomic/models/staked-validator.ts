import { Validator } from "./validator";

export type StakedValidator = Validator & {
  amountStaked: bigint;
  pendingNbtcRewards: bigint;
  pendingNomRewards: bigint;
};