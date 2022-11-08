import {SwapOperation} from "./types";
export type Addr = string;
export interface InstantiateMsg {
  factory_addr: Addr;
}
export type ExecuteMsg = {
  receive: Cw20ReceiveMsg;
} | {
  execute_swap_operations: {
    minimum_receive?: Uint128 | null;
    operations: SwapOperation[];
    to?: Addr | null;
  };
} | {
  execute_swap_operation: {
    operation: SwapOperation;
    to?: Addr | null;
  };
} | {
  assert_minimum_receive: {
    asset_info: AssetInfo;
    minimum_receive: Uint128;
    prev_balance: Uint128;
    receiver: Addr;
  };
};
export type Uint128 = string;
export type Binary = string;
export type AssetInfo = {
  token: {
    contract_addr: Addr;
  };
} | {
  native_token: {
    denom: string;
  };
};
export interface Cw20ReceiveMsg {
  amount: Uint128;
  msg: Binary;
  sender: string;
}
export type QueryMsg = {
  config: {};
} | {
  simulate_swap_operations: {
    offer_amount: Uint128;
    operations: SwapOperation[];
  };
};
export interface MigrateMsg {}
export interface ConfigResponse {
  factory_addr: Addr;
}
export interface SimulateSwapOperationsResponse {
  amount: Uint128;
}