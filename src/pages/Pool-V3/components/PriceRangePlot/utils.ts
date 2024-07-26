import {
  TokenAmount,
  SwapError,
  alignTickToSpacing,
  calculateSqrtPrice,
  getMaxTick,
  getMinTick,
//   getPriceScale
} from 'pages/Pool-V3/packages/wasm/oraiswap_v3_wasm.js';

export const PRICE_SCALE = 24;
export const CONCENTRATION_FACTOR = 1.00001526069123;

export const getTickAtSqrtPriceDelta = (
  tickSpacing: number,
  minimumRange: number,
  concentration: number
) => {
  const base = Math.pow(1.0001, -(tickSpacing / 4));
  const logArg =
    (1 - 1 / (concentration * CONCENTRATION_FACTOR)) /
    Math.pow(1.0001, (-tickSpacing * minimumRange) / 4);

  return Math.ceil(Math.log(logArg) / Math.log(base) / 2);
};

export const calculateConcentrationRange = (
  tickSpacing: number,
  concentration: number,
  minimumRange: number,
  currentTick: number,
  isXToY: boolean
) => {
  const tickDelta = getTickAtSqrtPriceDelta(tickSpacing, minimumRange, concentration);
  const lowerTick = currentTick - (minimumRange / 2 + tickDelta) * tickSpacing;
  const upperTick = currentTick + (minimumRange / 2 + tickDelta) * tickSpacing;

  return {
    leftRange: isXToY ? lowerTick : upperTick,
    rightRange: isXToY ? upperTick : lowerTick
  };
};

export const toMaxNumericPlaces = (num: number, places: number): string => {
  const log = Math.floor(Math.log10(num));

  if (log >= places) {
    return num.toFixed(0);
  }

  if (log >= 0) {
    return num.toFixed(places - log - 1);
  }

  return num.toFixed(places + Math.abs(log) - 1);
};

export const getPrimaryUnitsPrice = (price: number, isXtoY: boolean, xDecimal: number, yDecimal: number) => {
  const xToYPrice = isXtoY ? price : 1 / price;

  return xToYPrice * 10 ** (yDecimal - xDecimal);
};

export const logBase = (x: number, b: number): number => Math.log(x) / Math.log(b);

export const adjustToSpacing = (baseTick: number, spacing: number, isGreater: boolean): number => {
  const remainder = baseTick % spacing;

  if (Math.abs(remainder) === 0) {
    return baseTick;
  }

  let adjustment: number;
  if (isGreater) {
    if (baseTick >= 0) {
      adjustment = spacing - remainder;
    } else {
      adjustment = Math.abs(remainder);
    }
  } else {
    if (baseTick >= 0) {
      adjustment = -remainder;
    } else {
      adjustment = -(spacing - Math.abs(remainder));
    }
  }

  return baseTick + adjustment;
};

export const spacingMultiplicityLte = (arg: number, spacing: number): number => {
  return adjustToSpacing(arg, spacing, false);
};

export const spacingMultiplicityGte = (arg: number, spacing: number): number => {
  return adjustToSpacing(arg, spacing, true);
};

export const nearestSpacingMultiplicity = (centerTick: number, spacing: number) => {
  const greaterTick = spacingMultiplicityGte(centerTick, spacing);
  const lowerTick = spacingMultiplicityLte(centerTick, spacing);

  const nearestTick = Math.abs(greaterTick - centerTick) < Math.abs(lowerTick - centerTick) ? greaterTick : lowerTick;

  return Math.max(Math.min(nearestTick, Number(getMaxTick(spacing))), Number(getMinTick(spacing)));
};

export const getTickAtSqrtPriceFromBalance = (
  price: number,
  spacing: number,
  isXtoY: boolean,
  xDecimal: number,
  yDecimal: number
) => {
  const minTick = getMinTick(spacing);
  const maxTick = getMaxTick(spacing);

  const basePrice = Math.max(price, Number(calcPrice(isXtoY ? minTick : maxTick, isXtoY, xDecimal, yDecimal)));
  const primaryUnitsPrice = getPrimaryUnitsPrice(basePrice, isXtoY, Number(xDecimal), Number(yDecimal));
  const tick = Math.round(logBase(primaryUnitsPrice, 1.0001));

  return Math.max(Math.min(tick, Number(getMaxTick(spacing))), Number(getMinTick(spacing)));
};

export const calcPrice = (amountTickIndex: number, isXtoY: boolean, xDecimal: number, yDecimal: number): number => {
  const price = calcYPerXPriceByTickIndex(amountTickIndex, xDecimal, yDecimal);

  return isXtoY ? price : 1 / price;
};

export const calcYPerXPriceByTickIndex = (tickIndex: number, xDecimal: number, yDecimal: number): number => {
  const sqrt = +printBigint(calculateSqrtPrice(tickIndex), PRICE_SCALE);

  const proportion = sqrt * sqrt;

  return proportion / 10 ** (yDecimal - xDecimal);
};

export const printBigint = (amount: TokenAmount, decimals: number): string => {
  const amountString = amount.toString();
  const isNegative = amountString.length > 0 && amountString[0] === '-';

  const balanceString = isNegative ? amountString.slice(1) : amountString;

  if (balanceString.length <= decimals) {
    return (isNegative ? '-' : '') + '0.' + '0'.repeat(decimals - balanceString.length) + balanceString;
  } else {
    return (
      (isNegative ? '-' : '') +
      trimZeros(
        balanceString.substring(0, balanceString.length - decimals) +
          '.' +
          balanceString.substring(balanceString.length - decimals)
      )
    );
  }
};

export const trimZeros = (numStr: string): string => {
  return numStr
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/^0+(\d)|(\d)0+$/gm, '$1$2')
    .replace(/\.$/, '');
};

export const nearestTickIndex = (
  price: number,
  spacing: number,
  isXtoY: boolean,
  xDecimal: number,
  yDecimal: number
) => {
  const tick = getTickAtSqrtPriceFromBalance(price, spacing, isXtoY, xDecimal, yDecimal);

  return nearestSpacingMultiplicity(tick, spacing);
};

export const getConcentrationArray = (tickSpacing: number, minimumRange: number, currentTick: number): number[] => {
  const concentrations: number[] = [];
  let counter = 0;
  let concentration = 0;
  let lastConcentration = calculateConcentration(tickSpacing, minimumRange, counter) + 1;
  let concentrationDelta = 1;

  while (concentrationDelta >= 1) {
    concentration = calculateConcentration(tickSpacing, minimumRange, counter);
    concentrations.push(concentration);
    concentrationDelta = lastConcentration - concentration;
    lastConcentration = concentration;
    counter++;
  }
  concentration = Math.ceil(concentrations[concentrations.length - 1]);

  while (concentration > 1) {
    concentrations.push(concentration);
    concentration--;
  }
  const maxTick = alignTickToSpacing(getMaxTick(1), tickSpacing);
  if ((minimumRange / 2) * tickSpacing > maxTick - Math.abs(currentTick)) {
    throw new Error(String(SwapError.TickLimitReached));
  }
  const limitIndex = (maxTick - Math.abs(currentTick) - (minimumRange / 2) * tickSpacing) / tickSpacing;

  return concentrations.slice(0, limitIndex);
};

export const calculateConcentration = (tickSpacing: number, minimumRange: number, n: number) => {
  const concentration = 1 / (1 - Math.pow(1.0001, (-tickSpacing * (minimumRange + 2 * n)) / 4));
  return concentration / CONCENTRATION_FACTOR;
};

export const calcTicksAmountInRange = (
  min: number,
  max: number,
  tickSpacing: number,
  isXtoY: boolean,
  xDecimal: number,
  yDecimal: number
): number => {
  const primaryUnitsMin = getPrimaryUnitsPrice(min, isXtoY, xDecimal, yDecimal);
  const primaryUnitsMax = getPrimaryUnitsPrice(max, isXtoY, xDecimal, yDecimal);
  const minIndex = logBase(primaryUnitsMin, 1.0001);
  const maxIndex = logBase(primaryUnitsMax, 1.0001);

  return Math.ceil(Math.abs(maxIndex - minIndex) / tickSpacing);
};
