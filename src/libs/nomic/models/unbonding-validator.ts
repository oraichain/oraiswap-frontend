import { Validator } from "./validator";
import { UnbondInfo } from "./unbond-info";

export type UnbondingValidator = Validator & {
  unbondInfo: UnbondInfo[];
};
