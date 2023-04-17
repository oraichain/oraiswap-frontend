import { network } from 'config/networks';
import { AggregateResult } from 'libs/contracts/types';
import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { TokenItemType, tokenMap } from 'config/bridgeTokens';
import { ORAI, ORAIX_INFO, ORAI_INFO, SEC_PER_YEAR, STABLE_DENOM } from 'config/constants';
import { Contract } from 'config/contracts';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { PoolResponse } from 'libs/contracts/OraiswapPair.types';
import { PoolInfoResponse, RewardsPerSecResponse } from 'libs/contracts/OraiswapStaking.types';
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
import { TokenInfo } from 'types/token';
import { Pairs, Pair } from 'config/poolV2';
import { compact } from 'lodash';

interface PoolInfo {
  offerPoolAmount: bigint;
  askPoolAmount: bigint;
}
export type PairInfoData = {
  pair: Pair;
  amount: number;
  commissionRate: string;
  fromToken: TokenItemType;
  toToken: TokenItemType;
} & PoolInfo;

type PairDetails = {
  [key: string]: PoolResponse;
};

export const calculateAprResult = (
  pairInfos: PairInfoData[],
  prices: CoinGeckoPrices<string>,
  allTokenInfo: TokenInfo[],
  allLpTokenAsset: PoolInfoResponse[],
  allRewardPerSec: RewardsPerSecResponse[]
) => {
  const aprResult = Pairs.pairs.reduce((acc, pair, ind) => {
    const liquidityAmount = pairInfos.find((e) => e.pair.contract_addr === pair.contract_addr);
    const lpToken = allLpTokenAsset[ind];
    const tokenSupply = allTokenInfo[ind];
    const bondValue =
      (validateNumber(lpToken.total_bond_amount) * liquidityAmount.amount) / validateNumber(tokenSupply.total_supply);
    const rewardsPerSec = allRewardPerSec[ind].assets;
    let rewardsPerYearValue = 0;
    rewardsPerSec.forEach(({ amount, info }) => {
      if (isEqual(info, ORAI_INFO))
        rewardsPerYearValue += (SEC_PER_YEAR * validateNumber(amount) * prices['oraichain-token']) / atomic;
      else if (isEqual(info, ORAIX_INFO))
        rewardsPerYearValue += (SEC_PER_YEAR * validateNumber(amount) * prices['oraidex']) / atomic;
    });
    return {
      ...acc,
      [pair.contract_addr]: (100 * rewardsPerYearValue) / bondValue || 0
    };
  }, {});
  return aprResult;
};

// Fetch APR
const fetchAprResult = async (pairInfos: PairInfoData[], prices: CoinGeckoPrices<string>) => {
  const lpTokens = Pairs.pairs.map((p) => ({ contractAddress: p.liquidity_token } as TokenItemType));
  const assetTokens = Pairs.pairs.map((p) => tokenMap[p.token_asset]);

  try {
    const [allTokenInfo, allLpTokenAsset, allRewardPerSec] = await Promise.all([
      fetchTokenInfos(lpTokens),
      fetchAllTokenAssetPools(assetTokens),
      fetchAllRewardPerSecInfos(assetTokens)
    ]);
    return calculateAprResult(pairInfos, prices, allTokenInfo, allLpTokenAsset, allRewardPerSec);
  } catch (error) {
    console.log({ error });
  }
};

// Fetch Pair Info Data List
const fetchPoolListAndOraiPrice = async (cachedPairs: PairDetails) => {
  if (!cachedPairs) {
    // wait for cached pair updated
    return;
  }
  let poolList: PairInfoData[] = compact(await Promise.all(Pairs.pairs.map((p) => fetchPairInfoData(p, cachedPairs))));
  const oraiUsdtPool = poolList.find((pool) => pool.fromToken.denom === ORAI && pool.toToken.denom === STABLE_DENOM);
  if (!oraiUsdtPool) {
    // retry after 3 seconds
    setTimeout(fetchPoolListAndOraiPrice, 3000);
  } else {
    const oraiPrice = toDecimal(oraiUsdtPool.askPoolAmount, oraiUsdtPool.offerPoolAmount);
    try {
      const pairAmounts = await Promise.all(
        poolList.map((pool) => getPairAmountInfo(pool.fromToken, pool.toToken, cachedPairs))
      );
      poolList.forEach((pool, ind) => {
        pool.amount = pairAmounts[ind].tokenUsd;
      });
      poolList.sort((a, b) => b.amount - a.amount);
      return {
        pairInfo: poolList,
        oraiPrice
      };
    } catch (error) {
      console.log('error getPairAmountInfo', error);
    }
  }
};

export const fetchPairInfoData = async (pair: Pair, cached: PairDetails): Promise<PairInfoData> => {
  const [fromToken, toToken] = pair.asset_denoms.map((denom) => tokenMap[denom]);
  if (!fromToken || !toToken) return;

  try {
    const poolData = await fetchPoolInfoAmount(fromToken, toToken, cached);
    return {
      ...poolData,
      amount: 0,
      pair,
      commissionRate: pair.commission_rate,
      fromToken,
      toToken
    };
  } catch (ex) {
    console.log(ex);
  }
};

export const toPairDetails = (res: AggregateResult): PairDetails => {
  const pairsData = Object.fromEntries(
    Pairs.pairs.map((pair, ind) => {
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
const fetchCachedPairsData = async () => {
  const queries = Pairs.pairs.map((pair) => ({
    address: pair.contract_addr,
    data: toBinary({
      pool: {}
    })
  }));

  const res = await Contract.multicall.aggregate({
    queries
  });
  return toPairDetails(res);
};

export const calculateReward = (res: AggregateResult) => {
  const myPairData = Object.fromEntries(
    Pairs.pairs.map((pair, ind) => {
      const data = res.return_data[ind];
      if (!data.success) {
        return [pair.contract_addr, {}];
      }
      const value = fromBinary(data.data);
      const bondPools = sumBy(Object.values(value.reward_infos));
      console.log({ reward_infos: value.reward_infos, ind });
      return [pair.contract_addr, !!bondPools];
    })
  );
  return myPairData;
};

const generateRewardInfoQueries = (stakerAddress: string) => {
  const queries = Pairs.pairs.map((pair) => {
    const assetToken = tokenMap[pair.token_asset];
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

const fetchMyCachedPairsData = async (stakerAddress: string) => {
  const queries = generateRewardInfoQueries(stakerAddress);
  const res = await Contract.multicall.aggregate({
    queries
  });
  return calculateReward(res);
};

export { fetchAprResult, fetchPoolListAndOraiPrice, fetchCachedPairsData, fetchMyCachedPairsData };
