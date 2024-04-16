import { SharePriceChart } from '../SharePriceChart';
import { TvlChart } from '../TvlChart';
import styles from './PerformanceTab.module.scss';

export const PerformanceTab = () => {
  return (
    <section className={styles.performanceTab}>
      <div className={styles.chart}>
        <SharePriceChart height={265} />
        <TvlChart height={265} />
      </div>
    </section>
  );
};
