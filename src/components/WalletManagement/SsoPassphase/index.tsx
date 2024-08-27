import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import classNames from 'classnames';
import { Button } from 'components/Button';
import useMultifactorReducer from 'hooks/useMultifactorReducer';
import {
  PP_CACHE_KEY,
  removeWeb3MultifactorStorageKey,
  setWeb3MultifactorStorageKey
} from 'libs/web3MultifactorsUtils';
import { ConfirmPassStatus, PassphraseModalStatus } from 'reducer/type';
import styles from './index.module.scss';

const SsoPassphraseModal = () => {
  const [, setConfirmStatus] = useMultifactorReducer('confirmPassphrase');
  const [modalStatus, setModalStatus] = useMultifactorReducer('passphraseModalStatus');
  const [passphrase, setPassphrase] = useMultifactorReducer('passphrase');

  const rejectTx = () => {
    setConfirmStatus(ConfirmPassStatus.rejected);
    setModalStatus(PassphraseModalStatus.close);
    setPassphrase(null);
    removeWeb3MultifactorStorageKey(PP_CACHE_KEY);
  };

  return (
    <div className={classNames(styles.signModal, { [styles.active]: modalStatus === PassphraseModalStatus.open })}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          Setup Passphrase
          <div onClick={() => rejectTx()}>
            <CloseIcon />
          </div>
        </div>

        <div className={styles.dataContent}>
          You must enter your passphrase to active on this current device
          <br />
          <div className={styles.inputPass}>
            <input
              type="text"
              onChange={(e) => {
                e.preventDefault();
                setPassphrase(e.target.value?.trim());
              }}
              value={passphrase}
              role="presentation"
              autoComplete="off"
              required
              placeholder="Enter your passphrase . . ."
            />
          </div>
        </div>

        <div className={styles.btnGroup}>
          <Button
            type="third-sm"
            onClick={() => {
              rejectTx();
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary-sm"
            onClick={() => {
              setModalStatus(PassphraseModalStatus.close);
              setConfirmStatus(ConfirmPassStatus.approved);
              setWeb3MultifactorStorageKey(PP_CACHE_KEY, passphrase);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SsoPassphraseModal;
