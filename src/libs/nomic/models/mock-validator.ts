import {UnbondingValidator} from "./unbonding-validator";
import {StakedValidator} from "./staked-validator";
import {Validator} from "./validator";

export type MockValidator = Validator & StakedValidator & UnbondingValidator;

export const MockValidators: MockValidator[] = Array.from(Array(42).keys()).map((i) => {
    return {
        info: {
           moniker: `test validator ${i}`,
           website: "google.com",
           identity: "123",
           details: "this is a test validator"
        },
        address: `0x${i}`,
        votingPower: 0n,
        commission: 0.05,
        isJailed: false,
        isActive: true,
        logo: "",
        amountStaked: 0n,
        pendingNbtcRewards: 0n,
        pendingNomRewards: 0n,
        unbondInfo: []
    }
})

