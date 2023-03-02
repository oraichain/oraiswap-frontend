import { ConfigState, updateConfig } from 'reducer/config';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/configure';

// help typescript realize return type from key of ConfigState
export default function useConfigReducer<StateKey extends keyof ConfigState>(
  key: StateKey
): readonly [ConfigState[StateKey], (value: ConfigState[StateKey]) => void] {
  const value = useSelector((state: RootState) => state.config[key]);
  const dispatch = useDispatch();
  const setValue = (newValue: ConfigState[StateKey]) => {
    dispatch(updateConfig(key, newValue));
  };
  return [value, setValue];
}
