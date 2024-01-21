import { useManager } from '@cosmos-kit/react-lite';
import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as DownArrowIcon } from 'assets/icons/down-arrow.svg';
import cn from 'classnames/bind';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { getTotalUsd } from 'libs/utils';
import { formatDisplayUsdt } from 'pages/Pools/helpers';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { walletProvider } from '../ModalChooseWallet';
import styles from './index.module.scss';

const cx = cn.bind(styles);

const Connected: React.FC<{ setIsShowMyWallet: (isShow: boolean) => void }> = ({ setIsShowMyWallet }) => {
  const mobileMode = isMobile();

  const [theme] = useConfigReducer('theme');
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const { data: prices } = useCoinGeckoPrices();
  const totalUsd = getTotalUsd(amounts, prices);
  const { mainWallets } = useManager();

  return (
    <div className={cx('connected_container', theme)} onClick={() => setIsShowMyWallet(true)}>
      {mainWallets
        .filter((w) => w.isWalletConnected)
        .map((mainWallet) => {
          const wallet = walletProvider
            .find((item) => item.wallets.find((w) => w.nameRegistry === mainWallet.walletName))
            ?.wallets.find((item) => item.nameRegistry === mainWallet.walletName);
          if (!wallet) return null;
          return (
            <div className={cx('wallet_icon')}>
              <wallet.icon width={20} height={20} />
            </div>
          );
        })}
      {!mobileMode && (
        <>
          <div className={cx('content')}>
            <div className={cx('title')}>My Wallets</div>
            <div className={cx('money')}>{formatDisplayUsdt(totalUsd)}</div>
          </div>
          <div className={cx('down_icon')}>
            <DownArrowIcon />
          </div>
        </>
      )}
    </div>
  );
};

export default Connected;
