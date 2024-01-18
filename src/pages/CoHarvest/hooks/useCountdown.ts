import { useEffect, useRef, useState } from 'react';
import { TIMER } from '../constants';
import { calcDiffTime, calcPercent } from '../helpers';
import { BiddingInfo } from '@oraichain/oraidex-contracts-sdk/build/CoharvestBidPool.types';

export type CountDownType = {
  bidInfo: BiddingInfo;
  onStart: () => void;
  onEnd: () => void;
};

export const useCountdown = ({ bidInfo, onStart, onEnd }: CountDownType) => {
  // // Mock DATA
  // bidInfo['start_time'] = new Date('2024-01-12T11:29:10.691Z').getTime();
  // bidInfo['end_time'] = new Date('2024-01-12T11:30:10.691Z').getTime();

  const [percent, setPercent] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const countdownRef = useRef(null);
  const getTimeDateNow = Date.now();
  const [start, setStart] = useState(bidInfo?.start_time);
  const [end, setEnd] = useState(bidInfo?.end_time);
  const [timeRemaining, setTimeRemaining] = useState(() => calcDiffTime(getTimeDateNow, end));
  const [isStarted, setIsStarted] = useState(() => {
    const isStart = getTimeDateNow >= start;
    return isStart;
  });

  useEffect(() => {
    if (!bidInfo.round) return;
    setStart(bidInfo?.start_time);
    setEnd(bidInfo?.end_time);
    setIsStarted(() => {
      const isStart = getTimeDateNow >= bidInfo?.start_time * TIMER.MILLISECOND;

      if (isStart) {
        onStart();
      }

      return isStart;
    });

    setTimeRemaining(() => calcDiffTime(getTimeDateNow, bidInfo?.end_time * TIMER.MILLISECOND));
    const decrementTime = () => {
      setTimeRemaining((prev) => {
        const newRemain = prev - TIMER.MILLISECOND;
        if (newRemain <= 0) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
          setIsEnd(true);
          onEnd();
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
      onStart();
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
