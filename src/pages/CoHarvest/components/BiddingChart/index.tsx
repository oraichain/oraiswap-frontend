import TokenBalance from 'components/TokenBalance';
import styles from './index.module.scss';
import { ReactComponent as TooltipIcon } from 'assets/icons/icon_tooltip.svg';
import ChartColumn from '../ChartColumn';

const BiddingChart = () => {
  return (
    <div className={styles.biddingChart}>
      <div className={styles.title}>
        <span className={styles.titleLeft}>Bid Placed in Liquidations</span>
        <div className={styles.titleRight}>
          <div className={styles.subtitle}>
            <span>Total Bid</span>
            <TooltipIcon />
          </div>
          <div className={styles.balance}>
            <TokenBalance balance={25495.32} className={styles.usd} />
            {'('}
            <TokenBalance
              balance={{
                amount: '25495320000',
                denom: 'ORAIX',
                decimals: 6
              }}
              className={styles.token}
            />
            {')'}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.columnList}>
          {[...new Array(25)].map((e, key) => (
            <ChartColumn
              key={key}
              data={{
                percent: Math.floor(Math.random() * 100),
                volume: Math.floor(Math.random() * 3000),
                interest: key + 1
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiddingChart;
