import TokenBalance from 'components/TokenBalance';
import styles from './index.module.scss';
import { ReactComponent as TooltipIcon } from 'assets/icons/icon_tooltip.svg';
import ChartColumn from '../ChartColumn';
import { useGetAllBidPoolInRound } from 'pages/CoHarvest/hooks/useGetBidRound';
import { toDisplay } from '@oraichain/oraidex-common'
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { flattenTokens } from 'config/bridgeTokens';
import { getUsd } from 'libs/utils';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
const BiddingChart = (props: { round: number, bidInfo }) => {
  const { round, bidInfo } = props
  const { data: prices } = useCoinGeckoPrices();
  const totalBidAmount = bidInfo.total_bid_amount;
  const USDC_TOKEN_INFO = flattenTokens.find(e => e.coinGeckoId === "oraidex")
  const amountUsd = getUsd(totalBidAmount, USDC_TOKEN_INFO, prices);
  const { allBidPoolRound, isLoading, refetchAllBidPoolRound } = useGetAllBidPoolInRound(round)
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
            <div className={styles.usd}>
              {formatDisplayUsdt(amountUsd)}
            </div>
            {'('}
            <div className={styles.token}>
              {toDisplay(totalBidAmount)} ORAIX
            </div>
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
                percent: e.premium_rate,
                volume: toDisplay(e.total_bid_amount),
                interest: e.slot
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiddingChart;
