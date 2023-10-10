import { ReactComponent as BackIcon } from 'assets/icons/ic_back.svg';
import Content from 'layouts/Content';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from 'store/configure';
import styles from './PoolDetailV3.module.scss';
import { Earning } from './components/Earning';
import { MyPoolInfo } from './components/MyPoolInfo/MyPoolInfo';
import { OverviewPool } from './components/OverviewPool';
import { fetchLpPoolsFromContract, useGetPoolDetail, useGetPools } from './hookV3';
import useConfigReducer from 'hooks/useConfigReducer';
import { network } from 'config/networks';
import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import useLoadTokens from 'hooks/useLoadTokens';
import { updateLpPools } from 'reducer/token';
import { useGetPairInfo } from './hooks/useGetPairInfo';

const PoolDetailV3: React.FC = () => {
  let { poolUrl } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [address] = useConfigReducer('address');
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  const poolDetailData = useGetPoolDetail({ pairDenoms: poolUrl });
  const lpTokenBalance = BigInt(poolDetailData.info ? lpPools[poolDetailData.info?.liquidityAddr]?.balance || '0' : 0);
  const loadTokenAmounts = useLoadTokens();
  const setCachedLpPools = (payload: LpPoolDetails) => dispatch(updateLpPools(payload));
  const pools = useGetPools();
  const poolDetail = useGetPoolDetail({ pairDenoms: poolUrl });
  const { refetchPairAmountInfo, refetchLpTokenInfoData } = useGetPairInfo(poolDetail);

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

  const handleLiquidityChange = useCallback(() => {
    refetchPairAmountInfo();
    refetchLpTokenInfoData();
    refetchAllLpPools();
    loadTokenAmounts({ oraiAddress: address });
  }, [address, pools]);

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
        <Earning onLiquidityChange={handleLiquidityChange} />
        <MyPoolInfo myLpBalance={lpTokenBalance} handleLiquidityChange={handleLiquidityChange} />
      </div>
    </Content>
  );
};

export default PoolDetailV3;
