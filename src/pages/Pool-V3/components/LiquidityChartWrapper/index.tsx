import { FC, useCallback, useMemo } from 'react';
import styles from './index.module.scss';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh-ccw.svg';
import { ReactComponent as ZoomInIcon } from 'assets/icons/zoom-in.svg';
import { ReactComponent as ZoomOutIcon } from 'assets/icons/zoom-out.svg';
import { ConcentratedLiquidityDepthChart } from '../ConcentratedLiquidityDepthChart';
import { LiquidityChartData } from 'reducer/poolDetailV3';
import { debounce } from 'lodash';

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
        <div className={styles.actions}>
          <RefreshIcon onClick={resetRange} />
          <ZoomOutIcon onClick={zoomOut} />
          <ZoomInIcon onClick={zoomIn} />
        </div>
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
        //     debounce((num: number) => setMaxPrice(num), 250),
        //     []
        //   )}
        //   // eslint-disable-next-line react-hooks/exhaustive-deps
        //   onMoveMin={useCallback(
        //     debounce((num: number) => setMinPrice(num), 250),
        //     []
        //   )}
        onMoveMax={() => {}}
        onMoveMin={(val: number) => {
            console.log("move min", val);
        }}
          onSubmitMin={useCallback(
            (val: number) => {
              console.log("submit min", val);
              setMinPrice(val);
            },
            [setMinPrice]
          )}
          onSubmitMax={useCallback(
            (val: number) => {
              setMaxPrice(val);
            },
            [setMaxPrice]
          )}
          offset={{ top: 0, right: 36, bottom: 24 + 28, left: 0 }}
          horizontal
          fullRange={fullRange}
        />
      </div>
    </div>
  );
};

export default LiquidityChartWrapper;
