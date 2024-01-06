import { ReactComponent as TooltipIcon } from 'assets/icons/icon_tooltip.svg';
import { formatCountdownTime } from 'pages/CoHarvest/helpers';
import { CountDownType } from 'pages/CoHarvest/hooks/useCountdown';
import styles from './index.module.scss';

const CountDownTime = ({ timeRemaining, percent, isEnd }: CountDownType) => {
  const { days, hours, minutes, seconds } = formatCountdownTime(timeRemaining);
  const fmtPercent = percent >= 100 ? 0 : percent;

  return (
    <div className={styles.countdownWrapper}>
      <div className={styles.title}>
        <span>Co-Harvest Ending In</span>
        <TooltipIcon />
      </div>
      <div className={styles.countdown}>
        <div className={styles.unit}>
          <span>{days}</span>
          <span className={styles.symbol}>Days</span>
        </div>

        <div className={styles.unit}>
          <span>{hours}</span>
          <span className={styles.symbol}>Hours</span>
        </div>

        <div className={styles.unit}>
          <span>{minutes}</span>
          <span className={styles.symbol}>Minutes</span>
        </div>
        <div className={styles.unit}>
          <span>{seconds}</span>
          <span className={styles.symbol}>Seconds</span>
        </div>
      </div>
      <div className={styles.pie}>
        <div
          className={styles.progress}
          style={{
            background: `conic-gradient(#232521 ${fmtPercent}%, #AEE67F ${fmtPercent}%)`
          }}
        ></div>
      </div>
    </div>
  );
};

export default CountDownTime;
