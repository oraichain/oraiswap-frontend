import { Coin } from '@cosmjs/proto-signing';
import { PoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { oraichainTokens } from 'config/bridgeTokens';
import SingletonOraiswapV3 from 'libs/contractSingleton';
import { PRICE_SCALE, printBigint } from '../components/PriceRangePlot/utils';
import {
  AmountDeltaResult,
  Pool,
  Position,
  Tick,
  TokenAmounts,
  calculateAmountDelta,
  calculateSqrtPrice,
  getPercentageDenominator,
  getSqrtPriceDenominator,
  getTickAtSqrtPrice,
  calculateFee as wasmCalculateFee
} from '../packages/wasm/oraiswap_v3_wasm';
import { getIconPoolData } from './format';
import { network } from 'config/networks';
import { SwapHop } from '../packages/sdk/OraiswapV3.types';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { CoinGeckoId } from '@oraichain/oraidex-common/build/network';
// export const PERCENTAGE_SCALE = Number(getPercentageScale());
export interface InitPositionData {
  poolKeyData: PoolKey;
  lowerTick: number;
  upperTick: number;
  liquidityDelta: bigint;
  spotSqrtPrice: bigint;
  slippageTolerance: bigint;
  tokenXAmount: bigint;
  tokenYAmount: bigint;
  initPool?: boolean;
}

export const PERCENTAGE_SCALE = 12;
export interface FormatNumberThreshold {
  value: number;
  decimals: number;
  divider?: number;
}

export const defaultThresholds: FormatNumberThreshold[] = [
  {
    value: 10,
    decimals: 4
  },
  {
    value: 1000,
    decimals: 2
  },
  {
    value: 10000,
    decimals: 1
  },
  {
    value: 1000000,
    decimals: 2,
    divider: 1000
  },
  {
    value: 1000000000,
    decimals: 2,
    divider: 1000000
  },
  {
    value: Infinity,
    decimals: 2,
    divider: 1000000000
  }
];

export interface PrefixConfig {
  B?: number;
  M?: number;
  K?: number;
}

const defaultPrefixConfig: PrefixConfig = {
  B: 1000000000,
  M: 1000000,
  K: 10000
};

export const formatNumbers =
  (thresholds: FormatNumberThreshold[] = defaultThresholds) =>
  (value: string) => {
    const num = Number(value);
    const abs = Math.abs(num);
    const threshold = thresholds.sort((a, b) => a.value - b.value).find((thr) => abs < thr.value);

    const formatted = threshold ? (abs / (threshold.divider ?? 1)).toFixed(threshold.decimals) : value;

    return num < 0 && threshold ? '-' + formatted : formatted;
  };

export const showPrefix = (nr: number, config: PrefixConfig = defaultPrefixConfig): string => {
  const abs = Math.abs(nr);

  if (typeof config.B !== 'undefined' && abs >= config.B) {
    return 'B';
  }

  if (typeof config.M !== 'undefined' && abs >= config.M) {
    return 'M';
  }

  if (typeof config.K !== 'undefined' && abs >= config.K) {
    return 'K';
  }

  return '';
};

export const initialXtoY = (tokenXAddress?: string, tokenYAddress?: string) => {
  if (!tokenXAddress || !tokenYAddress) {
    return true;
  }

  const isTokeXStablecoin = [].includes(tokenXAddress);
  const isTokenYStablecoin = [].includes(tokenYAddress);

  return isTokeXStablecoin === isTokenYStablecoin || (!isTokeXStablecoin && !isTokenYStablecoin);
};

export const tickerToAddress = (ticker: string): string => {
  return addressTickerMap[ticker] || ticker;
};

export const TokenList = oraichainTokens.reduce((acc, cur) => {
  return {
    ...acc,
    [cur.name]: cur.contractAddress ?? cur.denom
  };
}, {});

export const addressTickerMap: { [key: string]: string } = TokenList;

export const calcYPerXPriceByTickIndex = (tickIndex: number, xDecimal: number, yDecimal: number): number => {
  const sqrt = +printBigint(calculateSqrtPrice(tickIndex), PRICE_SCALE);

  const proportion = sqrt * sqrt;

  return proportion / 10 ** (yDecimal - xDecimal);
};

export const calcYPerXPriceBySqrtPrice = (sqrtPrice: bigint, xDecimal: number, yDecimal: number): number => {
  const sqrt = +printBigint(sqrtPrice, PRICE_SCALE);

  const proportion = sqrt * sqrt;

  return proportion / 10 ** (yDecimal - xDecimal);
};

export const calculateTokenAmounts = (pool: Pool, position: Position): AmountDeltaResult => {
  return _calculateTokenAmounts(pool, position, false);
};

export const _calculateTokenAmounts = (pool: Pool, position: Position, sign: boolean): AmountDeltaResult => {
  return calculateAmountDelta(
    pool.current_tick_index,
    BigInt(pool.sqrt_price),
    BigInt(position.liquidity),
    sign,
    position.upper_tick_index,
    position.lower_tick_index
  );
};

export const calculateFee = (pool: Pool, position: Position, lowerTick: Tick, upperTick: Tick): TokenAmounts => {
  return wasmCalculateFee(
    lowerTick.index,
    BigInt(lowerTick.fee_growth_outside_x),
    BigInt(lowerTick.fee_growth_outside_y),
    upperTick.index,
    BigInt(upperTick.fee_growth_outside_x),
    BigInt(upperTick.fee_growth_outside_y),
    pool.current_tick_index,
    BigInt(pool.fee_growth_global_x),
    BigInt(pool.fee_growth_global_y),
    BigInt(position.fee_growth_inside_x),
    BigInt(position.fee_growth_inside_y),
    BigInt(position.liquidity)
  );
};

export const getTick = (tickData) => {
  return {
    fee_growth_outside_x: tickData.fee_growth_outside_x,
    fee_growth_outside_y: BigInt(tickData.fee_growth_outside_y),
    index: tickData.index,
    liquidity_change: BigInt(tickData.liquidity_change),
    sign: tickData.sign,
    liquidity_gross: BigInt(tickData.liquidity_gross),
    seconds_outside: tickData.seconds_outside,
    sqrt_price: BigInt(tickData.sqrt_price)
  };
};

export const getConvertedPool = (positions) => {
  return {
    liquidity: BigInt(positions.poolData.pool.liquidity),
    sqrt_price: BigInt(positions.poolData.pool.sqrt_price),
    current_tick_index: positions.poolData.pool.current_tick_index,
    fee_growth_global_x: BigInt(positions.poolData.pool.fee_growth_global_x),
    fee_growth_global_y: BigInt(positions.poolData.pool.fee_growth_global_y),
    fee_protocol_token_x: BigInt(positions.poolData.pool.fee_protocol_token_x),
    fee_protocol_token_y: BigInt(positions.poolData.pool.fee_protocol_token_y),
    start_timestamp: positions.poolData.pool.start_timestamp,
    last_timestamp: positions.poolData.pool.last_timestamp,
    fee_receiver: positions.poolData.pool.fee_receiver
  };
};

export const getConvertedPosition = (position) => {
  return {
    fee_growth_inside_x: position.fee_growth_inside_x,
    fee_growth_inside_y: position.fee_growth_inside_y,
    last_block_number: position.last_block_number,
    liquidity: BigInt(position.liquidity),
    lower_tick_index: position.lower_tick_index,
    tokens_owed_x: BigInt(position.tokens_owed_x),
    tokens_owed_y: BigInt(position.tokens_owed_y),
    upper_tick_index: position.upper_tick_index,
    pool_key: position.pool_key
  };
};

export const createLoaderKey = () => (new Date().getMilliseconds() + Math.random()).toString();

export const isNativeToken = (token: string): boolean => {
  return token === 'orai' || token.includes('ibc');
};

const newtonIteration = (n: bigint, x0: bigint): bigint => {
  const x1 = (n / x0 + x0) >> 1n;
  if (x0 === x1 || x0 === x1 - 1n) {
    return x0;
  }
  return newtonIteration(n, x1);
};

const sqrt = (value: bigint): bigint => {
  if (value < 0n) {
    throw 'square root of negative numbers is not supported';
  }

  if (value < 2n) {
    return value;
  }

  return newtonIteration(value, 1n);
};
export const sqrtPriceToPrice = (sqrtPrice: bigint): bigint => {
  return (BigInt(sqrtPrice) * BigInt(sqrtPrice)) / getSqrtPriceDenominator();
};

export const priceToSqrtPrice = (price: bigint): bigint => {
  return sqrt(price * getSqrtPriceDenominator());
};

export const calculateSqrtPriceAfterSlippage = (sqrtPrice: bigint, slippage: number, up: boolean): bigint => {
  if (slippage === 0) {
    return BigInt(sqrtPrice);
  }

  const multiplier = getPercentageDenominator() + BigInt(up ? slippage : -slippage);
  const price = sqrtPriceToPrice(sqrtPrice);
  const priceWithSlippage = BigInt(price) * multiplier * getPercentageDenominator();
  const sqrtPriceWithSlippage = priceToSqrtPrice(priceWithSlippage) / getPercentageDenominator();
  return sqrtPriceWithSlippage;
};

export const calculateTokenAmountsWithSlippage = (
  tickSpacing: number,
  currentSqrtPrice: bigint,
  liquidity: bigint,
  lowerTickIndex: number,
  upperTickIndex: number,
  slippage: number,
  roundingUp: boolean
): [bigint, bigint] => {
  const lowerBound = calculateSqrtPriceAfterSlippage(currentSqrtPrice, slippage, false);
  const upperBound = calculateSqrtPriceAfterSlippage(currentSqrtPrice, slippage, true);

  const currentTickIndex = getTickAtSqrtPrice(currentSqrtPrice, tickSpacing);

  const { x: lowerX, y: lowerY } = calculateAmountDelta(
    currentTickIndex,
    lowerBound,
    liquidity,
    roundingUp,
    upperTickIndex,
    lowerTickIndex
  );

  const { x: upperX, y: upperY } = calculateAmountDelta(
    currentTickIndex,
    upperBound,
    liquidity,
    roundingUp,
    upperTickIndex,
    lowerTickIndex
  );

  const x = lowerX > upperX ? lowerX : upperX;
  const y = lowerY > upperY ? lowerY : upperY;
  return [x, y];
};

export const approveToken = async (token: string, amount: bigint, address: string): Promise<string> => {
  if (isNativeToken(token)) {
    return '';
  }

  const result = await SingletonOraiswapV3.approveToken(token, amount, address);
  return result.transactionHash;
};

export const approveListToken = async (msg: any, address: string): Promise<string> => {
  const result = await SingletonOraiswapV3.dex.client.executeMultiple(address, msg, 'auto');
  return result.transactionHash;
};

export const genMsgAllowance = (datas: string[]) => {
  const MAX_ALLOWANCE_AMOUNT = '18446744073709551615';
  const spender = network.pool_v3;

  return datas.map((data) => ({
    contractAddress: data,
    msg: {
      increase_allowance: {
        amount: MAX_ALLOWANCE_AMOUNT,
        spender
      }
    }
  }));
};

export const createPoolTx = async (poolKey: PoolKey, initSqrtPrice: string, address: string): Promise<string> => {
  const initTick = getTickAtSqrtPrice(BigInt(initSqrtPrice), poolKey.fee_tier.tick_spacing);
  if (SingletonOraiswapV3.dex.sender !== address) {
    SingletonOraiswapV3.load(SingletonOraiswapV3.dex.client, address);
  }
  return (
    await SingletonOraiswapV3.dex.createPool({
      feeTier: poolKey.fee_tier,
      initSqrtPrice,
      initTick,
      token0: poolKey.token_x,
      token1: poolKey.token_y
    })
  ).transactionHash;
};

export const createPositionTx = async (
  poolKey: PoolKey,
  lowerTick: number,
  upperTick: number,
  liquidityDelta: bigint,
  spotSqrtPrice: bigint,
  slippageTolerance: bigint,
  address: string
): Promise<string> => {
  const slippageLimitLower = calculateSqrtPriceAfterSlippage(spotSqrtPrice, Number(slippageTolerance), false);
  const slippageLimitUpper = calculateSqrtPriceAfterSlippage(spotSqrtPrice, Number(slippageTolerance), true);

  if (SingletonOraiswapV3.dex.sender !== address) {
    SingletonOraiswapV3.load(SingletonOraiswapV3.dex.client, address);
  }

  const res = await SingletonOraiswapV3.dex.createPosition({
    poolKey,
    lowerTick: lowerTick,
    upperTick: upperTick,
    liquidityDelta: liquidityDelta.toString(),
    slippageLimitLower: slippageLimitLower.toString(),
    slippageLimitUpper: slippageLimitUpper.toString()
  });

  return res.transactionHash;
};

export const createPositionWithNativeTx = async (
  poolKey: PoolKey,
  lowerTick: number,
  upperTick: number,
  liquidityDelta: bigint,
  spotSqrtPrice: bigint,
  slippageTolerance: bigint,
  initialAmountX: bigint,
  initialAmountY: bigint,
  address: string
): Promise<string> => {
  const slippageLimitLower = calculateSqrtPriceAfterSlippage(spotSqrtPrice, Number(slippageTolerance), false);
  const slippageLimitUpper = calculateSqrtPriceAfterSlippage(spotSqrtPrice, Number(slippageTolerance), true);

  const token_x = poolKey.token_x;
  const token_y = poolKey.token_y;

  const fund: Coin[] = [];

  if (isNativeToken(token_x)) {
    fund.push({ denom: token_x, amount: initialAmountX.toString() });
  }

  if (isNativeToken(token_y)) {
    fund.push({ denom: token_y, amount: initialAmountY.toString() });
  }

  if (SingletonOraiswapV3.dex.sender !== address) {
    SingletonOraiswapV3.load(SingletonOraiswapV3.dex.client, address);
  }

  // console.log({ poolKey, lowerTick, upperTick, liquidityDelta, slippageLimitLower, slippageLimitUpper })
  const res = await SingletonOraiswapV3.dex.createPosition(
    {
      poolKey,
      lowerTick: lowerTick,
      upperTick: upperTick,
      liquidityDelta: liquidityDelta.toString(),
      slippageLimitLower: slippageLimitLower.toString(),
      slippageLimitUpper: slippageLimitUpper.toString()
    },
    'auto',
    '',
    fund
  );

  return res.transactionHash;
};

export const convertPosition = ({
  positions,
  poolsData,
  isLight,
  cachePrices,
  address
}: {
  positions: Position[] | any[];
  poolsData: {
    pool_key: {
      token_x: string;
      token_y: string;
    };
  }[];
  isLight: boolean;
  address: string;
  cachePrices: CoinGeckoPrices<CoinGeckoId>;
}) => {
  return positions.map((position: Position & { poolData: { pool: Pool }; ind: number }) => {
    const [tokenX, tokenY] = [position?.pool_key.token_x, position?.pool_key.token_y];
    let {
      FromTokenIcon: tokenXIcon,
      ToTokenIcon: tokenYIcon,
      tokenXinfo,
      tokenYinfo
    } = getIconPoolData(tokenX, tokenY, isLight);

    const positionsData = poolsData.find(
      (pool) =>
        pool.pool_key.token_x === position.pool_key.token_x && pool.pool_key.token_y === position.pool_key.token_y
    );

    const positions = {
      poolData: {
        ...positionsData,
        ...position
      }
    };

    const lowerPrice = Number(
      calcYPerXPriceByTickIndex(position.lower_tick_index, tokenXinfo.decimals, tokenYinfo.decimals)
    );

    const upperPrice = calcYPerXPriceByTickIndex(position.upper_tick_index, tokenXinfo.decimals, tokenYinfo.decimals);

    const min = Math.min(lowerPrice, upperPrice);
    const max = Math.max(lowerPrice, upperPrice);

    let tokenXLiq: number, tokenYLiq: number;

    let x = 0n;
    let y = 0n;

    if (positions.poolData) {
      const convertedPool = getConvertedPool(positions);
      const convertedPosition = getConvertedPosition(position);
      const res = calculateTokenAmounts(convertedPool, convertedPosition);
      x = res.x;
      y = res.y;
    }

    try {
      tokenXLiq = +printBigint(x, tokenXinfo.decimals);
    } catch (error) {
      tokenXLiq = 0;
    }

    try {
      tokenYLiq = +printBigint(y, tokenYinfo.decimals);
    } catch (error) {
      tokenYLiq = 0;
    }

    const currentPrice = calcYPerXPriceByTickIndex(
      position.poolData?.pool?.current_tick_index ?? 0,
      tokenXinfo.decimals,
      tokenYinfo.decimals
    );

    const valueX = tokenXLiq + tokenYLiq / currentPrice;
    const valueY = tokenYLiq + tokenXLiq * currentPrice;

    return {
      ...position,
      poolData: {
        ...positionsData,
        ...position
      },
      tokenX: tokenXinfo,
      tokenY: tokenYinfo,
      tokenXName: tokenXinfo.name,
      tokenYName: tokenYinfo.name,
      tokenXIcon: tokenXIcon,
      tokenYIcon: tokenYIcon,
      fee: +printBigint(BigInt(position.pool_key.fee_tier.fee), PERCENTAGE_SCALE - 2),
      min,
      max,
      tokenXLiq,
      tokenXLiqInUsd: tokenXLiq * cachePrices[tokenXinfo.coinGeckoId],
      tokenYLiqInUsd: tokenYLiq * cachePrices[tokenYinfo.coinGeckoId],
      tokenYLiq,
      valueX,
      valueY,
      address,
      id: position.ind,
      isActive: currentPrice >= min && currentPrice <= max,
      tokenXId: tokenXinfo.coinGeckoId
    };
  });
};
