import { FC } from 'react';
import HistoricalPriceChart, { formatPretty } from '../HistoricalPriceChart';
import styles from './index.module.scss';
import { TokenItemType } from '@oraichain/oraidex-common';
import { TimeDuration, TokenPairHistoricalPrice } from 'reducer/poolDetailV3';
import { Dec } from '@keplr-wallet/unit';

interface HistoricalChartDataWrapperProps {
  tokenX: TokenItemType;
  tokenY: TokenItemType;
  historicalChartData: TokenPairHistoricalPrice[];
  fullRange: boolean;
  yRange: [number, number];
  addRange: [number, number];
  currentPrice: number;
  hoverPrice: number;
  setHoverPrice: (price: number) => void;
  setHistoricalRange: (range: TimeDuration) => void;
}

const HistoricalChartDataWrapper: FC<HistoricalChartDataWrapperProps> = ({
  hoverPrice,
  tokenX,
  tokenY,
  historicalChartData,
  fullRange,
  yRange,
  addRange,
  currentPrice,
  setHoverPrice,
  setHistoricalRange
}) => {
  const formattedPrice =
    formatPretty(new Dec(hoverPrice), {
      maxDecimals: 4,
      notation: 'compact'
    }) || '';

  return (
    <div className={styles.chartPrice}>
      <div className={styles.chartOptions}>
        <div className={styles.priceWrapper}>
          <div>
            <h4 className={styles.price}>{formattedPrice}</h4>
          </div>
          {tokenX && tokenY ? (
            <div className={styles.text}>
              <div className={styles.currentPrice}>current price</div>
              <div className={styles.xPerY}>
                {tokenY.name} per {tokenX.name}
              </div>
            </div>
          ) : undefined}
        </div>

        <div className={styles.time}>
          <button onClick={() => setHistoricalRange('1d')}>1D</button>
          <button onClick={() => setHistoricalRange('7d')}>1W</button>
          <button onClick={() => setHistoricalRange('1mo')}>1M</button>
          <button onClick={() => setHistoricalRange('1y')}>1Y</button>
        </div>
      </div>

      <HistoricalPriceChart
        data={historicalChartData}
        annotations={(fullRange ? [new Dec(yRange[0] * 1.05), new Dec(yRange[1] * 0.95)] : addRange) as any}
        domain={yRange as [number, number]}
        onPointerHover={setHoverPrice}
        onPointerOut={() => {
          setHoverPrice(currentPrice);
        }}
      />
    </div>
  );
};

export default HistoricalChartDataWrapper;
