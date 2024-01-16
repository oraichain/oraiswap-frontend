import { BigDecimal, oraichainTokens, tokenMap } from '@oraichain/oraidex-common';
import { OraiswapRouterQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow.svg';
import LoadingBox from 'components/LoadingBox';
import { network } from 'config/networks';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { INIT_AMOUNT_SIMULATE, TAB_HISTORY } from 'pages/CoHarvest/constants';
import {
  useGetAllBids,
  useGetBidHistoryWithPotentialReturn,
  useGetBiddingFilter,
  useGetHistoryBid
} from 'pages/CoHarvest/hooks/useGetBidRound';
import { useSimulate } from 'pages/UniversalSwap/SwapV3/hooks';
import { memo, useEffect, useRef, useState } from 'react';
import AllBidding from '../AllBidding';
import MyBidding from '../MyBidding';
import styles from './index.module.scss';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';

const BiddingHistory = ({ round, isEnd }) => {
  const ORAIX_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'oraidex');
  const USDC_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'usd-coin');

  const [filterRound, setFilterRound] = useState(round);
  const [showFilter, setShowFilter] = useState(false);

  const originalFromToken = tokenMap['oraix'];
  const originalToToken = tokenMap['usdc'];
  const routerClient = new OraiswapRouterQueryClient(window.client, network.router);

  const [activeTab, setActiveTab] = useState(TAB_HISTORY.MY_BID);

  const { simulateData: averageRatio } = useSimulate(
    'simulate-average-data-co-harvest',
    ORAIX_TOKEN_INFO,
    USDC_TOKEN_INFO,
    originalFromToken,
    originalToToken,
    routerClient,
    INIT_AMOUNT_SIMULATE
  );

  useEffect(() => {
    if (round && !filterRound && round !== filterRound) {
      setFilterRound(round);
    }
  }, [round]);

  const exchangeRate = new BigDecimal(averageRatio?.displayAmount || 0).div(INIT_AMOUNT_SIMULATE).toString();
  const { biddingInfo } = useGetBiddingFilter(filterRound);
  const { historyBidPool } = useGetHistoryBid(filterRound);
  const { historyAllBidPool, isLoading: loadingAllBid } = useGetAllBids(filterRound, exchangeRate);
  const { data: prices } = useCoinGeckoPrices();
  const { listPotentialReturn, isLoading: loadingMyBid } = useGetBidHistoryWithPotentialReturn({
    listBidHistories: historyBidPool,
    exchangeRate,
    biddingInfo,
    prices
  });

  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setShowFilter(false);
  });

  return (
    <div className={styles.biddingHistory}>
      <div className={styles.tabWrapper}>
        <div className={styles.tabTitle}>
          <div
            onClick={() => setActiveTab(TAB_HISTORY.MY_BID)}
            className={`${styles.title} ${activeTab === TAB_HISTORY.MY_BID ? styles.active : ''}`}
          >
            My bids history
          </div>
          <div
            onClick={() => setActiveTab(TAB_HISTORY.ALL_BID)}
            className={`${styles.title} ${activeTab === TAB_HISTORY.ALL_BID ? styles.active : ''}`}
          >
            All Bidding
          </div>
        </div>
        <div className={styles.round}>
          <button onClick={() => setShowFilter((showFilter) => !showFilter)}>
            Round {filterRound}
            <ArrowDownIcon />
          </button>
          <div ref={ref} className={`${styles.wrapperFilter} ${showFilter ? styles.showFilter : ''}`}>
            {[...new Array(round).keys()]
              .sort((a, b) => b - a)
              .map((item, key) => {
                return (
                  <button
                    key={key}
                    className={`${filterRound === item + 1 ? styles.active : ''}`}
                    onClick={() => {
                      setFilterRound(item + 1);
                      setShowFilter((showFilter) => !showFilter);
                    }}
                  >
                    Round {item + 1}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
      <div className={styles.content}>
        {activeTab === TAB_HISTORY.MY_BID && (
          <LoadingBox loading={loadingMyBid} className={styles.loadingDivWrapper}>
            {listPotentialReturn.length <= 0 ? null : <span className={styles.title}>Round #{filterRound}</span>}
            <MyBidding biddingInfo={biddingInfo} list={listPotentialReturn} isEnd={isEnd} prices={prices} isLoading={loadingMyBid} />
          </LoadingBox>
        )}
        {activeTab === TAB_HISTORY.ALL_BID && (
          <LoadingBox loading={loadingAllBid} className={styles.loadingDivWrapper}>
            {historyAllBidPool.length <= 0 ? null : <span className={styles.title}>Round #{filterRound}</span>}
            <AllBidding biddingInfo={biddingInfo} list={historyAllBidPool} isEnd={isEnd} prices={prices} isLoading={loadingAllBid} />
          </LoadingBox>
        )}
      </div>
    </div>
  );
};

export default memo(BiddingHistory);
