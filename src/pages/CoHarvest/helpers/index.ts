import { TIMER } from '../constants';

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

export const calcDiffTime = (start: string | Date, end: string | Date) => {
  return new Date(end).getTime() - new Date(start).getTime();
};

export const calcPercent = (start: string | Date, end: string | Date, current: number) => {
  const total = 40000;
  // const total = new Date(end).getTime() - new Date(start).getTime();
  if (current <= 0) return 100;
  return total > 0 ? 100 - (current * 100) / total : 100;
};
