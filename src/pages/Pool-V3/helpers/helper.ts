import { BigDecimal, toDisplay, TokenItemType, CW20_DECIMALS } from '@oraichain/oraidex-common';
import { Coin } from '@cosmjs/proto-signing';
import { PoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { oraichainTokens } from 'config/bridgeTokens';
import SingletonOraiswapV3, { poolKeyToString } from 'libs/contractSingleton';
import { PRICE_SCALE, printBigint } from '../components/PriceRangePlot/utils';
import {
  AmountDeltaResult,
  Pool,
  Position,
  Tick,
  TokenAmounts,
  calculateAmountDelta,
  calculateSqrtPrice,
  extractAddress,
  getPercentageDenominator,
  getSqrtPriceDenominator,
  getTickAtSqrtPrice,
  calculateFee as wasmCalculateFee
} from '@oraichain/oraiswap-v3';
import { getIconPoolData } from './format';
import { network } from 'config/networks';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { CoinGeckoId } from '@oraichain/oraidex-common/build/network';
import { Position as PositionsNode } from 'gql/graphql';
import { oraichainTokensWithIcon } from 'config/chainInfos';

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
  const sqrt = +printBigint(calculateSqrtPrice(tickIndex), Number(PRICE_SCALE));

  const proportion = sqrt * sqrt;

  return proportion / 10 ** (yDecimal - xDecimal);
};

export const calcYPerXPriceBySqrtPrice = (sqrtPrice: bigint, xDecimal: number, yDecimal: number): number => {
  const sqrt = +printBigint(sqrtPrice, Number(PRICE_SCALE));

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
  return token === 'orai' || token.includes('ibc') || token.includes('factory');
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
    throw Error('square root of negative numbers is not supported');
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

export const formatClaimFeeData = (feeClaimData: PositionsNode[]) => {
  const fmtFeeClaimData = feeClaimData.reduce((acc, cur) => {
    const { principalAmountX, principalAmountY, id, fees } = cur || {};

    const totalEarn = {
      earnX: 0,
      earnY: 0,
      earnIncentive: {}
    };

    fees.nodes.forEach((fee) => {
      totalEarn.earnX = new BigDecimal(totalEarn.earnX).add(fee.amountX).toNumber();
      totalEarn.earnY = new BigDecimal(totalEarn.earnY).add(fee.amountY).toNumber();
      fee.claimFeeIncentiveTokens.nodes.forEach((incentiveClaimed) => {
        if (!totalEarn.earnIncentive[incentiveClaimed.tokenId]?.amount) {
          totalEarn.earnIncentive[incentiveClaimed.tokenId] = {
            amount: 0,
            token: oraichainTokensWithIcon.find((tk) => extractAddress(tk) === incentiveClaimed.tokenId)
          };
        }

        totalEarn.earnIncentive[incentiveClaimed.tokenId].amount = new BigDecimal(
          totalEarn.earnIncentive[incentiveClaimed.tokenId]?.amount || 0
        )
          .add(incentiveClaimed.rewardAmount)
          .toNumber();
      });
    });

    acc[id] = {
      principalAmountX,
      principalAmountY,
      totalEarn
    };

    return acc;
  }, {});

  return fmtFeeClaimData;
};

export const convertPosition = ({
  positions,
  poolsData,
  isLight,
  cachePrices,
  address,
  feeClaimData
}: {
  positions: Position[] | any[];
  poolsData: {
    pool_key: PoolKey;
  }[];
  isLight: boolean;
  address: string;
  cachePrices: CoinGeckoPrices<CoinGeckoId>;
  feeClaimData: PositionsNode[];
}) => {
  const fmtFeeClaim = formatClaimFeeData(feeClaimData);

  const fmtData = positions
    .map((position: Position & { poolData: { pool: Pool }; ind: number; token_id: number }) => {
      const [tokenX, tokenY] = [position?.pool_key.token_x, position?.pool_key.token_y];
      let {
        FromTokenIcon: tokenXIcon,
        ToTokenIcon: tokenYIcon,
        tokenXinfo,
        tokenYinfo
      } = getIconPoolData(tokenX, tokenY, isLight);

      if (!tokenXinfo || !tokenYinfo) {
        return null;
      }

      const poolData = poolsData.find((pool) => poolKeyToString(pool.pool_key) === poolKeyToString(position.pool_key));

      const positions = {
        poolData: {
          ...poolData,
          ...position
        }
      };

      const lowerPrice = calcYPerXPriceByTickIndex(position.lower_tick_index, tokenXinfo.decimals, tokenYinfo.decimals);
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
        // console.log({ convertedPool });
        x = res.x;
        y = res.y;
      }

      try {
        tokenXLiq = +printBigint(x, tokenXinfo.decimals);
      } catch (error) {
        console.log(error);
        tokenXLiq = 0;
      }

      try {
        tokenYLiq = +printBigint(y, tokenYinfo.decimals);
      } catch (error) {
        console.log(error);
        tokenYLiq = 0;
      }

      const currentPrice = calcYPerXPriceByTickIndex(
        position.poolData?.pool?.current_tick_index ?? 0,
        tokenXinfo.decimals,
        tokenYinfo.decimals
      );

      const valueX = tokenXLiq + tokenYLiq / currentPrice;
      const valueY = tokenYLiq + tokenXLiq * currentPrice;

      const { principalAmountX, principalAmountY, totalEarn } = fmtFeeClaim[
        `${poolKeyToString(position.pool_key)}-${position.token_id}`
      ] || {
        principalAmountX: 0,
        principalAmountY: 0,
        totalEarn: {
          earnX: 0,
          earnY: 0,
          earnIncentive: {}
        }
      };

      const totalEarnIncentiveUsd = Object.values(totalEarn.earnIncentive).reduce((acc: BigDecimal, cur) => {
        const { amount = '0', token } = cur as {
          amount: string;
          token: TokenItemType;
        };

        // const usd =
        //   toDisplay(amount.toString(), token.decimals || CW20_DECIMALS) * Number(cachePrices[token?.coinGeckoId] || 0);

        acc.add(
          new BigDecimal(amount)
            .mul(new BigDecimal(10).pow(token?.decimals || CW20_DECIMALS))
            .mul(cachePrices[token.coinGeckoId])
        );

        return acc;
      }, new BigDecimal(0));

      const tokenYDecimal = tokenYinfo.decimals || CW20_DECIMALS;
      const tokenXDecimal = tokenXinfo.decimals || CW20_DECIMALS;

      return {
        ...position,
        poolData: {
          ...poolData,
          ...position
        },
        tokenX: tokenXinfo,
        tokenY: tokenYinfo,
        tokenXName: tokenXinfo.name,
        tokenYName: tokenYinfo.name,
        tokenXIcon: tokenXIcon,
        tokenYIcon: tokenYIcon,
        tokenYinfo,
        tokenXinfo,
        tokenYDecimal,
        tokenXDecimal,
        fee: +printBigint(BigInt(position.pool_key.fee_tier.fee), PERCENTAGE_SCALE - 2),
        min,
        max,
        tokenXUsd: cachePrices[tokenXinfo.coinGeckoId],
        tokenYUsd: cachePrices[tokenYinfo.coinGeckoId],
        tokenXLiq,
        tokenXLiqInUsd: tokenXLiq * cachePrices[tokenXinfo.coinGeckoId],
        tokenYLiqInUsd: tokenYLiq * cachePrices[tokenYinfo.coinGeckoId],
        tokenYLiq,
        valueX,
        valueY,
        address,
        id: position.ind,
        isActive: currentPrice >= min && currentPrice <= max,
        tokenXId: tokenXinfo.coinGeckoId,
        principalAmountX,
        principalAmountY,
        totalEarn,
        totalEarnIncentiveUsd: (totalEarnIncentiveUsd as BigDecimal).toNumber()
      };
    })
    .filter(Boolean);
  return fmtData;
};
