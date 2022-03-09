import moment from 'dayjs';
import B from 'big.js';
import each from 'lodash-es/each';
import isFinite from 'lodash-es/isFinite';
import isNumber from 'lodash-es/isNumber';
import empty from 'is-empty';
import { memoize } from 'lodash-es';
import toString from 'lodash-es/toString';
import capitalize from 'lodash-es/capitalize';
import isString from 'lodash-es/isString';
import lowerCase from 'lodash-es/lowerCase';
import isNil from 'lodash-es/isNil';
import duration from 'dayjs/plugin/duration';

moment.extend(duration);

B.NE = -10;
B.PE = 100;

//  for high accuracy
const DEFAULT_PLACES = 20;

export type TBigInput = number | string;

//  necessary for decimal precision due to javascript being javascript.
//  ofc.
export const big = (input: TBigInput) => {
  const ret = new B(input);
  return ret ? ret : new B('0');
};

export const mod = (input1: TBigInput, input2: TBigInput) => {
  try {
    return new B(input1).mod(new B(input2)).toFixed(0);
  } catch (ex) {
    console.warn('mod error', input1, input2);
    return '1';
  }
};

export const fixed = (input: TBigInput, places: number): string => {
  try {
    return new B(input).toFixed(isNumber(places) ? places : 2);
  } catch (ex) {
    return fixed(0, 2);
  }
};

export const gte = (input1: TBigInput, input2: TBigInput): boolean => {
  return new B(empty(input1) ? 0 : input1).gte(
    new B(empty(input2) ? 0 : input2)
  );
};

export const gt = (input1: TBigInput, input2: TBigInput): boolean => {
  return new B(empty(input1) ? 0 : input1).gt(
    new B(empty(input2) ? 0 : input2)
  );
};

export const add = (
  input1: TBigInput,
  input2: TBigInput,
  places = DEFAULT_PLACES
): string => {
  try {
    return new B(empty(input1) ? 0 : input1)
      .plus(empty(input2) ? 0 : input2)
      .toFixed(places);
  } catch (ex) {
    // console.warn(`Big error ${input1} * ${input2}`, ex.message);
    return '0';
  }
};

export const sumArray = (
  inputArray: TBigInput[],
  places = DEFAULT_PLACES
): string => {
  let sum = '0';
  each(inputArray, (v) => {
    sum = add(sum, v, places);
  });
  return sum;
};

export const minus = (
  input1: TBigInput,
  input2: TBigInput,
  places = DEFAULT_PLACES
) => {
  try {
    return new B(input1).minus(input2).toFixed(places);
  } catch (ex) {
    // console.warn(`Big error ${input1} * ${input2}`, ex.message);
    return '0';
  }
};

export const multiply = (
  input1: TBigInput,
  input2: TBigInput,
  places = DEFAULT_PLACES
) => {
  try {
    return new B(input1).times(input2).toFixed(places);
  } catch (ex) {
    console.warn(`Big error ${input1} * ${input2}`, ex.message);
    return '0';
  }
};

export const divide = (
  input1: TBigInput,
  input2: TBigInput,
  places = DEFAULT_PLACES
) => {
  try {
    if (isZero(input2)) return 'NaN';
    else if (!isFinite(Number(input2)) || !isFinite(Number(input1)))
      return 'NaN';
    return new B(input1).div(input2).toFixed(places);
  } catch (ex) {
    console.warn(`Big error ${input1} / ${input2}`, ex.message);
    return '0';
  }
};

const isZero = (v: unknown) => Number(v) === 0;

export const isAlphanumeric = (input: string): boolean => {
  return /^[a-z0-9]+$/i.test(input);
};

export const setAmountStyle = (
  amount: TBigInput,
  sizeInt: number,
  sizeDecimal: number
) => {
  const amountArr = formatNumber(amount).split('.');
  return {
    __html: `<span style="font-size:${sizeInt}px;">${amountArr[0]}${
      amountArr[1] ? '.' : ''
    }</span>${
      amountArr[1]
        ? `<span style="font-size:${sizeDecimal}px;">${amountArr[1]}</span>`
        : ''
    }`
  };
};

export const formatNumber = (v: TBigInput): string => {
  const str = toString(v);
  if (empty(str)) return 'NaN';
  return formatNum(str);
};

export const applyOptionalDecimal = (v: string): string => {
  if (Number(v.split('.')?.[1]) === 0) return fixed(v, 0);
  return v;
};

export const formatUSD = (v: TBigInput): string => {
  const str = toString(v);
  if (empty(str) || !isNumber(str)) return 'NaN';
  return `$${formatNum(fixed(str, 2))}`;
};

const formatNum = (str: string): string => {
  const n = str,
    p = n.indexOf('.');
  return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
    p < 0 || i < p ? `${m},` : m
  );
};

export const getDuration = (unix: TBigInput) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return moment.duration(unix);
};

export const get12hrTime = (unix: TBigInput): string => {
  return moment(unix).format('hh:mm:ss A');
};

export const get24hrTime = (unix: TBigInput): string => {
  return moment(unix).format('HH:mm:ss');
};

export const toNormalCase = (str: string): string => capitalize(lowerCase(str));

export const truncateString = (str: string, front: number, back: number) =>
  `${str.substr(0, front)}...${str.substr(str.length - back, str.length)}`;

export const commaizeNumber = memoize((value: string | number) => {
  return String(value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
});
