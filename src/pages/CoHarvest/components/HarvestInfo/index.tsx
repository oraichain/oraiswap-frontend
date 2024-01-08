import { flattenTokens, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as TooltipIcon } from 'assets/icons/icon_tooltip.svg';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { getUsd } from 'libs/utils';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import { memo } from 'react';
import CountDownTime from '../CountDownTime';
import styles from './index.module.scss';

const HarvestInfo = (props: {
  poolValue: string;
  timeRemaining: number;
  percent: number;
  isEnd: boolean;
  round: number;
}) => {
  const { timeRemaining, percent, isEnd, poolValue } = props;
  const { data: prices } = useCoinGeckoPrices();

  const USDC_TOKEN_INFO = flattenTokens.find((e) => e.coinGeckoId === 'usd-coin');
  const amountUsd = getUsd(poolValue, USDC_TOKEN_INFO, prices);

  return (
    <div className={styles.harvestInfo}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={styles.value}>
            <span className={styles.heading}>
              Pool Value
              <TooltipIcon />
            </span>

            <div className={styles.balance}>
              <UsdcIcon />
              {toDisplay(poolValue)} USDC
            </div>
            <div className={styles.usd}>{formatDisplayUsdt(amountUsd)}</div>
          </div>
          <div className={styles.countdown}>
            <CountDownTime timeRemaining={timeRemaining} percent={percent} isEnd={isEnd} />
          </div>
        </div>
        <div className={styles.shadow}></div>
      </div>
    </div>
  );
};

export default memo(HarvestInfo);
