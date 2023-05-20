import {Uint128, AssetInfo, Addr, Logo, EmbeddedLogo, Binary, ListTokenMsg, Cw20Coin, Asset, InstantiateMarketingInfo, Config} from "./types";
export interface InstantiateMsg {
  cw20_code_id: number;
  factory_addr: string;
}
export type ExecuteMsg = {
  list_token: ListTokenMsg;
};
export interface MinterResponse {
  cap?: Uint128 | null;
  minter: string;
}
export type QueryMsg = {
  config: {};
};
export interface MigrateMsg {}