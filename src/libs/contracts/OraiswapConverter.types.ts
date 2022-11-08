import {TokenInfo, TokenRatio} from "./types";
export interface InstantiateMsg {}
export type ExecuteMsg = {
  receive: Cw20ReceiveMsg;
} | {
  update_config: {
    owner: Addr;
  };
} | {
  convert: {};
} | {
  update_pair: {
    from: TokenInfo;
    to: TokenInfo;
  };
} | {
  unregister_pair: {
    from: TokenInfo;
  };
} | {
  convert_reverse: {
    from_asset: AssetInfo;
  };
} | {
  withdraw_tokens: {
    asset_infos: AssetInfo[];
  };
};
export type Uint128 = string;
export type Binary = string;
export type Addr = string;
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
  convert_info: {
    asset_info: AssetInfo;
  };
};
export interface MigrateMsg {}
export interface ConfigResponse {
  owner: Addr;
}
export type Decimal = string;
export interface ConvertInfoResponse {
  token_ratio: TokenRatio;
}