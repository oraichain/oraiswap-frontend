import useMultifactorReducer from 'hooks/useMultifactorReducer';
import { ConfirmPassStatus, PassphraseModalStatus } from 'reducer/type';
import { store } from 'store/configure';

const useSsoPassphrase = () => {
  const [, setConfirmStatus] = useMultifactorReducer('confirmPassphrase');
  const [, setModalStatus] = useMultifactorReducer('passphraseModalStatus');

  const open = () => {
    setModalStatus(PassphraseModalStatus.open);
    setConfirmStatus(ConfirmPassStatus.init);
  };

  const process = () => {
    open();

    return new Promise((resolve, reject) => {
      const unsubscribe = store.subscribe(() => {
        const confirmed = store.getState().multifactorSlice.confirmPassphrase;
        const passphrase = store.getState().multifactorSlice.passphrase;

        if (confirmed !== ConfirmPassStatus.init && passphrase) {
          if (confirmed === ConfirmPassStatus.approved && passphrase) {
            resolve({ passphrase, confirmed });
          } else {
            reject('User rejected!');
          }
          unsubscribe();
        }
      });
    });
  };

  const close = () => {
    setModalStatus(PassphraseModalStatus.open);
    setConfirmStatus(ConfirmPassStatus.init);
  };

  return {
    open,
    process,
    close
  };
};

export default useSsoPassphrase;
