import { MultifactorState } from './../reducer/type';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/configure';
import { updateMultifactorState } from 'reducer/multifactorSlice';

// help typescript realize return type from key of MultifactorState
export default function useMultifactorReducer<StateKey extends keyof MultifactorState>(
  key: StateKey
): readonly [MultifactorState[StateKey], (value: MultifactorState[StateKey]) => void] {
  const value = useSelector((state: RootState) => state.multifactorSlice[key]);
  const dispatch = useDispatch();
  const setValue = (newValue: MultifactorState[StateKey]) => {
    dispatch(updateMultifactorState(key, newValue));
  };
  return [value, setValue];
}
