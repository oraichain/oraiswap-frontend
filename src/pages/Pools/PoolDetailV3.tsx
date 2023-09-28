import Content from 'layouts/Content';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchRewardInfo,
  fetchRewardPerSecInfo,
  fetchStakingPoolInfo,
  fetchTokenInfo,
  getPairAmountInfo
} from 'rest/api';
import styles from './PoolDetailV3.module.scss';

import { useQuery } from '@tanstack/react-query';
import { ReactComponent as BackIcon } from 'assets/icons/ic_back.svg';
import { TokenItemType } from 'config/bridgeTokens';
import useConfigReducer from 'hooks/useConfigReducer';
import { toDecimal } from 'libs/utils';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { Earning } from './components/Earning';
import { MyPoolInfo } from './components/MyPoolInfo/MyPoolInfo';
import { OverviewPool } from './components/OverviewPool';
import { useGetPoolDetail, useGetPools } from './hooks';
import { useFetchLpPoolsV3 } from './hookV3';

interface PoolDetailProps {}

const PoolDetailV3: React.FC<PoolDetailProps> = () => {
  let { poolUrl } = useParams();
  const navigate = useNavigate();
  const [address] = useConfigReducer('address');
  const [assetToken, setAssetToken] = useState<TokenItemType>();
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  const poolDetailData = useGetPoolDetail(poolUrl);

  const pools = useGetPools();
  const lpAddresses = pools.map((pool) => pool.liquidityAddr);
  useFetchLpPoolsV3(lpAddresses);

  let { data: pairAmountInfoData } = useQuery(
    ['pair-amount-info', poolDetailData],
    () => {
      return getPairAmountInfo(poolDetailData.token1, poolDetailData.token2);
    },
    {
      enabled: !!poolDetailData,
      refetchOnWindowFocus: false,
      refetchInterval: 15000
    }
  );

  const lpTokenBalance = BigInt(poolDetailData ? lpPools[poolDetailData.info?.liquidityAddr]?.balance ?? '0' : 0);

  const { data: lpTokenInfoData } = useQuery(
    ['token-info', poolDetailData],
    () =>
      fetchTokenInfo({
        contractAddress: poolDetailData?.info?.liquidityAddr
      } as TokenItemType),
    {
      enabled: !!poolDetailData,
      refetchOnWindowFocus: false
    }
  );

  const { data: totalRewardInfoData } = useQuery(
    ['reward-info', address, poolDetailData, assetToken],
    () => fetchRewardInfo(address, assetToken!),
    { enabled: !!address && !!assetToken, refetchOnWindowFocus: false }
  );

  // const { data: rewardPerSecInfoData } = useQuery(
  //   ['reward-per-sec-info', address, poolDetailData, assetToken],
  //   async () => {
  //     let t = await fetchRewardPerSecInfo(assetToken!);
  //     return t.assets;
  //   },
  //   { enabled: !!address && !!assetToken, refetchOnWindowFocus: false }
  // );

  // const { data: stakingPoolInfoData } = useQuery(
  //   ['staking-pool-info', address, poolDetailData, assetToken],
  //   () => fetchStakingPoolInfo(assetToken!),
  //   { enabled: !!address && !!assetToken, refetchOnWindowFocus: false }
  // );

  useEffect(() => {
    if (poolDetailData?.token1?.name === 'ORAI') {
      setAssetToken(poolDetailData.token2);
    } else if (!!poolDetailData) {
      setAssetToken(poolDetailData.token1);
    }
  }, [poolDetailData]);

  const lpTotalSupply = BigInt(lpTokenInfoData?.total_supply ?? 0);

  const rewardInfoFirst = totalRewardInfoData?.reward_infos[0];

  const bondAmountUsd = rewardInfoFirst
    ? toDecimal(BigInt(rewardInfoFirst?.bond_amount ?? 0), lpTotalSupply) * (pairAmountInfoData?.tokenUsd ?? 0)
    : 0;

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
        <Earning />
        <MyPoolInfo myLpBalance={lpTokenBalance} />
      </div>
    </Content>
  );
};

export default PoolDetailV3;

/**
 * fetch LP balance
 * earning: orai, oraix
 * my staked (usd, lp)
 * my liquidity (usd, lp)
 */
