import LoginWidget from './LoginWidget';
import Modal from 'components/Modal';
import React from 'react';
import style from './ConnectWalletModal.module.scss';
import cn from 'classnames/bind';
import MetamaskImage from 'assets/icons/metamask.svg';
import KeplrImage from 'assets/images/keplr.png';
import OWalletImage from 'assets/images/owallet.png';
import { isMobile, isIOS, isAndroid } from '@walletconnect/browser-utils';

const cx = cn.bind(style);

interface ConnectWalletModalProps {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  address: string;
  connectKeplr: (type) => Promise<void>;
  setOpenConnectWalletModal: any;
}

const ConnectWalletModalCosmos: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  close,
  connectKeplr,
  address,
  open,
  setOpenConnectWalletModal
}) => {

  const onClick = async (type: string) => {
    setOpenConnectWalletModal(false)
    connectKeplr(type);
  }
  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true}>
      <div className={cx('select')}>
        <div className={cx('title')}>
          <div>Connect wallet</div>
        </div>
        <div className={cx('options')}>
          <div onClick={() => onClick('keplr')}>Connect Keplr</div>
          <div onClick={() => onClick('owallet')}>Connect Owallet</div>
        </div>
      </div>
    </Modal>
  );
};

export default ConnectWalletModalCosmos;