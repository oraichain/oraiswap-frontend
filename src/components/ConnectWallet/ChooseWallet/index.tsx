import cn from 'classnames/bind';
import { FunctionComponent, useMemo, useState } from 'react';

import Modal from 'components/Modal';
import useConfigReducer from 'hooks/useConfigReducer';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import { ReactComponent as OwalletIcon } from 'assets/icons/owallet-icon.svg';
import { ReactComponent as MetamaskIcon } from 'assets/icons/metamask-icon.svg';
import { ReactComponent as TronIcon } from 'assets/icons/tron-icon.svg';
import { ReactComponent as KeplrIcon } from 'assets/icons/keplr-icon.svg';
import { ReactComponent as LedgerIcon } from 'assets/icons/ledger.svg';
import { ReactComponent as PhantomIcon } from 'assets/icons/phantom.svg';
import { ReactComponent as GoogleIcon } from 'assets/icons/google_icon.svg';
import { ReactComponent as AppleIcon } from 'assets/icons/apple_wallet.svg';
import { ReactComponent as PhoneIcon } from 'assets/icons/phone_wallet.svg';

import ConnectProcessing from './ConnectProcessing';
import ConnectError from './ConnectError';
import styles from './index.module.scss';

import { WALLET_TYPES } from '../';

const cx = cn.bind(styles);

export interface WalletItem {
  name: string;
  icon: FunctionComponent;
  walletType: WALLET_TYPES;
  isActive?: boolean;
}

enum CONNECT_STATUS {
  SELECTING = 'SELECTING',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR'
}

const ChooseWalletModal: React.FC<{
  close: () => void;
  connectToWallet: (walletType: WALLET_TYPES) => void;
}> = ({ close, connectToWallet }) => {
  const [theme] = useConfigReducer('theme');
  const [connectStatus, setConnectStatus] = useState(CONNECT_STATUS.SELECTING);
  const [walletSelected, setWalletSelected] = useState<WalletItem>();
  const [oraiAddressWallet] = useConfigReducer('address');
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [cosmosAddress] = useConfigReducer('cosmosAddress');
  const [tronAddress] = useConfigReducer('tronAddress');
  const isMetamask = !!window.ethereum?.isMetaMask;
  const isOwallet = !!window.owallet;
  const isKeplr = !!window.keplr;
  const isTron = !!window.tronLink;
  console.log('🚀 ~ file: index.tsx:50 ~ isMetamask:', isMetamask);
  const WALLETS: WalletItem[] = [
    { name: 'Owallet', icon: OwalletIcon, isActive: isOwallet, walletType: WALLET_TYPES.OWALLET },
    { name: 'Metamask', icon: MetamaskIcon, isActive: isMetamask, walletType: WALLET_TYPES.METAMASK },
    { name: 'TronLink', icon: TronIcon, isActive: isTron, walletType: WALLET_TYPES.TRON },
    { name: 'Phantom', icon: PhantomIcon, walletType: WALLET_TYPES.PHANTOM },
    { name: 'Keplr', icon: KeplrIcon, isActive: isKeplr, walletType: WALLET_TYPES.KEPLR },
    { name: 'Ledger', icon: LedgerIcon, walletType: WALLET_TYPES.LEDGER },
    { name: 'Connect with Google', icon: GoogleIcon, walletType: WALLET_TYPES.GOOGLE },
    { name: 'Connect with Apple', icon: AppleIcon, walletType: WALLET_TYPES.APPLE },
    { name: 'Use phone number', icon: PhoneIcon, walletType: WALLET_TYPES.PHONE }
  ];

  const content = useMemo(() => {
    if (connectStatus === CONNECT_STATUS.SELECTING) {
      return (
        <div className={cx('wallets_wrapper')}>
          {WALLETS.map((wallet, index) => {
            return (
              <div
                key={index}
                className={cx('wallet_item', `${!wallet.isActive && 'not-active'}`)}
                onClick={() => {
                  if (wallet.isActive) {
                    setWalletSelected(wallet);
                    connectToWallet(wallet.walletType);
                    setConnectStatus(CONNECT_STATUS.PROCESSING);
                  }
                }}
              >
                <div className={cx('wallet_icon')}>
                  <wallet.icon />
                </div>
                <div className={cx('wallet_name')}>{wallet.name}</div>
              </div>
            );
          })}
        </div>
      );
    } else if (connectStatus === CONNECT_STATUS.PROCESSING) {
      return (
        <ConnectProcessing
          close={() => {
            close();
            setConnectStatus(CONNECT_STATUS.SELECTING);
          }}
          wallet={walletSelected}
          walletName={walletSelected.name}
        />
      );
    } else {
      return (
        <ConnectError
          close={() => {
            close();
            setConnectStatus(CONNECT_STATUS.SELECTING);
          }}
          handleTryAgain={() => {}}
        />
      );
    }
  }, [connectStatus]);

  return (
    <Modal
      isOpen={true}
      close={close}
      open={() => {}}
      isCloseBtn={false}
      className={cx('choose_wallet_modal_container', theme)}
    >
      <div className={cx('choose_wallet_modal_wrapper')}>
        <div className={cx('header')}>
          <div>Connect to OraiDEX</div>
          <div onClick={close} className={cx('close_icon')}>
            <CloseIcon />
          </div>
        </div>
        {content}
      </div>
    </Modal>
  );
};

export default ChooseWalletModal;
