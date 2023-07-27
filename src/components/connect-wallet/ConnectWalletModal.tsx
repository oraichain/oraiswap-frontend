import LoginWidget from './LoginWidget';
import Modal from 'components/Modal';
import React from 'react';
import style from './ConnectWalletModal.module.scss';
import cn from 'classnames/bind';
import { TYPE_WALLET_KEPLR, TYPE_WALLET_OWALLET } from 'config/constants';
import { checkVersionWallet, displayInstallWallet, getStorageKey } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import KeplrImage from 'assets/images/keplr.png';
import { ReactComponent as Logout } from 'assets/icons/logout.svg';
import OWalletImage from 'assets/images/orai_wallet_logo.png';
import CenterEllipsis from 'components/CenterEllipsis';
import LoadingBox from 'components/LoadingBox';

const cx = cn.bind(style);

interface ConnectWalletModalProps {
  isOpen: boolean;
  close: () => void;
  open: () => void;
  address: string;
  disconnect: () => Promise<void>;
  connectKeplr: (type) => Promise<void>;
}

const ConnectWalletModalCosmos: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  close,
  connectKeplr,
  disconnect,
  address,
  open,
}) => {
  const [theme] = useConfigReducer('theme');
  const typeWallet = getStorageKey();
  const [loadingWallet, setLoadingWallet] = React.useState(false);

  const isCheckKeplr = typeWallet === TYPE_WALLET_KEPLR && address && !checkVersionWallet();
  const isCheckOwallet =
    (typeWallet === TYPE_WALLET_OWALLET && address && window.owallet) ||
    (typeWallet === TYPE_WALLET_KEPLR && address && checkVersionWallet());

  const onClick = async (type: string) => {
    if (type === TYPE_WALLET_OWALLET && !window.owallet) {
      return displayInstallWallet('', `You need to install OWallet to continue.`);
    }
    if (type === TYPE_WALLET_KEPLR && (!window.keplr || checkVersionWallet())) {
      return displayInstallWallet('', `You need to install Keplr to continue.`);
    }
    try {
      setLoadingWallet(true)
      await connectKeplr(type);
    } finally {
      setTimeout(() => setLoadingWallet(false), 1500)
    }
  };

  const arr = [
    {
      img: KeplrImage,
      isCheck: isCheckKeplr,
      type: TYPE_WALLET_KEPLR,
      title: 'Connect Keplr',
      label: 'Keplr Wallet'
    },
    {
      img: OWalletImage,
      isCheck: isCheckOwallet,
      type: TYPE_WALLET_OWALLET,
      title: 'Connect Owallet',
      label: 'Owallet'
    }
  ]

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true}>
      <LoadingBox loading={loadingWallet}>
        <div className={cx('select')}>
          <div className={cx('title')}>
            <div>Connect wallet</div>
          </div>
          <div className={cx('options')}>
            {arr.map((e, i) => {
              return <div
                key={i}
                onClick={() => {
                  if (e.isCheck) {
                    return disconnect();
                  }
                  onClick(e.type);
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
                        <div className={cx('des')}>Connect using browser wallet</div>
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
            })}
          </div>
        </div>
      </LoadingBox>
    </Modal>
  );
};

export default ConnectWalletModalCosmos;
