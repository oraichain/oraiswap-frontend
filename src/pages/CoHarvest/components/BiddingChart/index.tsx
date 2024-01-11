import { oraichainTokens, toDisplay } from '@oraichain/oraidex-common';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { getUsd } from 'libs/utils';
import { useGetAllBidPoolInRound } from 'pages/CoHarvest/hooks/useGetBidRound';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import { memo, useState } from 'react';
import ChartColumn from '../ChartColumn';
import { TooltipIconBtn } from '../Tooltip';
import styles from './index.module.scss';

const BiddingChart = (props: { round: number; bidInfo }) => {
  const { round, bidInfo } = props;
  const { data: prices } = useCoinGeckoPrices();
  const totalBidAmount = bidInfo.total_bid_amount;
  const USDC_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'oraidex');
  const amountUsd = getUsd(totalBidAmount, USDC_TOKEN_INFO, prices);

  const ORAIX_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'oraidex');
  const { allBidPoolRound, isLoading, refetchAllBidPoolRound } = useGetAllBidPoolInRound(round);
  const [visible, setVisible] = useState(false);

  const [theme] = useConfigReducer('theme');

  return (
    <div className={styles.biddingChart}>
      <div className={styles.title}>
        <span className={styles.titleLeft}>Bid Placed in Co-harvest</span>
        <div className={styles.titleRight}>
          <div className={styles.subtitle}>
            <span>Total Bid</span>
            <TooltipIconBtn
              placement="auto"
              visible={visible}
              setVisible={setVisible}
              content={
                <div className={`${styles.tooltip} ${styles[theme]}`}>
                  Total amount of ORAIX currently allocated across all Co-Harvest interest levels
                </div>
              }
            />
          </div>
          <div className={styles.balance}>
            <div className={styles.usd}>{formatDisplayUsdt(amountUsd)}</div>
            {'('}
            <div className={styles.token}>{toDisplay(totalBidAmount)} ORAIX</div>
            {')'}
          </div>
        </div>
      </div>

      {/* <LoadingBox loading={isLoading}> */}
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
      {/* </LoadingBox> */}
    </div>
  );
};

export default memo(BiddingChart);
