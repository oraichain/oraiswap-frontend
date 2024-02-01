import { isMobile } from '@walletconnect/browser-utils';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import type { Wallet as WalletResetType } from 'components/ConnectWallet/useResetBalance';
import { useResetBalance } from 'components/ConnectWallet/useResetBalance';
import { keplrCheck } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import useWalletReducer from 'hooks/useWalletReducer';
import { FC, useEffect, useState } from 'react';
import Connected from './Connected';
import { ModalChooseWallet } from './ModalChooseWallet';
import { MyWallet } from './MyWallet';
import styles from './WalletManagement.module.scss';
import { WalletProvider, walletProvider } from './walletConfig';
const cx = cn.bind(styles);

export const WalletManagement: FC<{}> = () => {
  const [theme] = useConfigReducer('theme');
  const [oraiAddress] = useConfigReducer('address');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');
  const { handleResetBalance } = useResetBalance();
  const loadTokenAmounts = useLoadTokens();

  const [walletProviderWithStatus, setWalletProviderWithStatus] = useState<WalletProvider[]>(walletProvider);
  const [isShowChooseWallet, setIsShowChooseWallet] = useState(false);
  const [isShowMyWallet, setIsShowMyWallet] = useState(false);

  // @ts-ignore
  const isCheckOwallet = window.owallet?.isOwallet;
  const version = window?.keplr?.version;
  const isCheckKeplr = !!version && keplrCheck('keplr');
  const isMetamask = window?.ethereum?.isMetaMask;

  // update wallet provider with status is active or not
  useEffect(() => {
    async function updateWalletProvider() {
      const updatedWalletProvider = walletProviderWithStatus.map((item) => {
        const updatedWallets = item.wallets.map((wallet) => {
          let isActive = true;
          switch (wallet.nameRegistry) {
            case 'keplr':
              isActive = isCheckKeplr;
              break;
            case 'owallet':
              isActive = isCheckOwallet;
              break;
            case 'leapSnap':
              isActive = isMetamask;
              break;
            case 'metamask':
              isActive = isMetamask;
              break;
          }
          return { ...wallet, isActive };
        });
        return {
          ...item,
          wallets: updatedWallets
        };
      });
      setWalletProviderWithStatus(updatedWalletProvider);
    }
    updateWalletProvider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckOwallet, isCheckKeplr, isMetamask]);

  // load balance every time change address
  useEffect(() => {
    loadTokenAmounts({ oraiAddress, tronAddress, metamaskAddress });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oraiAddress, tronAddress, metamaskAddress]);

  // reset balance when disconnect
  useEffect(() => {
    if (!metamaskAddress || !tronAddress || !oraiAddress) {
      let arrResetBalance: WalletResetType[] = [];
      if (!metamaskAddress) arrResetBalance.push('metamask');
      if (!tronAddress) arrResetBalance.push('tron');
      if (!oraiAddress) arrResetBalance.push('keplr');
      arrResetBalance.length && handleResetBalance(arrResetBalance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oraiAddress, tronAddress, metamaskAddress]);

  const isAnyWalletConnected = Object.values(walletByNetworks).some((wallet) => wallet !== null);
  useEffect(() => {
    // close my wallet info when not connect to any wallet
    if (!isAnyWalletConnected) setIsShowMyWallet(false);
  }, [isAnyWalletConnected]);

  return (
    <div className={cx('connect-wallet-container', theme)}>
      {!isAnyWalletConnected ? (
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
          walletProviderWithStatus={walletProviderWithStatus}
        />
      ) : null}
    </div>
  );
};
