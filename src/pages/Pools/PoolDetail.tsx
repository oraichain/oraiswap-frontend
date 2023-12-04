import { ReactComponent as BackIcon } from 'assets/icons/ic_back.svg';
import Content from 'layouts/Content';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './PoolDetail.module.scss';
import { Earning } from './components/Earning';
import { MyPoolInfo } from './components/MyPoolInfo/MyPoolInfo';
import { OverviewPool } from './components/OverviewPool';
import { useLiquidityPool } from './hooks/useLiquidityPool';

const PoolDetailV3: React.FC = () => {
  const { poolUrl } = useParams();
  const { poolDetailData, lpTokenBalance, onLiquidityChange } = useLiquidityPool(poolUrl);
  const navigate = useNavigate();

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

export default PoolDetailV3;
