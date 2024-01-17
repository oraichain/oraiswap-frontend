import { useEffect, useRef, useState } from 'react';
import { TIMER } from '../constants';
import { calcDiffTime, calcPercent } from '../helpers';

export type CountDownType = {
  timeRemaining: number;
  percent: number;
  isEnd: boolean;
  start: Date;
  end: Date;
  isStarted: boolean;
};

export const useCountdown = (bidInfo) => {
  // // FAKE DATA
  // bidInfo['start_time'] = new Date('2024-01-11T10:19:50.691Z').getTime();
  // bidInfo['end_time'] = new Date('01-27-2024').getTime();

  const [percent, setPercent] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const countdownRef = useRef(null);
  const getTimeDateNow = Date.now();
  const [start, setStart] = useState(bidInfo?.start_time);
  const [end, setEnd] = useState(bidInfo?.end_time);
  const [timeRemaining, setTimeRemaining] = useState(() => calcDiffTime(getTimeDateNow, end));
  const [isStarted, setIsStarted] = useState(() => getTimeDateNow >= start);

  useEffect(() => {
    if (!bidInfo.round) return;
    setStart(bidInfo?.start_time);
    setEnd(bidInfo?.end_time);

    setIsStarted(() => getTimeDateNow >= bidInfo?.start_time * TIMER.MILLISECOND);

    setTimeRemaining(() => calcDiffTime(getTimeDateNow, bidInfo?.end_time * TIMER.MILLISECOND));
    const decrementTime = () => {
      setTimeRemaining((prev) => {
        const newRemain = prev - TIMER.MILLISECOND;
        if (newRemain <= 0) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
          setIsEnd(true);
          return 0;
        }
        return newRemain;
      });
    };
    countdownRef.current = setInterval(decrementTime, TIMER.MILLISECOND);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [bidInfo]);

  useEffect(() => {
    if (!bidInfo.round) return;
    const newPercent = calcPercent(start, end, timeRemaining);
    setPercent(() => newPercent);

    if (getTimeDateNow >= bidInfo?.start_time * TIMER.MILLISECOND && !isStarted) {
      setIsStarted(true);
    }
  }, [timeRemaining, start, end, bidInfo]);

  return {
    isStarted,
    timeRemaining,
    percent,
    isEnd,
    start: new Date(start * TIMER.MILLISECOND),
    end: new Date(end * TIMER.MILLISECOND)
  };
};
