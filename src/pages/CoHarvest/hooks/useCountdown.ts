import { useEffect, useRef, useState } from 'react';
import { TIMER } from '../constants';
import { calcPercent } from '../helpers';

export type CountDownType = {
  timeRemaining: number;
  percent: number;
  isEnd: boolean;
};

export const useCountdown = () => {
  const [percent, setPercent] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(40000); // () => calcDiffTime(start, new Date())
  const [isEnd, setIsEnd] = useState(false);
  const countdownRef = useRef(null);
  const [start, end] = [new Date('12-27-2023'), new Date('12-29-2023')];

  useEffect(() => {
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
    const newPercent = calcPercent(start, end, timeRemaining);
    setPercent(() => newPercent);
  }, [timeRemaining, start, end]);

  return {
    timeRemaining,
    percent,
    isEnd
  };
};
