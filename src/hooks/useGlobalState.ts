import { createGlobalState } from 'react-hooks-global-state';

export type ChainInfoType = {
  networkType?: string;
  chainId?: string;
  rpc?: string;
  lcd?: string;
};
export type GlobalState = {
  address: string;
  metamaskAddress: string | null;
  chainId: string;
  chainInfo: ChainInfoType;
  infoEvm: ChainInfoType;
  infoCosmos: ChainInfoType;
  statusChangeAccount: boolean;
};

const initialState: GlobalState = {
  address: '',
  metamaskAddress: '',
  chainId: '',
  chainInfo: {},
  infoEvm: {},
  infoCosmos: {},
  statusChangeAccount: false,
};
const { useGlobalState } = createGlobalState(initialState);

export default useGlobalState;
