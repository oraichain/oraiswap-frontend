import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

import useMultifactorReducer from 'hooks/useMultifactorReducer';
import { ConfirmSignStatus, UiHandlerStatus } from 'reducer/type';
import { store } from 'store/configure';

const useSsoHandler = () => {
  const [, setModalStatus] = useMultifactorReducer('status');
  const [, setDataSign] = useMultifactorReducer('dataSign');
  const [, setConfirmSign] = useMultifactorReducer('confirmSign');

  const open = (data: any) => {
    setModalStatus(UiHandlerStatus.open);
    setDataSign(data);
    setConfirmSign(ConfirmSignStatus.init);
  };

  const process = (data: any) => {
    open(data);

    return new Promise((resolve, reject) => {
      const unsubscribe = store.subscribe(() => {
        const confirmed = store.getState().multifactorSlice.confirmSign;

        if (confirmed !== ConfirmSignStatus.init) {
          if (confirmed === ConfirmSignStatus.approved) {
            resolve(confirmed);
          } else {
            reject('User rejected the transaction');
          }
          unsubscribe();
        }
      });
    });
  };

  const close = () => {
    setModalStatus(UiHandlerStatus.close);
    setConfirmSign(ConfirmSignStatus.init);
    setDataSign(null);
  };

  return {
    open,
    process,
    close
  };
};

export default useSsoHandler;
