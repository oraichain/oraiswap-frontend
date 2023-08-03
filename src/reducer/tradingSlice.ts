import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/configure';
import { PairToken, TradingState } from './type';
import { pairsChart } from 'components/TVChartContainer/config';

const initialState: TradingState = {
  listToken: [],
  currentToken: pairsChart.find((pair) => pair.symbol === 'ORAI/USDT'),
  chartLoading: false
};

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    setListToken: (state, action: PayloadAction<PairToken[]>) => {
      state.listToken = action.payload;
    },
    setCurrentToken: (state, action: PayloadAction<PairToken>) => {
      console.log('st', action.payload);
      state.currentToken = action.payload;
    },
    setChartLoading: (state, action: PayloadAction<boolean>) => {
      state.chartLoading = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setCurrentToken, setListToken, setChartLoading } = tradingSlice.actions;

export const selectCurrentToken = (state: RootState): PairToken => state.trading.currentToken;
export const selectChartLoading = (state: RootState): boolean => state.trading.chartLoading;
export const selectListToken = (state: RootState): PairToken[] => state.trading.listToken;

export default tradingSlice.reducer;
