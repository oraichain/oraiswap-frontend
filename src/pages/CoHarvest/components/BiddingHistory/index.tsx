import TokenBalance from 'components/TokenBalance';
import styles from './index.module.scss';
import { ReactComponent as NoData } from 'assets/images/nodata-bid.svg';
import { useGetHistoryBid } from 'pages/CoHarvest/hooks/useGetBidRound';
import { toDisplay } from '@oraichain/oraidex-common';

const BiddingHistory = ({ round }) => {
  const { historyBidPool, isLoading, refetchHistoryBidPool } = useGetHistoryBid(round);
  return (
    <div className={styles.biddingHistory}>
      <span className={styles.title}>Bidding History</span>
      <div className={styles.content}>
        {historyBidPool?.length > 0 ? (
          historyBidPool.sort((a, b) => (b.premium_slot - a.premium_slot)).map((item, index) => {
            return (
              <div className={styles.item} key={index}>
                <div className={styles.right}>
                  <div className={styles.percent}>{item.premium_slot} %</div>
                  <div className={styles.info}>
                    <div className={styles.wallet}>{item.bidder}</div>
                    <div>{new Date(item.timestamp).toISOString()}</div>
                  </div>
                </div>
                <div className={styles.amount}>
                  <div className={styles.token}>
                    {toDisplay(item.amount)} ORAIX
                  </div>
                  <TokenBalance balance={0} />
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

export default BiddingHistory;
