import { ChartOptions, ColorType, DeepPartial, LineStyle, TickMarkType, Time, createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { FILTER_DAY } from 'reducer/type';
import styles from './AprChart.module.scss';
import useTheme from 'hooks/useTheme';
import { TIMER } from 'helper/constants';
import { formatDateChart, formatNumberKMB } from 'helper/format';
import { useSharePriceChart } from 'pages/VaultDetail/hooks/useSharePriceChart';

const aprAllTimeColor = '#A6BE93';
const aprDailyColor = '#6E78EC';

export const AprChart = ({
  filterDay,
  pair,
  height = 150
}: {
  filterDay: FILTER_DAY;
  pair?: string;
  height?: number;
}) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const seriesDailyAprRef = useRef(null);
  const seriesAllTimeAprRef = useRef(null);
  const resizeObserver = useRef(null);
  const theme = useTheme();

  const { currentDataLiquidity: data } = useSharePriceChart(filterDay, pair);

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries, b) => {
      window.requestAnimationFrame((): void | undefined => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }

        const { width, height } = entries[0].contentRect;
        chartRef.current.applyOptions({ width, height });
        setTimeout(() => {
          chartRef.current.timeScale().fitContent();
        }, 0);
      });
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
        color: 'transparent'
      },
      textColor: theme === 'light' ? '#686A66' : '#979995'
    },
    localization: {
      locale: 'en-US',
      dateFormat: 'dd MMM, yyyy',
      priceFormatter: (price) => {
        return formatNumberKMB(Number(price));
      }
    },
    grid: {
      horzLines: {
        color: theme === 'light' ? '#EFEFEF' : '#494949'
      },
      vertLines: {
        visible: false
      }
    },
    crosshair: {
      horzLine: {
        visible: false,
        labelVisible: false,
        style: LineStyle.Dotted,
        width: 1,
        color: theme === 'light' ? '#A6BE93' : '#A6BE93',
        labelBackgroundColor: '#aee67f'
      },
      vertLine: {
        visible: true,
        labelVisible: false,
        style: LineStyle.Solid,
        width: 1,
        color: theme === 'light' ? '#DFE0DE' : '#494949',
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
      chartRef.current = createChart(containerRef.current, defaultOption);
      seriesDailyAprRef.current = chartRef.current.addAreaSeries({
        priceLineVisible: false,
        lineColor: aprDailyColor,
        lineWidth: 3,
        topColor: 'transparent',
        bottomColor: 'transparent'
      });
      seriesAllTimeAprRef.current = chartRef.current.addAreaSeries({
        priceLineVisible: false,
        lineColor: aprAllTimeColor,
        lineWidth: 3,
        topColor: 'transparent',
        bottomColor: 'transparent'
      });
    }

    const toolTipWidth = 96;
    const toolTipHeight = 80;
    const toolTipMargin = 15;
    // Create and style the tooltip html element
    const toolTip = document.createElement('div');
    // @ts-ignore
    toolTip.style = `width: 106px; height: 140px; position: absolute; display: none; box-sizing: border-box; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none;`;
    toolTip.style.background = theme === 'light' ? '#FFF' : '#31332E';
    toolTip.style.fontWeight = '500';
    toolTip.style.borderRadius = '8px';
    toolTip.style.overflow = 'hidden';
    toolTip.style.padding = '12px';
    toolTip.style.boxShadow = '0px 5px 11px 0px rgba(95, 104, 123, 0.12);';
    toolTip.style.border = '1px solid rgba(255, 82, 82, 1)';
    containerRef.current.appendChild(toolTip);

    // update tooltip
    chartRef.current.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > containerRef.current.clientWidth ||
        param.point.y < 0 ||
        param.point.y > containerRef.current.clientHeight
      ) {
        toolTip.style.display = 'none';
      } else {
        const dateStr = param.time;
        toolTip.style.display = 'block';
        // TODO: use for data tooltip
        const dataDaily = param.seriesData.get(seriesDailyAprRef.current);
        const dataAllTime = param.seriesData.get(seriesAllTimeAprRef.current);
        toolTip.innerHTML = `
                  <div style="color: ${theme === 'light' ? '#686A66' : '#979995'}; margin-bottom: 4px">
                    ${formatDateChart(dateStr)}
                  </div>
                  <div style="font-size: 14px; color: ${aprDailyColor}">
                    0.06%
                  </div>
                  <div style="color: ${theme === 'light' ? '#686A66' : '#979995'}; margin-bottom: 4px">
                    Daily
                  </div>
                  <div style="font-size: 14px; color: ${aprAllTimeColor}">
                    11.8%
                  </div>
                  <div style="color: ${theme === 'light' ? '#686A66' : '#979995'}">
                    All time
                  </div>`;

        const y = param.point.y;
        let left = param.point.x + toolTipMargin;
        if (left > containerRef.current.clientWidth - toolTipWidth) {
          left = param.point.x - toolTipMargin - toolTipWidth;
        }

        let top = y + toolTipMargin;
        if (top > containerRef.current.clientHeight - toolTipHeight) {
          top = y - toolTipHeight - toolTipMargin;
        }
        toolTip.style.left = left + 'px';
        toolTip.style.top = top + 'px';
      }
    });
  }, []);

  // update new theme series with current data
  useEffect(() => {
    if (!chartRef?.current) return;

    chartRef.current.applyOptions(defaultOption);

    // remove current series
    chartRef.current.removeSeries(seriesDailyAprRef.current);
    chartRef.current.removeSeries(seriesAllTimeAprRef.current);

    seriesDailyAprRef.current = chartRef.current.addAreaSeries({
      priceLineVisible: false,
      lineColor: aprDailyColor,
      lineWidth: 3,
      topColor: 'transparent',
      bottomColor: 'transparent'
    });
    seriesAllTimeAprRef.current = chartRef.current.addAreaSeries({
      priceLineVisible: false,
      lineColor: aprAllTimeColor,
      lineWidth: 3,
      topColor: 'transparent',
      bottomColor: 'transparent'
    });

    let newData = data?.map((val) => {
      return {
        ...val,
        time: Math.floor(new Date(val?.time).getTime() / 1000)
      };
    });

    seriesDailyAprRef?.current?.setData(newData);
    seriesAllTimeAprRef?.current?.setData(
      newData.map((item) => {
        return {
          ...item,
          value: item.value - 1000000
        };
      })
    );
    chartRef.current?.timeScale()?.fitContent();
  }, [theme]);

  // set data for chart
  useEffect(() => {
    let newData = data?.map((val) => {
      return {
        ...val,
        time: Math.floor(new Date(val?.time).getTime() / 1000)
      };
    });
    seriesDailyAprRef?.current?.setData(newData);
    seriesAllTimeAprRef?.current?.setData(
      newData.map((item) => {
        return {
          ...item,
          value: item.value - 1000000
        };
      })
    );
    chartRef?.current?.timeScale()?.fitContent();
  }, [data]);

  return (
    <div className={styles.sharePriceChart}>
      <div className={styles.header}>
        <h3 className={styles.title}>APR</h3>
        <div className={styles.description}>
          <div className={styles.chartType}>
            <span className={styles.chartColor} style={{ backgroundColor: aprDailyColor }}></span>
            <span>Daily APR</span>
          </div>
          <div className={styles.chartType}>
            <span className={styles.chartColor} style={{ backgroundColor: aprAllTimeColor }}></span>
            <span>APR (All time)</span>
          </div>
        </div>
      </div>
      <div className={styles.chartContainer} style={{ height }}>
        <div className={styles.chartRoot} ref={containerRef} />
      </div>
    </div>
  );
};
