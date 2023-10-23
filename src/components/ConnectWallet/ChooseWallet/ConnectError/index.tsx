import cn from 'classnames/bind';

import useConfigReducer from 'hooks/useConfigReducer';

import styles from './index.module.scss';


const cx = cn.bind(styles);

const ConnectError: React.FC<{ cancel: () => void; handleTryAgain: () => void }> = ({
  cancel,
  handleTryAgain
}) => {
  const [theme] = useConfigReducer('theme');

  return (
    <div className={cx('connect_error', theme)}>
      <div className={cx('content')}>
        <p>Unfortunately, we did not receive the confirmation.</p>
        <p>Please, try again.</p>
      </div>
      <div className={cx('actions')}>
        <div className={cx('cancel_btn')} onClick={cancel}>
          Cancel
        </div>
        <div className={cx('try_again_btn')} onClick={handleTryAgain}>
          Try again
        </div>
      </div>
    </div>
  );
};

export default ConnectError;
