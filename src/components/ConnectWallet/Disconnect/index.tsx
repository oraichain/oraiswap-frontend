import cn from 'classnames/bind';

import Modal from 'components/Modal';
import useConfigReducer from 'hooks/useConfigReducer';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import { ReactComponent as UnavailableCloudIcon } from 'assets/icons/unavailable-cloud.svg';
import styles from './index.module.scss';
import { WALLET_TYPES, WalletItem } from '..';
import { reduceString } from 'libs/utils';

const cx = cn.bind(styles);

const DisconnectModal: React.FC<{
  close: () => void;
  approve: (walletType: WALLET_TYPES) => Promise<void>;
  walletActive: WalletItem;
  address: string;
}> = ({ close, approve, walletActive, address }) => {
  const [theme] = useConfigReducer('theme');
  const network = walletActive?.networks?.length > 0 ? walletActive?.networks[0] : null;
  return (
    <Modal
      isOpen={true}
      close={close}
      open={null}
      isCloseBtn={false}
      className={cx('choose_wallet_modal_container', theme)}
    >
      <div className={cx('choose_wallet_modal_wrapper')}>
        <div className={cx('header')}>
          <div>Disconnect wallet</div>
          <div onClick={close} className={cx('close_icon')}>
            <CloseIcon />
          </div>
        </div>

        <div className={cx('connect_error', theme)}>
          <div className={cx('content')}>
            <p className={cx('label')}>
              Are you sure you want to disconnect <span className={cx('wallet-type')}>{walletActive?.name}</span>
            </p>
            <div className={cx('content-2')}>
              {theme === 'light' ? (
                network?.IconLight ? (
                  <network.IconLight className={cx('icon')} />
                ) : (
                  <network.Icon className={cx('icon')} />
                )
              ) : (
                <network.Icon className={cx('icon')} />
              )}
              <span className={cx('sub-label')}>
                {'  '}
                {reduceString(address, 5, 5)} {'  '}
              </span>

              <UnavailableCloudIcon />
            </div>
          </div>
          <div className={cx('actions')}>
            <div className={cx('cancel_btn')} onClick={close}>
              Cancel
            </div>
            <div className={cx('try_again_btn')} onClick={() => approve(walletActive.code)}>
              Disconnect
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DisconnectModal;
