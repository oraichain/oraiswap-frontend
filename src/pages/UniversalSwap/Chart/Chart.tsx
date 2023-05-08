import { formateNumberDecimalsAuto } from 'libs/utils';
import { createChart } from 'lightweight-charts';
import { useEffect, useRef, memo, useCallback } from 'react';

const ChartComponent = (props) => {
  const {
    data,
    colors: { backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor },
    setInfoMove
  } = props;
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      // rightPriceScale: {
      //   autoScale: false,
      //   scaleMargins: {
      //     top: 0.1,
      //     bottom: 0,
      //   },
      // },
      layout: {
        backgroundColor: 'rgba(31, 33, 40,0)',
        textColor: '#c3c5cb',
        fontFamily: 'Roboto, sans-serif'
      },
      localization: {
        priceFormatter: (price) =>
          formateNumberDecimalsAuto({
            price: price,
            maxDecimal: 6,
            minDecimal: 2,
            unit: '',
            minPrice: 1
          })
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
        mode: 0,
        horzLine: {
          visible: true,
          color: '#A871DF',
          labelVisible: true
        },
        vertLine: {
          visible: true,
          color: '#A871DF',
          labelVisible: true
        }
      },
      timeScale: {
        rightOffset: 1,
        barSpacing: 12,
        lockVisibleTimeRangeOnResize: true,
        timeVisible: true
      }
    });
    // chart.timeScale().fitContent();

    const series = chart.addCandlestickSeries({});
    series.setData(data);

    chart.subscribeCrosshairMove((param) => {
      if (param === undefined || param.time === undefined || param.point.x < 0 || param.point.y < 0) {
        const valueMove = data[data.length - 1]?.close;
        setValueChartMove(valueMove, data[data.length - 1]?.time);
      } else {
        const valueMove: any = param.seriesPrices.get(series);
        setValueChartMove(valueMove?.close, param.time);
      }
    });

    new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) {
        return;
      }
      const newRect = entries[0].contentRect;
      chart.applyOptions({ height: newRect.height, width: newRect.width });
    }).observe(chartContainerRef.current);

    return () => {
      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

  useEffect(() => {
    setValueChartMove(data[data.length - 1]?.close, data[data.length - 1]?.time);
  }, [data]);

  const setValueChartMove = useCallback(
    (value, time) => {
      if (setInfoMove) {
        setInfoMove({
          value,
          time
        });
      }
    },
    [setInfoMove]
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        height: '100%',
        width: '100%'
      }}
      ref={chartContainerRef}
    />
  );
};

export default memo(ChartComponent);
