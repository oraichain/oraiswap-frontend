import { toDisplay, toAmount } from '@oraichain/oraidex-common';
import { ReactComponent as NoData } from 'assets/images/nodata-bid.svg';
import TokenBalance from 'components/TokenBalance';
import { TIMER } from 'pages/CoHarvest/constants';
import { dateFormat, shortenAddress } from 'pages/CoHarvest/helpers';
import { useGetHistoryBid } from 'pages/CoHarvest/hooks/useGetBidRound';
import { memo } from 'react';
import styles from './index.module.scss';
import { RootState } from 'store/configure';
import { useSelector } from 'react-redux';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { flattenTokens } from 'config/bridgeTokens';
import { getUsd } from 'libs/utils';
import { formatDisplayUsdt } from 'pages/Pools/helpers';

const BiddingHistory = ({ round }) => {
  const { historyBidPool, isLoading, refetchHistoryBidPool } = useGetHistoryBid(round);
  const { data: prices } = useCoinGeckoPrices();
  const ORAIX_TOKEN_INFO = flattenTokens.find((e) => e.coinGeckoId === 'oraidex');

  return (
    <div className={styles.biddingHistory}>
      <span className={styles.title}>Bidding History</span>
      <div className={styles.content}>
        {historyBidPool?.length > 0 ? (
          historyBidPool
            .sort((a, b) => b.premium_slot - a.premium_slot)
            .map((item, index) => {
              const amountUsd = getUsd(item.amount, ORAIX_TOKEN_INFO, prices);
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
                    {formatDisplayUsdt(amountUsd)}
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
