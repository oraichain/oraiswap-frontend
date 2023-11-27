import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/configure';
import { PairToken, TradingState } from './type';
import { PAIRS_CHART } from 'config/pools';

const initialState: TradingState = {
  currentToken: PAIRS_CHART.find((pair) => pair.symbol === 'ORAI/USDT'),
  chartTimeFrame: 0
};

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    setCurrentToken: (state, action: PayloadAction<PairToken>) => {
      state.currentToken = action.payload;
    },
    setChartTimeFrame: (state, action: PayloadAction<number>) => {
      state.chartTimeFrame = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setCurrentToken, setChartTimeFrame } = tradingSlice.actions;

export const selectCurrentToken = (state: RootState): PairToken => state.trading.currentToken;
export const selectChartTimeFrame = (state: RootState): number => state.trading.chartTimeFrame;

export default tradingSlice.reducer;
