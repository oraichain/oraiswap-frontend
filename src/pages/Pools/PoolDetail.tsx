import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import { useQueryClient } from '@tanstack/react-query';
import { ReactComponent as BackIcon } from 'assets/icons/ic_back.svg';
import { network } from 'config/networks';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import Content from 'layouts/Content';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateLpPools } from 'reducer/token';
import { PoolInfoResponse } from 'types/pool';
import styles from './PoolDetail.module.scss';
import { Earning } from './components/Earning';
import { MyPoolInfo } from './components/MyPoolInfo/MyPoolInfo';
import { OverviewPool } from './components/OverviewPool';
import { fetchLpPoolsFromContract, useGetPoolDetail, useGetPools } from './hooks';
import { useGetPairInfo } from './hooks/useGetPairInfo';
import { useGetLpBalance } from './hooks/useGetLpBalance';

const PoolDetail: React.FC = () => {
  let { poolUrl } = useParams();
  const navigate = useNavigate();
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

  return (
    <Content nonBackground>
      <div className={styles.pool_detail}>
        <div
          className={styles.back}
          onClick={() => {
            navigate(`/pools`);
          }}
        >
          <BackIcon className={styles.backIcon} />
          <span>Back to all pools</span>
        </div>
        <OverviewPool poolDetailData={poolDetailData} />
        <Earning onLiquidityChange={onLiquidityChange} />
        <MyPoolInfo myLpBalance={lpTokenBalance} onLiquidityChange={onLiquidityChange} />
      </div>
    </Content>
  );
};

export default PoolDetail;
