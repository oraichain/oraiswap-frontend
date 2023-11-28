import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { Cw20Coin, MulticallReadOnlyInterface } from '@oraichain/common-contracts-sdk';
import { Asset, AssetInfo, OraiswapPairTypes, OraiswapStakingTypes, PairInfo } from '@oraichain/oraidex-contracts-sdk';
import { assetInfoMap, tokenMap, oraichainTokens } from 'config/bridgeTokens';
import { ORAI, ORAIXOCH_INFO, SEC_PER_YEAR, STABLE_DENOM } from '@oraichain/oraidex-common';
import { network } from 'config/networks';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import { fetchPoolInfoAmount, getPairAmountInfo } from 'rest/api';
import { PairInfoExtend, TokenInfo } from 'types/token';
import { AggregateResult } from '@oraichain/common-contracts-sdk/build/Multicall.types';
import {
  atomic,
  parseAssetInfo,
  parseTokenInfo,
  toDecimal,
  validateNumber,
  TokenItemType
} from '@oraichain/oraidex-common';
import { Pairs } from 'config/pools';
import { MinterResponse } from '@oraichain/oraidex-contracts-sdk/build/OraiswapToken.types';
import { InstantiateMarketingInfo } from '@oraichain/common-contracts-sdk/build/Cw20Base.types';

export type PairInfoData = {
  pair: PairInfoExtend;
} & PairInfoDataRaw &
  PoolInfo;

export type PairInfoDataRaw = {
  amount: number;
  fromToken: TokenItemType;
  toToken: TokenItemType;
} & PoolInfo;

type PairDetails = {
  [key: string]: OraiswapPairTypes.PoolResponse;
};

export const calculateAprResult = (
  pairs: PairInfo[],
  pairInfos: PairInfoData[],
  prices: CoinGeckoPrices<string>,
  allTokenInfo: TokenInfo[],
  allLpTokenAsset: OraiswapStakingTypes.PoolInfoResponse[],
  allRewardPerSec: OraiswapStakingTypes.RewardsPerSecResponse[]
) => {
  const aprResult = pairs.reduce((acc, pair, ind) => {
    const liquidityAmount = pairInfos.find((e) => e.pair.contract_addr === pair.contract_addr);
    const lpToken = allLpTokenAsset[ind];
    const tokenSupply = allTokenInfo[ind];
    const rewardsPerSecData = allRewardPerSec[ind];
    if (!lpToken || !tokenSupply || !rewardsPerSecData) return acc;
    const bondValue =
      (validateNumber(lpToken.total_bond_amount) * liquidityAmount.amount) / validateNumber(tokenSupply.total_supply);
    const rewardsPerSec = rewardsPerSecData.assets;
    let rewardsPerYearValue = 0;
    rewardsPerSec.forEach(({ amount, info }) => {
      const assets = parseAssetInfo(info);
      const assetsToken = oraichainTokens.find((o) => o.contractAddress === assets || o.denom === assets);
      const coinGeckoId = assetsToken && assetsToken.coinGeckoId;
      if (coinGeckoId) {
        rewardsPerYearValue += (SEC_PER_YEAR * validateNumber(amount) * prices[coinGeckoId]) / atomic;
      } else if (isEqual(info, ORAIXOCH_INFO)) {
        //TODO: hardcode token xOCH: $0.4
        rewardsPerYearValue += (SEC_PER_YEAR * validateNumber(amount) * 0.4) / atomic;
      }
    });
    return {
      ...acc,
      [pair.contract_addr]: (100 * rewardsPerYearValue) / bondValue || 0
    };
  }, {});
  return aprResult;
};

// Fetch Pair Info Data List
const fetchPoolListAndOraiPrice = async (pairs: PairInfoExtend[], cachedPairs: PairDetails) => {
  if (!cachedPairs) {
    // wait for cached pair updated
    return;
  }
  let poolList: PairInfoData[] = await Promise.all(
    pairs.map(async (p: PairInfoExtend) => {
      const pairInfoDataRaw = await fetchPairInfoData(p, cachedPairs);
      return {
        pair: p,
        ...pairInfoDataRaw
      } as PairInfoData;
    })
  );

  const oraiUsdtPool = poolList.find((pool) => pool.fromToken.denom === ORAI && pool.toToken.denom === STABLE_DENOM);
  const oraiPrice = toDecimal(oraiUsdtPool.askPoolAmount, oraiUsdtPool.offerPoolAmount);
  try {
    const poolOraiUsdData = await fetchPoolInfoAmount(tokenMap[ORAI], tokenMap[STABLE_DENOM], cachedPairs);
    const pairAmounts = await Promise.all(
      poolList.map((pool) => getPairAmountInfo(pool.fromToken, pool.toToken, cachedPairs, { ...pool }, poolOraiUsdData))
    );
    poolList = poolList
      .map((pool, ind) => ({
        ...pool,
        amount: pairAmounts[ind].tokenUsd
      }))
      .sort((a, b) => b.amount - a.amount);
    return {
      pairInfo: poolList,
      oraiPrice
    };
  } catch (error) {
    console.log('error getPairAmountInfo', error);
  }
};

export const fetchPairInfoData = async (pairInfo: PairInfoExtend, cached: PairDetails): Promise<PairInfoDataRaw> => {
  const fromToken = assetInfoMap[pairInfo.asset_infos_raw[0]];
  const toToken = assetInfoMap[pairInfo.asset_infos_raw[1]];
  if (!fromToken || !toToken) return;

  try {
    const poolData = await fetchPoolInfoAmount(fromToken, toToken, cached, pairInfo);
    return {
      ...poolData,
      amount: 0,
      fromToken,
      toToken
    };
  } catch (ex) {
    console.log(ex);
  }
};

export const toPairDetails = (pairs: PairInfo[], res: AggregateResult): PairDetails => {
  const pairsData = Object.fromEntries(
    pairs.map((pair, ind) => {
      const data = res.return_data[ind];
      if (!data.success) {
        return [pair.contract_addr, {}];
      }
      return [pair.contract_addr, fromBinary(data.data)];
    })
  );
  return pairsData;
};

// Fetch all pair data
const fetchPairsData = async (pairs: PairInfo[], multicall: MulticallReadOnlyInterface) => {
  const queries = pairs.map((pair) => ({
    address: pair.contract_addr,
    data: toBinary({
      pool: {}
    })
  }));

  const res = await multicall.aggregate({
    queries
  });
  return { pairs, pairDetails: toPairDetails(pairs, res) };
};

export const calculateReward = (pairs: PairInfo[], res: AggregateResult) => {
  const myPairData = Object.fromEntries(
    pairs.map((pair, ind) => {
      const data = res.return_data[ind];
      if (!data.success) {
        return [pair.contract_addr, false];
      }
      const value = fromBinary(data.data);
      const bondPools = sumBy(Object.values(value.reward_infos));
      return [pair.contract_addr, !!bondPools];
    })
  );
  return myPairData;
};

export const calculateBondLpPools = (pairs: PairInfo[], res: AggregateResult) => {
  const myPairData = Object.fromEntries(
    pairs.map((pair, ind) => {
      const data = res.return_data[ind];
      if (!data.success) {
        return [pair.contract_addr, false];
      }
      const binaryData = fromBinary(data.data);
      const rewardInfos = binaryData && binaryData.reward_infos && binaryData.reward_infos;
      const bondAmount = rewardInfos && rewardInfos[0] && rewardInfos[0].bond_amount;
      return [pair.contract_addr, bondAmount || '0'];
    })
  );
  return myPairData;
};

const generateRewardInfoQueries = (pairs: PairInfoExtend[], stakerAddress: string) => {
  const queries = pairs.map((pair) => {
    return {
      address: network.staking,
      data: toBinary({
        reward_info: {
          staking_token: pair.liquidity_token,
          staker_addr: stakerAddress
        }
      })
    };
  });
  return queries;
};

const fetchMyPairsData = async (
  pairs: PairInfoExtend[],
  stakerAddress: string,
  multicall: MulticallReadOnlyInterface,
  typeReward?: string
) => {
  const queries = generateRewardInfoQueries(pairs, stakerAddress);
  const res = await multicall.aggregate({
    queries
  });
  if (typeReward === 'bond') return calculateBondLpPools(pairs, res);
  return calculateReward(pairs, res);
};

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

const generateLpPoolsInfoQueries = (pairs: PairInfo[], address: string) => {
  const queries = pairs.map((pair) => ({
    address: pair.liquidity_token,
    data: toBinary({
      balance: {
        address
      }
    })
  }));
  return queries;
};

const calculateLpPools = (pairs: PairInfo[], res: AggregateResult) => {
  const lpTokenData = Object.fromEntries(
    pairs.map((pair, ind) => {
      const data = res.return_data[ind];
      if (!data.success) {
        return [pair.liquidity_token, {}];
      }
      return [pair.liquidity_token, fromBinary(data.data)];
    })
  );
  return lpTokenData;
};

export const calculateLpPoolsV3 = (lpAddresses: string[], res: AggregateResult) => {
  const lpTokenData = Object.fromEntries(
    lpAddresses.map((lpAddress, ind) => {
      const data = res.return_data[ind];
      if (!data.success) {
        return [lpAddress, {}];
      }
      return [lpAddress, fromBinary(data.data)];
    })
  );
  return lpTokenData;
};

export const fetchCacheLpPoolsV3 = async (
  lpAddresses: string[],
  userAddress: string,
  multicall: MulticallReadOnlyInterface
) => {
  const queries = lpAddresses.map((lpAddress) => ({
    address: lpAddress,
    data: toBinary({
      balance: {
        address: userAddress
      }
    })
  }));
  const res = await multicall.aggregate({
    queries
  });
  return calculateLpPoolsV3(lpAddresses, res);
};

const fetchCacheLpPools = async (pairs: PairInfo[], address: string, multicall: MulticallReadOnlyInterface) => {
  const queries = generateLpPoolsInfoQueries(pairs, address);
  const res = await multicall.aggregate({
    queries
  });
  return calculateLpPools(pairs, res);
};

const isBigIntZero = (value: BigInt): boolean => {
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

export const toFixedIfNecessary = (value: string, dp: number): number => {
  return +parseFloat(value).toFixed(dp);
};

// add `,` when split thounsand value.
export const numberWithCommas = (x: number) => {
  return x.toLocaleString();
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
  if (totalBaseAmount === 0 || totalQuoteAmount === 0) return 0;

  const share = Math.min(
    Number((baseAmount * totalShare) / totalBaseAmount),
    Number((quoteAmount * totalShare) / totalQuoteAmount)
  );
  return share;
};

export {
  fetchCacheLpPools,
  fetchMyPairsData,
  fetchPairsData,
  fetchPoolListAndOraiPrice,
  generateMsgFrontierAddToken,
  getInfoLiquidityPool,
  isBigIntZero
};
