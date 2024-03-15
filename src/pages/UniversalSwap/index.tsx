import { isMobile } from '@walletconnect/browser-utils';
import cn from 'classnames/bind';
import { TVChartContainer } from '@oraichain/oraidex-common-ui';
import Content from 'layouts/Content';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AssetsTab, HeaderTab, HistoryTab, TabsTxs } from './Component';
import { TransactionProcess } from './Modals';
import SwapComponent from './SwapV3';
import { NetworkFilter, TYPE_TAB_HISTORY, calculateFinalPriceChange, initNetworkFilter } from './helpers';
import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectChartTimeFrame,
  selectCurrentToChain,
  selectCurrentToken,
  setChartTimeFrame
} from 'reducer/tradingSlice';
import { DuckDb } from 'libs/duckdb';
import useTheme from 'hooks/useTheme';
import { PAIRS_CHART } from 'config/pools';
import { useGetPriceChange } from 'pages/Pools/hooks';
import ChartUsdPrice from './Component/ChartUsdPrice';
import { FILTER_DAY, FILTER_TIME_CHART, TAB_CHART_SWAP } from 'reducer/type';
import { selectCurrentSwapTabChart } from 'reducer/chartSlice';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { reverseSymbolArr } from 'pages/Pools/helpers';
const cx = cn.bind(styles);

const Swap: React.FC = () => {
  const [[fromTokenDenom, toTokenDenom], setSwapTokens] = useState<[string, string]>(['orai', 'usdt']);
  const [hideChart, setHideChart] = useState<boolean>(false);
  const [isTxsProcess, setIsTxsProcress] = useState<boolean>(false);
  const [networkFilter, setNetworkFilter] = useState<NetworkFilter>(initNetworkFilter);
  const mobileMode = isMobile();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  let tab = searchParams.get('type');
  const dispatch = useDispatch();
  const initDuckdb = async () => {
    window.duckDb = await DuckDb.create();
  };

  const tabChart = useSelector(selectCurrentSwapTabChart);

  const [priceUsd, setPriceUsd] = useState(0);
  const currentPair = useSelector(selectCurrentToken);
  // const { data: prices } = useCoinGeckoPrices();

  const [baseContractAddr, quoteContractAddr] = currentPair.info.split('-');
  const isPairReverseSymbol = reverseSymbolArr.find(
    (pair) => pair.filter((item) => item.denom === baseContractAddr || item.denom === quoteContractAddr).length === 2
  );
  // const [baseDenom, quoteDenom] = currentPair.symbol.split('/');

  const tf = useSelector(selectChartTimeFrame);
  const { isLoading, priceChange } = useGetPriceChange({
    base_denom: currentPair.info.split('-')[0],
    quote_denom: currentPair.info.split('-')[1],
    tf
  });

  // useEffect(() => {
  //   if (priceChange && priceChange.price) {
  //     setPriceUsd(priceChange.price);
  //   }
  // }, [priceChange]);

  const isIncrement = priceChange && Number(priceChange.price_change) > 0 && !isPairReverseSymbol;

  // const percentPriceChange = calculateFinalPriceChange(
  //   !!isPairReverseSymbol,
  //   priceChange.price,
  //   priceChange.price_change
  // );

  // const isOchOraiPair = baseDenom === 'OCH' && quoteDenom === 'ORAI';
  // const currentPrice = isOchOraiPair ? priceChange.price * prices['oraichain-token'] : priceChange.price;

  useEffect(() => {
    if (!window.duckDb) initDuckdb();
  }, [window.duckDb]);

  const handleChangeChartTimeFrame = (resolution: number) => {
    dispatch(setChartTimeFrame(resolution));
  };

  return (
    <Content nonBackground>
      <div className={cx('swap-container')}>
        <div className={cx('swap-col', 'w60')}>
          <div>
            {!mobileMode && (
              <>
                {!priceChange.isError && (
                  <HeaderTab
                    setHideChart={setHideChart}
                    hideChart={hideChart}
                    toTokenDenom={toTokenDenom}
                    priceUsd={priceUsd}
                  />
                )}
                <div className={cx('tv-chart', hideChart || priceChange.isError ? 'hidden' : '')}>
                  {isTxsProcess && <TransactionProcess close={() => setIsTxsProcress(!isTxsProcess)} />}
                  <div
                    className={cx(
                      `chartItem`,
                      hideChart || priceChange.isError ? 'hidden' : '',
                      tabChart === TAB_CHART_SWAP.ORIGINAL ? 'activeChart' : ''
                    )}
                  >
                    <ChartUsdPrice
                      activeAnimation={hideChart}
                      filterDay={FILTER_TIME_CHART.DAY}
                      onUpdateCurrentItem={setPriceUsd}
                    />
                  </div>

                  <div className={cx(`chartItem`, tabChart === TAB_CHART_SWAP.TRADING_VIEW ? 'activeChart' : '')}>
                    <TVChartContainer
                      theme={theme}
                      currentPair={currentPair}
                      pairsChart={PAIRS_CHART}
                      setChartTimeFrame={handleChangeChartTimeFrame}
                      baseUrl={process.env.REACT_APP_BASE_API_URL}
                    />
                  </div>
                </div>
              </>
            )}

            {/* <RoutingSection /> */}
            <TabsTxs setNetworkFilter={setNetworkFilter} networkFilter={networkFilter} />
            {tab === TYPE_TAB_HISTORY.HISTORY ? (
              <HistoryTab networkFilter={networkFilter.value} />
            ) : (
              <AssetsTab networkFilter={networkFilter.value} />
            )}
          </div>
        </div>
        <div className={cx('swap-col', 'w40')}>
          <SwapComponent fromTokenDenom={fromTokenDenom} toTokenDenom={toTokenDenom} setSwapTokens={setSwapTokens} />
        </div>
      </div>
    </Content>
  );
};

export default Swap;
