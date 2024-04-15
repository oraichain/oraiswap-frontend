import { validateNumber } from '@oraichain/oraidex-common';

export const toFixedIfNecessary = (value: string, dp: number): number => {
  return +parseFloat(value).toFixed(dp);
};
export const isNegative = (number) => number <= 0;

// add `,` when split thounsand value.
export const numberWithCommas = (
  x: number,
  locales: Intl.LocalesArgument = undefined,
  options: Intl.NumberFormatOptions = {}
) => {
  if (isNegative(x)) return '0';
  return x.toLocaleString(locales, options);
};

export const formatDisplayUsdt = (amount: number | string, dp = 2, prefix = ''): string => {
  const validatedAmount = validateNumber(amount);
  if (validatedAmount < 1) return `${prefix}${toFixedIfNecessary(amount.toString(), 4).toString()}`;

  return `${prefix}${numberWithCommas(toFixedIfNecessary(amount.toString(), dp), undefined, {
    maximumFractionDigits: 6
  })}`;
};

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit'
});

export function formatDateChart(date: Date | number, hour = false, minute = false, second = false) {
  const obj = dateFormatter.formatToJson(date);

  let dateStr = `${obj.day} ${obj.month}`;
  if (hour) dateStr += `${obj.hour}`;
  if (minute) dateStr += `${obj.minute}`;
  if (second) dateStr += `${obj.second}`;
  return dateStr;
}

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
