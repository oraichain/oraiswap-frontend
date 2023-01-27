import { createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

const ChartComponent = (props) => {
  const {
    data,
    colors: {
      backgroundColor,
      lineColor,
      textColor,
      areaTopColor,
      areaBottomColor,
    },
  } = props;
  const chartContainerRef = useRef();

  useEffect(() => {
    // const handleResize = () => {
    //   chart.applyOptions({ width: 1000 });
    // };

    const chart = createChart(chartContainerRef.current, {
      //   width: 500,
      //   height: 300,
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.05,
        },
      },
      layout: {
        backgroundColor: 'rgba(31, 33, 40,0)',
        textColor: '#c3c5cb',
        fontFamily: "'Inter'",
      },
      //   localization: {
      //     priceFormatter: (price) => {
      //       return price;
      //     },
      //   },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        vertLine: {
          visible: true,
          style: 0,
          width: 2,
          color: '#A871DF',
          labelVisible: false,
        },
      },
      timeScale: {
        rightOffset: 1,
        barSpacing: 28,
        lockVisibleTimeRangeOnResize: true,
      },
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    newSeries.setData(data);

    // window.addEventListener('resize', handleResize);

    return () => {
    //   window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          height: '100%',
          width: '100%',
        }}
        ref={chartContainerRef}
      />
    </div>
  );
}

export default ChartComponent;