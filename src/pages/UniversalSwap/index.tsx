import { TVChartContainer } from '@oraichain/oraidex-common-ui';
import { isMobile } from '@walletconnect/browser-utils';
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
import { selectChartTimeFrame, selectCurrentToken, setChartTimeFrame } from 'reducer/tradingSlice';
import { TAB_CHART_SWAP } from 'reducer/type';
import { AssetsTab, HeaderTab, HistoryTab, TabsTxs } from './Component';
import ChartUsdPrice from './Component/ChartUsdPrice';
import { TransactionProcess } from './Modals';
import SwapComponent from './SwapV3';
import { initPairSwap } from './SwapV3/hooks/useFillToken';
import { NetworkFilter, TYPE_TAB_HISTORY, initNetworkFilter } from './helpers';
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

  const [priceUsd, setPriceUsd] = useState(0);
  const currentPair = useSelector(selectCurrentToken);
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
                {!priceChange.isError && (
                  <HeaderTab
                    setHideChart={setHideChart}
                    hideChart={hideChart}
                    toTokenDenom={toTokenDenom}
                    priceUsd={priceUsd}
                    priceChange={priceChange}
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
                      filterDay={filterTimeChartUsd}
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
