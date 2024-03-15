import HideImg from 'assets/icons/hidden.svg';
import ShowImg from 'assets/icons/show.svg';
import ChartImg from 'assets/icons/chart.svg';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import cn from 'classnames/bind';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { reverseSymbolArr } from 'pages/Pools/helpers';
import { useGetPriceChange } from 'pages/Pools/hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectChartTimeFrame,
  selectCurrentToChain,
  selectCurrentToToken,
  selectCurrentToken
} from 'reducer/tradingSlice';
import { calculateFinalPriceChange } from '../helpers';
import styles from './HeaderTab.module.scss';
import { FILTER_TIME_CHART, TAB_CHART, TAB_CHART_SWAP } from 'reducer/type';
import {
  selectCurrentSwapFilterTime,
  selectCurrentSwapTabChart,
  setFilterTimeSwap,
  setTabChartSwap
} from 'reducer/chartSlice';
import { useEffect, useState } from 'react';
import useTheme from 'hooks/useTheme';

const cx = cn.bind(styles);

export const HeaderTab: React.FC<{
  hideChart: boolean;
  setHideChart: (isHideChart: boolean) => void;
  toTokenDenom: string;
  priceUsd: number;
}> = ({ setHideChart, hideChart, priceUsd }) => {
  const theme = useTheme();

  const filterTime = useSelector(selectCurrentSwapFilterTime);
  const tab = useSelector(selectCurrentSwapTabChart);
  const currentToChain = useSelector(selectCurrentToChain);
  const currentToToken = useSelector(selectCurrentToToken);
  const dispatch = useDispatch();

  let IconToToken = DefaultIcon;
  if (currentToToken && Object.keys(currentToToken.IconLight || currentToToken.Icon).length > 0) {
    IconToToken = theme === 'light' ? currentToToken.IconLight || currentToToken.Icon : currentToToken.Icon;
  }

  return (
    <div className={cx('headerTab')}>
      <div className={cx('headerTop')}>
        <div>
          {currentToToken && currentToChain && (
            <div className={cx('tokenInfo')}>
              <div>
                <IconToToken />
              </div>
              <span>{currentToChain}</span>
              <span className={cx('tokenName')}>{currentToToken?.name || currentToToken?.denom}</span>
            </div>
          )}
        </div>
        <div className={cx('tabEyes')}>
          {!hideChart && (
            <div className={cx('tabWrapper')}>
              <button
                className={cx('tab', tab === TAB_CHART_SWAP.ORIGINAL ? 'active' : '')}
                onClick={() => {
                  dispatch(setTabChartSwap(TAB_CHART_SWAP.ORIGINAL));
                }}
              >
                {TAB_CHART_SWAP.ORIGINAL}
              </button>
              <button
                className={cx('tab', tab === TAB_CHART_SWAP.TRADING_VIEW ? 'active' : '')}
                onClick={() => {
                  dispatch(setTabChartSwap(TAB_CHART_SWAP.TRADING_VIEW));
                }}
              >
                {TAB_CHART_SWAP.TRADING_VIEW}
              </button>
            </div>
          )}
          <div className={cx('eyesWrapper')}>
            <img
              className={cx('eyes')}
              src={hideChart ? ChartImg : HideImg}
              alt="eyes"
              onClick={() => setHideChart(!hideChart)}
            />
          </div>
        </div>
      </div>

      <div className={cx('headerBottom')}>
        <div className={cx('priceUsd')}>${priceUsd}</div>
        {tab === TAB_CHART_SWAP.ORIGINAL && !hideChart && (
          <div className={cx('filter_day_wrapper')}>
            {LIST_FILTER_TIME.map((e) => {
              return (
                <button
                  key={'time-key-chart' + e.label}
                  className={cx(`filter_day`, e.value === filterTime ? 'active' : '')}
                  onClick={() => {
                    dispatch(setFilterTimeSwap(e.value));
                  }}
                >
                  {e.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const LIST_FILTER_TIME = [
  {
    label: '1H',
    value: FILTER_TIME_CHART.ONE_HOUR
  },
  {
    label: '4H',
    value: FILTER_TIME_CHART.FOUR_HOUR
  },
  {
    label: 'D',
    value: FILTER_TIME_CHART.DAY
  },
  {
    label: 'M',
    value: FILTER_TIME_CHART.MONTH
  }
];
