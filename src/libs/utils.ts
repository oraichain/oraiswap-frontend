import { is } from 'ramda';
import bech32 from 'bech32';

/* object */
export const record = <T, V>(
  object: T,
  value: V,
  skip?: (keyof T)[]
): Record<keyof T, V> =>
  Object.keys(object).reduce(
    (acc, cur) =>
      Object.assign({}, acc, {
        [cur]: skip?.includes(cur as keyof T) ? object[cur as keyof T] : value
      }),
    {} as Record<keyof T, V>
  );

export const omitEmpty = (object: object): object =>
  Object.entries(object).reduce((acc, [key, value]) => {
    const next = is(Object, value) ? omitEmpty(value) : value;
    return Object.assign({}, acc, value && { [key]: next });
  }, {});

/* array */
export const insertIf = <T>(condition?: any, ...elements: T[]) =>
  condition ? elements : [];

/* string */
export const getLength = (text: string) => new Blob([text]).size;
export const capitalize = (text: string) =>
  text[0].toUpperCase() + text.slice(1);

export const checkPrefixAndLength = (
  prefix: string,
  data: string,
  length: number
): boolean => {
  try {
    const vals = bech32.decode(data);
    return vals.prefix === prefix && data.length == length;
  } catch (e) {
    return false;
  }
};

export const getEvmAddress = (bech32Address: string) => {
  const decoded = bech32.decode(bech32Address);
  const evmAddress =
    '0x' + Buffer.from(bech32.fromWords(decoded.words)).toString('hex');
  return evmAddress;
};

export const validateNumber = (amount: number): number => {
  if (Number.isNaN(amount) || !Number.isFinite(amount)) return 0;
  return amount;
};
export const toAmount = (amount: number, decimals: number): BigInt => {
  const validatedAmount = validateNumber(amount);
  return BigInt(Math.round(validatedAmount * 10 ** decimals));
};

export const toDisplay = (
  amount: number | string | BigInt,
  sourceDecimals = 6,
  desDecimals = 6
): number => {
  // guarding conditions to prevent crashing
  const validatedAmount = validateNumber(Number(amount));
  const returnAmount = validatedAmount / 10 ** sourceDecimals;
  return Number(returnAmount.toFixed(desDecimals));
};

export const reduceString = (str: string, from: number, end: number) => {
  return str
    ? str.substring(0, from) + '...' + str.substring(str.length - end)
    : '-';
};

export const parseBep20Erc20Name = (name: string) => {
  return name.replace(/(BEP20|ERC20)\s+/, '');
};

export const buildMultipleMessages = (mainMsg?: any, ...preMessages: any[]) => {
  var messages: any[] = mainMsg ? [mainMsg] : [];
  messages.unshift(...preMessages.flat(1));
  messages = messages.map((msg) => ({
    contractAddress: msg.contract,
    handleMsg: msg.msg.toString(),
    handleOptions: { funds: msg.sent_funds }
  }));
  return messages;
};

export const formatCash = (n: number) => {
  if (n < 1e3) return n.toFixed(2);
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
};

export const delay = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

let cache = {};
export async function getFunctionExecution(
  method: Function,
  args: any[] = [],
  cacheKey: string = null,
  expiredIn = 10000
) {
  const key = cacheKey || method.name;
  if (cache[key] !== undefined) {
    while (cache[key].pending) {
      await delay(500);
      if (!cache[key]) return undefined;
    }
    return cache[key].value;
  }

  cache[key] = { expired: Date.now() + expiredIn, pending: true };
  const value = await method(...args);
  cache[key].pending = false;
  cache[key].value = value;

  return cache[key].value;
}

// Interval to clear cache;
setInterval(function () {
  if (Object.keys(cache).length > 0) {
    let currentTime = Date.now();
    Object.keys(cache).forEach((key) => {
      if (currentTime > cache[key].expired) {
        delete cache[key];
        // console.log(`${key}'s cache deleted`);
      }
    });
  }
}, 1000);

export const formateNumberDecimals = (price, decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: decimals
  }).format(price);
};

export const detectBestDecimalsDisplay = (
  price,
  minDecimal = 2,
  minPrice = 1,
  maxDecimal
) => {
  if (price && price > minPrice) return minDecimal;
  let decimals = minDecimal;
  if (price !== undefined) {
    // Find out the number of leading floating zeros via regex
    const priceSplit = price?.toString().split('.');
    if (priceSplit?.length === 2 && priceSplit[0] === '0') {
      const leadingZeros = priceSplit[1].match(/^0+/);
      decimals += leadingZeros ? leadingZeros[0]?.length + 1 : 1;
    }
  }
  if (maxDecimal && decimals > maxDecimal) decimals = maxDecimal;
  return decimals;
};

interface FormatNumberDecimal {
  price: number;
  maxDecimal?: number;
  unit?: string;
  minDecimal?: number;
  minPrice?: number;
  unitPosition?: 'prefix' | 'suffix';
}

export const formateNumberDecimalsAuto = ({
  price,
  maxDecimal,
  unit,
  minDecimal,
  minPrice,
  unitPosition
}: FormatNumberDecimal) => {
  minDecimal = minDecimal ? minDecimal : 2;
  minPrice = minPrice ? minPrice : 1;
  unit = unit ? unit : '';
  const priceFormat = formateNumberDecimals(
    price,
    detectBestDecimalsDisplay(price, minDecimal, minPrice, maxDecimal)
  );
  const res =
    unitPosition === 'prefix' ? unit + priceFormat : priceFormat + unit;
  return res;
};
