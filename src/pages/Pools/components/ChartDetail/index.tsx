import { useState } from 'react';
import LiquidityChart from '../LiquidityChart';
import VolumeChart from '../VolumeChart';
import styles from './index.module.scss';

import { FILTER_DAY, LIST_FILTER_DAY } from '../Header';

export enum TAB_CHART {
  LIQUIDITY = 'Liquidity',
  VOLUME = 'Volume'
}

const ChartDetail = ({ pair }: { pair: string }) => {
  const [filterDay, setFilterDay] = useState(FILTER_DAY.DAY);
  const [tab, setTab] = useState(TAB_CHART.LIQUIDITY);
  return (
    <div className={styles.chartDetail}>
      <div className={styles.header}>
        <div className={styles.tabWrapper}>
          <button
            className={`${styles.tab}${' '}${tab === TAB_CHART.LIQUIDITY ? styles.active : ''}`}
            onClick={() => setTab(TAB_CHART.LIQUIDITY)}
          >
            {TAB_CHART.LIQUIDITY}
          </button>
          <button
            className={`${styles.tab}${' '}${tab === TAB_CHART.VOLUME ? styles.active : ''}`}
            onClick={() => setTab(TAB_CHART.VOLUME)}
          >
            {TAB_CHART.VOLUME}
          </button>
        </div>
        <div className={styles.filter_day_wrapper}>
          {LIST_FILTER_DAY.map((e) => {
            return (
              <button
                key={'day-key-chart' + e.label}
                className={`${styles.filter_day}${' '}${e.value === filterDay ? styles.active : ''}`}
                onClick={() => setFilterDay(e.value)}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <div className={`${styles.chartItem} ${tab === TAB_CHART.LIQUIDITY ? styles.activeChart : ''}`}>
          <LiquidityChart filterDay={filterDay} pair={pair} height={265} />
        </div>
        <div className={`${styles.chartItem} ${tab === TAB_CHART.VOLUME ? styles.activeChart : ''}`}>
          <VolumeChart filterDay={filterDay} pair={pair} height={265} />
        </div>
      </div>
    </div>
  );
};

export default ChartDetail;
