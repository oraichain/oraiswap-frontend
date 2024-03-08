import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/configure';
import { FILTER_DAY, PoolChartState, TAB_CHART } from './type';

const initialState: PoolChartState = {
  filterDay: FILTER_DAY.DAY,
  tabChart: TAB_CHART.LIQUIDITY
};

const poolChartSlice = createSlice({
  name: 'poolChart',
  initialState,
  reducers: {
    setFilterDay: (state, action: PayloadAction<FILTER_DAY>) => {
      console.log('first', action.payload);
      state.filterDay = action.payload;
    },
    setTabChart: (state, action: PayloadAction<TAB_CHART>) => {
      state.tabChart = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setFilterDay, setTabChart } = poolChartSlice.actions;

export const selectCurrentFilterDay = (state: RootState): FILTER_DAY => state.poolChart.filterDay;
export const selectCurrentTabChart = (state: RootState): TAB_CHART => state.poolChart.tabChart;

export default poolChartSlice.reducer;
