/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Uint128 = string;
/**
 * AssetInfo contract_addr is usually passed from the cw20 hook so we can trust the contract_addr is properly validated.
 */
export type AssetInfo =
  | {
      token: {
        contract_addr: HumanAddr;
        [k: string]: unknown;
      };
      [k: string]: unknown;
    }
  | {
      native_token: {
        denom: string;
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
export type HumanAddr = string;

export interface PoolResponse {
  assets: [Asset, Asset];
  total_share: Uint128;
  [k: string]: unknown;
}
export interface Asset {
  amount: Uint128;
  info: AssetInfo;
  [k: string]: unknown;
}

export interface AllPoolAprResponse {
  [contract_addr: string]: number;
}
