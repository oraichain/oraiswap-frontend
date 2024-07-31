import { oraichainTokens } from 'config/bridgeTokens';
import { PRICE_SCALE, printBigint } from '../components/PriceRangePlot/utils';
import {
  AmountDeltaResult,
  Pool,
  Position,
  Tick,
  TokenAmounts,
  calculateAmountDelta,
  calculateSqrtPrice,
  getPercentageScale,
  calculateFee as wasmCalculateFee
} from '../packages/wasm/oraiswap_v3_wasm';
import { getIconPoolData } from './format';

// export const PERCENTAGE_SCALE = Number(getPercentageScale());

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

export const convertPosition = ({ positions, poolsData, isLight, cachePrices, address }) => {
  return positions.map((position: any, index) => {
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

    let tokenXLiq: any, tokenYLiq: any;

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
      id: index,
      isActive: currentPrice >= min && currentPrice <= max,
      tokenXId: tokenXinfo.coinGeckoId
    };
  });
};
