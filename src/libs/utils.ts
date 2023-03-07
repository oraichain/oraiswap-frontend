import bech32 from 'bech32';
import { filteredTokens, TokenItemType, tokenMap } from 'config/bridgeTokens';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { TokenInfo } from 'types/token';
import { TokenInfoResponse } from './contracts/OraiswapToken.types';

const truncDecimals = 6;
const atomic = 10 ** truncDecimals;

export const getEvmAddress = (bech32Address: string) => {
  if (!bech32Address) return;
  const decoded = bech32.decode(bech32Address);
  const evmAddress = '0x' + Buffer.from(bech32.fromWords(decoded.words)).toString('hex');
  return evmAddress;
};

export const validateNumber = (amount: number | string): number => {
  if (typeof amount === 'string') return Number(amount);
  if (Number.isNaN(amount) || !Number.isFinite(amount)) return 0;
  return amount;
};

// decimals always >= 6
export const toAmount = (amount: number, decimals = 6): bigint => {
  const validatedAmount = validateNumber(amount);
  return BigInt(Math.trunc(validatedAmount * atomic)) * BigInt(10 ** (decimals - truncDecimals));
};

export const toDecimal = (numerator: bigint, denominator: bigint): number => {
  if (denominator === BigInt(0)) return 0;
  return toDisplay((numerator * BigInt(atomic)) / denominator, truncDecimals);
};

export const toDisplay = (amount: string | bigint, sourceDecimals = 6, desDecimals = 6): number => {
  if (!amount) return 0;
  // guarding conditions to prevent crashing
  const validatedAmount = typeof amount === 'string' ? BigInt(amount || '0') : amount;
  const displayDecimals = Math.min(truncDecimals, desDecimals);
  const returnAmount = validatedAmount / BigInt(10 ** (sourceDecimals - displayDecimals));
  // save calculation by using cached atomic
  return Number(returnAmount) / (displayDecimals === truncDecimals ? atomic : 10 ** displayDecimals);
};

export const getUsd = (amount: string | bigint, tokenInfo: TokenItemType, prices: CoinGeckoPrices<string>): number => {
  return toDisplay(amount, tokenInfo.decimals) * (prices[tokenInfo.coingeckoId] ?? 0);
};

export const getTotalUsd = (amounts: AmountDetails, prices: CoinGeckoPrices<string>): number => {
  let usd = 0;
  for (const denom in amounts) {
    const tokenInfo = tokenMap[denom];
    if (!tokenInfo) continue;
    const amount = toDisplay(amounts[denom], tokenInfo.decimals);
    usd += amount * (prices[tokenInfo.coingeckoId] ?? 0);
  }
  return usd;
};

export const getSubAmountDetails = (amounts: AmountDetails, tokenInfo: TokenItemType): AmountDetails => {
  if (!tokenInfo.evmDenoms) return {};
  return Object.fromEntries(
    tokenInfo.evmDenoms.map((denom) => {
      return [denom, amounts[denom]];
    })
  );
};

export const toSubDisplay = (amounts: AmountDetails, tokenInfo: TokenItemType): number => {
  const subAmounts = getSubAmountDetails(amounts, tokenInfo);
  return toSumDisplay(subAmounts);
};

export const toTotalDisplay = (amounts: AmountDetails, tokenInfo: TokenItemType): number => {
  return toDisplay(amounts[tokenInfo.denom], tokenInfo.decimals) + toSubDisplay(amounts, tokenInfo);
};

export const toSubAmount = (amounts: AmountDetails, tokenInfo: TokenItemType): bigint => {
  const displayAmount = toSubDisplay(amounts, tokenInfo);
  return toAmount(displayAmount, tokenInfo.decimals);
};

export const toSumDisplay = (amounts: AmountDetails): number => {
  // get all native balances that are from oraibridge (ibc/...)
  let amount = 0;

  for (const denom in amounts) {
    // update later
    const balance = amounts[denom];
    if (!balance) continue;
    amount += toDisplay(balance, tokenMap[denom].decimals);
  }
  return amount;
};

export const reduceString = (str: string, from: number, end: number) => {
  return str ? str.substring(0, from) + '...' + str.substring(str.length - end) : '-';
};

export const parseBep20Erc20Name = (name: string) => {
  return name.replace(/(BEP20|ERC20)\s+/, '');
};

export const toTokenInfo = (tokenSwap: TokenItemType, info?: TokenInfoResponse): TokenInfo => {
  const data = info?.token_info_response ?? info;
  return {
    ...tokenSwap,
    symbol: tokenSwap.name,
    verified: !tokenSwap.contractAddress,
    ...data
  };
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

export const delay = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

const cache = {};

export function clearFunctionExecution(...keys: (Function | string)[]) {
  for (const methodOrKey of keys) {
    if (!methodOrKey) continue;
    const key = typeof methodOrKey === 'string' ? methodOrKey : methodOrKey.name;
    delete cache[key];
  }
}

export async function getFunctionExecution(
  method: Function,
  args: any[] = [],
  cacheKey: string = null,
  expiredIn = 60000
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
  if (cache[key]) {
    cache[key].pending = false;
    cache[key].value = value;
  }
  return value;
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

export const detectBestDecimalsDisplay = (price, minDecimal = 2, minPrice = 1, maxDecimal) => {
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
  const priceFormat = formateNumberDecimals(price, detectBestDecimalsDisplay(price, minDecimal, minPrice, maxDecimal));
  const res = unitPosition === 'prefix' ? unit + priceFormat : priceFormat + unit;
  return res;
};

export const buildWebsocketSendMessage = (message: string, id = 1) => {
  return {
    jsonrpc: '2.0',
    method: 'subscribe',
    params: [`tm.event='Tx' AND ${message}`],
    id
  };
};

export const buildUnsubscribeMessage = () => {
  return {
    jsonrpc: '2.0',
    method: 'unsubscribe_all',
    params: [],
    id: 99
  };
};

export const processWsResponseMsg = (message: any): string => {
  if (message === null || message.result === null) {
    return null;
  }
  const { result } = message;
  if (
    result && // 👈 null and undefined check
    (Object.keys(result).length !== 0 || result.constructor !== Object)
  ) {
    if (!result.events) return null;
    const events = result.events;
    console.log('events: ', events);
    // TODO: process multiple tokens at once if there are multiple recvpacket messages
    const packets = events['recv_packet.packet_data'];
    if (!packets) return null;
    let tokens = '';
    for (let packetRaw of packets) {
      const packet = JSON.parse(packetRaw);
      // we look for the true denom information with decimals to process
      // format: {"amount":"100000000000000","denom":"oraib0xA325Ad6D9c92B55A3Fc5aD7e412B1518F96441C0","receiver":"orai...","sender":"oraib..."}
      const receivedToken = filteredTokens.find((token) => token.denom === packet.denom);
      const displayAmount = toDisplay(packet.amount, receivedToken.decimals);
      tokens = tokens.concat(`${displayAmount} ${receivedToken.name}, `);
    }
    return tokens.substring(0, tokens.length - 2); // remove , due to concat
  }
  return null;
};
