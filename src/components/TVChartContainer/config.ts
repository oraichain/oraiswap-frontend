import { FAVORITES_INTERVAL } from "components/TVChartContainer/helpers/constants";
import { addMinutes, format as formatDateFn } from "date-fns";

export function formatTVDate(date: Date) {
  // https://github.com/date-fns/date-fns/issues/1401#issuecomment-578580199
  return formatDateFn(addMinutes(date, date.getTimezoneOffset()), "dd MMM yyyy");
}

export function formatTVTime(date: Date) {
  return formatDateFn(addMinutes(date, date.getTimezoneOffset()), "h:mm:ss a");
}

const RED = "#fa3c58";
const GREEN = "#0ecc83";
export const DEFAULT_PERIOD = "4h";
export const DARK_BACKGROUND_CHART = "#151619";
export const LIGHT_BACKGROUND_CHART = "#fff";

const chartStyleOverrides = ["candleStyle", "hollowCandleStyle", "haStyle"].reduce((acc, cv) => {
  acc[`mainSeriesProperties.${cv}.drawWick`] = true;
  acc[`mainSeriesProperties.${cv}.drawBorder`] = false;
  acc[`mainSeriesProperties.${cv}.upColor`] = GREEN;
  acc[`mainSeriesProperties.${cv}.downColor`] = RED;
  acc[`mainSeriesProperties.${cv}.wickUpColor`] = GREEN;
  acc[`mainSeriesProperties.${cv}.wickDownColor`] = RED;
  acc[`mainSeriesProperties.${cv}.borderUpColor`] = GREEN;
  acc[`mainSeriesProperties.${cv}.borderDownColor`] = RED;
  return acc;
}, {});

const chartOverrides = {
  "paneProperties.background": "#16182e",
  "paneProperties.backgroundGradientStartColor": "#16182e",
  "paneProperties.backgroundGradientEndColor": "#16182e",
  "paneProperties.backgroundType": "solid",
  "paneProperties.vertGridProperties.color": "rgba(35, 38, 59, 1)",
  "paneProperties.vertGridProperties.style": 2,
  "paneProperties.horzGridProperties.color": "rgba(35, 38, 59, 1)",
  "paneProperties.horzGridProperties.style": 2,
  "mainSeriesProperties.priceLineColor": "#3a3e5e",
  "scalesProperties.textColor": "#fff",
  "scalesProperties.lineColor": "#16182e",
  ...chartStyleOverrides,
};

export const disabledFeaturesOnMobile = ["header_saveload", "header_fullscreen_button"];

const disabledFeatures = [
  "show_logo_on_all_charts",
  "caption_buttons_text_if_possible",
  "header_compare",
  "compare_symbol",
  "display_market_status",
  "header_interval_dialog_button",
  "show_interval_dialog_on_key_press",
  "header_symbol_search",
  "popup_hints",
  "header_in_fullscreen_mode",
  "right_bar_stays_on_scroll",
  "symbol_info",
];

const enabledFeatures = [
  "side_toolbar_in_fullscreen_mode",
  "header_in_fullscreen_mode",
  "hide_resolution_in_legend",
  "items_favoriting",
  "hide_left_toolbar_by_default",
  'create_volume_indicator_by_default',
  'use_localstorage_for_settings',
  'save_chart_properties_to_local_storage',
];

export const defaultChartProps = {
  locale: "en",
  library_path: "/charting_library/",
  clientId: "tradingview.com",
  userId: "public_user_id",
  fullscreen: false,
  autosize: true,
  header_widget_dom_node: false,
  overrides: chartOverrides,
  enabled_features: enabledFeatures,
  disabled_features: disabledFeatures,
  custom_css_url: '/charting_library/style.css',
  favorites: {
    intervals: FAVORITES_INTERVAL,
  },
  custom_formatters: {
    timeFormatter: {
      format: (date) => formatTVTime(date),
    },
    dateFormatter: {
      format: (date) => formatTVDate(date),
    },
  },
};
