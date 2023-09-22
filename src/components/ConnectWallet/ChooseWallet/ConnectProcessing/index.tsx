import cn from 'classnames/bind';

import { ReactComponent as LoadingIcon } from 'assets/icons/loading.svg';

import styles from './index.module.scss';

const cx = cn.bind(styles);

const ConnectProcessing: React.FC<{ walletName: string; close: () => void }> = ({ walletName, close }) => {
  return (
    <div className={cx('connect_processing')}>
      <div className={cx('loading_icon')}>
        <span>
          <LoadingIcon />
        </span>
      </div>
      <div className={cx('content')}>Connect {walletName} to OraiDEX to proceed</div>
      <div className={cx('cancel_btn')} onClick={close}>
        Cancel
      </div>
    </div>
  );
};

export default ConnectProcessing;
