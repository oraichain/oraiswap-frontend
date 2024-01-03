import cn from 'classnames/bind';
import { FC, useState } from 'react';

import { isMobile } from '@walletconnect/browser-utils';
import { Button } from 'components/Button';
import useConfigReducer from 'hooks/useConfigReducer';
import { ChooseWalletModal } from './ChooseWallet/ChooseWallet';
import styles from './ConnectWallet.module.scss';

const cx = cn.bind(styles);

export const ConnectWallet: FC<{}> = () => {
  const [theme] = useConfigReducer('theme');
  const [isShowChooseWallet, setIsShowChooseWallet] = useState(false);

  const isConnected = false;

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
      ) : null}
      {isShowChooseWallet && !isMobile() ? (
        <ChooseWalletModal
          close={() => {
            setIsShowChooseWallet(false);
          }}
        />
      ) : null}
    </div>
  );
};
