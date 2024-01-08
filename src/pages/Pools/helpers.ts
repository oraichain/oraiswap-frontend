import { Cw20Coin } from '@oraichain/common-contracts-sdk';
import { InstantiateMarketingInfo } from '@oraichain/common-contracts-sdk/build/Cw20Base.types';
import { validateNumber } from '@oraichain/oraidex-common';
import { Asset, AssetInfo } from '@oraichain/oraidex-contracts-sdk';
import { MinterResponse } from '@oraichain/oraidex-contracts-sdk/build/OraiswapToken.types';

export type ListTokenJsMsg = {
  initialBalances?: Cw20Coin[];
  mint?: MinterResponse;
  marketing?: InstantiateMarketingInfo;
  label?: string;
  name?: string;
  symbol: string;
  liquidityPoolRewardAssets: Asset[];
  pairAssetInfo: AssetInfo;
  targetedAssetInfo?: AssetInfo;
};

const generateMsgFrontierAddToken = (tokenMsg: ListTokenJsMsg) => {
  const {
    symbol,
    liquidityPoolRewardAssets,
    label,
    pairAssetInfo,
    marketing,
    mint,
    initialBalances,
    name,
    targetedAssetInfo
  } = tokenMsg;
  const msgAddTokenFrontier: ListTokenJsMsg = {
    symbol,
    liquidityPoolRewardAssets,
    pairAssetInfo,
    targetedAssetInfo
  };
  if (mint) msgAddTokenFrontier.mint = mint;
  if (initialBalances) msgAddTokenFrontier.initialBalances = initialBalances;

  if (marketing) msgAddTokenFrontier.marketing = marketing;
  if (name) msgAddTokenFrontier.name = name;
  if (label) msgAddTokenFrontier.label = label;
  msgAddTokenFrontier.pairAssetInfo = pairAssetInfo;
  return msgAddTokenFrontier;
};

const getInfoLiquidityPool = ({ denom, contract_addr }) => {
  if (contract_addr)
    return {
      token: {
        contract_addr
      }
    };
  return { native_token: { denom } };
};

const isBigIntZero = (value: BigInt): boolean => {
  return value === BigInt(0);
};

export const parseAssetOnlyDenom = (assetInfo: AssetInfo) => {
  if ('native_token' in assetInfo) return assetInfo.native_token.denom;
  return assetInfo.token.contract_addr;
};

// TODO: need to seperate format funcs to format module later.
export const formatDisplayUsdt = (amount: number | string, dp = 4): string => {
  const validatedAmount = validateNumber(amount);
  if (validatedAmount < 1) return `$${toFixedIfNecessary(amount.toString(), dp).toString()}`;

  return `$${numberWithCommas(toFixedIfNecessary(amount.toString(), dp))}`;
};

export const formatDisplayClaimable = (amount: number | string, dp = 2): string => {
  const validatedAmount = validateNumber(amount);
  if (validatedAmount < 1) {
    const displayValue = toFixedIfNecessary(amount.toString(), 4);
    return !displayValue ? '0' : `+$${toFixedIfNecessary(amount.toString(), 4).toString()}`;
  }

  return `+$${numberWithCommas(toFixedIfNecessary(amount.toString(), dp))}`;
};

export const toFixedIfNecessary = (value: string, dp: number): number => {
  return +parseFloat(value).toFixed(dp);
};

// add `,` when split thounsand value.
export const numberWithCommas = (
  x: number,
  locales: Intl.LocalesArgument = undefined,
  options: Intl.NumberFormatOptions = {}
) => {
  if (isNegative(x)) return '0';
  return x.toLocaleString(locales, options);
};

export const isNegative = (number) => number <= 0;
/**
 * Estmate LP share when provide liquidity pool
 * @param baseAmount input base amount
 * @param quoteAmount input quote amount
 * @param totalShare total LP share of pool
 * @param totalBaseAmount total base amount in pool
 * @param totalQuoteAmount total quote amount in pool
 * @returns // min(1, 2)
  // 1. sqrt(deposit_0 * exchange_rate_0_to_1 * deposit_0) * (total_share / sqrt(pool_0 * pool_1))
  // == deposit_0 * total_share / pool_0
  // 2. sqrt(deposit_1 * exchange_rate_1_to_0 * deposit_1) * (total_share / sqrt(pool_1 * pool_1))
  // == deposit_1 * total_share / pool_1
 */
export const estimateShare = ({
  baseAmount,
  quoteAmount,
  totalShare,
  totalBaseAmount,
  totalQuoteAmount
}: {
  baseAmount: number;
  quoteAmount: number;
  totalShare: number;
  totalBaseAmount: number;
  totalQuoteAmount: number;
}): number => {
  if (totalBaseAmount === 0 || totalQuoteAmount === 0 || !totalShare) return 0;

  const share = Math.min(
    Number((baseAmount * totalShare) / totalBaseAmount),
    Number((quoteAmount * totalShare) / totalQuoteAmount)
  );
  return share;
};

export { generateMsgFrontierAddToken, getInfoLiquidityPool, isBigIntZero };
