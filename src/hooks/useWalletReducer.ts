import { WalletState, updateWallets } from 'reducer/wallet';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/configure';

// help typescript realize return type from key of WalletState
export default function useWalletReducer<StateKey extends keyof WalletState>(
  key: StateKey
): readonly [WalletState[StateKey], (value: WalletState[StateKey]) => void] {
  const value = useSelector((state: RootState) => state.wallet[key]);
  const dispatch = useDispatch();
  const setValue = (newValue: WalletState[StateKey]) => {
    dispatch(updateWallets(key, newValue));
  };
  return [value, setValue];
}
