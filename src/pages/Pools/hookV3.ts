import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { MulticallQueryClient, MulticallReadOnlyInterface } from '@oraichain/common-contracts-sdk';
import { AggregateResult } from '@oraichain/common-contracts-sdk/build/Multicall.types';
import { ORAI, parseAssetInfo, toDisplay } from '@oraichain/oraidex-common';
import {
  AssetInfo,
  OraiswapStakingQueryClient,
  OraiswapStakingTypes,
  PairInfo
} from '@oraichain/oraidex-contracts-sdk';
import { useQuery } from '@tanstack/react-query';
import { cw20TokenMap, oraichainTokens, tokenMap } from 'config/bridgeTokens';
import { network } from 'config/networks';
import { Pairs } from 'config/pools';
import useConfigReducer from 'hooks/useConfigReducer';
import { getUsd } from 'libs/utils';
import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RewardPoolType } from 'reducer/config';
import { updateLpPools } from 'reducer/token';
import { fetchRewardPerSecInfo, fetchTokenInfo } from 'rest/api';
import axios from 'rest/request';
import { RootState } from 'store/configure';
import { PoolInfoResponse } from 'types/pool';
import { PairInfoExtend } from 'types/token';
import { PoolTableData } from './indexV3';

// Fetch Reward
export const useFetchCacheReward = (pairs: PairInfo[]) => {
  const [cachedReward, setCachedReward] = useConfigReducer('rewardPools');
  const fetchReward = async () => {
    let rewardAll: RewardPoolType[] = await Promise.all(
      pairs.map(async (p: PairInfoExtend) => {
        let denom = '';
        if (p.asset_infos_raw?.[0] === ORAI) {
          denom = p.asset_infos_raw?.[1];
        } else {
          denom = p.asset_infos_raw?.[0];
        }
        const [pairInfoRewardDataRaw] = await Promise.all([fetchRewardPerSecInfo(p.liquidity_token)]);
        const reward = pairInfoRewardDataRaw.assets.reduce((acc, cur) => {
          let token =
            'token' in cur.info ? cw20TokenMap[cur.info.token.contract_addr] : tokenMap[cur.info.native_token.denom];
          // TODO: hardcode token reward xOCH
          return [...acc, token?.name ?? token?.denom ?? 'xOCH'];
        }, []);
        return {
          reward,
          liquidity_token: p.liquidity_token
        };
      })
    );
    setCachedReward(rewardAll);
  };

  useEffect(() => {
    if (!cachedReward?.length || cachedReward?.length < pairs?.length) {
      fetchReward();
    }
  }, [pairs]);

  return [cachedReward];
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

export const fetchLpPoolsFromContract = async (
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

// Fetch lp pools from contract
export const useFetchLpPoolsV3 = (lpAddresses: string[]) => {
  const dispatch = useDispatch();
  const [address] = useConfigReducer('address');
  const setCachedLpPools = (payload: LpPoolDetails) => dispatch(updateLpPools(payload));

  const fetchLpPool = async () => {
    const lpTokenData = await fetchLpPoolsFromContract(
      lpAddresses,
      address,
      new MulticallQueryClient(window.client, network.multicall)
    );
    setCachedLpPools(lpTokenData);
  };

  useEffect(() => {
    if (lpAddresses.length > 0 && address) {
      fetchLpPool();
    }
  }, [lpAddresses, address]);
};

export const getPools = async (): Promise<PoolInfoResponse[]> => {
  try {
    const res = await axios.get('/v1/pools/', {});
    return res.data;
  } catch (e) {
    console.error('getPools', e);
    return [];
  }
};

export const useGetPriceChange = (params: { base_denom: string; quote_denom: string; tf: number }) => {
  const getPriceChange = async (queries: { base_denom: string; quote_denom: string; tf: number }) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/price`, { params: queries }); // TODO: change Server url
      return res.data;
    } catch (e) {
      console.error('useGetPriceChange', e);
      return {
        price_change: 0,
        price: 0
      };
    }
  };

  const { data: priceChange, isLoading } = useQuery(['price-change', params], () => getPriceChange(params), {
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
    placeholderData: {
      price: 0,
      price_change: 0
    }
  });

  return {
    isLoading,
    priceChange
  };
};

export const useGetPools = () => {
  const { data: pools } = useQuery(['pools'], getPools, {
    refetchOnWindowFocus: true,
    placeholderData: [],
    staleTime: 5 * 60 * 1000
  });
  return pools;
};

export type GetStakedByUserQuery = {
  stakerAddress: string;
  tf?: number;
  pairDenoms?: string;
};

export type StakeByUserResponse = {
  stakingAssetDenom: string;
  earnAmountInUsdt: number;
  stakingAmountInUsdt: number;
};

const getMyStake = async (queries: GetStakedByUserQuery): Promise<StakeByUserResponse[]> => {
  try {
    const res = await axios.get('/v1/my-staking/', { params: queries });
    return res.data;
  } catch (e) {
    console.error('getMyStake', e);
  }
};
export const useGetMyStake = ({ stakerAddress, pairDenoms, tf }: GetStakedByUserQuery) => {
  const { totalRewardInfoData } = useGetRewardInfo({ stakerAddr: stakerAddress });
  const pools = useGetPools();

  const { data: myStakes } = useQuery(
    ['myStakes', stakerAddress, pairDenoms, tf],
    () => getMyStake({ stakerAddress, pairDenoms, tf }),
    {
      placeholderData: [],
      refetchOnWindowFocus: true,
      enabled: !!stakerAddress,
      staleTime: 5 * 60 * 1000
      // cacheTime: 5 * 60 * 1000,
      // initialData: []
    }
  );

  // calculate total staked of all pool
  const totalStaked = pools.reduce((accumulator, pool) => {
    const { totalSupply, totalLiquidity } = pool;
    const myStakedLP = pool.liquidityAddr
      ? totalRewardInfoData?.reward_infos.find((item) => isEqual(item.staking_token, pool.liquidityAddr))
          ?.bond_amount || '0'
      : 0;

    const lpPrice = totalSupply ? totalLiquidity / Number(totalSupply) : 0;
    const myStakeLPInUsdt = +myStakedLP * lpPrice;
    accumulator += myStakeLPInUsdt;
    return accumulator;
  }, 0);

  const totalEarned = myStakes
    ? myStakes.reduce((total, current) => {
        total += current.earnAmountInUsdt;
        return total;
      }, 0)
    : 0;

  return {
    totalStaked,
    totalEarned,
    myStakes: myStakes || []
  };
};

export const useGetPoolDetail = ({ pairDenoms }: { pairDenoms: string }) => {
  const getPoolDetail = async (queries: { pairDenoms: string }): Promise<PoolInfoResponse> => {
    try {
      const res = await axios.get('/v1/pool-detail/', { params: queries });
      return res.data;
    } catch (e) {
      console.error('error getPoolDetail: ', e);
    }
  };

  const { data: poolDetail, isLoading } = useQuery(['pool-detail', pairDenoms], () => getPoolDetail({ pairDenoms }), {
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
    enabled: !!pairDenoms
  });

  const pairRawData = pairDenoms.split('_');
  const tokenTypes = pairRawData.map((raw) =>
    oraichainTokens.find((token) => token.denom === raw || token.contractAddress === raw)
  );
  return {
    info: poolDetail,
    token1: tokenTypes[0],
    token2: tokenTypes[1],
    isLoading
  };
};

export type RewardInfoQueryType = {
  stakerAddr: string;
  stakingToken?: string;
};
export const fetchRewardInfoV3 = async (
  stakerAddr: string,
  stakingToken?: string
): Promise<OraiswapStakingTypes.RewardInfoResponse> => {
  const stakingContract = new OraiswapStakingQueryClient(window.client, network.staking);
  let payload: RewardInfoQueryType = {
    stakerAddr
  };
  if (stakingToken) payload.stakingToken = stakingToken;
  const data = await stakingContract.rewardInfo(payload);
  return data;
};

export const useGetRewardInfo = ({ stakerAddr, stakingToken }: RewardInfoQueryType) => {
  const { data: totalRewardInfoData, refetch: refetchRewardInfo } = useQuery(
    ['reward-info', stakerAddr, stakingToken],
    () => fetchRewardInfoV3(stakerAddr, stakingToken),
    { enabled: !!stakerAddr, refetchOnWindowFocus: true }
  );

  return { totalRewardInfoData, refetchRewardInfo };
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
  const stakingAssetInfo = Pairs.getStakingAssetInfo([
    JSON.parse(pool.firstAssetInfo),
    JSON.parse(pool.secondAssetInfo)
  ]);
  const rewardPerSecInfoData = JSON.parse(pool.rewardPerSec);

  const currentPoolReward = totalRewardInfoData?.reward_infos?.find(
    (reward) => parseAssetInfo(reward.asset_info) === parseAssetInfo(stakingAssetInfo)
  );
  const totalRewardAmount = BigInt(currentPoolReward?.pending_reward ?? 0);

  // unit LP
  const totalRewardPerSec = rewardPerSecInfoData.assets
    .map((asset) => BigInt(asset.amount))
    .reduce((a, b) => a + b, BigInt(0));

  const results = rewardPerSecInfoData.assets
    .filter((asset) => parseInt(asset.amount))
    .map(async (asset) => {
      const pendingWithdraw = BigInt(
        totalRewardInfoData.reward_infos[0]?.pending_withdraw.find((e) => isEqual(e.info, asset.info))?.amount ?? 0
      );

      const amount = (totalRewardAmount * BigInt(asset.amount)) / totalRewardPerSec + pendingWithdraw;

      let token =
        'token' in asset.info ? cw20TokenMap[asset.info.token.contract_addr] : tokenMap[asset.info.native_token.denom];

      // only for atom/scatom pool
      if (!token && 'token' in asset.info && asset.info?.token?.contract_addr) {
        const tokenInfo = await fetchTokenInfo({
          contractAddress: asset.info.token.contract_addr,
          name: '',
          org: 'Oraichain',
          denom: '',
          Icon: undefined,
          chainId: 'Oraichain',
          rpc: '',
          decimals: 0,
          coinGeckoId: 'scatom',
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
};

export const getClaimableAmountByPool = async ({ pool, totalRewardInfoData, cachePrices }) => {
  const results = getClaimableInfoByPool({ pool, totalRewardInfoData });

  const res = await Promise.all(results);

  const total = res.reduce((acc, cur) => {
    const eachBalance = getUsd(cur.amount, cur, cachePrices, cur.coinGeckoId === 'scatom' && xOCH_PRICE);

    acc = acc + eachBalance;

    return acc;
  }, 0);

  return total;
};

export const getTotalClaimable = async ({ poolTableData, totalRewardInfoData }) => {
  const promiseRes = [];

  poolTableData.map((e) => {
    const results = getClaimableInfoByPool({ pool: e, totalRewardInfoData });
    promiseRes.push(...results);
  });

  const res = await Promise.all(promiseRes);

  return res;
};

export const xOCH_PRICE = 0.4;

export const useGetTotalClaimable = ({ poolTableData, totalRewardInfoData }) => {
  const [cachePrices] = useConfigReducer('coingecko');
  const [totalClaim, setTotalClaim] = useState();
  const lpPools = useSelector((state: RootState) => state.token.lpPools);

  const isPoolWithLiquidity = (pool: PoolInfoResponse) => {
    const liquidityAddress = pool?.liquidityAddr;
    return parseInt(lpPools[liquidityAddress]?.balance) > 0;
  };

  const findBondAmount = (pool: PoolInfoResponse) => {
    const assetInfo = Pairs.getStakingAssetInfo([JSON.parse(pool.firstAssetInfo), JSON.parse(pool.secondAssetInfo)]);
    const rewardInfo = totalRewardInfoData?.reward_infos.find(({ asset_info }) => isEqual(asset_info, assetInfo));
    return rewardInfo ? parseInt(rewardInfo.bond_amount) : 0;
  };

  const myPools = poolTableData.filter((pool) => isPoolWithLiquidity(pool) || findBondAmount(pool) > 0);

  useEffect(() => {
    (async () => {
      if (totalRewardInfoData) {
        const res = await getTotalClaimable({ poolTableData: myPools, totalRewardInfoData });
        const total = res.reduce((acc, cur) => {
          const eachBalance = getUsd(cur.amount, cur, cachePrices, cur.coinGeckoId === 'scatom' && xOCH_PRICE);

          acc = acc + eachBalance;

          return acc;
        }, 0);

        if (res) {
          setTotalClaim(total);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalRewardInfoData, poolTableData, cachePrices]);

  return totalClaim;
};

export const useGetPoolsWithClaimableAmount = ({ poolTableData, totalRewardInfoData }) => {
  const [cachePrices] = useConfigReducer('coingecko');
  const [listClaimable, setListClaimable] = useState([]);
  const promiseClaimAmounts = poolTableData.map(async (pool) => {
    const stakingAssetInfo = Pairs.getStakingAssetInfo([
      JSON.parse(pool.firstAssetInfo),
      JSON.parse(pool.secondAssetInfo)
    ]);
    const amountEachPool = await getClaimableAmountByPool({ pool, totalRewardInfoData, cachePrices });

    return {
      assetInfo: stakingAssetInfo,
      amountEachPool: amountEachPool
    };
  });

  useEffect(() => {
    (async () => {
      if (totalRewardInfoData) {
        const res = await Promise.all(promiseClaimAmounts);

        if (res) {
          setListClaimable(res);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalRewardInfoData, poolTableData, cachePrices]);

  return listClaimable;
};
