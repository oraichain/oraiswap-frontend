import { numberWithCommas } from 'pages/Pools/helpers';
import { toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as ChartUpIcon } from 'assets/icons/chartUpIcon.svg';
import { ReactComponent as PercentIcon } from 'assets/icons/percentIcon.svg';
import styles from './index.module.scss';

const Summary = () => {
  return (
    <div className={styles.summary}>
      <div className={styles.title}>Summary</div>
      <div className={styles.divider}></div>

      <div className={styles.statistic}>
        <div className={styles.item}>
          <div className={styles.header}>{Number('12.48').toFixed(2)}%</div>
          <span>APY</span>
        </div>
        <div className={styles.item}>
          <div className={styles.header}>{numberWithCommas(toDisplay('5140989240498'))} ORAIX</div>
          <span>Total staked</span>
        </div>
        <div className={styles.item}>
          <div className={styles.header}>{numberWithCommas(3147)}</div>
          <span>Stakers</span>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.overview}>
        <div className={styles.item}>
          <ChartUpIcon />
          <span className={styles.header}>Earn rewards over time</span>
          <span>USDC rewards are distributed approximately every 5 minutes.</span>
        </div>

        <div className={styles.item}>
          <PercentIcon />
          <span className={styles.header}>Earn rewards over time</span>
          <span>USDC rewards are distributed approximately every 5 minutes.</span>
        </div>
      </div>
    </div>
  );
};

export default Summary;
