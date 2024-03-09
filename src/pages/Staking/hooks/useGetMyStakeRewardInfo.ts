import { Cw20StakingQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { useQuery } from '@tanstack/react-query';
import { network } from 'config/networks';

export const useGetMyStakeRewardInfo = (stakingToken, stakerAddr) => {
  const getRewardAmount = async () => {
    const cw20Staking = new Cw20StakingQueryClient(window.client, network.staking_oraix);
    const data = await cw20Staking.rewardInfo({
      stakingToken,
      stakerAddr
    });

    const rewardPending = data?.reward_infos?.reduce((acc, cur) => {
      acc = Number(cur.pending_reward) + acc;

      return acc;
    }, 0);

    const stakedAmount = data?.reward_infos?.reduce((acc, cur) => {
      acc = Number(cur.bond_amount) + acc;

      return acc;
    }, 0);

    return {
      ...(data || {
        reward_infos: [],
        staker_addr: stakerAddr
      }),
      rewardPending: rewardPending.toString(),
      stakedAmount: stakedAmount.toString()
    };
  };

  const {
    data: myStakeRewardInfo,
    isLoading,
    refetch: refetchMyStakeRewardInfo
  } = useQuery(['my-stake-reward-info', stakerAddr, stakingToken], () => getRewardAmount(), {
    refetchOnWindowFocus: false,
    placeholderData: {
      reward_infos: [],
      rewardPending: '0',
      staker_addr: stakerAddr,
      stakedAmount: '0'
    },
    enabled: !!stakingToken && !!stakerAddr
  });

  return { myStakeRewardInfo, isLoading, refetchMyStakeRewardInfo };
};
