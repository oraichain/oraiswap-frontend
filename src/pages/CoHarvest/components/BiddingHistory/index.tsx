import { BigDecimal, toDisplay } from '@oraichain/oraidex-common';
import { OraiswapRouterQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { ReactComponent as NoData } from 'assets/images/nodata-bid.svg';
import { flattenTokens, tokenMap } from 'config/bridgeTokens';
import { network } from 'config/networks';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { getUsd } from 'libs/utils';
import { INIT_AMOUNT_SIMULATE, TIMER } from 'pages/CoHarvest/constants';
import { dateFormat, shortenAddress } from 'pages/CoHarvest/helpers';
import { useGetBidHistoryWithPotentialReturn, useGetHistoryBid } from 'pages/CoHarvest/hooks/useGetBidRound';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import { useSimulate } from 'pages/UniversalSwap/SwapV3/hooks';
import { memo } from 'react';
import styles from './index.module.scss';

const BiddingHistory = ({ round }) => {
  const ORAIX_TOKEN_INFO = flattenTokens.find((e) => e.coinGeckoId === 'oraidex');
  const USDC_TOKEN_INFO = flattenTokens.find((e) => e.coinGeckoId === 'usd-coin');

  const originalFromToken = tokenMap['oraix'];
  const originalToToken = tokenMap['usdc'];
  const routerClient = new OraiswapRouterQueryClient(window.client, network.router);

  const { simulateData: averageRatio } = useSimulate(
    'simulate-average-data-co-harvest',
    ORAIX_TOKEN_INFO,
    USDC_TOKEN_INFO,
    originalFromToken,
    originalToToken,
    routerClient,
    INIT_AMOUNT_SIMULATE
  );

  const { data: prices } = useCoinGeckoPrices();
  const { historyBidPool, isLoading, refetchHistoryBidPool } = useGetHistoryBid(round);
  const { refetchPotentialReturn, listPotentialReturn } = useGetBidHistoryWithPotentialReturn({
    listBidHistories: historyBidPool,
    exchangeRate: new BigDecimal(averageRatio?.displayAmount || 0).div(INIT_AMOUNT_SIMULATE).toString()
  });

  return (
    <div className={styles.biddingHistory}>
      <span className={styles.title}>Bidding History</span>
      <div className={styles.content}>
        {listPotentialReturn?.length > 0 ? (
          listPotentialReturn
            .sort((a, b) => b.premium_slot - a.premium_slot)
            .map((item, index) => {
              return (
                <div className={styles.item} key={index}>
                  <div className={styles.right}>
                    <div className={styles.percent}>{item.premium_slot} %</div>
                    <div className={styles.info}>
                      <div className={styles.wallet}>{shortenAddress(item.bidder)}</div>
                      <div>{dateFormat(new Date(item.timestamp * TIMER.MILLISECOND))}</div>
                    </div>
                  </div>
                  <div className={styles.amount}>
                    <div className={styles.token}>{toDisplay(item.amount)} ORAIX</div>
                    {formatDisplayUsdt(item.potentialReturnUSD)}
                  </div>
                </div>
              );
            })
        ) : (
          <div className={styles.nodata}>
            <NoData />
            <span>Place a bid and take it all!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(BiddingHistory);
