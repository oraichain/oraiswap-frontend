import { useQuery } from '@tanstack/react-query';
import isEqual from 'lodash/isEqual';
import axios from 'rest/request';
import { STALE_TIME } from '../constants';
import { useGetPools } from './useGetPools';
import { useGetRewardInfo } from './useGetRewardInfo';

export type GetStakedByUserQuery = {
  stakerAddress: string;
  tf?: number;
  pairDenoms?: string;
};

export type StakeByUserResponse = {
  stakingAssetDenom: string;
  earnAmountInUsdt: number;
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
      staleTime: STALE_TIME
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
    myStakes
  };
};
