import { FILTER_DAY } from 'reducer/type';
import { SharePriceChart } from '../SharePriceChart';
import styles from './PerformanceTab.module.scss';
import { AprChart } from '../AprChart';

export const PerformanceTab = () => {
  const filterDay = FILTER_DAY.DAY;
  const pair = 'orai-ibc/A2E2EEC9057A4A1C2C0A6A4C78B0239118DF5F278830F50B4A6BDD7A66506B78';

  return (
    <section className={styles.performanceTab}>
      <div className={styles.chart}>
        <SharePriceChart filterDay={filterDay} pair={pair} height={265} />
        <AprChart filterDay={filterDay} pair={pair} height={265} />
      </div>
    </section>
  );
};
