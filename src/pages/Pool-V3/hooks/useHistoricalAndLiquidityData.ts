import {
  calculateSqrtPrice,
  extractAddress,
  getTickAtSqrtPrice,
  Pool,
  PoolKey,
  poolKeyToString
} from '@oraichain/oraiswap-v3';
import { action, autorun, computed, makeObservable, observable } from 'mobx';
import { useEffect, useState } from 'react';
import { convertPlotTicks, printBigint } from '../components/PriceRangePlot/utils';
import SingletonOraiswapV3, { PRICE_SCALE, stringToPoolKey } from 'libs/contractSingleton';
import { TokenItemType, BigDecimal } from '@oraichain/oraidex-common';
import { PoolWithPoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { useQuery } from '@tanstack/react-query';
import { oraichainTokens } from '@oraichain/oraidex-common';
import { getHistoricalPriceData } from 'rest/graphClient';

export const AvailableTimeDurations = ['1d', '7d', '1mo', '1y'] as const;

export type TimeDuration = (typeof AvailableTimeDurations)[number];

export interface TokenPairHistoricalPrice {
  close: number;
  time: number;
}

export type ActiveLiquidityPerTickRange = {
  /** Price-correlated tick index. */
  lowerTick: number;
  upperTick: number;
  /** Net liquidity, for calculating active liquidity. */
  liquidityAmount: number;
};

export function useHistoricalAndLiquidityData(poolKey: PoolKey): ObservableHistoricalAndLiquidityData {
  const [config] = useState(() => new ObservableHistoricalAndLiquidityData());
  useEffect(
    () => () => {
      config.dispose();
    },
    [config]
  );

  const tokenX = oraichainTokens.find((token) => extractAddress(token) === poolKey.token_x);
  if (tokenX) config.setTokenX(tokenX);
  const tokenY = oraichainTokens.find((token) => extractAddress(token) === poolKey.token_y);
  if (tokenY) config.setTokenY(tokenY);

  const { data: pool } = useQuery<PoolWithPoolKey>({
    queryKey: ['pool', poolKey],
    queryFn: async () => {
      return await SingletonOraiswapV3.getPool(poolKey);
    }
  });
  if (pool) config.setPool(pool);

  const { data: activeLiquidity } = useQuery<ActiveLiquidityPerTickRange[]>({
    queryKey: ['activeLiquidity', poolKey],
    queryFn: async () => {
      return await convertPlotTicks({
        poolKey,
        isXtoY: true,
        xDecimal: tokenX?.decimals ?? 0,
        yDecimal: tokenY?.decimals ?? 0
      });
    }
  });
  if (activeLiquidity) {
    config.setActiveLiquidity(activeLiquidity);
  }

  const {
    data: historicalPriceData,
    isLoading,
    isError,
  } = useQuery<TokenPairHistoricalPrice[]>({
    queryKey: ['historicalPriceData', poolKey, config.historicalRange],
    queryFn: async () => {
      return await getHistoricalPriceData(poolKeyToString(poolKey), config.historicalRange);
    }
  });
  if (historicalPriceData) config.setHistoricalData(historicalPriceData);

  config.setIsHistoricalDataLoading(isLoading);
  config.setHistoricalDataError(isError);

  return config;
}

const INITIAL_ZOOM = 1.05;
const ZOOM_STEP = 0.05;

export class ObservableHistoricalAndLiquidityData {
  /*
   Used to get historical range for price chart
  */
  @observable
  protected _historicalRange: TimeDuration = '7d';

  @observable.ref
  protected _historicalData: TokenPairHistoricalPrice[] = [];

  @observable
  protected _historicalDataError: boolean = false;

  @observable
  protected _isHistoricalDataLoading: boolean = false;

  @observable
  protected _zoom: number = INITIAL_ZOOM;

  @observable
  protected _hoverPrice: number = 0;

  @observable
  protected _priceRange: [number, number] | null = null;

  @observable.ref
  protected _pool: PoolWithPoolKey | null = null;

  @observable.ref
  protected _tokenX: TokenItemType | null = null;

  @observable.ref
  protected _tokenY: TokenItemType | null = null;

  @observable.ref
  protected _depthChartData: { price: number; depth: number }[] = [];

  @observable.ref
  protected _activeLiquidity: ActiveLiquidityPerTickRange[] | null = null;

  protected _disposers: (() => void)[] = [];

  constructor() {
    makeObservable(this);

    // Init last hover price to current price in pool once loaded
    this._disposers.push(
      autorun(() => {
        if (this.lastChartData) this.setHoverPrice(this.lastChartData.close);
      })
    );
  }

  @computed
  get currentPrice(): number {
    if (!this.pool) return 0;

    const sqrt = +printBigint(calculateSqrtPrice(this.pool.pool.current_tick_index), Number(PRICE_SCALE));

    const proportion = sqrt * sqrt;

    return proportion / 10 ** this.multiplicationQuoteOverBase;
  }

  @computed
  get pool() {
    if (!this._pool) return null;

    return this._pool;
  }

  @computed
  get historicalChartUnavailable(): boolean {
    return this._historicalDataError;
  }

  @computed
  get isHistoricalDataLoading(): boolean {
    return this._isHistoricalDataLoading;
  }

  @computed
  get tokenX(): TokenItemType | null {
    return this._tokenX;
  }

  @computed
  get tokenY(): TokenItemType | null {
    return this._tokenY;
  }

  @computed
  protected get multiplicationQuoteOverBase(): number {
    return (this._tokenY?.decimals ?? 0) - (this._tokenX?.decimals ?? 0);
  }

  /** Use pool current price as last/current chart price. */
  @computed
  get lastChartData(): TokenPairHistoricalPrice | null {
    const price = Number(this.currentPrice.toString() ?? 0);

    if (price === 0) return null;

    return {
      close: price,
      time: new Date().getTime()
    };
  }

  @action
  readonly setHistoricalRange = (range: TimeDuration) => {
    this._historicalRange = range;
    // window(['historicalPriceData']);
  };

  @computed
  get historicalRange(): TimeDuration {
    return this._historicalRange;
  }

  @computed
  get activeLiquidity(): ActiveLiquidityPerTickRange[] {
    return this._activeLiquidity ?? [];
  }

  @action
  setHoverPrice = (price: number) => {
    // console.log('setHoverPrice', price);
    this._hoverPrice = price;
  };

  @computed
  get hoverPrice(): number {
    // console.log("get hoverPrice", this._hoverPrice);
    return this._hoverPrice;
  }

  @computed
  get priceDecimal(): number {
    if (!this.lastChartData) return 2;
    if (this.lastChartData.close <= 0.001) return 5;
    if (this.lastChartData.close <= 0.01) return 4;
    if (this.lastChartData.close <= 0.1) return 3;
    if (this.lastChartData.close < 1) return 3;
    return 2;
  }

  get zoom(): number {
    return this._zoom;
  }

  @action
  readonly setZoom = (zoom: number) => {
    this._zoom = zoom;
  };

  @action
  readonly resetZoom = () => {
    this._zoom = INITIAL_ZOOM;
  };

  @action
  readonly zoomIn = () => {
    this._zoom = Math.max(1, this._zoom - ZOOM_STEP);
  };

  @action
  readonly zoomOut = () => {
    this._zoom = this._zoom + ZOOM_STEP;
  };

  @action
  readonly setPriceRange = (range: [number, number]) => {
    this._priceRange = range;
  };

  @computed
  get historicalChartData(): TokenPairHistoricalPrice[] {
    return this._historicalData;
  }

  get range(): [number, number] | null {
    return this._priceRange;
  }

  @computed
  get yRange(): [number, number] {
    const data = this.historicalChartData?.map(({ time, close }) => ({
      time,
      price: close
    }));
    const zoom = this.zoom;
    const padding = 0.1;

    const prices = data.map((d) => d.price);

    const chartMin =
      this.historicalChartData?.length > 0 ? Math.max(0, Math.min(...prices)) : this.currentPrice * 0.5 ?? 0;
    const chartMax = this.historicalChartData?.length > 0 ? Math.max(...prices) : this.currentPrice * 1.5 ?? 0;

    const absMax = this.range ? Math.max(Number(this.range[1].toString()), chartMax) : chartMax;
    const absMin = this.range ? Math.min(Number(this.range[0].toString()), chartMin) : chartMin;

    const delta = Math.abs(absMax - absMin);

    const minWithPadding = Math.max(0, absMin - delta * padding);
    const maxWithPadding = absMax + delta * padding;

    const zoomAdjustedMin = zoom > 1 ? absMin / zoom : absMin * zoom;
    const zoomAdjustedMax = absMax * zoom;

    let finalMin = minWithPadding;
    let finalMax = maxWithPadding;

    if (zoomAdjustedMin < minWithPadding) finalMin = zoomAdjustedMin;
    if (zoomAdjustedMax > maxWithPadding) finalMax = zoomAdjustedMax;

    return [finalMin, finalMax];
  }

  @computed
  get depthChartData(): { price: number; depth: number }[] {
    const data = this.activeLiquidity;
    const [min, max] = this.yRange;

    if (min === max) return [];

    const depths: { price: number; depth: number }[] = [];

    for (let price = min; price <= max; price += (max - min) / 20) {
      //   if (this.multiplicationQuoteOverBase === 0) continue;

      const sqrtPrice = BigInt(
        new BigDecimal(price)
          .mul(new BigDecimal(10 ** this.multiplicationQuoteOverBase))
          .sqrt()
          .mul(new BigDecimal(10n ** PRICE_SCALE))
          .toString()
      );

      depths.push({
        price,
        depth: getLiqFrom(getTickAtSqrtPrice(sqrtPrice, this.pool.pool_key.fee_tier.tick_spacing), data)
      });
    }

    return depths;
  }

  @computed
  get xRange(): [number, number] {
    if (!this.depthChartData.length) return [0, 0];

    return [0, Math.max(...this.depthChartData.map((d) => d.depth)) * 1.2];
  }

  dispose() {
    this._disposers.forEach((dispose) => dispose());
  }

  @action
  readonly setHistoricalData = (data: TokenPairHistoricalPrice[]) => {
    if (this.currentPrice) {
        data = [...data, this.lastChartData];
    }
    this._historicalData = data;
  };

  /** What exactly happened isn't important, just that an error occured */
  @action
  readonly setHistoricalDataError = (error: boolean) => {
    this._historicalDataError = error;
  };

  @action
  readonly setIsHistoricalDataLoading = (isLoading: boolean) => {
    this._isHistoricalDataLoading = isLoading;
  };

  @action
  readonly setPool = (pool: PoolWithPoolKey) => {
    this._pool = pool;
  };

  @action
  readonly setTokenX = (token: TokenItemType) => {
    this._tokenX = token;
  };

  @action
  readonly setTokenY = (token: TokenItemType) => {
    this._tokenY = token;
  };

  @action
  readonly setActiveLiquidity = (activeLiquidity: ActiveLiquidityPerTickRange[]) => {
    this._activeLiquidity = activeLiquidity;
  };
}

function getLiqFrom(target: number, list: ActiveLiquidityPerTickRange[]): number {
  for (let i = 0; i < list.length; i++) {
    if (list[i].lowerTick <= target && list[i].upperTick >= target) {
      return Number(list[i].liquidityAmount.toString());
    }
  }
  return 0;
}
