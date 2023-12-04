import { MulticallQueryClient } from '@oraichain/common-contracts-sdk/build/Multicall.client';
import { network } from '@oraichain/oraidex-common/build/network';
import { useQueryClient } from '@tanstack/react-query';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { updateLpPools } from 'reducer/token';
import { PoolInfoResponse } from 'types/pool';
import { fetchLpPoolsFromContract } from './useFetchLpPool';
import { useGetPairInfo } from './useGetPairInfo';
import { useGetPoolDetail } from './useGetPoolDetail';
import { useGetPools } from './useGetPools';
import { RootState } from 'store/configure';

export const useLiquidityPool = (poolUrl: string) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [address] = useConfigReducer('address');
  const pools = useGetPools();
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  const poolDetailData = useGetPoolDetail({ pairDenoms: poolUrl });
  const lpTokenBalance = BigInt(poolDetailData.info ? lpPools[poolDetailData.info?.liquidityAddr]?.balance || '0' : 0);
  const loadTokenAmounts = useLoadTokens();
  const setCachedLpPools = (payload: LpPoolDetails) => dispatch(updateLpPools(payload));
  const { refetchPairAmountInfo, refetchLpTokenInfoData } = useGetPairInfo(poolDetailData);

  const refetchAllLpPools = useCallback(async () => {
    if (pools.length === 0) return;
    const lpAddresses = pools.map((pool) => pool.liquidityAddr);
    const lpTokenData = await fetchLpPoolsFromContract(
      lpAddresses,
      address,
      new MulticallQueryClient(window.client, network.multicall)
    );
    setCachedLpPools(lpTokenData);
  }, [pools]);

  const onLiquidityChange = useCallback(
    (amountLpInUsdt = 0) => {
      refetchPairAmountInfo();
      refetchLpTokenInfoData();
      refetchAllLpPools();
      loadTokenAmounts({ oraiAddress: address });

      // Update in an immutable way.
      const queryKey = ['pool-detail', poolUrl];
      queryClient.setQueryData(queryKey, (oldPoolDetail: PoolInfoResponse) => {
        const updatedTotalLiquidity = oldPoolDetail.totalLiquidity + amountLpInUsdt;
        return {
          ...oldPoolDetail,
          totalLiquidity: updatedTotalLiquidity
        };
      });
    },
    [address, pools]
  );

  return {
    onLiquidityChange,
    poolDetailData,
    lpTokenBalance
  };
};
