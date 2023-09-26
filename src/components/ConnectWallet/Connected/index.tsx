import cn from 'classnames/bind';
import { useSelector } from 'react-redux';

import useConfigReducer from 'hooks/useConfigReducer';
import { ReactComponent as WalletIcon } from 'assets/icons/wallet-icon.svg';
import { ReactComponent as DownArrowIcon } from 'assets/icons/down-arrow.svg';

import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { getTotalUsd } from 'libs/utils';
import { RootState } from 'store/configure';
import styles from './index.module.scss';

const cx = cn.bind(styles);

const Connected: React.FC<{ setIsShowMyWallet: (isShow: boolean) => void }> = ({ setIsShowMyWallet }) => {
  const [theme] = useConfigReducer('theme');
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const { data: prices } = useCoinGeckoPrices();
  const totalUsd = getTotalUsd(amounts, prices);

  return (
    <div className={cx('connected_container', theme)} onClick={() => setIsShowMyWallet(true)}>
      <div className={cx('wallet_icon')}>
        <WalletIcon />
      </div>
      <div className={cx('content')}>
        <div className={cx('title')}>My Wallets</div>
        <div className={cx('money')}>$ {totalUsd.toFixed(6)}</div>
      </div>
      <div className={cx('down_icon')}>
        <DownArrowIcon />
      </div>
    </div>
  );
};

export default Connected;
