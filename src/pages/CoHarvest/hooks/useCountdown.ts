import { Stargate } from '@injectivelabs/sdk-ts';
import { useEffect, useRef, useState } from 'react';
import { TIMER } from '../constants';
import { calcDiffTime, calcPercent } from '../helpers';

export type CountDownType = {
  timeRemaining: number;
  percent: number;
  isEnd: boolean;
};

export const useCountdown = (bidInfo) => {
  const [percent, setPercent] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const countdownRef = useRef(null);
  // const [start, end] = [new Date(Date.now()), new Date(bidInfo.end_time)];

  const [start, setStart] = useState(bidInfo?.start_time);
  const [end, setEnd] = useState(bidInfo?.end_time);
  const [timeRemaining, setTimeRemaining] = useState(() => calcDiffTime(new Date().getTime(), end));

  useEffect(() => {
    if (!bidInfo.round) return;
    setStart(bidInfo?.start_time);
    setEnd(bidInfo?.end_time);
    // when bidInfo round === 0 => time is in milliseconds and when round != 0 time is in seconds
    setTimeRemaining(() => calcDiffTime(new Date().getTime(), bidInfo?.end_time * TIMER.MILLISECOND));

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
  }, [timeRemaining, start, end, bidInfo]);

  return {
    timeRemaining,
    percent,
    isEnd
  };
};
