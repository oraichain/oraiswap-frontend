import {Addr, Decimal, OracleTreasuryQuery, OracleExchangeQuery, OracleContractQuery, Null, ExchangeRateItem} from "./types";
export interface InstantiateMsg {
  admin?: Addr | null;
  max_rate?: Decimal | null;
  min_rate?: Decimal | null;
  name?: string | null;
  version?: string | null;
}
export type ExecuteMsg = {
  update_admin: {
    admin: Addr;
  };
} | {
  update_exchange_rate: {
    denom: string;
    exchange_rate: Decimal;
  };
} | {
  delete_exchange_rate: {
    denom: string;
  };
} | {
  update_tax_cap: {
    cap: Uint128;
    denom: string;
  };
} | {
  update_tax_rate: {
    rate: Decimal;
  };
};
export type Uint128 = string;
export type QueryMsg = {
  tax_rate: {};
} | {
  tax_cap: {
    denom: string;
  };
} | {
  exchange_rate: {
    base_denom?: string | null;
    quote_denom: string;
  };
} | {
  exchange_rates: {
    base_denom?: string | null;
    quote_denoms: string[];
  };
} | {
  contract_info: {};
} | {
  reward_pool: {
    denom: string;
  };
} | {
  treasury: OracleTreasuryQuery;
} | {
  exchange: OracleExchangeQuery;
} | {
  contract: OracleContractQuery;
};
export interface MigrateMsg {}
export interface ContractInfoResponse {
  admin: Addr;
  creator: Addr;
  max_rate: Decimal;
  min_rate: Decimal;
  name: string;
  version: string;
}
export interface ExchangeRateResponse {
  base_denom: string;
  item: ExchangeRateItem;
}
export interface ExchangeRatesResponse {
  base_denom: string;
  items: ExchangeRateItem[];
}
export interface RewardPoolResponse {
  balance: Coin;
}
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export interface TaxCapResponse {
  cap: Uint128;
}
export interface TaxRateResponse {
  rate: Decimal;
}