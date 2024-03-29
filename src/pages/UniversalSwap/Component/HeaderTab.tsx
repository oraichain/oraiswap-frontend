import ChartImg from 'assets/icons/chart.svg';
import HideImg from 'assets/icons/show.svg';
import { ReactComponent as DefaultIcon } from 'assets/icons/tokens.svg';
import cn from 'classnames/bind';
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
};

export const HeaderTab: React.FC<HeaderTabPropsType> = ({
  setHideChart,
  hideChart,
  priceUsd,
  priceChange,
  percentChangeUsd,
  chartTokenType,
  setChartTokenType
}) => {
  const theme = useTheme();

  const filterTime = useSelector(selectCurrentSwapFilterTime);
  const tab = useSelector(selectCurrentSwapTabChart);
  const currentToChain = useSelector(selectCurrentToChain);
  const currentToToken = useSelector(selectCurrentToToken);
  const currentFromToken = useSelector(selectCurrentFromToken);
  const dispatch = useDispatch();

  const { data: prices } = useCoinGeckoPrices();
  const currentPair = useSelector(selectCurrentToken);

  const [baseContractAddr, quoteContractAddr] = currentPair.info.split('-');
  const isPairReverseSymbol = reverseSymbolArr.find(
    (pair) => pair.filter((item) => item.denom === baseContractAddr || item.denom === quoteContractAddr).length === 2
  );
  const [baseDenom, quoteDenom] = currentPair.symbol.split('/');

  const isIncrement = priceChange && Number(priceChange.price_change) > 0 && !isPairReverseSymbol;
  const isIncrementUsd = percentChangeUsd && Number(percentChangeUsd) > 0;

  const percentPriceChange = calculateFinalPriceChange(
    !!isPairReverseSymbol,
    priceChange.price,
    priceChange.price_change
  );

  const isOchOraiPair = baseDenom === 'OCH' && quoteDenom === 'ORAI';
  const currentPrice = isOchOraiPair ? priceChange.price * prices['oraichain-token'] : priceChange.price;

  let [ToTokenIcon, FromTokenIcon] = [DefaultIcon, DefaultIcon];
  if (currentToToken && Object.keys(currentToToken.IconLight || currentToToken.Icon).length > 0) {
    ToTokenIcon = theme === 'light' ? currentToToken.IconLight || currentToToken.Icon : currentToToken.Icon;
  }
  if (currentFromToken && Object.keys(currentFromToken.IconLight || currentFromToken.Icon).length > 0) {
    FromTokenIcon = theme === 'light' ? currentFromToken.IconLight || currentFromToken.Icon : currentFromToken.Icon;
  }

  return (
    <div className={cx('headerTab')}>
      <div className={cx('headerTop')}>
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
                    {currentFromToken?.name || currentFromToken?.denom}/{currentToToken?.name || currentToToken?.denom}
                  </span>
                </div>
              )}
        </div>
        <div className={cx('tabEyes')}>
          {!hideChart && (
            <div className={cx('tabWrapper')}>
              <button
                className={cx('tab', tab === TAB_CHART_SWAP.TOKEN ? 'active' : '')}
                onClick={() => {
                  dispatch(setTabChartSwap(TAB_CHART_SWAP.TOKEN));
                }}
              >
                {TAB_CHART_SWAP.TOKEN}
              </button>
              <button
                className={cx('tab', tab === TAB_CHART_SWAP.POOL ? 'active' : '')}
                onClick={() => {
                  dispatch(setTabChartSwap(TAB_CHART_SWAP.POOL));
                }}
              >
                {TAB_CHART_SWAP.POOL}
              </button>
            </div>
          )}
          <div className={cx('eyesWrapper')} onClick={() => setHideChart(!hideChart)}>
            <img className={cx('eyes')} src={hideChart ? ChartImg : HideImg} alt="eyes" />
          </div>
        </div>
      </div>

      <div className={cx('headerBottom')}>
        <div className={cx('priceUsd')}>
          {tab === TAB_CHART_SWAP.TOKEN ? (
            <div>
              <span>${!priceUsd ? '--' : numberWithCommas(priceUsd, undefined, { maximumFractionDigits: 6 })}</span>
              <span
                className={cx('percent', isIncrementUsd ? 'increment' : 'decrement', {
                  hidePercent: chartTokenType === ChartTokenType.Volume
                })}
              >
                {(isIncrementUsd ? '+' : '') + Number(percentChangeUsd).toFixed(2)}%
              </span>
            </div>
          ) : (
            !priceChange.isError && (
              <div className={cx('bottom')}>
                <div className={cx('balance')}>
                  {`1 ${baseDenom} ≈ ${
                    isPairReverseSymbol ? (1 / currentPrice || 0).toFixed(6) : currentPrice.toFixed(6)
                  } ${quoteDenom}`}
                </div>
                <div className={cx('percent', isIncrement ? 'increment' : 'decrement')}>
                  {(isIncrement ? '+' : '') + percentPriceChange.toFixed(2)}%
                </div>
              </div>
            )
          )}
        </div>
        {tab === TAB_CHART_SWAP.TOKEN && !hideChart && (
          <div className={cx('filter_wrapper')}>
            <div className={cx('filter_day_wrapper')}>
              {[ChartTokenType.Price, ChartTokenType.Volume].map((type) => {
                return (
                  <button
                    key={'time-key-chart' + type}
                    className={cx(`filter_day`, type === chartTokenType ? 'active' : '')}
                    onClick={() => {
                      setChartTokenType(type);
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
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
