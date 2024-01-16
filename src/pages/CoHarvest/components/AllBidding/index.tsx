import { oraichainTokens, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as NoDataDark } from 'assets/images/nodata-bid-dark.svg';
import { ReactComponent as NoData } from 'assets/images/nodata-bid.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import { getUsd } from 'libs/utils';
import { TIMER } from 'pages/CoHarvest/constants';
import { dateFormat, shortenAddress } from 'pages/CoHarvest/helpers';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import styles from './index.module.scss';

const AllBidding = ({ list, isLoading, prices, biddingInfo, isEnd }) => {
  const [theme] = useConfigReducer('theme');
  const ORAIX_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'oraidex');
  const pricesToken = isEnd
    ? { oraidex: Number(biddingInfo.distribution_info.exchange_rate), 'usd-coin': prices['usd-coin'] } : prices;
  if (isLoading) return <div className={styles.loadingDiv}></div>;

  return (
    <div className={styles.allBid}>
      {list?.length > 0 ? (
        list
          .sort((a, b) => b.premium_slot - a.premium_slot)
          .map((item, index) => {
            const amountUsd = getUsd(item.amount, ORAIX_TOKEN_INFO, pricesToken);
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
                  <div className={styles.token}>{numberWithCommas(toDisplay(item.amount))} ORAIX</div>
                  {formatDisplayUsdt(amountUsd)}
                </div>
              </div>
            );
          })
      ) : (
        <div className={styles.nodata}>
          {theme === 'light' ? <NoData /> : <NoDataDark />}
          <span>Place a bid and take it all!</span>
        </div>
      )}
    </div>
  );
};

export default AllBidding;
