import { oraichainTokens, toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { getUsd } from 'libs/utils';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { memo, useState } from 'react';
import CountDownTime from '../CountDownTime';
import { TooltipIconBtn } from '../Tooltip';
import styles from './index.module.scss';
import { BiddingInfo } from '@oraichain/oraidex-contracts-sdk/build/CoharvestBidPool.types';

const HarvestInfo = (props: { poolValue: string; onEnd: () => void; onStart: () => void; bidInfo: BiddingInfo }) => {
  const { poolValue, onEnd, onStart, bidInfo } = props;
  const { data: prices } = useCoinGeckoPrices();
  const [visible, setVisible] = useState(false);
  const [theme] = useConfigReducer('theme');

  const USDC_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'usd-coin');
  const amountUsd = getUsd(poolValue, USDC_TOKEN_INFO, prices);

  return (
    <div className={styles.harvestInfo}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={styles.value}>
            <span className={styles.heading}>
              Pool Value
              <TooltipIconBtn
                placement="auto"
                visible={visible}
                setVisible={setVisible}
                content={
                  <div className={`${styles.tooltip} ${styles[theme]}`}>
                    Reward pool: 40% of all fees generated via OraiBridge, Order Book, and Futures trading are deposited
                    into the pool in USDC
                  </div>
                }
              />
            </span>

            <div className={styles.balance}>
              <UsdcIcon />
              {numberWithCommas(toDisplay(poolValue))} USDC
            </div>
            <div className={styles.usd}>{formatDisplayUsdt(amountUsd)}</div>
          </div>
          <div className={styles.countdown}>
            <CountDownTime bidInfo={bidInfo} onEnd={onEnd} onStart={onStart} />
          </div>
        </div>
        <div className={styles.shadow}></div>
      </div>
    </div>
  );
};

export default memo(HarvestInfo);
