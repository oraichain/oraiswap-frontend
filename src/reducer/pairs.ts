import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { PairInfoExtend } from 'types/token';

export interface TokenState {
  pairInfos: PairInfoExtend[];
}

const initialState: TokenState = {
  pairInfos: []
};

export const pairsSlice = createSlice({
  name: 'pairs',
  initialState,
  reducers: {
    updatePairInfos: (state, action: PayloadAction<PairInfoExtend[]>) => {
      state.pairInfos = action.payload;
    },
    removePairInfos: (state) => {
      state.pairInfos = [];
    }
  }
});

// Action creators are generated for each case reducer function
export const { updatePairInfos, removePairInfos } = pairsSlice.actions;

export default pairsSlice.reducer;
