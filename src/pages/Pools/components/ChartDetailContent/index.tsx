import { useRef, useState } from 'react';
import LiquidityChart from '../LiquidityChart';
import VolumeChart from '../VolumeChart';
import styles from './index.module.scss';

import { isMobile } from '@walletconnect/browser-utils';
import { Button } from 'components/Button';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentFilterDay, selectCurrentTabChart, setFilterDay, setTabChart } from 'reducer/chartSlice';
import { TAB_CHART } from 'reducer/type';
import { LIST_FILTER_DAY } from '../Header';

const ChartDetail = ({
  pair,
  showOverlay = true,
  openChartModal = false,
  setOpenChart = (open) => {
    console.log(open);
  }
}: {
  pair: string;
  openChartModal?: boolean;
  setOpenChart?: React.Dispatch<React.SetStateAction<boolean>>;
  showOverlay?: boolean;
}) => {
  // const [filterDay, setFilterDay] = useState(defaultDay);
  // const [tab, setTab] = useState(defaultTab);
  const [isFocusChart, setFocusChart] = useState(false);
  const isMobileMode = isMobile();
  const chartRef = useRef();
  const filterDay = useSelector(selectCurrentFilterDay);
  const tab = useSelector(selectCurrentTabChart);
  const dispatch = useDispatch();

  useOnClickOutside(chartRef, () => {
    setFocusChart(false);
  });

  return (
    <div className={styles.chartDetail}>
      <div className={styles.header}>
        <div className={styles.tabWrapper}>
          <button
            className={`${styles.tab}${' '}${tab === TAB_CHART.LIQUIDITY ? styles.active : ''}`}
            onClick={() => {
              dispatch(setTabChart(TAB_CHART.LIQUIDITY));
            }}
          >
            {TAB_CHART.LIQUIDITY}
          </button>
          <button
            className={`${styles.tab}${' '}${tab === TAB_CHART.VOLUME ? styles.active : ''}`}
            onClick={() => {
              dispatch(setTabChart(TAB_CHART.VOLUME));
            }}
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
                onClick={() => {
                  dispatch(setFilterDay(e.value));
                }}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.chartWrapper}>
        {showOverlay && isMobileMode && (
          <div
            ref={chartRef}
            className={`${styles.overlay} ${isFocusChart ? styles.isFocus : ''}`}
            onClick={() => setFocusChart(true)}
          >
            {isMobileMode && isFocusChart && (
              <div className={styles.btnInteract}>
                <Button
                  type="secondary-sm"
                  onClick={() => {
                    setOpenChart(true);
                  }}
                >
                  Tab to interact
                </Button>
              </div>
            )}
          </div>
        )}
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
