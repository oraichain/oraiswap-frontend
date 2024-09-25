import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
// import { PERSIST_VERSION } from 'store/configure';

export interface TemporaryConfigState {
  customBanner: boolean;
}

const initialState: TemporaryConfigState = {
  customBanner: true
};

export const temporaryConfigSlice = createSlice({
  name: 'temporaryConfig',
  initialState,
  reducers: {
    updateConfig: {
      reducer(state, action: PayloadAction<string, string, TemporaryConfigState[keyof TemporaryConfigState]>) {
        state[action.payload] = action.meta;
      },
      prepare(key: string, value: TemporaryConfigState[keyof TemporaryConfigState]) {
        return { payload: key, meta: value };
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateConfig } = temporaryConfigSlice.actions;

export default temporaryConfigSlice.reducer;
