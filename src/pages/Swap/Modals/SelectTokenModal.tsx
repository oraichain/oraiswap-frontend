import React, { FC, useState } from 'react';
import Modal from 'components/Modal';
import style from './SelectTokenModal.module.scss';
import cn from 'classnames/bind';

const cx = cn.bind(style);

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

const SelectTokenModal: FC<ModalProps> = ({
  isOpen,
  close,
  open,
  listToken,
  setToken,
  icon
}) => {
  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true}>
      <div className={cx('select')}>
        <div className={cx('title')}>
          <div>Select a token</div>
        </div>
        <div className={cx('options')}>
          {listToken.map((option: any, idx) => {
            return (
              <div
                className={cx('item')}
                key={idx}
                onClick={() => {
                  setToken(option.denom);
                  close();
                }}
              >
                {!icon && <option.Icon className={cx('logo')} />}
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
