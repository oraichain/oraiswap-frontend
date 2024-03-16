import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Themes } from 'context/theme-context';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { DepositInfo } from 'pages/BitcoinDashboard/@types';
import { KeyFilterPool } from 'pages/Pools/components/Filter';
import { PERSIST_VER } from 'store/constants';
// import { PERSIST_VERSION } from 'store/configure';

export type ChainInfoType = {
  networkType?: string;
  chainId?: string;
  rpc?: string;
  lcd?: string;
};

export type RewardPoolType = {
  reward: Array<string>;
  liquidity_token: string;
};

export interface ConfigState {
  address: string;
  metamaskAddress: string | null;
  tronAddress: string | null;
  btcAddress: string | null;
  cosmosAddress: { [key: string]: string };
  allPendingDeposits: { [key: string]: DepositInfo[] };
  chainId: string;
  chainInfo: ChainInfoType;
  infoEvm: ChainInfoType;
  filterNetwork: string;
  walletTypeStore: string;
  infoCosmos: ChainInfoType;
  statusChangeAccount: boolean;
  hideOtherSmallAmount: boolean;
  hideOraichainSmallAmount: boolean;
  theme: Themes;
  coingecko: CoinGeckoPrices<string>;
  apr: {
    [key: string]: number;
  };
  rewardPools: RewardPoolType[];
  filterDefaultPool: KeyFilterPool;
  persistVersion: number;
}

const initialState: ConfigState = {
  address: '',
  metamaskAddress: '',
  btcAddress: '',
  tronAddress: '',
  walletTypeStore: 'owallet',
  cosmosAddress: {},
  allPendingDeposits: {
    // orai1ehmhqcn8erf3dgavrca69zgp4rtxj5kqgtcnyd: [
    //   {
    //     txid: 'd360d3cf992f7ec39b8152a91a483e07891aab7010c34bcda65019107815c05f',
    //     vout: 1,
    //     amount: 1000,
    //     height: 834150,
    //     confirmations: 3
    //   }
    // ]
  },
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
  rewardPools: [],
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
