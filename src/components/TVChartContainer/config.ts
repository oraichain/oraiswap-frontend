import { FAVORITES_INTERVAL } from 'components/TVChartContainer/helpers/constants';
import { PairMapping } from './helpers/types';
import { ORAI } from 'config/constants';

const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit'
});

const timeFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit'
});

export function formatTVDate(date: Date) {
  const obj = dateFormat.formatToJson(date);
  return `${obj.day} ${obj.month} ${obj.year}`;
}

export function formatTVTime(date: Date) {
  const obj = timeFormat.formatToJson(date);
  return `${obj.hour}:${obj.minute}:${obj.second} ${obj.dayPeriod}`;
}

const RED = '#fa3c58';
const GREEN = '#0ecc83';
export const DEFAULT_PERIOD = '4h';
export const DARK_BACKGROUND_CHART = '#151619';
export const LIGHT_BACKGROUND_CHART = '#fff';

const chartStyleOverrides = ['candleStyle', 'hollowCandleStyle', 'haStyle'].reduce((acc, cv) => {
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
  'paneProperties.background': '#16182e',
  'paneProperties.backgroundGradientStartColor': '#16182e',
  'paneProperties.backgroundGradientEndColor': '#16182e',
  'paneProperties.backgroundType': 'solid',
  'paneProperties.vertGridProperties.color': 'rgba(35, 38, 59, 1)',
  'paneProperties.vertGridProperties.style': 2,
  'paneProperties.horzGridProperties.color': 'rgba(35, 38, 59, 1)',
  'paneProperties.horzGridProperties.style': 2,
  'mainSeriesProperties.priceLineColor': '#3a3e5e',
  'scalesProperties.textColor': '#fff',
  'scalesProperties.lineColor': '#16182e',
  ...chartStyleOverrides
};

export const disabledFeaturesOnMobile = ['header_saveload', 'header_fullscreen_button'];

const disabledFeatures = [
  'show_logo_on_all_charts',
  'caption_buttons_text_if_possible',
  'header_compare',
  'compare_symbol',
  'display_market_status',
  'header_interval_dialog_button',
  'show_interval_dialog_on_key_press',
  'header_symbol_search',
  'popup_hints',
  'header_in_fullscreen_mode',
  'right_bar_stays_on_scroll',
  'symbol_info',
  'volume_force_overlay'
];

const enabledFeatures = [
  'side_toolbar_in_fullscreen_mode',
  'header_in_fullscreen_mode',
  'hide_resolution_in_legend',
  'items_favoriting',
  'hide_left_toolbar_by_default',
  'create_volume_indicator_by_default',
  'use_localstorage_for_settings',
  'save_chart_properties_to_local_storage'
];

export const defaultChartProps = {
  locale: 'en',
  library_path: '/charting_library/',
  clientId: 'tradingview.com',
  userId: 'public_user_id',
  fullscreen: false,
  autosize: true,
  header_widget_dom_node: false,
  overrides: chartOverrides,
  enabled_features: enabledFeatures,
  disabled_features: disabledFeatures,
  custom_css_url: '/charting_library/style.css',
  favorites: {
    intervals: FAVORITES_INTERVAL
  },
  custom_formatters: {
    timeFormatter: {
      format: (date) => formatTVTime(date)
    },
    dateFormatter: {
      format: (date) => formatTVDate(date)
    }
  }
};

// the orders are important! Do not change the order of the asset_infos.
export const pairs: PairMapping[] = [
  {
    asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_USDT_CONTRACT } }],
    symbols: ['ORAI', 'USDT']
  },
  {
    asset_infos: [{ token: { contract_addr: process.env.REACT_APP_AIRI_CONTRACT } }, { native_token: { denom: ORAI } }],
    symbols: ['AIRI', 'ORAI']
  },
  {
    asset_infos: [
      { token: { contract_addr: process.env.REACT_APP_ORAIX_CONTRACT } },
      { native_token: { denom: ORAI } }
    ],
    symbols: ['ORAIX', 'ORAI']
  },
  {
    asset_infos: [
      { token: { contract_addr: process.env.REACT_APP_SCORAI_CONTRACT } },
      { native_token: { denom: ORAI } }
    ],
    symbols: ['scORAI', 'ORAI']
  },
  {
    asset_infos: [
      { native_token: { denom: ORAI } },
      { native_token: { denom: process.env.REACT_APP_ATOM_ORAICHAIN_DENOM } }
    ],
    symbols: ['ORAI', 'ATOM']
  },

  {
    asset_infos: [{ token: { contract_addr: process.env.REACT_APP_KWT_CONTRACT } }, { native_token: { denom: ORAI } }],
    symbols: ['KWT', 'ORAI']
  },
  {
    asset_infos: [
      { native_token: { denom: ORAI } },
      {
        native_token: { denom: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM }
      }
    ],
    symbols: ['ORAI', 'OSMO']
  },
  {
    asset_infos: [
      { token: { contract_addr: process.env.REACT_APP_MILKY_CONTRACT } },
      { token: { contract_addr: process.env.REACT_APP_USDT_CONTRACT } }
    ],
    symbols: ['MILKY', 'USDT']
  },
  {
    asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_USDC_CONTRACT } }],
    symbols: ['ORAI', 'USDC']
  },
  {
    asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_TRX_CONTRACT } }],
    symbols: ['ORAI', 'wTRX']
  },
  {
    asset_infos: [
      { token: { contract_addr: process.env.REACT_APP_SCATOM_CONTRACT } },
      { native_token: { denom: process.env.REACT_APP_ATOM_ORAICHAIN_DENOM } }
    ],
    symbols: ['scATOM', 'ATOM']
  }
];

export const pairsChart = pairs.map((pair) => {
  const assets = pair.asset_infos.map((info) => {
    if ('native_token' in info) return info.native_token.denom;
    return info.token.contract_addr;
  });

  return {
    ...pair,
    assets,
    info: `${assets[0]}-${assets[1]}`,
    symbol: `${pair.symbols[0]}/${pair.symbols[1]}`
  };
});
