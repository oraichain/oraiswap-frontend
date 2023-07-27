import { FC } from 'react';
import styles from './LoginWidget.module.scss';
import cn from 'classnames/bind';
import CenterEllipsis from 'components/CenterEllipsis';
import { ReactComponent as Logout } from 'assets/icons/logout.svg';
import useConfigReducer from 'hooks/useConfigReducer';

const cx = cn.bind(styles);

export const LoginWidget: FC<{
  logo: string;
  text: string;
  address: string | null;
  connect?: () => Promise<void>;
  disconnect: () => Promise<void>;
  open?: () => void;
  switchWallet?: boolean;
}> = ({ logo, text, address, connect, disconnect, open, switchWallet = false }) => {
  const [theme] = useConfigReducer('theme');
  const onClick = () => {
    if (!address && connect) return connect();
    if (open) open()
  };
  return (
    <div className={cx('item', theme)} onClick={onClick}>
      <img src={logo} className={cx('logo')} />
      <div className={cx('grow')}>
        {address ? (
          <div className={cx('des', theme)}>
            <CenterEllipsis size={6} text={address} />
          </div>
        ) : (
          <div className={cx('des', theme)}>{text}</div>
        )}
      </div>
      {address && (
        <div onClick={() => !switchWallet && disconnect()}>
          <Logout />
        </div>
      )}
    </div>
  );
};

export default LoginWidget;
