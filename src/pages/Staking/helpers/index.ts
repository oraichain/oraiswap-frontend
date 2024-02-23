import { toDisplay } from '@oraichain/oraidex-common';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import { MONTHLY_SECOND, MONTHS_ARR, STAKING_PERIOD, TIMER, YEARLY_SECOND } from '../constants';

export const calcDiffTime = (start: string | Date | number, end: string | Date | number) => {
  return new Date(end).getTime() - new Date(start).getTime();
};

export const calcPercent = (
  start: string | Date | number,
  end: string | Date | number,
  totalDate: number = MONTHLY_SECOND
) => {
  const diffTime = calcDiffTime(start, end);
  return (diffTime * 100) / totalDate;
};

export const getDiffDay = (start: string | Date | number, end: string | Date | number) => {
  const diff = calcDiffTime(start, end);
  const dayLeft = Math.ceil(diff / TIMER.MILLISECOND_OF_DAY);

  return dayLeft <= 0 ? 0 : dayLeft;
};

export const formatNumberKMB = (num: number) => {
  if (num >= 1e9) {
    return '$' + (num / 1e9).toFixed(2) + 'B';
  }

  if (num >= 1e6) {
    return '$' + (num / 1e6).toFixed(2) + 'M';
  }

  if (num >= 1e3) {
    return '$' + (num / 1e3).toFixed(2) + 'K';
  }
  return formatDisplayUsdt(num, 2);
};

export const calcAPY = (rewardPerSec: string | number, totalBond: string | number) => {
  if (!totalBond || !Number(totalBond)) return 0;
  return ((Number(rewardPerSec) * YEARLY_SECOND) / Number(totalBond)) * 100;
};
