import {AllowMsg, Uint128, Binary, Cw20ReceiveMsg, TransferMsg, Cw20PairMsg, Amount, Coin, Cw20Coin, ChannelInfo, IbcEndpoint, Addr, Cw20PairQuery, Cw20MappingMetadata, AllowedInfo} from "./types";
export interface InstantiateMsg {
  allowlist: AllowMsg[];
  default_gas_limit?: number | null;
  default_timeout: number;
  gov_contract: string;
}
export type ExecuteMsg = {
  receive: Cw20ReceiveMsg;
} | {
  transfer: TransferMsg;
} | {
  update_cw20_mapping_pair: Cw20PairMsg;
} | {
  allow: AllowMsg;
} | {
  update_admin: {
    admin: string;
  };
};
export type QueryMsg = {
  port: {};
} | {
  list_channels: {};
} | {
  channel: {
    id: string;
  };
} | {
  config: {};
} | {
  admin: {};
} | {
  allowed: {
    contract: string;
  };
} | {
  list_allowed: {
    limit?: number | null;
    order?: number | null;
    start_after?: string | null;
  };
} | {
  cw20_mapping: {
    limit?: number | null;
    order?: number | null;
    start_after?: string | null;
  };
} | {
  cw20_mapping_from_key: {
    key: string;
  };
} | {
  cw20_mapping_from_cw20_denom: {
    cw20_denom: string;
  };
};
export interface MigrateMsg {
  default_gas_limit?: number | null;
}
export interface AdminResponse {
  admin?: string | null;
}
export interface AllowedResponse {
  gas_limit?: number | null;
  is_allowed: boolean;
}
export interface ChannelResponse {
  balances: Amount[];
  info: ChannelInfo;
  total_sent: Amount[];
}
export interface ConfigResponse {
  default_gas_limit?: number | null;
  default_timeout: number;
  gov_contract: string;
}
export interface ListAllowedResponse {
  allow: AllowedInfo[];
}
export interface ListChannelsResponse {
  channels: ChannelInfo[];
}
export interface PortResponse {
  port_id: string;
}