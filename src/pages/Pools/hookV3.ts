import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { MulticallQueryClient, MulticallReadOnlyInterface } from '@oraichain/common-contracts-sdk';
import { AggregateResult } from '@oraichain/common-contracts-sdk/build/Multicall.types';
import { ORAI } from '@oraichain/oraidex-common';
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
import isEqual from 'lodash/isEqual';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RewardPoolType } from 'reducer/config';
import { updateLpPools } from 'reducer/token';
import { fetchRewardPerSecInfo } from 'rest/api';
import axios, { withBaseApiUrl } from 'rest/request';
import { PoolInfoResponse } from 'types/pool';
import { PairInfoExtend } from 'types/token';

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
        const assetToken = oraichainTokens.find((token) => token.denom === denom || token.contractAddress === denom);
        const [pairInfoRewardDataRaw] = await Promise.all([fetchRewardPerSecInfo(assetToken)]);
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
    const res = await axios.get(withBaseApiUrl('/v1/pools/'), {});
    return res.data;
  } catch (e) {
    console.error('getPools', e);
    return [];
  }
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
    const res = await axios.get(withBaseApiUrl('/v1/my-staking/'), { params: queries });
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
    }
  );

  // calculate total staked of all pool
  const totalStaked = pools.reduce((accumulator, pool) => {
    const { totalSupply, totalLiquidity, firstAssetInfo, secondAssetInfo } = pool;
    const stakingAssetInfo = Pairs.getStakingAssetInfo([JSON.parse(firstAssetInfo), JSON.parse(secondAssetInfo)]);
    const myStakedLP = stakingAssetInfo
      ? totalRewardInfoData?.reward_infos.find((item) => isEqual(item.asset_info, stakingAssetInfo))?.bond_amount || '0'
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
    myStakes
  };
};

export const useGetPoolDetail = ({ pairDenoms }: { pairDenoms: string }) => {
  const getPoolDetail = async (queries: { pairDenoms: string }): Promise<PoolInfoResponse> => {
    try {
      const res = await axios.get(withBaseApiUrl('/v1/pool-detail/'), { params: queries });
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
  assetInfo?: AssetInfo;
};
export const fetchRewardInfoV3 = async (
  stakerAddr: string,
  assetInfo?: AssetInfo
): Promise<OraiswapStakingTypes.RewardInfoResponse> => {
  const stakingContract = new OraiswapStakingQueryClient(window.client, network.staking);
  let payload: RewardInfoQueryType = {
    stakerAddr
  };
  if (assetInfo) payload.assetInfo = assetInfo;
  const data = await stakingContract.rewardInfo(payload);
  return data;
};

export const useGetRewardInfo = ({ stakerAddr, assetInfo: stakingAssetInfo }: RewardInfoQueryType) => {
  const { data: totalRewardInfoData, refetch: refetchRewardInfo } = useQuery(
    ['reward-info', stakerAddr, stakingAssetInfo],
    () => fetchRewardInfoV3(stakerAddr, stakingAssetInfo),
    { enabled: !!stakerAddr, refetchOnWindowFocus: true }
  );

  return { totalRewardInfoData, refetchRewardInfo };
};
