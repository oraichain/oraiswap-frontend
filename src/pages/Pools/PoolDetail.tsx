import { ReactComponent as BackIcon } from 'assets/icons/ic_back.svg';
import Content from 'layouts/Content';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PoolDetail.module.scss';
import { Earning } from './components/Earning';
import { MyPoolInfo } from './components/MyPoolInfo/MyPoolInfo';
import { OverviewPool } from './components/OverviewPool';
import { useLiquidityPool } from './hooks/useLiquidityPool';

const PoolDetail: FC = () => {
  const navigate = useNavigate();
  const { poolDetailData, onLiquidityChange, lpTokenBalance } = useLiquidityPool();

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
