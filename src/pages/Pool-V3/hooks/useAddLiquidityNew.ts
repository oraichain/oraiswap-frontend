import usePoolDetailV3Reducer from 'hooks/usePoolDetailV3Reducer';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  ActiveLiquidityPerTickRange,
  fetchActiveLiquidityData,
  fetchHistoricalPriceData1D,
  fetchHistoricalPriceData1M,
  fetchHistoricalPriceData1Y,
  fetchHistoricalPriceData7D,
  fetchPool,
  setHistoricalChartData,
  setHistoricalRange,
  setLiquidityChartData,
  setPoolId,
  setXRange,
  setYRange,
  setZoom,
  TimeDuration
} from 'reducer/poolDetailV3';
import { BigDecimal } from '@oraichain/oraidex-common';
import { PRICE_SCALE } from 'libs/contractSingleton';
import { getMaxTick, getMinTick, getTickAtSqrtPrice } from '@oraichain/oraiswap-v3';
import { calcPrice } from '../components/PriceRangePlot/utils';

const ZOOM_STEP = 0.05;

const useAddLiquidityNew = (poolString: string) => {
  const dispatch = useDispatch();
  const [hoverPrice, setHoverPrice] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [lowerTick, setLowerTick] = useState<number>(0);
  const [higherTick, setHigherTick] = useState<number>(0);

  const poolId = usePoolDetailV3Reducer('poolId');
  const poolKey = usePoolDetailV3Reducer('poolKey');
  const pool = usePoolDetailV3Reducer('pool');
  const tokenX = usePoolDetailV3Reducer('tokenX');
  const tokenY = usePoolDetailV3Reducer('tokenY');
  const historicalRange = usePoolDetailV3Reducer('historicalRange');
  const cache1Day = usePoolDetailV3Reducer('cache1Day');
  const cache7Day = usePoolDetailV3Reducer('cache7Day');
  const cache1Month = usePoolDetailV3Reducer('cache1Month');
  const cache1Year = usePoolDetailV3Reducer('cache1Year');
  const historicalChartData = usePoolDetailV3Reducer('historicalChartData');
  const fullRange = usePoolDetailV3Reducer('fullRange');
  const xRange = usePoolDetailV3Reducer('xRange');
  const yRange = usePoolDetailV3Reducer('yRange');
  const currentPrice = usePoolDetailV3Reducer('currentPrice');
  const activeLiquidity = usePoolDetailV3Reducer('activeLiquidity');
  const liquidityChartData = usePoolDetailV3Reducer('liquidityChartData');
  const zoom = usePoolDetailV3Reducer('zoom');
  const range = usePoolDetailV3Reducer('range');

  // when have pool string, we set to pool id
  // can get: poolKey, tokenX, tokenY
  useEffect(() => {
    if (poolString) {
      console.log('change pool', poolString);
      dispatch(setPoolId(poolString));
    }
  }, [poolString, dispatch]);

  // when have pool key, we fetch pool data, after that we can get:
  // pool, currentPrice,
  useEffect(() => {
    if (poolKey) {
      dispatch<any>(fetchPool(poolKey));
    }
  }, [poolKey, dispatch]);

  // when we have poolId, poolKey, tokenX, tokenY, we can get:
  // historicalChartData, activeLiquidity, cache1Day, cache7Day, cache1Month, cache1Year
  useEffect(() => {
    if (poolKey && tokenX && tokenY) {
      dispatch<any>(fetchHistoricalPriceData1D(poolId));
      dispatch<any>(fetchHistoricalPriceData7D(poolId));
      dispatch<any>(fetchHistoricalPriceData1M(poolId));
      dispatch<any>(fetchHistoricalPriceData1Y(poolId));
      dispatch<any>(
        fetchActiveLiquidityData({
          poolKey,
          xDecimal: tokenX.decimals,
          yDecimal: tokenY.decimals,
          isXToY: true
        })
      );
    }
  }, [poolId, poolKey, tokenX, tokenY, dispatch]);

  // when have historicalChartData, currentPrice, we can get yRange
  useEffect(() => {
    if (historicalChartData && currentPrice) {
      const data = historicalChartData?.map(({ time, close }) => ({
        time,
        price: close
      }));
      const padding = 0.1;

      const prices = data.map((d) => d.price);

      const chartMin = historicalChartData?.length > 0 ? Math.max(0, Math.min(...prices)) : currentPrice * 0.5;
      const chartMax = historicalChartData?.length > 0 ? Math.max(...prices) : currentPrice * 1.5;

      const absMax = range ? Math.max(Number(range[1].toString()), chartMax) : chartMax;
      const absMin = range ? Math.min(Number(range[0].toString()), chartMin) : chartMin;

      const delta = Math.abs(absMax - absMin);

      const minWithPadding = Math.max(0, absMin - delta * padding);
      const maxWithPadding = absMax + delta * padding;

      const zoomAdjustedMin = zoom > 1 ? absMin / zoom : absMin * zoom;
      const zoomAdjustedMax = absMax * zoom;

      let finalMin = minWithPadding;
      let finalMax = maxWithPadding;

      if (zoomAdjustedMin < minWithPadding) finalMin = zoomAdjustedMin;
      if (zoomAdjustedMax > maxWithPadding) finalMax = zoomAdjustedMax;

      dispatch(setYRange([finalMin, finalMax]));
    }
  }, [historicalChartData, zoom, currentPrice, range, dispatch]);

  // when have activeLiquidity, yRange, poolKey, tokenX, tokenY, we can get liquidityChartData
  useEffect(() => {
    if (activeLiquidity && yRange && poolKey && tokenX && tokenY) {
      const data = activeLiquidity;
      const [min, max] = yRange;
      const multiplicationQuoteOverBase = tokenY.decimals - tokenX.decimals;

      if (min !== max) {
        const depths: { price: number; depth: number }[] = [];

        for (let price = min; price <= max; price += (max - min) / 20) {
          //   if (multiplicationQuoteOverBase === 0) continue;

          const sqrtPrice = BigInt(
            new BigDecimal(price)
              .mul(new BigDecimal(10 ** multiplicationQuoteOverBase))
              .sqrt()
              .mul(new BigDecimal(10n ** PRICE_SCALE))
              .toString()
          );

          depths.push({
            price,
            depth: getLiqFrom(getTickAtSqrtPrice(sqrtPrice, poolKey.fee_tier.tick_spacing), data)
          });
        }
        dispatch(setLiquidityChartData(depths));
      }
    }
  }, [activeLiquidity, yRange, poolKey, tokenX, tokenY, dispatch]);

  // when have liquidityChartData, we can get xRange
  useEffect(() => {
    if (liquidityChartData.length > 0) {
      const xRange = [0, Math.max(...liquidityChartData.map((d) => d.depth)) * 1.2];
      dispatch(setXRange(xRange as [number, number]));
    }
  }, [liquidityChartData, dispatch]);

  useEffect(() => {
    if (historicalRange) {
      console.log('setHistoricalChartData', historicalRange);
      switch (historicalRange) {
        case '1d':
          dispatch<any>(setHistoricalChartData(cache1Day));
          break;
        case '7d':
          dispatch<any>(setHistoricalChartData(cache7Day));
          break;
        case '1mo':
          dispatch<any>(setHistoricalChartData(cache1Month));
          break;
        case '1y':
          dispatch<any>(setHistoricalChartData(cache1Year));
          break;
        default:
          break;
      }
    }
  }, [historicalRange, cache1Day, cache7Day, cache1Month, cache1Year, dispatch]);

  useEffect(() => {
    if (currentPrice) {
      setHoverPrice(currentPrice);
    }
  }, [currentPrice]);

  useEffect(() => {
    if (poolKey && pool && tokenX && tokenY) {
      resetPlot();
    }
  }, [poolKey, pool, tokenX, tokenY]);

  useEffect(() => {

  }, [minPrice, maxPrice]);

  const changeHistoricalRange = (range: TimeDuration) => {
    dispatch(setHistoricalRange(range));
  };

  const zoomIn = () => {
    dispatch(setZoom(zoom + ZOOM_STEP));
  };

  const zoomOut = () => {
    dispatch(setZoom(zoom - ZOOM_STEP));
  };

  const resetRange = () => {
    dispatch(setZoom(1.05));
  };

  const resetPlot = () => {
    const higherTick = Math.max(
      Number(getMinTick(Number(poolKey.fee_tier.tick_spacing))),
      Number(pool.current_tick_index) + Number(poolKey.fee_tier.tick_spacing) * 3
    );

    const lowerTick = Math.min(
      Number(getMaxTick(Number(poolKey.fee_tier.tick_spacing))),
      Number(pool.current_tick_index) - Number(poolKey.fee_tier.tick_spacing) * 3
    );

    const minPrice = calcPrice(lowerTick, true, tokenX.decimals, tokenY.decimals);
    const maxPrice = calcPrice(higherTick, true, tokenX.decimals, tokenY.decimals);

    setLowerTick(lowerTick);
    setHigherTick(higherTick);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };

  return {
    poolId,
    poolKey,
    pool,
    tokenX,
    tokenY,
    historicalRange,
    cache1Day,
    cache7Day,
    cache1Month,
    cache1Year,
    historicalChartData,
    fullRange,
    xRange,
    yRange,
    currentPrice,
    activeLiquidity,
    liquidityChartData,
    zoom,
    range,
    hoverPrice,
    minPrice,
    maxPrice,
    lowerTick,
    higherTick,
    setLowerTick,
    setHigherTick,
    setMinPrice,
    setMaxPrice,
    setHoverPrice,
    changeHistoricalRange,
    zoomIn,
    zoomOut,
    resetRange
  };
};

function getLiqFrom(target: number, list: ActiveLiquidityPerTickRange[]): number {
  for (let i = 0; i < list.length; i++) {
    if (list[i].lowerTick <= target && list[i].upperTick >= target) {
      return Number(list[i].liquidityAmount.toString());
    }
  }
  return 0;
}

export default useAddLiquidityNew;
