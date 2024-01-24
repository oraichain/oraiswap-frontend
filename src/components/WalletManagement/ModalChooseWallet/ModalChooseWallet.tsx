import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';
import classNames from 'classnames';
import Modal from 'components/Modal';
import { isUnlockMetamask, keplrCheck } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect, useState } from 'react';
import { WalletProvider, walletProvider } from '../walletConfig';
import styles from './ModalChooseWallet.module.scss';
import { WalletByNetwork } from './WalletByNetwork';

export const ModalChooseWallet: React.FC<{
  close: () => void;
}> = ({ close }) => {
  const [theme] = useConfigReducer('theme');

  const [walletProviderWithStatus, setWalletProviderWithStatus] = useState<WalletProvider[]>(walletProvider);

  const renderListWalletByNetwork = () => {
    return walletProviderWithStatus.map((item, index) => {
      return <WalletByNetwork key={index} walletProvider={item} />;
    });
  };

  // @ts-ignore
  const isCheckOwallet = window.owallet?.isOwallet;
  const version = window?.keplr?.version;
  const isCheckKeplr = !!version && keplrCheck('keplr');
  const isMetamask = window?.ethereum?.isMetaMask;

  // update wallet provider with status is active or not
  useEffect(() => {
    async function updateWalletProvider() {
      const isMetamaskUnlock = await isUnlockMetamask();
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
              isActive = isMetamask && isMetamaskUnlock;
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
  }, [isCheckOwallet, isCheckKeplr, isMetamask]);

  return (
    <Modal
      isOpen={true}
      close={close}
      open={() => {}}
      isCloseBtn={false}
      className={classNames(styles.chooseWalletModalContainer, `${styles[theme]}`)}
    >
      <div className={styles.chooseWalletModalWrapper}>
        <div className={styles.header}>
          <div>Connect to OraiDEX</div>
          <div onClick={close} className={styles.closeIcon}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.listWalletNetworkWrapper}>{renderListWalletByNetwork()}</div>
      </div>
    </Modal>
  );
};
