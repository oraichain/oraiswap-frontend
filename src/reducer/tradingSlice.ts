import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/configure';
import { PairToken, TradingState } from './type';
import { DATA_PAIRS } from 'layouts/App';

const initialState: TradingState = {
  listToken: [],
  listTokenFilter: [],
  currentToken: DATA_PAIRS[0],
  currentPrice: ''
};

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    searchToken: (state, action: PayloadAction<string>) => {
      console.log('actin', action.payload);
    },
    setListToken: (state, action: PayloadAction<PairToken[]>) => {
      state.listToken = action.payload;
    },
    setListTokenFilterInitial: (state, action: PayloadAction<PairToken[]>) => {
      state.listTokenFilter = action.payload;
    },
    setCurrentToken: (state, action: PayloadAction<PairToken>) => {
      console.log('st', action.payload);
      state.currentToken = action.payload;
    },
    setCurrentPrice: (state, action: PayloadAction<string>) => {
      state.currentPrice = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { searchToken, setCurrentToken, setListToken, setListTokenFilterInitial, setCurrentPrice } =
  tradingSlice.actions;

export const selectTokenFilter = (state: RootState): PairToken[] => state.trading.listTokenFilter;
export const selectCurrentToken = (state: RootState): PairToken => state.trading.currentToken;
export const selectCurrentPrice = (state: RootState): string => state.trading.currentPrice;
export const selectListToken = (state: RootState): PairToken[] => state.trading.listToken;

export default tradingSlice.reducer;
