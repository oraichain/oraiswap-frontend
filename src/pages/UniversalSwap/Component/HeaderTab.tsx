import { isMobile } from '@walletconnect/browser-utils';
import ChartImg from 'assets/icons/chart.svg';
import HideImg from 'assets/icons/show.svg';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import cn from 'classnames/bind';
import { flattenTokensWithIcon } from 'config/chainInfos';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useTheme from 'hooks/useTheme';
import { numberWithCommas, reverseSymbolArr } from 'pages/Pools/helpers';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentSwapFilterTime,
  selectCurrentSwapTabChart,
  setFilterTimeSwap,
  setTabChartSwap
} from 'reducer/chartSlice';
import {
  selectCurrentFromToken,
  selectCurrentToChain,
  selectCurrentToToken,
  selectCurrentToken
} from 'reducer/tradingSlice';
import { FILTER_TIME_CHART, TAB_CHART_SWAP } from 'reducer/type';
import { calculateFinalPriceChange } from '../helpers';
import { ChartTokenType } from '../hooks/useChartUsdPrice';
import styles from './HeaderTab.module.scss';

const cx = cn.bind(styles);

export type HeaderTabPropsType = {
  hideChart: boolean;
  setHideChart: (isHideChart: boolean) => void;
  toTokenDenom: string;
  priceUsd: number;
  priceChange: {
    price_change: number;
    price: number;
    isError?: boolean;
  };
  percentChangeUsd: string | number;

  chartTokenType: ChartTokenType;
  setChartTokenType: React.Dispatch<React.SetStateAction<ChartTokenType>>;
  showTokenInfo?: boolean;
};

export const HeaderTab: React.FC<HeaderTabPropsType> = ({
  setHideChart,
  hideChart,
  priceUsd,
  priceChange,
  percentChangeUsd,
  chartTokenType,
  setChartTokenType,
  showTokenInfo = true
}) => {
  const filterTime = useSelector(selectCurrentSwapFilterTime);
  const tab = useSelector(selectCurrentSwapTabChart);
  const dispatch = useDispatch();
  const mobileMode = isMobile();

  return (
    <div className={cx('headerTab')}>
      <HeaderTop
        showHideChart={!mobileMode}
        hideChart={hideChart}
        onClickAction={() => setHideChart(!hideChart)}
        priceUsd={priceUsd}
        priceChange={priceChange}
        percentChangeUsd={percentChangeUsd}
        chartTokenType={chartTokenType}
        showTokenInfo={showTokenInfo}
      />

      <div className={cx('headerBottom')}>
        {!mobileMode && (
          <UsdPrice priceUsd={priceUsd} percentChangeUsd={percentChangeUsd} chartTokenType={chartTokenType} />
        )}

        {tab === TAB_CHART_SWAP.TOKEN && !hideChart && (
          <div className={cx('filter_wrapper')}>
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
          </div>
        )}
      </div>
    </div>
  );
};

export const UsdPrice = ({
  percentChangeUsd,
  priceUsd,
  chartTokenType
}: Pick<HeaderTabPropsType, 'percentChangeUsd' | 'priceUsd' | 'chartTokenType'>) => {
  const isIncrementUsd = percentChangeUsd && Number(percentChangeUsd) > 0;

  const minimize = (input: string) => {
    let isNeedSub = false;
    const replaceItem = input.replace(/(?<=\.)0+/, (m) => {
      isNeedSub = m.length > 3;
      return isNeedSub ? `0<sub>${m.length}</sub>` : m;
    });

    if (!isNeedSub) return numberWithCommas(priceUsd, undefined, { maximumFractionDigits: 6 });

    const SUB_ELEMENT_LENGTH = 5; // </sub>
    const DECIMALS_AFTER_SUB_LENGTH = 5;
    const decimalAfterSub = replaceItem.indexOf('</sub>') + SUB_ELEMENT_LENGTH + DECIMALS_AFTER_SUB_LENGTH;
    return replaceItem.slice(0, decimalAfterSub);
  };

  const headerTabSimple = () => {
    return (
      <div>
        <span dangerouslySetInnerHTML={{ __html: `\$${!priceUsd ? '--' : minimize(priceUsd.toString())}` }} />

        <span
          className={cx('percent', isIncrementUsd ? 'increment' : 'decrement', {
            hidePercent: chartTokenType === ChartTokenType.Volume
          })}
        >
          {(isIncrementUsd ? '+' : '') + Number(percentChangeUsd).toFixed(2)}%
        </span>
      </div>
    );
  };

  return <div className={cx('priceUsd')}>{headerTabSimple()}</div>;
};

export const HeaderTop = ({
  showHideChart = true,
  hideChart,
  onClickAction,
  priceUsd,
  priceChange,
  percentChangeUsd,
  chartTokenType,
  showTokenInfo = true
}: Pick<HeaderTabPropsType, 'priceChange' | 'percentChangeUsd' | 'priceUsd' | 'chartTokenType'> & {
  showHideChart?: boolean;
  hideChart?: boolean;
  onClickAction: () => void;
  showTokenInfo?: boolean;
}) => {
  const theme = useTheme();
  const tab = useSelector(selectCurrentSwapTabChart);
  const currentFromToken = useSelector(selectCurrentFromToken);
  const currentToChain = useSelector(selectCurrentToChain);
  const currentToToken = useSelector(selectCurrentToToken);

  const mobileMode = isMobile();
  let [ToTokenIcon, FromTokenIcon] = [DefaultIcon, DefaultIcon];

  const generateIconTokenByTheme = (token) => {
    return theme === 'light' ? token.IconLight : token.Icon;
  };

  if (currentToToken) {
    const tokenIcon = flattenTokensWithIcon.find(
      (tokenWithIcon) => tokenWithIcon.coinGeckoId === currentToToken.coinGeckoId
    );
    if (tokenIcon) ToTokenIcon = generateIconTokenByTheme(tokenIcon);
  }
  if (currentFromToken) {
    const tokenIcon = flattenTokensWithIcon.find(
      (tokenWithIcon) => tokenWithIcon.coinGeckoId === currentFromToken.coinGeckoId
    );
    if (tokenIcon) FromTokenIcon = generateIconTokenByTheme(tokenIcon);
  }

  return (
    <div className={cx('headerTop')}>
      <div className={cx('tokenWrapper')}>
        {showTokenInfo && (
          <div>
            {tab === TAB_CHART_SWAP.TOKEN
              ? currentToToken &&
                currentToChain && (
                  <div className={cx('tokenInfo')}>
                    <div>
                      <ToTokenIcon />
                    </div>
                    <span>{currentToToken?.name || currentToToken?.denom}</span>
                    <span className={cx('tokenName')}>{currentToChain}</span>
                  </div>
                )
              : currentToToken &&
                currentFromToken && (
                  <div className={cx('tokenInfo')}>
                    <div className={cx('icons')}>
                      <div className={cx('formIcon')}>
                        <FromTokenIcon />
                      </div>
                      <div className={cx('toIcon')}>
                        <ToTokenIcon />
                      </div>
                    </div>
                    <span>
                      {currentFromToken?.name || currentFromToken?.denom}/
                      {currentToToken?.name || currentToToken?.denom}
                    </span>
                  </div>
                )}
          </div>
        )}
        {mobileMode && (
          <UsdPrice priceUsd={priceUsd} percentChangeUsd={percentChangeUsd} chartTokenType={chartTokenType} />
        )}
      </div>
    </div>
  );
};

export const LIST_FILTER_TIME = [
  {
    label: '24H',
    value: FILTER_TIME_CHART['DAY']
  },
  {
    label: '7D',
    value: FILTER_TIME_CHART['7DAY']
  },
  {
    label: 'M',
    value: FILTER_TIME_CHART['MONTH']
  },
  {
    label: '3M',
    value: FILTER_TIME_CHART['3MONTH']
  }
];
