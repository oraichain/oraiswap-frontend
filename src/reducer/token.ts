import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TokenState {
  amounts: AmountDetails;
  pairs: PairDetails;
}

const initialState: TokenState = {
  amounts: {},
  pairs: {}
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    updateAmounts: (state, action: PayloadAction<AmountDetails>) => {
      state.amounts = {
        ...state.amounts,
        ...action.payload
      };
    },
    updatePairs: (state, action: PayloadAction<PairDetails>) => {
      state.pairs = {
        ...state.pairs,
        ...action.payload
      };
    },
    removeToken: (state, action: PayloadAction<AmountDetails>) => {
      state.amounts = {};
      state.pairs = {};
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateAmounts, updatePairs, removeToken } = tokenSlice.actions;

export default tokenSlice.reducer;
