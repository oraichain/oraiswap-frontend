import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import Modal from 'components/Modal';
import useTheme from 'hooks/useTheme';
import styles from './ModalDownloadOwallet.module.scss';
import classNames from 'classnames';
import { ReactComponent as GooglePlayOWalletIcon } from 'assets/icons/google_play_owallet.svg';
import { ReactComponent as GooglePlayOWalletDarkIcon } from 'assets/icons/google_play_owallet_dark.svg';
import { ReactComponent as ChromeExtOWalletIcon } from 'assets/icons/chrome-ext_owallet.svg';
import { ReactComponent as ChromeExtOWalletDarkIcon } from 'assets/icons/chrome-ext_owallet_dark.svg';
import { ReactComponent as AppstoreOWalletDarkIcon } from 'assets/icons/appstore_owallet_dark.svg';
import { ReactComponent as AppstoreOWalletIcon } from 'assets/icons/appstore_owallet.svg';
import { ReactComponent as QrOwalletIcon } from 'assets/icons/qr_owallet.svg';
import { ReactComponent as DownloadOwalletIconDark } from 'assets/icons/logo_owallet_gateway_dark.svg';
import { ReactComponent as DownloadOwalletIcon } from 'assets/icons/logo_owallet_gateway.svg';

const ModalDownloadOwallet: React.FC<{
  close: () => void;
}> = ({ close }) => {
  const theme = useTheme();

  return (
    <Modal
      isOpen={true}
      close={close}
      open={() => {}}
      isCloseBtn={false}
      className={classNames(styles.chooseWalletModalContainer, `${styles[theme]}`)}
    >
      <div className={styles.chooseWalletModalWrapper}>
        <div className={styles.header}>
          <div>Download OWallet</div>
          <div onClick={close} className={styles.closeIcon}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.downloadInfo}>
          {theme === 'light' ? <DownloadOwalletIcon /> : <DownloadOwalletIconDark />}
          <div className={styles.qrCode}>
            <QrOwalletIcon />
          </div>
          <div>Scan QR for mobile download link</div>
        </div>
        <div className={styles.downloadPlatform}>
          <div className={styles.appStore}>
            {theme === 'light' ? <AppstoreOWalletIcon /> : <AppstoreOWalletDarkIcon />}
            {theme === 'light' ? <GooglePlayOWalletIcon /> : <GooglePlayOWalletDarkIcon />}
          </div>
          <div className={styles.chromeExt}>
            {theme === 'light' ? <ChromeExtOWalletIcon /> : <ChromeExtOWalletDarkIcon />}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDownloadOwallet;
