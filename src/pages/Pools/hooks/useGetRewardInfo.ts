import { OraiswapStakingQueryClient } from '@oraichain/oraidex-contracts-sdk/build/OraiswapStaking.client';
import { RewardInfoResponse } from '@oraichain/oraidex-contracts-sdk/build/OraiswapStaking.types';
import { useQuery } from '@tanstack/react-query';
import { network } from 'config/networks';

export type RewardInfoQueryType = {
  stakerAddr: string;
  stakingToken?: string;
  poolInfo?: {
    liquidityAddr: string;
  };
};

export const fetchRewardInfoV3 = async (stakerAddr: string, stakingToken?: string): Promise<RewardInfoResponse> => {
  const stakingContract = new OraiswapStakingQueryClient(window.client, network.staking);
  let payload: RewardInfoQueryType = {
    stakerAddr
  };
  if (stakingToken) payload.stakingToken = stakingToken;
  const data = await stakingContract.rewardInfo(payload);
  return data;
};

export const useGetRewardInfo = ({ stakerAddr }: RewardInfoQueryType) => {
  const { data: totalRewardInfoData, refetch: refetchRewardInfo } = useQuery(
    ['reward-info', stakerAddr],
    () => fetchRewardInfoV3(stakerAddr),
    { enabled: !!stakerAddr, refetchOnWindowFocus: true }
  );

  return { totalRewardInfoData, refetchRewardInfo };
};

export const useGetRewardInfoDetail = ({ stakerAddr, poolInfo }: RewardInfoQueryType) => {
  const { data: totalRewardInfoData, refetch: refetchRewardInfo } = useQuery(
    ['reward-info-detail', stakerAddr, poolInfo],
    () => {
      return fetchRewardInfoV3(stakerAddr, poolInfo.liquidityAddr);
    },
    { enabled: !!stakerAddr && !!poolInfo && !!poolInfo.liquidityAddr, refetchOnWindowFocus: true }
  );

  return { totalRewardInfoData, refetchRewardInfo };
};
