import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import classNames from 'classnames';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import useMultifactorReducer from 'hooks/useMultifactorReducer';
import { ConfirmSignStatus, UiHandlerStatus } from 'reducer/type';
import styles from './index.module.scss';
import ReactJson from 'react-json-view';
import useTheme from 'hooks/useTheme';

const SsoSignModal = () => {
  const [, setConfirmSignStatus] = useMultifactorReducer('confirmSign');
  const [modalStatus, setModalStatus] = useMultifactorReducer('status');
  const [dataSign, setDataSign] = useMultifactorReducer('dataSign');
  const theme = useTheme();

  const rejectTx = () => {
    setConfirmSignStatus(ConfirmSignStatus.rejected);
    setModalStatus(UiHandlerStatus.close);
    setDataSign(null);
  };

  return (
    <div className={classNames(styles.signModal, { [styles.active]: modalStatus === UiHandlerStatus.open })}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          Approve Transaction
          <div onClick={() => rejectTx()}>
            <CloseIcon />
          </div>
        </div>

        <div className={styles.dataContent}>
          Data:
          <br />
          <br />
          {/* <div>{JSON.stringify(dataSign || '')}</div> */}
          <div className={styles.json}>
            {!dataSign ? (
              <p style={{ textAlign: 'center' }}>No data sign</p>
            ) : (
              <ReactJson
                enableClipboard={false}
                groupArraysAfterLength={10}
                displayDataTypes={false}
                displayObjectSize
                collapseStringsAfterLength={20}
                src={dataSign}
                theme={theme === 'light' ? 'bright:inverted' : 'google'} // railscasts
              />
            )}
          </div>
        </div>

        <div className={styles.btnGroup}>
          <Button
            type="third-sm"
            onClick={() => {
              setConfirmSignStatus(ConfirmSignStatus.rejected);
              setModalStatus(UiHandlerStatus.close);
              setDataSign(null);
            }}
          >
            Reject
          </Button>
          <Button
            type="primary-sm"
            onClick={() => {
              setModalStatus(UiHandlerStatus.processing);
              setConfirmSignStatus(ConfirmSignStatus.approved);
            }}
          >
            {modalStatus === UiHandlerStatus.processing && <Loader width={20} height={20} />}
            &nbsp;&nbsp;Approve
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SsoSignModal;
