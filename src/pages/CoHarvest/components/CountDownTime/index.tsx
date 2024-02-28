import useConfigReducer from 'hooks/useConfigReducer';
import { formatCountdownTime, formatDate, formatUTCDateString, getUTCTime } from 'pages/CoHarvest/helpers';
import { CountDownType, useCountdown } from 'pages/CoHarvest/hooks/useCountdown';
import { useState } from 'react';
import { TooltipIconBtn } from '../Tooltip';
import styles from './index.module.scss';

const CountDownTime = ({ bidInfo, onStart, onEnd, isCurrentRound }: CountDownType & { isCurrentRound: boolean }) => {
  const { timeRemaining, percent, isEnd, start, end, isStarted } = useCountdown({
    bidInfo,
    onStart,
    onEnd
  });
  const { days, hours, minutes, seconds } = formatCountdownTime(timeRemaining);
  const [visible, setVisible] = useState(false);
  const fmtPercent = percent >= 100 ? 0 : percent;
  const [theme] = useConfigReducer('theme');

  const startDateStr = formatDate(start);
  const startTimeStr = getUTCTime(start);

  const endDateStr = formatDate(end);
  const endTimeStr = getUTCTime(end);

  return (
    <div className={styles.countdownWrapper}>
      <div className={styles.title}>
        <span>{isStarted ? 'Round Ending In' : 'Round Start In'}</span>
        {/* <TooltipIcon /> */}
        {!bidInfo?.round ? null : (
          <TooltipIconBtn
            placement="auto"
            visible={visible}
            setVisible={setVisible}
            content={
              <div className={`${styles.tooltip} ${styles[theme]}`}>
                Current round period: {formatUTCDateString(start)} - {formatUTCDateString(end)}
              </div>
            }
          />
        )}
      </div>

      {isStarted ? (
        isCurrentRound ? (
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
        ) : (
          <div className={styles.countdownStart}>
            <span className={styles.startDate}>{endDateStr}</span>
            <span className={styles.startTime}>{endTimeStr}&nbsp;UTC</span>
          </div>
        )
      ) : (
        <div className={styles.countdownStart}>
          <span className={styles.startDate}>{startDateStr}</span>
          <span className={styles.startTime}>{startTimeStr}&nbsp;UTC</span>
        </div>
      )}

      {isStarted && isCurrentRound && (
        <div className={styles.pie}>
          <div
            className={styles.progress}
            style={{
              background: `conic-gradient(#232521 ${fmtPercent}%, #AEE67F ${fmtPercent}%)`
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default CountDownTime;
