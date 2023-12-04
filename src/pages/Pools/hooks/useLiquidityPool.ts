import { MulticallQueryClient } from '@oraichain/common-contracts-sdk/build/Multicall.client';
import { network } from '@oraichain/oraidex-common/build/network';
import { useQueryClient } from '@tanstack/react-query';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateLpPools } from 'reducer/token';
import { PoolInfoResponse } from 'types/pool';
import { fetchLpPoolsFromContract } from './useFetchLpPool';
import { useGetLpBalance } from './useGetLpBalance';
import { useGetPairInfo } from './useGetPairInfo';
import { useGetPoolDetail } from './useGetPoolDetail';
import { useGetPools } from './useGetPools';

export const useLiquidityPool = () => {
  let { poolUrl } = useParams();
  const dispatch = useDispatch();
  const [address] = useConfigReducer('address');
  const poolDetailData = useGetPoolDetail({ pairDenoms: poolUrl });
  const loadTokenAmounts = useLoadTokens();
  const setCachedLpPools = (payload: LpPoolDetails) => dispatch(updateLpPools(payload));
  const pools = useGetPools();
  const lpAddresses = pools.map((pool) => pool.liquidityAddr);
  const { refetchPairAmountInfo, refetchLpTokenInfoData } = useGetPairInfo(poolDetailData);
  const queryClient = useQueryClient();

  const { lpBalanceInfoData, refetchLpBalanceInfoData } = useGetLpBalance(poolDetailData);
  const lpTokenBalance = BigInt(lpBalanceInfoData?.balance || '0');

  const refetchAllLpPools = async () => {
    if (lpAddresses.length === 0) return;
    const lpTokenData = await fetchLpPoolsFromContract(
      lpAddresses,
      address,
      new MulticallQueryClient(window.client, network.multicall)
    );
    setCachedLpPools(lpTokenData);
  };

  const onLiquidityChange = useCallback(
    (amountLpInUsdt = 0) => {
      refetchPairAmountInfo();
      refetchLpTokenInfoData();
      refetchLpBalanceInfoData();
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
