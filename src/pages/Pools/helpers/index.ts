import { InstantiateMarketingInfo } from '@oraichain/common-contracts-sdk/build/Cw20Base.types';
import { Cw20Coin } from '@oraichain/common-contracts-sdk/build/types';
import { toDisplay, validateNumber } from '@oraichain/oraidex-common/build/helper';
import { MinterResponse } from '@oraichain/oraidex-contracts-sdk/build/OraiswapToken.types';
import { Asset, AssetInfo } from '@oraichain/oraidex-contracts-sdk/build/types';
import * as Sentry from '@sentry/react';
import { cw20TokenMap, tokenMap } from 'config/bridgeTokens';
import { handleErrorMsg } from 'helper';
import isEqual from 'lodash/isEqual';
import { fetchTokenInfo } from 'rest/api';
import { PoolTableData } from 'types/pool';
import { SCATOM_COINGECKO_ID } from '../constants';

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

export const generateMsgFrontierAddToken = (tokenMsg: ListTokenJsMsg) => {
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

export const getInfoLiquidityPool = ({ denom, contract_addr }) => {
  if (contract_addr)
    return {
      token: {
        contract_addr
      }
    };
  return { native_token: { denom } };
};

export const isBigIntZero = (value: BigInt): boolean => {
  return value === BigInt(0);
};

export const parseAssetOnlyDenom = (assetInfo: AssetInfo) => {
  if ('native_token' in assetInfo) return assetInfo.native_token.denom;
  return assetInfo.token.contract_addr;
};

export const formatDisplayUsdt = (amount: number | string, dp = 2): string => {
  const validatedAmount = validateNumber(amount);
  if (validatedAmount < 1) return `$${toFixedIfNecessary(amount.toString(), 4).toString()}`;

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
  return x.toLocaleString(locales, options);
};

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

export const getStatisticData = (data: PoolTableData[]) => {
  const statisticData = data.reduce(
    (acc, curr) => {
      acc.volume = acc.volume + toDisplay(curr.volume24Hour);
      acc.totalLiquidity = acc.totalLiquidity + curr.totalLiquidity;

      return acc;
    },
    {
      volume: 0,
      totalLiquidity: 0,
      totalClaimable: 0
    }
  );

  return statisticData;
};

export const getClaimableInfoByPool = ({ pool, totalRewardInfoData }) => {
  try {
    const rewardPerSecInfoData = JSON.parse(pool.rewardPerSec);

    const currentPoolReward = totalRewardInfoData?.reward_infos?.find((reward) =>
      isEqual(reward.staking_token, pool.liquidityAddr)
    );
    const totalRewardAmount = BigInt(currentPoolReward?.pending_reward ?? 0);

    // unit LP
    const totalRewardPerSec = rewardPerSecInfoData.assets.reduce(
      (accumulator, currentAsset) => accumulator + BigInt(currentAsset.amount),
      BigInt(0)
    );

    const results = rewardPerSecInfoData.assets
      .filter((asset) => parseInt(asset.amount))
      .map(async (asset) => {
        const pendingWithdraw = BigInt(
          currentPoolReward?.pending_withdraw.find((e) => isEqual(e.info, asset.info))?.amount ?? 0
        );

        const amount = (totalRewardAmount * BigInt(asset.amount)) / totalRewardPerSec + pendingWithdraw;

        let token =
          'token' in asset.info
            ? cw20TokenMap[asset.info.token.contract_addr]
            : tokenMap[asset.info.native_token.denom];

        // only for atom/scatom pool
        if (!token && 'token' in asset.info && asset.info.token?.contract_addr) {
          const tokenInfo = await fetchTokenInfo({
            contractAddress: asset.info.token.contract_addr,
            name: '',
            org: 'Oraichain',
            denom: '',
            Icon: undefined,
            chainId: 'Oraichain',
            rpc: '',
            decimals: 0,
            coinGeckoId: SCATOM_COINGECKO_ID,
            cosmosBased: undefined
          });

          token = {
            ...tokenInfo,
            denom: tokenInfo?.symbol
          };
        }
        return {
          ...token,
          amount,
          pendingWithdraw
        };
      });

    return results;
  } catch (ex) {
    const errorMsg = handleErrorMsg(ex);
    Sentry.captureException(`ERROR: GetClaimableInfoByPool:: ${errorMsg}`);
    return [];
  }
};
