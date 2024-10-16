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
  isXToY: boolean;
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
  isXToY,
  setHoverPrice,
  setHistoricalRange
}) => {
  const formattedPrice =
    formatPretty(new Dec(hoverPrice), {
      maxDecimals: 8,
      notation: 'standard'
    }) || '';

  const chartDataToNow = [...historicalChartData];
  if (historicalChartData.length > 0) {
    chartDataToNow.push({
      close: currentPrice,
      time: Date.now()
    });
  }

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
                {isXToY ? `${tokenY.name} per ${tokenX.name}` : `${tokenX.name} per ${tokenY.name}`}
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
        data={chartDataToNow}
        annotations={(fullRange ? [new Dec(yRange[0] * 1.05), new Dec(yRange[1] * 0.95)] : addRange) as any}
        domain={yRange as [number, number]}
        onPointerHover={setHoverPrice}
        onPointerOut={() => {
          setHoverPrice(currentPrice);
        }}
        extendLeft={historicalChartData[0]?.close <= 0.001 ? 30 : 10}
      />
    </div>
  );
};

export default HistoricalChartDataWrapper;
