import { flattenTokens, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as NoDataDark } from 'assets/images/nodata-bid-dark.svg';
import { ReactComponent as NoData } from 'assets/images/nodata-bid.svg';
import useConfigReducer from 'hooks/useConfigReducer';
import { TIMER } from 'pages/CoHarvest/constants';
import { dateFormat, shortenAddress } from 'pages/CoHarvest/helpers';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import styles from './index.module.scss';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { ReactComponent as OraiXIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as OraiXLightIcon } from 'assets/icons/oraix_light.svg';
import { getUsd } from 'libs/utils';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';

const AllBidding = ({ list, isLoading }) => {
  const [theme] = useConfigReducer('theme');
  const { data: prices } = useCoinGeckoPrices();
  const ORAIX_TOKEN_INFO = flattenTokens.find((e) => e.coinGeckoId === 'oraidex');

  if (isLoading) return <div className={styles.loadingDiv}></div>;

  return (
    <div className={styles.allBid}>
      {list?.length > 0 ? (
        list
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
                  {/* <div>
                    <UsdcIcon height={16} width={16} />
                    {toDisplay(item.estimateReceive)} USDC
                  </div>
                  <div>
                    {theme === 'light' ? (
                      <OraiXLightIcon height={16} width={16} />
                    ) : (
                      <OraiXIcon height={16} width={16} />
                    )}
                    {toDisplay(item.estimateResidueBid)} ORAIX
                  </div> */}
                  {/* {formatDisplayUsdt(item.potentialReturnUSD)} */}
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
