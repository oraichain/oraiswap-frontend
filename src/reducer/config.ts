import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Themes } from 'context/theme-context';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { KeyFilterPool } from 'pages/Pools';
import { embedNetworkInfos } from 'config/networkInfos';
import { ORAICHAIN_ID } from 'config/constants';

export type ChainInfoType = {
  networkType?: string;
  chainId?: string;
  rpc?: string;
  lcd?: string;
};

export type NetworkBridgeType = {
  rpc: string;
  chainId: string | number;
  chainName: string;
};

export function getDefaultNetwork(): NetworkBridgeType {
  const { rpc, chainId, chainName } = embedNetworkInfos.find((network) => network.chainId === ORAICHAIN_ID);
  return { rpc, chainId, chainName };
}

export interface ConfigState {
  address: string;
  metamaskAddress: string | null;
  tronAddress: string | null;
  chainId: string;
  chainInfo: ChainInfoType;
  infoEvm: ChainInfoType;
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
  fromNetwork: NetworkBridgeType;
}

const initialState: ConfigState = {
  address: '',
  metamaskAddress: '',
  tronAddress: '',
  chainId: 'Oraichain',
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
  fromNetwork: getDefaultNetwork()
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
