import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { getUsd } from 'libs/utils';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import { MONTHLY_SECOND, ORAIX_TOKEN_INFO, TIMER, USDC_TOKEN_INFO, YEARLY_SECOND } from '../constants';

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

export const calcAPY = (rewardPerSec: string, totalBond: string, prices: CoinGeckoPrices<string>) => {
  if (!totalBond || !Number(totalBond)) return 0;

  const rewardPerSecUsd = getUsd(rewardPerSec, USDC_TOKEN_INFO, prices);
  const totalBondUsd = getUsd(totalBond, ORAIX_TOKEN_INFO, prices);

  return ((Number(rewardPerSecUsd) * YEARLY_SECOND) / Number(totalBondUsd)) * 100;
};

export const calcYearlyReward = (amount: number, apr: number, prices: CoinGeckoPrices<string>) => {
  if (!prices[ORAIX_TOKEN_INFO.coinGeckoId]) return 0;
  return ((amount * apr) / 100) * prices[ORAIX_TOKEN_INFO.coinGeckoId];
};
