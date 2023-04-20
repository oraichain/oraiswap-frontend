import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Themes } from 'context/theme-context';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { KeyFilterPool } from 'pages/Pools/indexV2';
import { PERSIST_VER } from 'store/constants';
// import { PERSIST_VERSION } from 'store/configure';

export type ChainInfoType = {
  networkType?: string;
  chainId?: string;
  rpc?: string;
  lcd?: string;
};

export interface ConfigState {
  address: string;
  metamaskAddress: string | null;
  tronAddress: string | null;
  chainId: string;
  chainInfo: ChainInfoType;
  infoEvm: ChainInfoType;
  filterNetwork: string;
  infoCosmos: ChainInfoType;
  statusChangeAccount: boolean;
  hideOtherSmallAmount: boolean;
  hideOraichainSmallAmount: boolean;
  theme: Themes;
  coingecko: CoinGeckoPrices<string>;
  apr: {
    [key: string]: number;
  };
  filterDefaultPool: KeyFilterPool;
  persistVersion: number;
}

const initialState: ConfigState = {
  address: '',
  metamaskAddress: '',
  tronAddress: '',
  chainId: 'Oraichain',
  filterNetwork: 'Oraichain',
  chainInfo: {},
  infoEvm: {},
  infoCosmos: {},
  statusChangeAccount: false,
  hideOtherSmallAmount: false,
  hideOraichainSmallAmount: false,
  theme: 'dark',
  coingecko: {},
  apr: {},
  filterDefaultPool: KeyFilterPool.all_pool,
  persistVersion: PERSIST_VER
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateConfig: {
      reducer(state, action: PayloadAction<string, string, ConfigState[keyof ConfigState]>) {
        state[action.payload] = action.meta;
      },
      prepare(key: string, value: ConfigState[keyof ConfigState]) {
        return { payload: key, meta: value };
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateConfig } = configSlice.actions;

export default configSlice.reducer;
