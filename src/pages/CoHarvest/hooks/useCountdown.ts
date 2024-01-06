import { useEffect, useRef, useState } from 'react';
import { TIMER } from '../constants';
import { calcPercent } from '../helpers';

export type CountDownType = {
  timeRemaining: number;
  percent: number;
  isEnd: boolean;
};

export const useCountdown = (bidInfo) => {
  const [percent, setPercent] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(129832); // () => calcDiffTime(start, new Date())
  const [isEnd, setIsEnd] = useState(false);
  const countdownRef = useRef(null);
  // const [start, end] = [new Date(Date.now()), new Date(bidInfo.end_time)];
  const [start, end] = [new Date('01-05-2024'), new Date('01-07-2024')];
  useEffect(() => {
    if (!bidInfo.round) return;
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
  }, []);

  useEffect(() => {
    if (!bidInfo.round) return;
    const newPercent = calcPercent(start, end, timeRemaining);
    setPercent(() => newPercent);
  }, [timeRemaining, start, end]);

  return {
    timeRemaining,
    percent,
    isEnd
  };
};
