import { FC, useContext, useState } from 'react';
import Modal from 'components/Modal';
import classNames from 'classnames';
import style from './index.module.scss';
import useConfigReducer from 'hooks/useConfigReducer';
import { NomicContext } from 'context/nomic-context';

interface ModalProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DepositBtcModal: FC<ModalProps> = ({ isOpen, open, close }) => {
  const [theme] = useConfigReducer('theme');
  const nomic = useContext(NomicContext);
  return (
    <Modal theme={theme} isOpen={isOpen} close={close} open={open} className={classNames(style.modal)}>
      <div className={classNames(style.modal)}>
        <button
          onClick={async () => {
            await nomic.setRecoveryAddress('tb1qepum984v3l7nnvzy79dtgx3kh709uvm93v3qjj');
          }}
        >
          Set recovery address
        </button>
      </div>
    </Modal>
  );
};

export default DepositBtcModal;
