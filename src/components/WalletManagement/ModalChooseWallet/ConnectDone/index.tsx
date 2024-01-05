import react from 'react';
import cn from 'classnames/bind';
import useConfigReducer from 'hooks/useConfigReducer';
import styles from './index.module.scss';
const cx = cn.bind(styles);
export const ConnectProgressDone: React.FC<{ cancel: () => void; address: string }> = ({ address, cancel }) => {
  const [theme] = useConfigReducer('theme');
  return (
    <div className={cx('connect_processing', theme)}>
      <div className={cx('content')}>This address has already been added</div>
      <div className={cx('content')}>{address}</div>
      <div className={cx('cancel_btn')} onClick={cancel}>
        Cancel
      </div>
    </div>
  );
};
