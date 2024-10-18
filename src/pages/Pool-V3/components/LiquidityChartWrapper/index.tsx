import { FC, useCallback, useMemo } from 'react';
import styles from './index.module.scss';
import { ConcentratedLiquidityDepthChart } from '../ConcentratedLiquidityDepthChart';
import { LiquidityChartData } from 'reducer/poolDetailV3';

interface LiquidityChartWrapperProps {
  minPrice: number;
  maxPrice: number;
  yRange: [number, number];
  xRange: [number, number];
  liquidityChartData: LiquidityChartData[];
  currentPrice: number;
  fullRange: boolean;
  setMaxPrice: (value: number) => void;
  setMinPrice: (value: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetRange: () => void;
}

const LiquidityChartWrapper: FC<LiquidityChartWrapperProps> = ({
  minPrice,
  maxPrice,
  yRange,
  xRange,
  liquidityChartData,
  currentPrice,
  fullRange,
  setMaxPrice,
  setMinPrice,
  zoomIn,
  zoomOut,
  resetRange
}) => {
  return (
    <div className={styles.chartLiquid}>
      <div className={styles.chart}>
        
        <ConcentratedLiquidityDepthChart
          min={minPrice}
          max={maxPrice}
          yRange={yRange as [number, number]}
          xRange={xRange as [number, number]}
          data={liquidityChartData}
          annotationDatum={useMemo(
            () => ({
              price: currentPrice,
              depth: xRange[1]
            }),
            [xRange, currentPrice]
          )}
          // eslint-disable-next-line react-hooks/exhaustive-deps
          //   onMoveMax={useCallback(
          //     debounce((num: number) => setMaxPrice(num), 2),
          //     []
          //   )}
          //   // eslint-disable-next-line react-hooks/exhaustive-deps
          //   onMoveMin={useCallback(
          //     debounce((num: number) => setMinPrice(num), 2),
          //     []
          //   )}
          onMoveMax={() => {}}
          onMoveMin={() => {}}
          onSubmitMin={(val: number) => {
            console.log('submit min', val);
            setMinPrice(val);
          }}
          onSubmitMax={(val: number) => {
            setMaxPrice(val);
          }}
          offset={{ top: 0, right: 36, bottom: 24 + 28, left: 0 }}
          horizontal
          fullRange={fullRange}
        />
      </div>
    </div>
  );
};

export default LiquidityChartWrapper;
