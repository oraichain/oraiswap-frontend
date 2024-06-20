import { useParams } from 'react-router-dom';
import styles from './index.module.scss';
import { ReactComponent as BackIcon } from 'assets/icons/ic_back.svg';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import { formatNumberKMB } from 'pages/Pools/helpers';
import { Button } from 'components/Button';

const PoolDetailV3 = () => {
  let { poolUrl } = useParams();

  return (
    <div className={styles.poolDetailV3}>
      <div className={styles.header}>
        <div className={styles.back} onClick={() => console.log('back')}>
          <BackIcon />
        </div>
        <div className={styles.icon}>
          <DefaultIcon />
          <DefaultIcon />
        </div>
        <div className={styles.name}>ORAI / USDT</div>
        <div className={styles.statistic}>
          <div className={styles.item}>0.003% Fee</div>
          <div className={styles.item}>0.03% Spread</div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.itemInfo}>
            <h4>Total Value Locked</h4>
            <p className={styles.value}>$16,893,631</p>
            <p className={styles.desc}>98.28 LP</p>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.alloc}>
            <h4>Liquidity Allocation</h4>
            <div className={styles.percent}>
              <div className={styles.basePercent}></div>
              <div className={styles.quotePercent}></div>
            </div>
            <div className={styles.pair}>
              <div className={styles.token}>
                <div className={styles.icon}>
                  <DefaultIcon />
                </div>
                <span className={styles.tokenName}>{'ORAI'}</span>
                <span>{formatNumberKMB(34567)}</span>
              </div>
              <div className={styles.token}>
                <div className={styles.icon}>
                  <DefaultIcon />
                </div>
                <span className={styles.tokenName}>{'USDT'}</span>
                <span>{formatNumberKMB(1234567)}</span>
              </div>
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.itemInfo}>
            <h4>Volume (24H)</h4>
            <p className={styles.value}>$16,893,631</p>
          </div>
          <div className={styles.btnGroup}>
            <Button type="secondary-sm" onClick={() => console.log('swap')}>
              Swap
            </Button>
            <Button type="primary-sm" onClick={() => console.log('Add Liquidity')}>
              Add Liquidity
            </Button>
          </div>
        </div>
        <div className={styles.chart}>chart quan que</div>
      </div>

      <div className={styles.positions}>position day</div>
    </div>
  );
};

export default PoolDetailV3;
