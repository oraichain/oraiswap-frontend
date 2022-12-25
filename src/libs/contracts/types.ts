export interface AllowMsg {
  contract: string;
  gas_limit?: number | null;
}
export type Uint128 = string;
export type Binary = string;
export interface Cw20ReceiveMsg {
  amount: Uint128;
  msg: Binary;
  sender: string;
}
export interface TransferMsg {
  channel: string;
  memo?: string | null;
  remote_address: string;
  timeout?: number | null;
}
export interface Cw20PairMsg {
  cw20_decimals: number;
  cw20_denom: string;
  denom: string;
  local_channel_id: string;
  remote_decimals: number;
}
export type Amount = {
  native: Coin;
} | {
  cw20: Cw20Coin;
};
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export interface Cw20Coin {
  address: string;
  amount: Uint128;
}
export interface ChannelInfo {
  connection_id: string;
  counterparty_endpoint: IbcEndpoint;
  id: string;
}
export interface IbcEndpoint {
  channel_id: string;
  port_id: string;
  [k: string]: unknown;
}
export type Addr = string;
export interface Cw20PairQuery {
  cw20_map: Cw20MappingMetadata;
  key: string;
}
export interface Cw20MappingMetadata {
  cw20_decimals: number;
  cw20_denom: string;
  remote_decimals: number;
}
export interface AllowedInfo {
  contract: string;
  gas_limit?: number | null;
}
export type AssetInfo = {
  token: {
    contract_addr: Addr;
  };
} | {
  native_token: {
    denom: string;
  };
};
export interface TokenInfo {
  decimals: number;
  info: AssetInfo;
}
export type Decimal = string;
export interface TokenRatio {
  info: AssetInfo;
  ratio: Decimal;
}
export interface PairInfo {
  asset_infos: [AssetInfo, AssetInfo];
  commission_rate: string;
  contract_addr: Addr;
  liquidity_token: Addr;
  oracle_addr: Addr;
}
export type Uint64 = string;
export interface SwapMsg {
  channel: string;
  min_amount_out: Uint128;
  pool: Uint64;
  timeout?: number | null;
  token_out: string;
}
export interface JoinPoolMsg {
  channel: string;
  pool: Uint64;
  share_min_out: Uint128;
  timeout?: number | null;
}
export interface ExitPoolMsg {
  channel: string;
  min_amount_out: Uint128;
  timeout?: number | null;
  token_out: string;
}
export interface CreateLockupMsg {
  channel: string;
  timeout?: number | null;
}
export interface LockTokensMsg {
  channel: string;
  duration: Uint64;
  timeout?: number | null;
}
export interface ClaimTokensMsg {
  channel: string;
  denom: string;
  timeout?: number | null;
}
export interface UnlockTokensMsg {
  channel: string;
  lock_id: Uint64;
  timeout?: number | null;
}
export interface ExternalTokenMsg {
  contract: string;
  denom: string;
}
export interface AllowedTokenInfo {
  contract: string;
  denom: string;
}
export type OrderDirection = "buy" | "sell";
export interface Asset {
  amount: Uint128;
  info: AssetInfo;
}
export type OrderFilter = ("tick" | "none") | {
  bidder: string;
} | {
  price: Decimal;
};
export type OracleTreasuryQuery = {
  tax_rate: {};
} | {
  tax_cap: {
    denom: string;
  };
};
export type OracleExchangeQuery = {
  exchange_rate: {
    base_denom?: string | null;
    quote_denom: string;
  };
} | {
  exchange_rates: {
    base_denom?: string | null;
    quote_denoms: string[];
  };
};
export type OracleContractQuery = {
  contract_info: {};
} | {
  reward_pool: {
    denom: string;
  };
};
export interface ExchangeRateItem {
  exchange_rate: Decimal;
  quote_denom: string;
}
export type SwapOperation = {
  orai_swap: {
    ask_asset_info: AssetInfo;
    offer_asset_info: AssetInfo;
  };
};
export interface RewardInfoResponseItem {
  asset_info: AssetInfo;
  bond_amount: Uint128;
  pending_reward: Uint128;
  pending_withdraw: Asset[];
  should_migrate?: boolean | null;
}
export type Logo = {
  url: string;
} | {
  embedded: EmbeddedLogo;
};
export type EmbeddedLogo = {
  svg: Binary;
} | {
  png: Binary;
};
export interface InstantiateMarketingInfo {
  description?: string | null;
  logo?: Logo | null;
  marketing?: string | null;
  project?: string | null;
}
export type Expiration = {
  at_height: number;
} | {
  at_time: Timestamp;
} | {
  never: {};
};
export type Timestamp = Uint64;
export interface AllowanceInfo {
  allowance: Uint128;
  expires: Expiration;
  spender: string;
}
export interface SpenderAllowanceInfo {
  allowance: Uint128;
  expires: Expiration;
  owner: string;
}
export type LogoInfo = {
  url: string;
} | "embedded";