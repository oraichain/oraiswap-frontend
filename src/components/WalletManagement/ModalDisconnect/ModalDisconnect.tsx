import { ReactComponent as BnbIcon } from 'assets/icons/bnb.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as KwtIcon } from 'assets/icons/kwt.svg';
import { ReactComponent as MetamaskIcon } from 'assets/icons/metamask-icon.svg';
import cn from 'classnames/bind';
import Modal from 'components/Modal';
import useConfigReducer from 'hooks/useConfigReducer';
import styles from './ModalDisconnect.module.scss';

const cx = cn.bind(styles);

export const ModalDisconnect: React.FC<{
  close: () => void;
}> = ({ close }) => {
  const [theme] = useConfigReducer('theme');

  const chains = [
    {
      icon: EthIcon,
      name: 'Ethereum'
    },
    {
      icon: BnbIcon,
      name: 'BNB Chain'
    },
    {
      icon: KwtIcon,
      name: 'Kawaiiverse'
    }
  ];

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
              Are you sure you want to disconnect <span className={cx('wallet-type')}>EVM network ?</span>
            </p>
            <div className={styles.chains}>
              {chains.map((chain, index) => {
                return (
                  <div className={styles.chainInfo} key={index}>
                    <div className={styles.chainLogo}>{<chain.icon width={20} height={20} />}</div>
                    <div className={styles.chainName}>{chain.name}</div>
                  </div>
                );
              })}
            </div>
            <div className={cx('content-2')}>
              <MetamaskIcon width={30} height={30} />
              <span className={cx('sub-label')}>0xD3aB...7f1108</span>
              <CopyIcon />
            </div>
          </div>
          <div className={cx('actions')}>
            <div className={cx('cancel_btn')} onClick={close}>
              Cancel
            </div>
            <div className={cx('try_again_btn')} onClick={() => {}}>
              Disconnect
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
