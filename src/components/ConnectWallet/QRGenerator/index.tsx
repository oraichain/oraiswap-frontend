import cn from 'classnames/bind';

import Modal from 'components/Modal';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';

import styles from './index.module.scss';
import useConfigReducer from 'hooks/useConfigReducer';

export interface QRGeneratorInfo {
  url: string;
  name: string;
  icon: any;
  address: string;
}

interface QRGeneratorProps {
  close: () => void;
}

const cx = cn.bind(styles);

const QRGeneratorModal: React.FC<QRGeneratorProps & QRGeneratorInfo> = ({ url, name, icon, address, close }) => {
  const [theme] = useConfigReducer('theme');
  const IconComponnet = typeof icon === 'string' ? <img src={icon} alt="network icon" /> : icon;
  return (
    <Modal
      isOpen={!!url}
      close={close}
      open={() => {}}
      isCloseBtn={false}
      className={cx('QR_generator_modal_container', theme)}
    >
      <div className={cx('QR_generator_modal_wrapper')}>
        <div className={cx('header')}>
          <div>QR Code</div>
          <div onClick={close} className={cx('close-icon')}>
            <CloseIcon />
          </div>
        </div>
        <div className={cx('info')}>
          <div className={cx('icon')}>
            <IconComponnet />
          </div>
          <div className={cx('name')}>{name}</div>
        </div>
        <img src={url} alt="Qr code" />
        <div className={cx('address')}>{address}</div>
        <div className={cx('cancel-btn')} onClick={close}>
          Cancel
        </div>
      </div>
    </Modal>
  );
};

export default QRGeneratorModal;
