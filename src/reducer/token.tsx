import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TokenState {
  amounts: Object;
}

const initialState: TokenState = {
  amounts: {},
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    updateAmounts: (state, action: PayloadAction<any>) => {
      console.log({ state, action });
      
      state.amounts = {
        ...state.amounts,
        ...action.payload
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAmounts } = tokenSlice.actions;

export default tokenSlice.reducer;
