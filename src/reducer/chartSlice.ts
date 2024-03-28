import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/configure';
import { FILTER_DAY, FILTER_TIME_CHART, PoolChartState, TAB_CHART, TAB_CHART_SWAP } from './type';

const initialState: PoolChartState = {
  filterDay: FILTER_DAY.DAY,
  tabChart: TAB_CHART.LIQUIDITY,
  filterTimeSwap: FILTER_TIME_CHART.DAY,
  tabChartSwap: TAB_CHART_SWAP.TOKEN
};

const chartSlice = createSlice({
  name: 'chartSlice',
  initialState,
  reducers: {
    setFilterDay: (state, action: PayloadAction<FILTER_DAY>) => {
      state.filterDay = action.payload;
    },
    setTabChart: (state, action: PayloadAction<TAB_CHART>) => {
      state.tabChart = action.payload;
    },
    setFilterTimeSwap: (state, action: PayloadAction<FILTER_TIME_CHART>) => {
      state.filterTimeSwap = action.payload;
    },
    setTabChartSwap: (state, action: PayloadAction<TAB_CHART_SWAP>) => {
      state.tabChartSwap = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setFilterDay, setTabChart, setFilterTimeSwap, setTabChartSwap } = chartSlice.actions;

export const selectCurrentFilterDay = (state: RootState): FILTER_DAY => state.chartSlice.filterDay;
export const selectCurrentTabChart = (state: RootState): TAB_CHART => state.chartSlice.tabChart;
export const selectCurrentSwapTabChart = (state: RootState): TAB_CHART_SWAP => state.chartSlice.tabChartSwap;
export const selectCurrentSwapFilterTime = (state: RootState): FILTER_TIME_CHART => state.chartSlice.filterTimeSwap;

export default chartSlice.reducer;
