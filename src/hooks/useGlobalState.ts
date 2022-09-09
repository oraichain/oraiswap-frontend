import { createGlobalState } from 'react-hooks-global-state';

export type GlobalState = {
  address: string;
  metamaskAddress: string | null;
  chainId: string;
};

const initialState: GlobalState = {
  address: '',
  metamaskAddress: '',
  chainId: '',
};
const { useGlobalState } = createGlobalState(initialState);

export default useGlobalState;
