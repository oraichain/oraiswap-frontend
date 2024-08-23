import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { ConfirmSignStatus, MultifactorState, UiHandlerStatus } from './type';

const initialState: MultifactorState = {
  status: UiHandlerStatus.close,
  dataSign: null,
  confirmSign: ConfirmSignStatus.init
};

const multifactorSlice = createSlice({
  name: 'multifactorSlice',
  initialState,
  reducers: {
    updateMultifactorState: {
      reducer(state, action: PayloadAction<string, string, MultifactorState[keyof MultifactorState]>) {
        state[action.payload] = action.meta;
      },
      prepare(key: string, value: MultifactorState[keyof MultifactorState]) {
        return { payload: key, meta: value };
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateMultifactorState } = multifactorSlice.actions;

export default multifactorSlice.reducer;
