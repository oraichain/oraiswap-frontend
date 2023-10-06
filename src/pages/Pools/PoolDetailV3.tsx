import Content from 'layouts/Content';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './PoolDetailV3.module.scss';

import { ReactComponent as BackIcon } from 'assets/icons/ic_back.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { Earning } from './components/Earning';
import { MyPoolInfo } from './components/MyPoolInfo/MyPoolInfo';
import { OverviewPool } from './components/OverviewPool';
import { useGetPoolDetail } from './hookV3';

interface PoolDetailProps {}

const PoolDetailV3: React.FC<PoolDetailProps> = () => {
  let { poolUrl } = useParams();
  const navigate = useNavigate();
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  const poolDetailData = useGetPoolDetail({ pairDenoms: poolUrl });
  const lpTokenBalance = BigInt(poolDetailData.info ? lpPools[poolDetailData.info?.liquidityAddr]?.balance ?? '0' : 0);

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
