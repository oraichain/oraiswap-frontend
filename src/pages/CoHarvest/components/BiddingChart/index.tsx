import { toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as TooltipIcon } from 'assets/icons/icon_tooltip.svg';
import { flattenTokens } from 'config/bridgeTokens';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { getUsd } from 'libs/utils';
import { useGetAllBidPoolInRound } from 'pages/CoHarvest/hooks/useGetBidRound';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import { memo } from 'react';
import ChartColumn from '../ChartColumn';
import styles from './index.module.scss';
const BiddingChart = (props: { round: number; bidInfo }) => {
  const { round, bidInfo } = props;
  const { data: prices } = useCoinGeckoPrices();
  const totalBidAmount = bidInfo.total_bid_amount;
  const USDC_TOKEN_INFO = flattenTokens.find((e) => e.coinGeckoId === 'oraidex');
  const amountUsd = getUsd(totalBidAmount, USDC_TOKEN_INFO, prices);

  const ORAIX_TOKEN_INFO = flattenTokens.find((e) => e.coinGeckoId === 'oraidex');
  const { allBidPoolRound, isLoading, refetchAllBidPoolRound } = useGetAllBidPoolInRound(round);

  return (
    <div className={styles.biddingChart}>
      <div className={styles.title}>
        <span className={styles.titleLeft}>Bid Placed in Liquidations</span>
        <div className={styles.titleRight}>
          <div className={styles.subtitle}>
            <span>Total Bid</span>
            <TooltipIcon />
          </div>
          <div className={styles.balance}>
            <div className={styles.usd}>{formatDisplayUsdt(amountUsd)}</div>
            {'('}
            <div className={styles.token}>{toDisplay(totalBidAmount)} ORAIX</div>
            {')'}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.columnList}>
          {allBidPoolRound.map((e, key) => (
            <ChartColumn
              key={key}
              data={{
                percent: e.percentage,
                volume: getUsd(e.total_bid_amount, ORAIX_TOKEN_INFO, prices),
                interest: e.slot
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(BiddingChart);
