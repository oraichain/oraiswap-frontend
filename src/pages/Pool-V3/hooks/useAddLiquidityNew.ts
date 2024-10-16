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
  fetchLiquidityTicks,
  fetchPool,
  fetchTickMap,
  setHistoricalChartData,
  setHistoricalRange,
  setIsXToY,
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
import { calcPrice, handleGetCurrentPlotTicks } from '../components/PriceRangePlot/utils';

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
  const liquidityChartData = usePoolDetailV3Reducer('liquidityChartData');
  const fullTickMap = usePoolDetailV3Reducer('fullTickMap');
  const liquidityTicks = usePoolDetailV3Reducer('liquidityTicks');
  const zoom = usePoolDetailV3Reducer('zoom');
  const range = usePoolDetailV3Reducer('range');
  const isXToY = usePoolDetailV3Reducer('isXToY');

  // when have pool string, we set to pool id
  // can get: poolKey, tokenX, tokenY
  useEffect(() => {
    if (poolString) {
      console.log('set new pool id', poolString);
      dispatch(setPoolId(poolString));
    }
  }, [poolString, dispatch]);

  // when have pool key, we fetch pool data, after that we can get:
  // pool, currentPrice,
  useEffect(() => {
    if (poolKey) {
      console.log('fetch new pool');
      dispatch<any>(fetchPool(poolKey));
      dispatch<any>(fetchTickMap(poolKey));
    }
  }, [poolKey, dispatch]);

  useEffect(() => {
    if (fullTickMap) {
      dispatch<any>(
        fetchLiquidityTicks({
          poolKey,
          tickMap: fullTickMap
        })
      );
    }
  }, [fullTickMap, poolKey, dispatch]);

  useEffect(() => {
    if (liquidityTicks && poolKey && tokenX && tokenY && yRange) {
      dispatch(setLiquidityChartData());
    }
  }, [liquidityTicks, isXToY, poolKey, tokenX, tokenY, yRange, dispatch]);

  // when we have poolId, poolKey, tokenX, tokenY, we can get:
  // historicalChartData, activeLiquidity, cache1Day, cache7Day, cache1Month, cache1Year
  useEffect(() => {
    if (poolKey && tokenX && tokenY) {
      console.log('fetch new historical data, active liquidity');
      dispatch<any>(fetchHistoricalPriceData1D(poolId));
      dispatch<any>(fetchHistoricalPriceData7D(poolId));
      dispatch<any>(fetchHistoricalPriceData1M(poolId));
      dispatch<any>(fetchHistoricalPriceData1Y(poolId));
      dispatch<any>(
        fetchActiveLiquidityData({
          poolKey,
          xDecimal: tokenX.decimals,
          yDecimal: tokenY.decimals,
          isXToY: isXToY
        })
      );
    }
  }, [poolId, poolKey, tokenX, tokenY, isXToY, dispatch]);

  // when have historicalChartData, currentPrice, we can get yRange
  useEffect(() => {
    if (historicalChartData && currentPrice) {
      console.log('set y range');
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

  // when have liquidityChartData, we can get xRange
  useEffect(() => {
    if (liquidityChartData) {
      console.log('set x range', Math.max(...liquidityChartData.map((d) => d.depth)));
      const xRange = [0, Math.max(...liquidityChartData.map((d) => d.depth))];
      dispatch(setXRange(xRange as [number, number]));
    }
  }, [liquidityChartData, dispatch]);

  useEffect(() => {
    if (currentPrice) {
      setHoverPrice(currentPrice);
    }
  }, [currentPrice]);

  useEffect(() => {
    if (poolKey && pool && tokenX && tokenY) {
      resetPlot();
    }
  }, [poolKey, pool, tokenX, tokenY, isXToY]);

  const changeHistoricalRange = (range: TimeDuration) => {
    dispatch(setHistoricalRange(range));
  };

  const flipToken = () => {
    dispatch(setIsXToY(!isXToY));
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

    const minPrice = calcPrice(lowerTick, isXToY, tokenX.decimals, tokenY.decimals);
    const maxPrice = calcPrice(higherTick, isXToY, tokenX.decimals, tokenY.decimals);

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
    liquidityChartData,
    zoom,
    range,
    hoverPrice,
    minPrice,
    maxPrice,
    lowerTick,
    higherTick,
    isXToY,
    setLowerTick,
    setHigherTick,
    setMinPrice,
    setMaxPrice,
    setHoverPrice,
    changeHistoricalRange,
    zoomIn,
    zoomOut,
    resetRange,
    flipToken
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
