import cn from 'classnames/bind';
import { FC, useState } from 'react';
import { isMobile } from '@walletconnect/browser-utils';
import { Button } from 'components/Button';
import useConfigReducer from 'hooks/useConfigReducer';
import { ModalChooseWallet } from './ModalChooseWallet';
import styles from './WalletManagement.module.scss';
import { MyWallet } from './MyWallet';
import Connected from './Connected';
const cx = cn.bind(styles);

export const WalletManagement: FC<{}> = () => {
  const [theme] = useConfigReducer('theme');
  const [isShowChooseWallet, setIsShowChooseWallet] = useState(false);
  const [isShowMyWallet, setIsShowMyWallet] = useState(false);
  const isConnected = true;

  return (
    <div className={cx('connect-wallet-container', theme)}>
      {!isConnected ? (
        <Button
          type="primary"
          onClick={() => {
            setIsShowChooseWallet(true);
          }}
        >
          Connect Wallet
        </Button>
      ) : (
        <Connected setIsShowMyWallet={setIsShowMyWallet} />
      )}
      <MyWallet
        setIsShowChooseWallet={setIsShowChooseWallet}
        isShowMyWallet={isShowMyWallet}
        setIsShowMyWallet={setIsShowMyWallet}
        isShowChooseWallet={isShowChooseWallet}
      />
      {isShowChooseWallet && !isMobile() ? (
        <ModalChooseWallet
          close={() => {
            setIsShowChooseWallet(false);
          }}
        />
      ) : null}
    </div>
  );
};
