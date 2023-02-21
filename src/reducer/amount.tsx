import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AmountState {
  amounts: Object;
}

const initialState: AmountState = {
  amounts: {},
};

export const amountsSlice = createSlice({
  name: 'amount',
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
export const { updateAmounts } = amountsSlice.actions;

export default amountsSlice.reducer;
