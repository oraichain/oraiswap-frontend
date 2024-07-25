import React, { useCallback, useMemo, useRef } from 'react';
import { Layer, ResponsiveLine } from '@nivo/line';
import { linearGradientDef } from '@nivo/core';
import classNames from 'classnames';
import Brush from './Brush/Brush';
import { nearestTickIndex } from './utils';
import styles from './index.module.scss';
import loadingGif from 'assets/gif/loading.gif';
import { ReactComponent as ZoomInIcon } from 'assets/images/zoom-in-icon.svg';
import { ReactComponent as ZoomOutIcon } from 'assets/images/zoom-out-icon.svg';
// import { PlotTickData } from '@store/reducers/positions'
// import { nearestTickIndex } from '@store/consts/utils'

export interface PlotTickData {
  x: number;
  y: number;
  index: number;
}

export type TickPlotPositionData = Omit<PlotTickData, 'y'>;

export interface IPriceRangePlot {
  data: PlotTickData[];
  midPrice?: TickPlotPositionData;
  leftRange: TickPlotPositionData;
  rightRange: TickPlotPositionData;
  onChangeRange?: (left: number, right: number) => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  plotMin: number;
  plotMax: number;
  zoomMinus: () => void;
  zoomPlus: () => void;
  loading?: boolean;
  isXtoY: boolean;
  xDecimal: number;
  yDecimal: number;
  tickSpacing: number;
  isDiscrete?: boolean;
  coverOnLoading?: boolean;
  hasError?: boolean;
  reloadHandler: () => void;
}

export const PriceRangePlot: React.FC<IPriceRangePlot> = ({
  data,
  leftRange,
  rightRange,
  midPrice,
  onChangeRange,
  style,
  className,
  disabled = false,
  plotMin,
  plotMax,
  zoomMinus,
  zoomPlus,
  loading,
  isXtoY,
  xDecimal,
  yDecimal,
  tickSpacing,
  isDiscrete = false,
  coverOnLoading = false,
  hasError = false,
  reloadHandler
}) => {
  // const { classes } = useStyles();

  // const isSmDown = useMediaQuery(theme.breakpoints.down('sm'))

  const containerRef = useRef<HTMLDivElement>(null);

  const maxVal = useMemo(() => Math.max(...data.map((element) => element.y)), [data]);

  const pointsOmitter = useCallback(
    (data: Array<{ x: number; y: number }>) => {
      if (containerRef.current === null || data.length <= 1000) {
        return data;
      }

      const minXDist = containerRef.current.offsetWidth / 100000;
      const minYChange = containerRef.current.offsetHeight / 1000;

      const dataAfterOmit: Array<{ x: number; y: number }> = [];

      data.forEach((tick, index) => {
        if (
          index === 0 ||
          index === data.length - 1 ||
          (dataAfterOmit.length > 0 &&
            ((tick.x - dataAfterOmit[dataAfterOmit.length - 1].x) / (plotMax - plotMin) >= minXDist ||
              Math.abs(tick.y - dataAfterOmit[dataAfterOmit.length - 1].y) / maxVal >= minYChange))
        ) {
          dataAfterOmit.push(tick);
        }
      });

      return dataAfterOmit;
    },
    [containerRef.current, plotMin, plotMax, maxVal]
  );

  const currentLessThanRange = useMemo(() => {
    if (!data.length || disabled || leftRange.x < Math.max(plotMin, data[0].x)) {
      return [];
    }

    let rangeData: Array<{ x: number; y: number }> = data.filter((tick) => tick.x <= leftRange.x);
    const outData: Array<{ x: number; y: number }> = data.filter((tick) => tick.x < Math.max(plotMin, data[0].x));

    if (!rangeData.length) {
      return [];
    }

    if (rangeData[rangeData.length - 1].x < leftRange.x) {
      rangeData.push({
        x: leftRange.x,
        y: rangeData[rangeData.length - 1].y
      });
    }

    rangeData = rangeData.slice(outData.length, rangeData.length);

    if (rangeData[0].x > Math.max(plotMin, data[0].x)) {
      rangeData.unshift({
        x: Math.max(plotMin, data[0].x),
        y: outData.length > 0 ? outData[outData.length - 1].y : 0
      });
    }

    return pointsOmitter(rangeData);
  }, [disabled, leftRange, data, plotMin, plotMax, pointsOmitter]);

  const currentRange = useMemo(() => {
    if (!data.length) return;
    if (disabled) {
      const outMinData: Array<{ x: number; y: number }> = data.filter((tick) => tick.x < Math.max(plotMin, data[0].x));
      const outMaxData: Array<{ x: number; y: number }> = data.filter(
        (tick) => tick.x > Math.min(plotMax, data[data.length - 1].x)
      );
      const rangeData: Array<{ x: number; y: number }> = data.slice(outMinData.length, data.length - outMaxData.length);

      if (!rangeData.length || rangeData[0].x > Math.max(plotMin, data[0].x)) {
        rangeData.unshift({
          x: Math.max(plotMin, data[0].x),
          y: outMinData.length > 0 ? outMinData[outMinData.length - 1].y : 0
        });
      }

      if (rangeData[rangeData.length - 1].x < Math.min(plotMax, data[data.length - 1].x)) {
        rangeData.push({
          x: Math.min(plotMax, data[data.length - 1].x),
          y: rangeData[rangeData.length - 1].y
        });
      }

      return pointsOmitter(rangeData);
    }

    if (leftRange.x > plotMax || rightRange.x < plotMin) {
      return [];
    }

    const lessThan = data.filter((tick) => tick.x <= leftRange.x).length;
    let rangeData: Array<{ x: number; y: number }> = data.filter(
      (tick) => tick.x >= leftRange.x && tick.x <= rightRange.x
    );

    if (!rangeData.length) {
      rangeData.push({
        x: Math.max(leftRange.x, plotMin),
        y: data[lessThan - 1].y
      });

      rangeData.push({
        x: Math.min(rightRange.x, plotMax),
        y: data[lessThan - 1].y
      });
    } else {
      if (rangeData[0].x > leftRange.x) {
        rangeData.unshift({
          x: leftRange.x,
          y: rangeData[0].y
        });
      }

      if (rangeData[rangeData.length - 1].x < rightRange.x) {
        rangeData.push({
          x: rightRange.x,
          y: rangeData[rangeData.length - 1].y
        });
      }

      const outMinData: Array<{ x: number; y: number }> = rangeData.filter(
        (tick) => tick.x < Math.max(plotMin, data[0].x)
      );
      const outMaxData: Array<{ x: number; y: number }> = rangeData.filter(
        (tick) => tick.x > Math.min(plotMax, data[data.length - 1].x)
      );
      const newRangeData: Array<{ x: number; y: number }> = rangeData.slice(
        outMinData.length,
        rangeData.length - outMaxData.length
      );

      if (!newRangeData.length || newRangeData[0].x > Math.max(plotMin, rangeData[0].x)) {
        newRangeData.unshift({
          x: Math.max(plotMin, rangeData[0].x),
          y: outMinData.length > 0 ? outMinData[outMinData.length - 1].y : 0
        });
      }

      if (newRangeData[newRangeData.length - 1].x < Math.min(plotMax, rangeData[rangeData.length - 1].x)) {
        newRangeData.push({
          x: Math.min(plotMax, rangeData[rangeData.length - 1].x),
          y: newRangeData[newRangeData.length - 1].y
        });
      }

      rangeData = newRangeData;
    }

    return pointsOmitter(rangeData);
  }, [disabled, data, leftRange, rightRange, plotMin, plotMax, pointsOmitter]);

  const currentGreaterThanRange = useMemo(() => {
    if (!data.length || disabled || rightRange.x > plotMax) {
      return [];
    }

    let rangeData: Array<{ x: number; y: number }> = data.filter((tick) => tick.x >= rightRange.x);
    const outData: Array<{ x: number; y: number }> = data.filter(
      (tick) => tick.x > Math.min(plotMax, data[data.length - 1].x)
    );

    if (!rangeData.length) {
      return [];
    }

    if (rangeData[0].x > rightRange.x) {
      rangeData.unshift({
        x: rightRange.x,
        y: rangeData[0].y
      });
    }

    rangeData = rangeData.slice(0, rangeData.length - outData.length);

    if (rangeData[rangeData.length - 1].x < Math.min(plotMax, data[data.length - 1].x)) {
      rangeData.push({
        x: Math.min(plotMax, data[data.length - 1].x),
        y: rangeData[rangeData.length - 1].y
      });
    }

    return pointsOmitter(rangeData);
  }, [disabled, data, rightRange, plotMin, plotMax, pointsOmitter]);

  const currentLayer: Layer = ({ innerWidth, innerHeight }) => {
    if (typeof midPrice === 'undefined') {
      return null;
    }

    const unitLen = innerWidth / (plotMax - plotMin);
    return (
      <svg x={(midPrice.x - plotMin) * unitLen - 20} y={-20} width={40} height={innerHeight + 20}>
        <defs>
          <filter id="shadow-global-price" x="-10" y="-9" width="20" height={innerHeight}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>
        <rect x={14} y={20} width="16" height={innerHeight} filter="url(#shadow-global-price)" opacity="0.3" />
        <rect x={19} y={20} width="3" height={innerHeight} fill="#EFD063" />
      </svg>
    );
  };

  const bottomLineLayer: Layer = ({ innerWidth, innerHeight }) => {
    const bottomLine = innerHeight;
    return <rect x={0} y={bottomLine} width={innerWidth} height={1} fill="#494949" />;
  };

  const lazyLoadingLayer: Layer = ({ innerWidth, innerHeight }) => {
    if (!loading || coverOnLoading) {
      return null;
    }

    return (
      <svg
        width={innerWidth}
        height={innerHeight + 5}
        viewBox={`0 0 ${innerWidth} ${innerHeight + 5}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        x={0}
        y={-5}
      >
        <rect x={0} y={0} width="100%" height="100%" fill="#FFFFFF" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className={styles.loadingText}>
          Loading liquidity data...
        </text>
      </svg>
    );
  };

  const brushLayer = Brush(
    leftRange.x,
    rightRange.x,
    (position) => {
      const nearest = nearestTickIndex(
        plotMin + position * (plotMax - plotMin),
        tickSpacing,
        isXtoY,
        xDecimal,
        yDecimal
      );
      onChangeRange?.(
        isXtoY ? Math.min(rightRange.index - tickSpacing, nearest) : Math.max(rightRange.index + tickSpacing, nearest),
        rightRange.index
      );
    },
    (position) => {
      const nearest = nearestTickIndex(
        plotMin + position * (plotMax - plotMin),
        tickSpacing,
        isXtoY,
        xDecimal,
        yDecimal
      );
      onChangeRange?.(
        leftRange.index,
        isXtoY ? Math.max(leftRange.index + tickSpacing, nearest) : Math.min(leftRange.index - tickSpacing, nearest)
      );
    },
    plotMin,
    plotMax,
    disabled
  );

  return (
    <div>
      {loading && coverOnLoading ? (
        <div className={styles.cover}>
          <img src={loadingGif} alt="loading-gif" width={30} height={30} />
        </div>
      ) : null}
      {!loading && hasError ? (
        <div className={styles.cover}>
          <div className={styles.errorWrapper}>
            <p className={styles.errorText}>Unable to load liquidity chart</p>
            <button className={styles.reloadButton} onClick={reloadHandler}>
              Reload chart
            </button>
          </div>
        </div>
      ) : null}
      <div className={classNames(styles.zoomButtonsWrapper, 'zoomBtns')}>
        <button className={styles.zoomButton} onClick={zoomPlus}>
          <ZoomInIcon />
        </button>
        <button className={styles.zoomButton} onClick={zoomMinus}>
          <ZoomOutIcon />
        </button>
      </div>
      <ResponsiveLine
        data={[
          {
            id: 'less than range',
            data: currentLessThanRange.length ? currentLessThanRange : [{ x: plotMin, y: 0 }]
          },
          {
            id: 'range',
            data: currentRange
          },
          {
            id: 'greater than range',
            data: currentGreaterThanRange.length ? currentGreaterThanRange : [{ x: plotMax, y: 0 }]
          }
        ]}
        curve={isDiscrete ? (isXtoY ? 'stepAfter' : 'stepBefore') : 'basis'}
        margin={{ top: true ? 55 : 25, bottom: 15 }}
        colors={['#EF84F5', '#2EE09A', '#EF84F5']}
        axisTop={null}
        axisRight={null}
        axisLeft={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 0,
          tickRotation: 0,
          tickValues: 5
        }}
        xScale={{
          type: 'linear',
          min: plotMin,
          max: plotMax
        }}
        yScale={{
          type: 'linear',
          min: 0,
          max: maxVal
        }}
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
        enableArea={true}
        legends={[]}
        isInteractive={false}
        animate={false}
        role="application"
        layers={[
          bottomLineLayer,
          'grid',
          'markers',
          'areas',
          'lines',
          lazyLoadingLayer,
          currentLayer,
          brushLayer,
          'axes',
          'legends'
        ]}
        defs={[
          linearGradientDef('gradient', [
            { offset: 0, color: 'inherit' },
            { offset: 50, color: 'inherit' },
            { offset: 100, color: 'inherit', opacity: 0 }
          ])
        ]}
        fill={[
          {
            match: '*',
            id: 'gradient'
          }
        ]}
      />
    </div>
  );
};

export default PriceRangePlot;
