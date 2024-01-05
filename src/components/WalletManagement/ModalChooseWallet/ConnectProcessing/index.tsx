import cn from 'classnames/bind';
import Lottie from 'lottie-react';
import useConfigReducer from 'hooks/useConfigReducer';
import OraiDEXLoadingBlack from 'assets/lottie/oraiDEX_loading_black.json';

import styles from './index.module.scss';

const cx = cn.bind(styles);

const ConnectProcessing: React.FC<{
  walletName: string;
  cancel: () => void;
}> = ({ walletName, cancel }) => {
  const [theme] = useConfigReducer('theme');

  return (
    <div className={cx('connect_processing', theme)}>
      <div className={cx('loading_icon')}>
        <span>
          <Lottie animationData={OraiDEXLoadingBlack} />
        </span>
      </div>
      <div className={cx('content')}>Connect {walletName} to OraiDEX to proceed</div>
      <div className={cx('cancel_btn')} onClick={cancel}>
        Cancel
      </div>
    </div>
  );
};

export default ConnectProcessing;
