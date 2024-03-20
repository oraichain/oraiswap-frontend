import { ReactComponent as AppstoreOWalletIcon } from 'assets/icons/appstore_owallet.svg';
import { ReactComponent as AppstoreOWalletDarkIcon } from 'assets/icons/appstore_owallet_dark.svg';
import { ReactComponent as ChromeExtOWalletIcon } from 'assets/icons/chrome-ext_owallet.svg';
import { ReactComponent as ChromeExtOWalletDarkIcon } from 'assets/icons/chrome-ext_owallet_dark.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import { ReactComponent as GooglePlayOWalletIcon } from 'assets/icons/google_play_owallet.svg';
import { ReactComponent as GooglePlayOWalletDarkIcon } from 'assets/icons/google_play_owallet_dark.svg';
import { ReactComponent as DownloadOwalletIcon } from 'assets/icons/logo_owallet_gateway.svg';
import { ReactComponent as DownloadOwalletIconDark } from 'assets/icons/logo_owallet_gateway_dark.svg';
import classNames from 'classnames';
import Modal from 'components/Modal';
import useTheme from 'hooks/useTheme';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import styles from './ModalDownloadOwallet.module.scss';
import { owalletAndroidDownloadUrl, owalletExtensionDownloadUrl, owalletIosDownloadUrl } from 'pages/DownloadApp';

const ModalDownloadOwallet: React.FC<{
  close: () => void;
}> = ({ close }) => {
  const theme = useTheme();
  const [qrUrl, setQrUrl] = useState();

  const getUrlQrCode = async () => {
    try {
      const downloadAppUrl = window.location.origin + '/download-owallet';
      const url = await QRCode.toDataURL(downloadAppUrl);
      setQrUrl(url);
    } catch (err) {
      console.error('ERROR getUrlQrCode:', err);
    }
  };
  useEffect(() => {
    getUrlQrCode();
  }, []);

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
          <div className={styles.qrCode}>{qrUrl && <img src={qrUrl} alt="Qr code" />}</div>
          <div>Scan QR for mobile download link</div>
        </div>
        <div className={styles.downloadPlatform}>
          <div className={styles.appStore}>
            <div onClick={() => window.open(owalletIosDownloadUrl)}>
              {theme === 'light' ? <AppstoreOWalletIcon /> : <AppstoreOWalletDarkIcon />}
            </div>
            <div onClick={() => window.open(owalletAndroidDownloadUrl)}>
              {theme === 'light' ? <GooglePlayOWalletIcon /> : <GooglePlayOWalletDarkIcon />}
            </div>
          </div>
          <div className={styles.chromeExt} onClick={() => window.open(owalletExtensionDownloadUrl)}>
            {theme === 'light' ? <ChromeExtOWalletIcon /> : <ChromeExtOWalletDarkIcon />}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDownloadOwallet;
