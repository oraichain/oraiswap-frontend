import cn from 'classnames/bind';
import Modal from 'components/Modal';
import { FC } from 'react';
import styles from './SelectTokenModal.module.scss';

const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
  listToken: any[];
  setToken: (denom: string) => void;
  icon?: boolean;
}

const SelectTokenModal: FC<ModalProps> = ({ isOpen, close, open, listToken, setToken, icon }) => {
  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true}>
      <div className={cx('select')}>
        <div className={cx('title')}>
          <div>Select a network</div>
        </div>
        <div className={cx('options')}>
          {listToken.map((option: any, idx) => {
            return (
              <div
                className={cx('item')}
                key={idx}
                onClick={() => {
                  setToken(option.title);
                  close();
                }}
              >
                <div>{option.icon}</div>
                <div className={cx('grow')}>
                  <div>{option.title || option.name}</div>
                </div>
                <div>{option.balance}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default SelectTokenModal;
