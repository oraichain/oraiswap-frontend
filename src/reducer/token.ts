import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TokenState {
  amounts: AmountDetails;
  pairs: PairDetails;
  lpPools: LpPoolDetails;
  bondLpPools: BondLpPoolDetails;
}

const initialState: TokenState = {
  amounts: {},
  pairs: {},
  lpPools: {},
  bondLpPools: {}
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
    removeToken: (state) => {
      state.amounts = {};
      state.pairs = {};
      state.lpPools = {};
      state.bondLpPools = {};
    },
    updateLpPools: (state, action: PayloadAction<LpPoolDetails>) => {
      state.lpPools = {
        ...state.lpPools,
        ...action.payload
      };
    },
    updateBondLpPools: (state, action: PayloadAction<BondLpPoolDetails>) => {
      state.bondLpPools = {
        ...state.bondLpPools,
        ...action.payload
      };
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateAmounts, updatePairs, removeToken, updateLpPools, updateBondLpPools } = tokenSlice.actions;

export default tokenSlice.reducer;
