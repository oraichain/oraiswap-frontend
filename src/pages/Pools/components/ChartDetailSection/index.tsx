import styles from './index.module.scss';

import { isMobile } from '@walletconnect/browser-utils';
import ChartDetail from '../ChartDetailContent';
import ModalChart from '../ModalChartDetail';
import { useState } from 'react';
import { FILTER_DAY, TAB_CHART } from 'reducer/type';

const ChartDetailSection = ({ pair, symbol }: { pair: string; symbol: string }) => {
  const isMobileMode = isMobile();
  const [openChart, setOpenChart] = useState(false);

  return (
    <div className={styles.ChartDetailSection}>
      <ChartDetail pair={pair} setOpenChart={setOpenChart} />

      {isMobileMode && <ModalChart title={symbol} pair={pair} open={openChart} onClose={() => setOpenChart(false)} />}
    </div>
  );
};

export default ChartDetailSection;
