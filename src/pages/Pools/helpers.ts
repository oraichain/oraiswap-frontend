import { Pairs } from 'config/pools';
import { parseAssetInfo } from 'helper';
import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import {
  AggregateResult,
  AssetInfo,
  Cw20Coin,
  InstantiateMarketingInfo,
  MulticallReadOnlyInterface
} from '@oraichain/common-contracts-sdk';
import { OraiswapPairTypes, OraiswapStakingTypes } from '@oraichain/oraidex-contracts-sdk';
import { TokenItemType, assetInfoMap, tokenMap, oraichainTokens } from 'config/bridgeTokens';
import { ORAI, ORAIXOCH_INFO, ORAIX_INFO, ORAI_INFO, SEC_PER_YEAR, STABLE_DENOM } from 'config/constants';
import { network } from 'config/networks';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { atomic, toDecimal, validateNumber } from 'libs/utils';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import {
  fetchAllRewardPerSecInfos,
  fetchAllTokenAssetPools,
  fetchPoolInfoAmount,
  fetchTokenInfos,
  getPairAmountInfo,
  parseTokenInfo
} from 'rest/api';
import { PairInfoExtend, TokenInfo } from 'types/token';
import { MinterResponse } from '@oraichain/oraidex-contracts-sdk/build/OraiswapToken.types';
import { Asset, PairInfo } from '@oraichain/oraidex-contracts-sdk/build/OraiswapPair.types';

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
      const coinGeckoId = oraichainTokens.find((o) => o.contractAddress === assets || o.denom === assets)?.coinGeckoId;
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

// Fetch APR
const fetchAprResult = async (pairs: PairInfo[], pairInfos: PairInfoData[], prices: CoinGeckoPrices<string>) => {
  const lpTokens = pairs.map((p) => ({ contractAddress: p.liquidity_token } as TokenItemType));
  const assetTokens = Pairs.getStakingInfoTokenItemTypeFromPairs(pairs);
  try {
    const [allTokenInfo, allLpTokenAsset, allRewardPerSec] = await Promise.all([
      fetchTokenInfos(lpTokens),
      fetchAllTokenAssetPools(assetTokens),
      fetchAllRewardPerSecInfos(assetTokens)
    ]);
    return calculateAprResult(pairs, pairInfos, prices, allTokenInfo, allLpTokenAsset, allRewardPerSec);
  } catch (error) {
    console.log({ error });
  }
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
        return [pair.contract_addr, {}];
      }
      const value = fromBinary(data.data);
      const bondPools = sumBy(Object.values(value.reward_infos));
      return [pair.contract_addr, !!bondPools];
    })
  );
  return myPairData;
};

const generateRewardInfoQueries = (pairs: PairInfoExtend[], stakerAddress: string) => {
  const queries = pairs.map((pair) => {
    let assetToken = assetInfoMap[pair.asset_infos_raw[0]];
    const firstParsedAssetInfo = parseAssetInfo(pair.asset_infos[0]);

    // we implicitly set asset info of the pool as non-ORAI token. If the first asset info in the pair list is ORAI then we get the other asset info
    if (firstParsedAssetInfo === ORAI) assetToken = assetInfoMap[pair.asset_infos_raw[1]];
    const { info: assetInfo } = parseTokenInfo(assetToken);
    return {
      address: network.staking,
      data: toBinary({
        reward_info: {
          asset_info: assetInfo,
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
  multicall: MulticallReadOnlyInterface
) => {
  const queries = generateRewardInfoQueries(pairs, stakerAddress);
  const res = await multicall.aggregate({
    queries
  });
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

const fetchCacheLpPools = async (pairs: PairInfo[], address: string, multicall: MulticallReadOnlyInterface) => {
  const queries = generateLpPoolsInfoQueries(pairs, address);
  const res = await multicall.aggregate({
    queries
  });
  return calculateLpPools(pairs, res);
};

const isBigIntZero = (value: BigInt): boolean => {
  if (value === BigInt(0)) return true;
  return false;
};

export {
  fetchAprResult,
  fetchPoolListAndOraiPrice,
  fetchPairsData,
  fetchMyPairsData,
  fetchCacheLpPools,
  generateMsgFrontierAddToken,
  getInfoLiquidityPool,
  isBigIntZero
};
