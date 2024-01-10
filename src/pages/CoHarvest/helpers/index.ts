import { MONTHS_ARR, TIMER } from '../constants';

export const formatCountdownTime = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / TIMER.MILLISECOND);
  const minutes = Math.floor(seconds / TIMER.SECOND);
  const hours = Math.floor(minutes / TIMER.MINUTE);
  const days = Math.floor(hours / TIMER.HOUR);

  const remainingHours = hours % TIMER.HOUR;
  const remainingMinutes = minutes % TIMER.MINUTE;
  const remainingSeconds = seconds % TIMER.SECOND;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(remainingHours).padStart(2, '0'),
    minutes: String(remainingMinutes).padStart(2, '0'),
    seconds: String(remainingSeconds).padStart(2, '0')
  };
};

export const calcDiffTime = (start: string | Date | number, end: string | Date | number) => {
  return new Date(end).getTime() - new Date(start).getTime();
};

export const calcPercent = (start: number, end: number, current: number) => {
  const total = new Date(end * TIMER.MILLISECOND).getTime() - new Date(start * TIMER.MILLISECOND).getTime();

  if (current <= 0) return 100;
  return total > 0 ? 100 - (current * 100) / total : 100;
};

export function dateFormat(date) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);

  const [month, day, year, time] = formattedDate.split(' ');

  return `${MONTHS_ARR[MONTHS_ARR.indexOf(month)]} ${day} ${year} ${time}`;
}

export function shortenAddress(address: string) {
  return address.substring(0, 8) + '...' + address.substring(address.length - 7, address.length);
}

export const formatUTCDateString = (date) => {
  const toDate = new Date(date);
  const dateUtc = new Date(toDate.toUTCString().slice(0, -4));
  // return dateUtc.toString(); // ignore the timezone
  return new Date(date).toUTCString();
};
