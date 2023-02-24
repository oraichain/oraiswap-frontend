import {Uint128, Logo, EmbeddedLogo, Binary, Cw20Coin, InstantiateMarketingInfo, Expiration, Timestamp, Uint64, AllowanceInfo, SpenderAllowanceInfo, LogoInfo, Addr} from "./types";
export interface InstantiateMsg {
  decimals: number;
  initial_balances: Cw20Coin[];
  marketing?: InstantiateMarketingInfo | null;
  mint?: MinterResponse | null;
  name: string;
  symbol: string;
}
export interface MinterResponse {
  cap?: Uint128 | null;
  minter: string;
}
export type ExecuteMsg = {
  transfer: {
    amount: Uint128;
    recipient: string;
  };
} | {
  burn: {
    amount: Uint128;
  };
} | {
  send: {
    amount: Uint128;
    contract: string;
    msg: Binary;
  };
} | {
  increase_allowance: {
    amount: Uint128;
    expires?: Expiration | null;
    spender: string;
  };
} | {
  decrease_allowance: {
    amount: Uint128;
    expires?: Expiration | null;
    spender: string;
  };
} | {
  transfer_from: {
    amount: Uint128;
    owner: string;
    recipient: string;
  };
} | {
  send_from: {
    amount: Uint128;
    contract: string;
    msg: Binary;
    owner: string;
  };
} | {
  burn_from: {
    amount: Uint128;
    owner: string;
  };
} | {
  mint: {
    amount: Uint128;
    recipient: string;
  };
} | {
  update_minter: {
    new_minter?: string | null;
  };
} | {
  update_marketing: {
    description?: string | null;
    marketing?: string | null;
    project?: string | null;
  };
} | {
  upload_logo: Logo;
};
export type QueryMsg = {
  balance: {
    address: string;
  };
} | {
  token_info: {};
} | {
  minter: {};
} | {
  allowance: {
    owner: string;
    spender: string;
  };
} | {
  all_allowances: {
    limit?: number | null;
    owner: string;
    start_after?: string | null;
  };
} | {
  all_spender_allowances: {
    limit?: number | null;
    spender: string;
    start_after?: string | null;
  };
} | {
  all_accounts: {
    limit?: number | null;
    start_after?: string | null;
  };
} | {
  marketing_info: {};
} | {
  download_logo: {};
};
export interface AllAccountsResponse {
  accounts: string[];
  [k: string]: unknown;
}
export interface AllAllowancesResponse {
  allowances: AllowanceInfo[];
  [k: string]: unknown;
}
export interface AllSpenderAllowancesResponse {
  allowances: SpenderAllowanceInfo[];
  [k: string]: unknown;
}
export interface AllowanceResponse {
  allowance: Uint128;
  expires: Expiration;
  [k: string]: unknown;
}
export interface BalanceResponse {
  balance: Uint128;
}
export interface DownloadLogoResponse {
  data: Binary;
  mime_type: string;
}
export interface MarketingInfoResponse {
  description?: string | null;
  logo?: LogoInfo | null;
  marketing?: Addr | null;
  project?: string | null;
  [k: string]: unknown;
}
export interface TokenInfoResponse {
  decimals: number;
  name: string;
  symbol: string;
  total_supply: Uint128;
}