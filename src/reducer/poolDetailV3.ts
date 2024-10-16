import { extractAddress, LiquidityTick, Tickmap } from '@oraichain/oraiswap-v3';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TokenItemType } from '@oraichain/oraidex-common';
import SingletonOraiswapV3, { PRICE_SCALE, stringToPoolKey } from 'libs/contractSingleton';
import { oraichainTokens } from '@oraichain/oraidex-common';
import { Pool, PoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import {
  convertPlotTicks,
  createLiquidityPlot,
  handleGetCurrentPlotTicks,
  printBigint
} from 'pages/Pool-V3/components/PriceRangePlot/utils';
import { getHistoricalPriceData } from 'rest/graphClient';

export const AvailableTimeDurations = ['1d', '7d', '1mo', '1y'] as const;

export type TimeDuration = (typeof AvailableTimeDurations)[number];

export interface TokenPairHistoricalPrice {
  close: number;
  time: number;
}

export interface LiquidityChartData {
  price: number;
  depth: number;
}

export type ActiveLiquidityPerTickRange = {
  /** Price-correlated tick index. */
  lowerTick: number;
  upperTick: number;
  /** Net liquidity, for calculating active liquidity. */
  liquidityAmount: number;
};

export interface PoolDetailV3State {
  poolId: string; //
  poolKey: PoolKey; //
  pool: Pool;
  tokenX: TokenItemType; //
  tokenY: TokenItemType; //
  isXToY: boolean; //
  historicalRange: TimeDuration; //
  cache1Day: TokenPairHistoricalPrice[]; //
  cache7Day: TokenPairHistoricalPrice[]; //
  cache1Month: TokenPairHistoricalPrice[]; //
  cache1Year: TokenPairHistoricalPrice[]; //
  historicalChartData: TokenPairHistoricalPrice[]; //
  fullRange: boolean; //
  xRange: [number, number]; //
  yRange: [number, number]; //
  currentPrice: number; //
  fullTickMap: Tickmap;
  liquidityTicks: LiquidityTick[];
  liquidityChartData: LiquidityChartData[];
  zoom: number;
  range: [number, number];
}

const initialState: PoolDetailV3State = {
  poolId: '',
  poolKey: null,
  pool: null,
  tokenX: null,
  tokenY: null,
  isXToY: true,
  historicalRange: '7d',
  cache1Day: null,
  cache7Day: null,
  cache1Month: null,
  cache1Year: null,
  historicalChartData: null,
  fullRange: false,
  xRange: null,
  yRange: null,
  currentPrice: null,
  fullTickMap: null,
  liquidityTicks: null,
  liquidityChartData: null,
  zoom: 1.05,
  range: undefined
};

export const poolDetailV3Slice = createSlice({
  name: 'poolDetailV3',
  initialState,
  reducers: {
    setPoolId: (state, action: PayloadAction<string>) => {
      state.poolId = action.payload;
      const poolKey = stringToPoolKey(action.payload);
      state.poolKey = poolKey;
      const tokenX = oraichainTokens.find((token) => extractAddress(token) === poolKey.token_x);
      const tokenY = oraichainTokens.find((token) => extractAddress(token) === poolKey.token_y);
      state.tokenX = tokenX;
      state.tokenY = tokenY;
    },
    setYRange: (state, action: PayloadAction<[number, number]>) => {
      state.yRange = action.payload;
    },
    setXRange: (state, action: PayloadAction<[number, number]>) => {
      state.xRange = action.payload;
    },
    setLiquidityChartData: (state) => {
      if (!state.liquidityTicks || !state.poolKey || !state.tokenX || !state.tokenY || !state.yRange) return;
      const plots = createLiquidityPlot(
        state.liquidityTicks,
        state.poolKey.fee_tier.tick_spacing,
        state.isXToY,
        state.tokenX.decimals,
        state.tokenY.decimals
      );
      const fullData = plots.map((tick) => {
        return {
          price: tick.x,
          depth: tick.y
        };
      });

      // just get data has price in yRange
      state.liquidityChartData = fullData.filter(
        (data) => data.price >= state.yRange[0] && data.price <= state.yRange[1]
      );
    },
    setHistoricalChartData: (state, action: PayloadAction<TokenPairHistoricalPrice[]>) => {
      let data = action.payload;
      state.historicalChartData = data;
    },
    setHistoricalRange: (state, action: PayloadAction<TimeDuration>) => {
      state.historicalRange = action.payload;
      switch (state.historicalRange) {
        case '1d':
          state.historicalChartData = state.cache1Day;
          break;
        case '7d':
          state.historicalChartData = state.cache7Day;
          break;
        case '1mo':
          state.historicalChartData = state.cache1Month;
          break;
        case '1y':
          state.historicalChartData = state.cache1Year;
          break;
        default:
          state.historicalChartData = state.cache7Day;
      }
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setFullTickMap: (state, action: PayloadAction<Tickmap>) => {
      state.fullTickMap = action.payload;
    },
    setAllLiquidityTicks: (state, action: PayloadAction<LiquidityTick[]>) => {
      state.liquidityTicks = action.payload;
    },
    setToDefault: () => ({ ...initialState }),
    setIsXToY: (state, action: PayloadAction<boolean>) => {
      state.isXToY = action.payload;
      state.currentPrice = 1 / state.currentPrice;
      if (state.historicalRange) {
        state.historicalChartData = revertHistoricalChartData(state.historicalChartData);
        state.cache1Day = revertHistoricalChartData(state.cache1Day);
        state.cache7Day = revertHistoricalChartData(state.cache7Day);
        state.cache1Month = revertHistoricalChartData(state.cache1Month);
        state.cache1Year = revertHistoricalChartData(state.cache1Year);
      }
      if (state.liquidityChartData) {
        state.liquidityChartData = revertLiquidityChartData(state.liquidityChartData);
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPool.fulfilled, (state, action) => {
      state.pool = action.payload;
      const sqrtPrice = +printBigint(BigInt(state.pool.sqrt_price), Number(PRICE_SCALE));
      const price = (sqrtPrice * sqrtPrice) / 10 ** ((state.tokenY.decimals ?? 0) - (state.tokenX.decimals ?? 0));
      state.currentPrice = price;
    });
    builder.addCase(fetchHistoricalPriceData1D.fulfilled, (state, action) => {
      if (action.payload.poolId !== state.poolId) return;
      state.cache1Day = state.isXToY ? action.payload.data : revertHistoricalChartData(action.payload.data);
      if (state.historicalRange === '1d') {
        state.historicalChartData = state.isXToY ? action.payload.data : revertHistoricalChartData(action.payload.data);
      }
    });
    builder.addCase(fetchHistoricalPriceData7D.fulfilled, (state, action) => {
      if (action.payload.poolId !== state.poolId) return;
      state.cache7Day = state.isXToY ? action.payload.data : revertHistoricalChartData(action.payload.data);
      if (state.historicalRange === '7d') {
        state.historicalChartData = state.isXToY ? action.payload.data : revertHistoricalChartData(action.payload.data);
      }
    });
    builder.addCase(fetchHistoricalPriceData1M.fulfilled, (state, action) => {
      if (action.payload.poolId !== state.poolId) return;
      state.cache1Month = state.isXToY ? action.payload.data : revertHistoricalChartData(action.payload.data);
      if (state.historicalRange === '1mo') {
        state.historicalChartData = state.isXToY ? action.payload.data : revertHistoricalChartData(action.payload.data);
      }
    });
    builder.addCase(fetchHistoricalPriceData1Y.fulfilled, (state, action) => {
      if (action.payload.poolId !== state.poolId) return;
      state.cache1Year = state.isXToY ? action.payload.data : revertHistoricalChartData(action.payload.data);
      if (state.historicalRange === '1y') {
        state.historicalChartData = state.isXToY ? action.payload.data : revertHistoricalChartData(action.payload.data);
      }
    });
    builder.addCase(fetchTickMap.fulfilled, (state, action) => {
      state.fullTickMap = action.payload;
    });
    builder.addCase(fetchLiquidityTicks.fulfilled, (state, action) => {
      state.liquidityTicks = action.payload;
    });
  }
});

export const fetchTickMap = createAsyncThunk('poolDetailV3/fetchTickMap', async (poolKey: PoolKey) => {
  return await SingletonOraiswapV3.getFullTickmap(poolKey);
});

export const fetchLiquidityTicks = createAsyncThunk(
  'poolDetailV3/fetchLiquidityTicks',
  async ({ poolKey, tickMap }: { poolKey: PoolKey; tickMap: Tickmap }) => {
    return await SingletonOraiswapV3.getAllLiquidityTicks(poolKey, tickMap);
  }
);

export const fetchPool = createAsyncThunk('poolDetailV3/fetchPool', async (poolKey: PoolKey) => {
  return (await SingletonOraiswapV3.getPool(poolKey)).pool;
});

export const fetchActiveLiquidityData = createAsyncThunk(
  'poolDetailV3/fetchActiveLiquidityData',
  async ({
    poolKey,
    isXToY,
    xDecimal,
    yDecimal
  }: {
    poolKey: PoolKey;
    isXToY: boolean;
    xDecimal: number;
    yDecimal: number;
  }) => {
    return await convertPlotTicks({
      poolKey,
      isXToY,
      xDecimal,
      yDecimal
    });
  }
);

// separate to 4 actions for better caching and performance
export const fetchHistoricalPriceData1D = createAsyncThunk(
  'poolDetailV3/fetchHistoricalPriceData1D',
  async (poolId: string) => {
    return await getHistoricalPriceData(poolId, '1d');
  }
);

export const fetchHistoricalPriceData7D = createAsyncThunk(
  'poolDetailV3/fetchHistoricalPriceData7D',
  async (poolId: string) => {
    return await getHistoricalPriceData(poolId, '7d');
  }
);

export const fetchHistoricalPriceData1M = createAsyncThunk(
  'poolDetailV3/fetchHistoricalPriceData1M',
  async (poolId: string) => {
    return await getHistoricalPriceData(poolId, '1mo');
  }
);

export const fetchHistoricalPriceData1Y = createAsyncThunk(
  'poolDetailV3/fetchHistoricalPriceData1Y',
  async (poolId: string) => {
    return await getHistoricalPriceData(poolId, '1y');
  }
);

const revertLiquidityChartData = (data: LiquidityChartData[]) => {
  if (!data) return [];
  return data.map((item) => {
    return {
      price: 1 / item.price,
      depth: item.depth
    };
  });
};

const revertHistoricalChartData = (data: TokenPairHistoricalPrice[]) => {
  if (!data) return [];
  return data.map((item) => {
    return {
      time: item.time,
      close: 1 / item.close
    };
  });
};

export const {
  setPoolId,
  setXRange,
  setYRange,
  setLiquidityChartData,
  setHistoricalChartData,
  setHistoricalRange,
  setZoom,
  setToDefault,
  setIsXToY
} = poolDetailV3Slice.actions;

export default poolDetailV3Slice.reducer;
