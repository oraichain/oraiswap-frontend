import bech32 from 'bech32';
import { cosmosTokens, TokenItemType, tokenMap } from 'config/bridgeTokens';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { TokenInfo } from 'types/token';
import { AssetInfo } from '@oraichain/common-contracts-sdk';
import { TokenInfoResponse } from '@oraichain/oraidex-contracts-sdk/build/OraiswapToken.types';

export const truncDecimals = 6;
export const atomic = 10 ** truncDecimals;

export const checkRegex = (str: string, regex?: RegExp) => {
  const re = regex ?? /^[a-zA-Z\-]{3,12}$/;
  return re.test(str);
};

export const getEvmAddress = (bech32Address: string) => {
  if (!bech32Address) return;
  const decoded = bech32.decode(bech32Address);
  const evmAddress = '0x' + Buffer.from(bech32.fromWords(decoded.words)).toString('hex');
  return evmAddress;
};

export const validateNumber = (amount: number | string): number => {
  if (typeof amount === 'string') return validateNumber(Number(amount));
  if (Number.isNaN(amount) || !Number.isFinite(amount)) return 0;
  return amount;
};

// decimals always >= 6
export const toAmount = (amount: number | string, decimals = 6): bigint => {
  const validatedAmount = validateNumber(amount);
  return BigInt(Math.trunc(validatedAmount * atomic)) * BigInt(10 ** (decimals - truncDecimals));
};

/**
 * Converts a fraction to its equivalent decimal value as a number.
 *
 * @param {bigint} numerator - The numerator of the fraction
 * @param {bigint} denominator - The denominator of the fraction
 * @return {number} - The decimal value equivalent to the input fraction, returned as a number.
 */
export const toDecimal = (numerator: bigint, denominator: bigint): number => {
  if (denominator === BigInt(0)) return 0;
  return toDisplay((numerator * BigInt(10 ** 6)) / denominator, 6);
};

/**
 * Convert the amount to be displayed on the user interface.
 *
 * @param {string|bigint} amount - The amount to be converted.
 * @param {number} sourceDecimals - The number of decimal places in the original `amount`.
 * @param {number} desDecimals - The number of decimal places in the `amount` after conversion.
 * @return {number} The value of `amount` after conversion.
 */
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
  return toDisplay(amount, tokenInfo.decimals) * (prices[tokenInfo.coinGeckoId] ?? 0);
};

export const getTotalUsd = (amounts: AmountDetails, prices: CoinGeckoPrices<string>): number => {
  let usd = 0;
  for (const denom in amounts) {
    const tokenInfo = tokenMap[denom];
    if (!tokenInfo) continue;
    const amount = toDisplay(amounts[denom], tokenInfo.decimals);
    usd += amount * (prices[tokenInfo.coinGeckoId] ?? 0);
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

/**
 * Returns a shortened string by replacing characters in between with '...'.
 * @param str The input string.
 * @param from The position of the character to be kept as-is in the resulting string.
 * @param end The number of characters to be kept as-is at the end of the resulting string.
 * @returns The shortened string, or '-' if the input string is null or undefined.
 */
export const reduceString = (str: string, from: number, end: number) => {
  return str ? str.substring(0, from) + '...' + str.substring(str.length - end) : '-';
};

export const parseBep20Erc20Name = (name: string) => {
  return name.replace(/(BEP20|ERC20)\s+/, '');
};

export const toTokenInfo = (token: TokenItemType, info?: TokenInfoResponse): TokenInfo => {
  const data = (info as any)?.token_info_response ?? info;
  return {
    ...token,
    symbol: token.name,
    verified: !token.contractAddress,
    ...data
  };
};

export const toAssetInfo = (token: TokenInfo): AssetInfo => {
  return token.contractAddress
    ? {
        token: {
          contract_addr: token.contractAddress
        }
      }
    : { native_token: { denom: token.denom } };
};

export const buildMultipleMessages = (mainMsg?: any, ...preMessages: any[]) => {
  try {
    var messages: any[] = mainMsg ? [mainMsg] : [];
    messages.unshift(...preMessages.flat(1));
    messages = messages.map((msg) => {
      return {
        contractAddress: msg.contract,
        handleMsg: msg.msg,
        handleOptions: { funds: msg.sent_funds }
      };
    });
    return messages;
  } catch (error) {
    console.log('error in buildMultipleMessages', error);
  }
};

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
    const packets = events['recv_packet.packet_data'];
    if (!packets) return null;
    let tokens = '';
    for (let packetRaw of packets) {
      const packet = JSON.parse(packetRaw);
      // we look for the true denom information with decimals to process
      // format: {"amount":"100000000000000","denom":"oraib0xA325Ad6D9c92B55A3Fc5aD7e412B1518F96441C0","receiver":"orai...","sender":"oraib..."}
      const receivedToken = cosmosTokens.find((token) => token.denom === packet.denom);
      const displayAmount = toDisplay(packet.amount, receivedToken.decimals);
      tokens = tokens.concat(`${displayAmount} ${receivedToken.name}, `);
    }
    return tokens.substring(0, tokens.length - 2); // remove , due to concat
  }
  return null;
};

export const generateError = (message: string) => {
  return { ex: { message } };
};
