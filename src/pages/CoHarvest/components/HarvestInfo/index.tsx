import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { ReactComponent as TooltipIcon } from 'assets/icons/icon_tooltip.svg';
import styles from './index.module.scss';
import TokenBalance from 'components/TokenBalance';
import CountDownTime from '../CountDownTime';
import { CountDownType } from 'pages/CoHarvest/hooks/useCountdown';

const HarvestInfo = (props: CountDownType) => {
  const { timeRemaining, percent, isEnd } = props;
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
              <TokenBalance
                balance={{
                  amount: '25495320000',
                  denom: 'USDC',
                  decimals: 6
                }}
                className={styles.token}
              />
            </div>
            <TokenBalance balance={25495.32} className={styles.usd} />
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

export default HarvestInfo;
