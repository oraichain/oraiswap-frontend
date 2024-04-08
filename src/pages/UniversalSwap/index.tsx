import { isMobile } from '@walletconnect/browser-utils';
import cn from 'classnames/bind';
import { TVChartContainer } from '@oraichain/oraidex-common-ui';
import Content from 'layouts/Content';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AssetsTab, HeaderTab, HistoryTab, TabsTxs } from './Component';
import { TransactionProcess } from './Modals';
import SwapComponent from './SwapV3';
import { NetworkFilter, TYPE_TAB_HISTORY, initNetworkFilter } from './helpers';
import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectChartTimeFrame, selectCurrentToken, setChartTimeFrame } from 'reducer/tradingSlice';
import { DuckDb } from 'libs/duckdb';
import useTheme from 'hooks/useTheme';
import { PAIRS_CHART } from 'config/pools';
import { useGetPriceChange } from 'pages/Pools/hooks';
import { initPairSwap } from './SwapV3/hooks/useFillToken';
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

  useEffect(() => {
    if (!window.duckDb) initDuckdb();
  }, [window.duckDb]);

  const handleChangeChartTimeFrame = (resolution: number) => {
    dispatch(setChartTimeFrame(resolution));
  };

  // data token pair
  const currentPair = useSelector(selectCurrentToken);
  const tf = useSelector(selectChartTimeFrame);
  const { priceChange } = useGetPriceChange({
    base_denom: currentPair.info.split('-')[0],
    quote_denom: currentPair.info.split('-')[1],
    tf
  });

  return (
    <Content nonBackground>
      <div className={cx('swap-container')}>
        <div className={cx('swap-col', 'w60')}>
          <div>
            {!mobileMode && (
              <>
                {!priceChange.isError && (
                  <HeaderTab setHideChart={setHideChart} hideChart={hideChart} toTokenDenom={toTokenDenom} />
                )}
                <div className={cx('tv-chart', hideChart || priceChange.isError ? 'hidden' : '')}>
                  {isTxsProcess && <TransactionProcess close={() => setIsTxsProcress(!isTxsProcess)} />}
                  <TVChartContainer
                    theme={theme}
                    currentPair={currentPair}
                    pairsChart={PAIRS_CHART}
                    setChartTimeFrame={handleChangeChartTimeFrame}
                    baseUrl={process.env.REACT_APP_BASE_API_URL}
                  />
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
