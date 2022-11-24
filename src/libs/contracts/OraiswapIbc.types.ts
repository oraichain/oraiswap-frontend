import {AllowMsg, Uint128, Binary, Uint64, Cw20ReceiveMsg, TransferMsg, SwapMsg, JoinPoolMsg, ExitPoolMsg, CreateLockupMsg, LockTokensMsg, ClaimTokensMsg, UnlockTokensMsg, ExternalTokenMsg, Amount, Coin, Cw20Coin, ChannelInfo, IbcEndpoint, AllowedInfo, AllowedTokenInfo} from "./types";
export interface InstantiateMsg {
  allowlist: AllowMsg[];
  default_timeout: number;
  gov_contract: string;
}
export type ExecuteMsg = {
  receive: Cw20ReceiveMsg;
} | {
  transfer: TransferMsg;
} | {
  swap: SwapMsg;
} | {
  join_pool: JoinPoolMsg;
} | {
  exit_pool: ExitPoolMsg;
} | {
  create_lockup: CreateLockupMsg;
} | {
  lock_tokens: LockTokensMsg;
} | {
  claim_tokens: ClaimTokensMsg;
} | {
  unlock_tokens: UnlockTokensMsg;
} | {
  allow: AllowMsg;
} | {
  allow_external_token: ExternalTokenMsg;
} | {
  update_admin: {
    admin: string;
  };
};
export type QueryMsg = {
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
  external_token: {
    denom: string;
  };
} | {
  list_allowed: {
    limit?: number | null;
    start_after?: string | null;
  };
} | {
  list_external_tokens: {
    limit?: number | null;
    start_after?: string | null;
  };
} | {
  lockup: {
    channel: string;
    owner: string;
  };
};
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
  default_timeout: number;
  gov_contract: string;
}
export interface AllowedTokenResponse {
  contract?: string | null;
  is_allowed: boolean;
}
export interface ListAllowedResponse {
  allow: AllowedInfo[];
}
export interface ListChannelsResponse {
  channels: ChannelInfo[];
}
export interface ListExternalTokensResponse {
  tokens: AllowedTokenInfo[];
}
export interface LockupResponse {
  address: string;
  owner: string;
}