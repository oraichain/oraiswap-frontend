import { useEffect, useRef, useState } from "react";
import { useLocalStorage, useMedia } from "react-use";
import cn from 'classnames/bind';
import { useSelector } from "react-redux";

import { selectChartDataLength, selectCurrentToken } from "reducer/tradingSlice";
import useTheme from "hooks/useTheme";
import { SUPPORTED_RESOLUTIONS, TV_CHART_RELOAD_INTERVAL } from "components/TVChartContainer/helpers/constants";
import useTVDatafeed from "./helpers/useTVDatafeed";
import { TVDataProvider } from "./helpers/TVDataProvider";
import { getObjectKeyFromValue } from "./helpers/utils";
import { SaveLoadAdapter, } from "./SaveLoadAdapter";
import {
  defaultChartProps,
  DEFAULT_PERIOD,
  disabledFeaturesOnMobile,
  DARK_BACKGROUND_CHART,
  LIGHT_BACKGROUND_CHART
} from "./config";
import { ChartData, IChartingLibraryWidget, ResolutionString } from "../../charting_library";

import styles from './index.module.scss';

const cx = cn.bind(styles);

export function useLocalStorageSerializeKey<T>(
  key: string | any[],
  value: T,
  opts?: {
    raw: boolean;
    serializer: (val: T) => string;
    deserializer: (value: string) => T;
  }
) {
  key = JSON.stringify(key);
  return useLocalStorage<T>(key, value, opts);
}

export default function TVChartContainer() {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const currentPair = useSelector(selectCurrentToken);
  const chartDataLength = useSelector(selectChartDataLength)
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);
  const [tvCharts, setTvCharts] = useLocalStorage<ChartData[] | undefined>('TV_SAVE_LOAD_CHARTS_KEY', []);
  const { datafeed, resetCache } = useTVDatafeed({ dataProvider: new TVDataProvider() });
  const isMobile = useMedia("(max-width: 550px)");
  const [chartReady, setChartReady] = useState(false);
  const [period, setPeriod] = useLocalStorageSerializeKey([currentPair.symbol, "Chart-period"], DEFAULT_PERIOD);
  const symbolRef = useRef(currentPair.symbol);

  useEffect(() => {
    if (chartReady && tvWidgetRef.current && currentPair.symbol !== tvWidgetRef.current?.activeChart?.().symbol()) {
      tvWidgetRef.current.setSymbol(currentPair.symbol, tvWidgetRef.current.activeChart().resolution(), () => { });
    }
  }, [currentPair, chartReady, period]);

  /* Tradingview charting library only fetches the historical data once so if the tab is inactive or system is in sleep mode
  for a long time, the historical data will be outdated. */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        localStorage.setItem('TV_CHART_RELOAD_TIMESTAMP_KEY', Date.now().toString());
      } else {
        const tvReloadTimestamp = Number(localStorage.getItem('TV_CHART_RELOAD_TIMESTAMP_KEY'));
        if (tvReloadTimestamp && Date.now() - tvReloadTimestamp > TV_CHART_RELOAD_INTERVAL) {
          if (resetCache) {
            resetCache();
            tvWidgetRef.current?.activeChart().resetData();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [resetCache]);

  useEffect(() => {
    const widgetOptions = {
      debug: false,
      symbol: symbolRef.current, // Using ref to avoid unnecessary re-renders on symbol change and still have access to the latest symbol
      datafeed: datafeed,
      theme: theme === 'dark' ? 'Dark' : 'Light',
      container: chartContainerRef.current,
      library_path: defaultChartProps.library_path,
      locale: defaultChartProps.locale,
      loading_screen: {
        backgroundColor: theme === 'dark' ? DARK_BACKGROUND_CHART : LIGHT_BACKGROUND_CHART,
        foregroundColor: theme === 'dark' ? DARK_BACKGROUND_CHART : LIGHT_BACKGROUND_CHART
      },
      enabled_features: defaultChartProps.enabled_features,
      disabled_features: isMobile
        ? defaultChartProps.disabled_features.concat(disabledFeaturesOnMobile)
        : defaultChartProps.disabled_features,
      client_id: defaultChartProps.clientId,
      user_id: defaultChartProps.userId,
      fullscreen: defaultChartProps.fullscreen,
      autosize: defaultChartProps.autosize,
      custom_css_url: defaultChartProps.custom_css_url,
      overrides: defaultChartProps.overrides,
      interval: getObjectKeyFromValue(period, SUPPORTED_RESOLUTIONS),
      favorites: defaultChartProps.favorites,
      custom_formatters: defaultChartProps.custom_formatters,
      save_load_adapter: new SaveLoadAdapter(symbolRef.current, tvCharts, setTvCharts),
      studies: [],
      timeframe: '1M',
      time_scale: {
        min_bar_spacing: 15,
      },
      time_frames: [
        { text: '6m', resolution: '6h' as ResolutionString, description: '6 Months' },
        { text: '1m', resolution: '1h' as ResolutionString, description: '1 Month' },
        { text: '2w', resolution: '1h' as ResolutionString, description: '2 Weeks' },
        { text: '1w', resolution: '1h' as ResolutionString, description: '1 Week' },
        { text: '1d', resolution: '15' as ResolutionString, description: '1 Day' },
      ],
    };
    tvWidgetRef.current = new (window as any).TradingView.widget(widgetOptions);
    tvWidgetRef.current!.onChartReady(function () {
      setChartReady(true);
      tvWidgetRef.current!.applyOverrides({
        "paneProperties.background": theme === 'dark' ? DARK_BACKGROUND_CHART : LIGHT_BACKGROUND_CHART,
        "paneProperties.backgroundType": "solid",
      });

      tvWidgetRef.current
        ?.activeChart()
        .onIntervalChanged()
        .subscribe(null, (interval) => {
          if (SUPPORTED_RESOLUTIONS[interval]) {
            const period = SUPPORTED_RESOLUTIONS[interval];
            setPeriod(period);
          }
        });

      tvWidgetRef.current?.activeChart().dataReady(() => {
      });
    });

    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
        setChartReady(false);
      }
    };
  }, [theme]);

  return (
    <div className={cx('chart-container')}>
      <div
        className={cx('chart-content')}
        style={{ width: chartDataLength > 0 ? "100%" : "0%" }}
        ref={chartContainerRef}
      />
    </div>
  );
}