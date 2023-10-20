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

const cx = cn.bind(styles);

interface WalletItem {
  name: string;
  icon: FunctionComponent;
  isActive?: boolean;
}

const WALLETS: WalletItem[] = [
  { name: 'Owallet', icon: OwalletIcon, isActive: true },
  { name: 'Metamask', icon: MetamaskIcon, isActive: true },
  { name: 'TronLink', icon: TronIcon, isActive: true },
  { name: 'Phantom', icon: PhantomIcon },
  { name: 'Keplr', icon: KeplrIcon, isActive: true },
  { name: 'Ledger', icon: LedgerIcon },
  { name: 'Connect with Google', icon: GoogleIcon },
  { name: 'Connect with Apple', icon: AppleIcon },
  { name: 'Use phone number', icon: PhoneIcon }
];

enum CONNECT_STATUS {
  SELECTING = 'SELECTING',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR'
}

const ChooseWalletModal: React.FC<{
  close: () => void;
}> = ({ close }) => {
  const [theme] = useConfigReducer('theme');
  const [connectStatus, setConnectStatus] = useState(CONNECT_STATUS.SELECTING);
  const [walletSelected, setWalletSelected] = useState<WalletItem>();
  const [oraiAddressWallet] = useConfigReducer('address');
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [cosmosAddress] = useConfigReducer('cosmosAddress');
  const [tronAddress] = useConfigReducer('tronAddress');

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
