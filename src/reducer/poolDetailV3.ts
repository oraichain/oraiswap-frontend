import { extractAddress } from '@oraichain/oraiswap-v3';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TokenItemType } from '@oraichain/oraidex-common';
import SingletonOraiswapV3, { PRICE_SCALE, stringToPoolKey } from 'libs/contractSingleton';
import { oraichainTokens } from '@oraichain/oraidex-common';
import { Pool, PoolKey } from '@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types';
import { convertPlotTicks, printBigint } from 'pages/Pool-V3/components/PriceRangePlot/utils';
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
  activeLiquidity: ActiveLiquidityPerTickRange[]; //
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
  historicalRange: '7d',
  cache1Day: [],
  cache7Day: [],
  cache1Month: [],
  cache1Year: [],
  historicalChartData: [],
  fullRange: false,
  xRange: [0, 0],
  yRange: [0, 0],
  currentPrice: 1,
  activeLiquidity: [],
  liquidityChartData: [],
  zoom: 1.05,
  range: undefined
};

export const poolDetailV3Slice = createSlice({
  name: 'poolDetailV3',
  initialState,
  reducers: {
    setPoolId: (state, action: PayloadAction<string>) => {
      console.log('set pool id');
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
    setLiquidityChartData: (state, action: PayloadAction<LiquidityChartData[]>) => {
      state.liquidityChartData = action.payload;
    },
    setHistoricalChartData: (state, action: PayloadAction<TokenPairHistoricalPrice[]>) => {
      let data = action.payload;
      if (state.currentPrice) {
        data = [...data, { time: Date.now(), close: state.currentPrice }];
      }
      state.historicalChartData = data;
    },
    setHistoricalRange: (state, action: PayloadAction<TimeDuration>) => {
      state.historicalRange = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPool.fulfilled, (state, action) => {
      state.pool = action.payload;
      const sqrtPrice = +printBigint(BigInt(state.pool.sqrt_price), Number(PRICE_SCALE));
      const price = (sqrtPrice * sqrtPrice) / 10 ** ((state.tokenY.decimals ?? 0) - (state.tokenX.decimals ?? 0));
      state.currentPrice = price;
    });
    builder.addCase(fetchActiveLiquidityData.fulfilled, (state, action) => {
      state.activeLiquidity = action.payload;
    });
    builder.addCase(fetchHistoricalPriceData1D.fulfilled, (state, action) => {
      state.cache1Day = action.payload;
    });
    builder.addCase(fetchHistoricalPriceData7D.fulfilled, (state, action) => {
      state.cache7Day = action.payload;
    });
    builder.addCase(fetchHistoricalPriceData1M.fulfilled, (state, action) => {
      state.cache1Month = action.payload;
    });
    builder.addCase(fetchHistoricalPriceData1Y.fulfilled, (state, action) => {
      state.cache1Year = action.payload;
    });
  }
});

export const fetchPool = createAsyncThunk('poolDetailV3/fetchPool', async (poolKey: PoolKey) => {
  console.log('get pool');
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

export const {
  setPoolId,
  setXRange,
  setYRange,
  setLiquidityChartData,
  setHistoricalChartData,
  setHistoricalRange,
  setZoom
} = poolDetailV3Slice.actions;

export default poolDetailV3Slice.reducer;
