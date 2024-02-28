import { ChartOptions, ColorType, DeepPartial, LineStyle, TickMarkType, Time, createChart } from 'lightweight-charts';
import { TIMER } from 'pages/CoHarvest/constants';
import { formatDateChart, formatNumberKMB } from 'pages/CoHarvest/helpers';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import { useLiquidityEventChart } from 'pages/Pools/hooks/useLiquidityEventChart';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import useConfigReducer from 'hooks/useConfigReducer';

const LiquidityChart = () => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const serieRef = useRef(null);
  const resizeObserver = useRef(null);
  const [theme] = useConfigReducer('theme');

  const [chartState, setChartState] = useState(null);

  const {
    currentDataLiquidity: data,
    currentItem,
    onCrossMove: crossMove,
    onMouseLiquidityLeave: onMouseLeave
  } = useLiquidityEventChart();

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries, b) => {
      const { width, height } = entries[0].contentRect;
      chartRef.current.applyOptions({ width, height });
      setTimeout(() => {
        chartRef.current.timeScale().fitContent();
      }, 0);
    });
    resizeObserver.current.observe(containerRef.current, {
      box: 'content-box'
    });
    return () => {
      resizeObserver.current.disconnect();
    };
  }, []);

  const defaultOption: DeepPartial<ChartOptions> = {
    rightPriceScale: {
      borderColor: theme === 'light' ? '#EFEFEF' : '#232521',
      borderVisible: false,
      scaleMargins: {
        top: 0.1,
        bottom: 0.05
      }
    },
    leftPriceScale: {
      visible: false,
      borderColor: theme === 'light' ? '#EFEFEF' : '#232521'
    },
    layout: {
      background: {
        type: ColorType.Solid,
        color: theme === 'light' ? '#FFF' : '#181A17'
      },
      textColor: theme === 'light' ? '#686A66' : '#979995'
    },
    localization: {
      locale: 'en-US',
      priceFormatter: (price) => {
        return formatNumberKMB(Number(price));
      }
    },
    grid: {
      horzLines: {
        visible: false
      },
      vertLines: {
        visible: false
      }
    },
    crosshair: {
      horzLine: {
        visible: true,
        labelVisible: true,
        style: LineStyle.Dotted,
        width: 1,
        color: theme === 'light' ? '#5EA402' : '#78CA11',
        labelBackgroundColor: '#aee67f'
      },
      vertLine: {
        visible: true,
        labelVisible: true,
        style: LineStyle.Dotted,
        width: 1,
        color: theme === 'light' ? '#5EA402' : '#78CA11',
        labelBackgroundColor: '#aee67f'
      }
    },
    timeScale: {
      rightOffset: 1,
      barSpacing: 28,

      borderColor: theme === 'light' ? '#EFEFEF' : '#232521',
      timeVisible: true,
      secondsVisible: false,

      rightBarStaysOnScroll: true,
      lockVisibleTimeRangeOnResize: true,
      ticksVisible: false,

      tickMarkFormatter: (time: Time, tickMarkType: TickMarkType, locale: string) => {
        // formatTime Feb 1, Mar 2,....
        const timestamp = Number(time) * TIMER.MILLISECOND;
        return formatDateChart(timestamp);
      }
    }
  };

  useEffect(() => {
    // Initialization
    if (chartRef.current === null) {
      const chart = createChart(containerRef.current, defaultOption);

      serieRef.current = chart.addAreaSeries({
        topColor: theme === 'light' ? '#EEF9E5' : '#152703',
        bottomColor: theme === 'light' ? '#EEF9E5' : '#152703',
        lineColor: theme === 'light' ? '#5EA402' : '#78CA11',
        lineWidth: 3
      });

      // // priceScaleId: left | right
      //   chart.priceScale('right').applyOptions({
      //     borderVisible: false
      //   });

      chartRef.current = chart;
    }

    const hover = (event) => {
      let item = event?.seriesData?.get(serieRef.current) || { time: '', value: '' };
      crossMove(item);
    };
    chartRef.current.subscribeCrosshairMove(hover);

    return () => {
      chartRef.current.unsubscribeCrosshairMove(hover);
    };
  }, [crossMove]);

  useEffect(() => {
    if (!chartRef?.current) return;

    chartRef.current.applyOptions(defaultOption);

    serieRef.current = chartRef.current.addAreaSeries({
      topColor: theme === 'light' ? '#EEF9E5' : '#152703',
      bottomColor: theme === 'light' ? '#EEF9E5' : '#152703',
      lineColor: theme === 'light' ? '#5EA402' : '#78CA11',
      lineWidth: 3
    });

    console.log('serieRef.current', serieRef.current);
  }, [theme]);

  useEffect(() => {
    // When data is updated
    let newData = data?.map((val) => {
      return {
        ...val,
        time: Math.floor(new Date(val?.time).getTime() / 1000)
      };
    });
    serieRef?.current?.setData(newData);
    chartRef?.current?.timeScale()?.fitContent();
  }, [data]);

  useEffect(() => {
    if (!currentItem.time || !currentItem.value) {
      onMouseLeave();
    }
  }, [currentItem]);

  return (
    <div className={styles.liquidityChart}>
      <div className={styles.header}>
        <span>Value: {formatDisplayUsdt(currentItem.value || '0')}</span>
        <br />
        <span>Time: {(currentItem.time || '').toString()}</span>
      </div>
      <div className={styles.chartContainer}>
        <div onMouseLeave={onMouseLeave} className={styles.chartRoot} ref={containerRef} />
      </div>
    </div>
  );
};

export default LiquidityChart;
