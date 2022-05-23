import LoginWidget from './LoginWidget';
import Modal from 'components/Modal';
import React from 'react';
import MESSAGE from 'lang/MESSAGE.json';
import style from './ConnectWalletModal.module.scss';
import cn from 'classnames/bind';
import MetamaskImage from 'assets/icons/metamask.svg';
import OWalletImage from 'assets/images/owallet.png';

const cx = cn.bind(style);

interface ConnectWalletModalProps {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  address: string;
  metamaskAddress: string | null;
  disconnectMetamask: () => Promise<void>;
  disconnectOWallet: () => Promise<void>;
  connectOWallet: () => Promise<void>;
  connectMetamask: () => Promise<void>;
}

const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  close,
  connectOWallet,
  disconnectOWallet,
  connectMetamask,
  metamaskAddress,
  disconnectMetamask,
  address,
  open
}) => {
  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true}>
      <div className={cx('select')}>
        <div className={cx('title')}>
          <div>Connect wallet</div>
        </div>
        <div className={cx('options')}>
          <LoginWidget
            text={MESSAGE.Form.Button.ConnectOWallet}
            address={address}
            logo={OWalletImage}
            connect={connectOWallet}
            disconnect={disconnectOWallet}
          />
          <LoginWidget
            address={metamaskAddress}
            logo={MetamaskImage}
            text={MESSAGE.Form.Button.ConnectMetamask}
            connect={connectMetamask}
            disconnect={disconnectMetamask}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConnectWalletModal;
