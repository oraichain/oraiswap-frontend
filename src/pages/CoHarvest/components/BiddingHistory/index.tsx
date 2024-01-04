import TokenBalance from 'components/TokenBalance';
import styles from './index.module.scss';
import { ReactComponent as NoData } from 'assets/images/nodata-bid.svg';

const BiddingHistory = () => {
  const listBidding = [5, 4, 3, 2, 1];

  return (
    <div className={styles.biddingHistory}>
      <span className={styles.title}>Bidding History</span>
      <div className={styles.content}>
        {listBidding?.length > 0 ? (
          listBidding.map((item, index) => {
            return (
              <div className={styles.item}>
                <div className={styles.right}>
                  <div className={styles.percent}>{item} %</div>
                  <div className={styles.info}>
                    <div className={styles.wallet}>{'orai12d...wvx01us'}</div>
                    <div>{'Fed 01 2024 19:03:43'}</div>
                  </div>
                </div>

                <div className={styles.amount}>
                  <TokenBalance
                    balance={{
                      amount: '125495320000',
                      denom: 'ORAIX',
                      decimals: 6
                    }}
                    className={styles.token}
                  />
                  <TokenBalance balance={25495.32} />
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
