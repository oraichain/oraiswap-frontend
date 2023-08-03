import LoginWidget from './LoginWidget';
import Modal from 'components/Modal';
import React from 'react';
import style from './ConnectWalletModal.module.scss';
import cn from 'classnames/bind';
import { checkVersionWallet, displayInstallWallet } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import KeplrImage from 'assets/images/keplr.png';
import { ReactComponent as Logout } from 'assets/icons/logout.svg';
import OWalletImage from 'assets/images/orai_wallet_logo.png';
import CenterEllipsis from 'components/CenterEllipsis';
import LoadingBox from 'components/LoadingBox';
import { WalletType } from 'config/constants';

const cx = cn.bind(style);

interface ConnectWalletModalProps {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  address: string;
  disconnect: () => Promise<void>;
  connectKeplr: (type) => Promise<void>;
  isCheckKeplr: boolean;
  isCheckOwallet: boolean;
}

const ConnectWalletModalCosmos: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  close,
  connectKeplr,
  disconnect,
  address,
  open,
  isCheckOwallet,
  isCheckKeplr
}) => {
  const [theme] = useConfigReducer('theme');
  const [loadingWallet, setLoadingWallet] = React.useState(false);

  const onClick = async (type: WalletType) => {
    if (type === 'owallet' && !window.owallet) {
      return displayInstallWallet('', `You need to install OWallet to continue.`);
    }
    if (type === 'keplr' && (!window.keplr || checkVersionWallet())) {
      return displayInstallWallet(
        '',
        `You need to install Keplr to continue.`,
        'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap'
      );
    }
    try {
      setLoadingWallet(true);
      await connectKeplr(type);
      setTimeout(() => setLoadingWallet(false), 1000);
    } catch (err) {
      setLoadingWallet(false);
    }
  };

  const arr = [
    {
      img: OWalletImage,
      isCheck: isCheckOwallet,
      type: 'owallet',
      title: 'Connect OWallet',
      label: 'OWallet'
    },
    {
      img: KeplrImage,
      isCheck: isCheckKeplr,
      type: 'keplr',
      title: 'Connect Keplr',
      label: 'Keplr Wallet'
    }
  ];

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true}>
      <LoadingBox loading={loadingWallet}>
        <div className={cx('select')}>
          <div className={cx('title')}>
            <div>Connect wallet</div>
          </div>
          <div className={cx('options')}>
            {arr.map((e, i) => (
              <div
                key={i}
                onClick={() => {
                  if (e.isCheck) {
                    return disconnect();
                  }
                  onClick(e.type as WalletType);
                }}
              >
                <div className={cx('item', theme)}>
                  <img src={e.img} className={cx('logo')} />
                  <div className={cx('grow')}>
                    {e.isCheck ? (
                      <>
                        <div className={cx('network-title')}>{e.label}</div>
                        <div className={cx('des')}>
                          <CenterEllipsis size={6} text={address} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={cx('network-title')}>{e.title}</div>
                        <div className={cx('des')}>Connect using extension wallet</div>
                      </>
                    )}
                  </div>
                  {e.isCheck && (
                    <div>
                      <Logout />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </LoadingBox>
    </Modal>
  );
};

export default ConnectWalletModalCosmos;
