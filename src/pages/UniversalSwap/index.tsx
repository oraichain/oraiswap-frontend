import { TVChartContainer } from '@oraichain/oraidex-common-ui';
import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as NoChartData } from 'assets/images/nochart_data.svg';
import cn from 'classnames/bind';
import { PAIRS_CHART } from 'config/pools';
import useTheme from 'hooks/useTheme';
import Content from 'layouts/Content';
import { DuckDb } from 'libs/duckdb';
import { useGetPriceChange } from 'pages/Pools/hooks';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { selectCurrentSwapFilterTime, selectCurrentSwapTabChart } from 'reducer/chartSlice';
import {
  selectChartTimeFrame,
  selectCurrentFromToken,
  selectCurrentToToken,
  selectCurrentToken,
  setChartTimeFrame
} from 'reducer/tradingSlice';
import { TAB_CHART_SWAP } from 'reducer/type';
import { AssetsTab, HeaderTab, HistoryTab, TabsTxs } from './Component';
import ChartUsdPrice from './Component/ChartUsdPrice';
import { TransactionProcess } from './Modals';
import SwapComponent from './Swap';
import { initPairSwap } from './Swap/hooks/useFillToken';
import { NetworkFilter, TYPE_TAB_HISTORY, initNetworkFilter } from './helpers';
import { ChartTokenType } from './hooks/useChartUsdPrice';
import styles from './index.module.scss';
const cx = cn.bind(styles);

const Swap: React.FC = () => {
  const [[fromTokenDenom, toTokenDenom], setSwapTokens] = useState<[string, string]>(initPairSwap);
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

  const [chartTokenType, setChartTokenType] = useState(ChartTokenType.Price);
  const [priceUsd, setPriceUsd] = useState(0);
  const [percentChangeUsd, setPercentChangeUsd] = useState<string | number>(0);
  const currentPair = useSelector(selectCurrentToken);
  const currentFromToken = useSelector(selectCurrentFromToken);
  const currentToToken = useSelector(selectCurrentToToken);
  const filterTimeChartUsd = useSelector(selectCurrentSwapFilterTime);

  const tf = useSelector(selectChartTimeFrame);
  const { isLoading, priceChange } = useGetPriceChange({
    base_denom: currentPair.info.split('-')[0],
    quote_denom: currentPair.info.split('-')[1],
    tf
  });

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
                {/* {!priceChange.isError && ( */}
                <HeaderTab
                  chartTokenType={chartTokenType}
                  setChartTokenType={setChartTokenType}
                  setHideChart={setHideChart}
                  hideChart={hideChart}
                  toTokenDenom={toTokenDenom}
                  priceUsd={priceUsd}
                  priceChange={priceChange}
                  percentChangeUsd={percentChangeUsd}
                />
                {/* )} */}
                <div className={cx('tv-chart', hideChart ? 'hidden' : '')}>
                  {isTxsProcess && <TransactionProcess close={() => setIsTxsProcress(!isTxsProcess)} />}
                  <div
                    className={cx(
                      `chartItem`,
                      hideChart ? 'hidden' : '',
                      tabChart === TAB_CHART_SWAP.TOKEN ? 'activeChart' : ''
                    )}
                  >
                    <ChartUsdPrice
                      activeAnimation={hideChart}
                      filterDay={filterTimeChartUsd}
                      onUpdateCurrentItem={setPriceUsd}
                      onUpdatePricePercent={setPercentChangeUsd}
                      chartTokenType={chartTokenType}
                    />
                  </div>

                  <div className={cx(`chartItem`, tabChart === TAB_CHART_SWAP.POOL ? 'activeChart' : '')}>
                    {!priceChange.isError && currentFromToken && currentToToken ? (
                      <TVChartContainer
                        theme={theme}
                        currentPair={currentPair}
                        pairsChart={PAIRS_CHART}
                        setChartTimeFrame={handleChangeChartTimeFrame}
                        baseUrl={process.env.REACT_APP_BASE_API_URL}
                      />
                    ) : (
                      <div className={cx('nodata-wrapper', hideChart ? 'hidden' : '')}>
                        <NoChartData />
                        <div className={cx('nodata-content')}>
                          <p className={cx('nodata-title')}>No data available</p>
                          <p>Please try switching to Simple view</p>
                        </div>
                      </div>
                    )}
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
