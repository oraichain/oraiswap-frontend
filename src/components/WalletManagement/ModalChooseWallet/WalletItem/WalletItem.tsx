import type { Wallet } from 'components/WalletManagement/ModalChooseWallet/ModalChooseWallet';
import { getListAddressCosmos, setStorageKey } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { MouseEventHandler, useEffect } from 'react';
import { ConnectStatus } from '../WalletByNetwork';
import {
  Connected,
  Connecting,
  Disconnected,
  Error as ErrorBtn,
  NotExist,
  Rejected,
  WalletConnectComponent
} from './WalletConnect';
import styles from './WalletItem.module.scss';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import Keplr from 'libs/keplr';
import { collectWallet } from 'libs/cosmjs';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { network } from 'config/networks';
import { GasPrice } from '@cosmjs/stargate';
import useWalletReducer from 'hooks/useWalletReducer';

type WalletItemProps = {
  wallet: Wallet;
  setConnectStatus: React.Dispatch<React.SetStateAction<ConnectStatus>>;
  connectStatus: ConnectStatus;
  currentWallet?: string;
  setCurrentWalletConnected: React.Dispatch<any>;
  setCurrentWalletConnecting: React.Dispatch<any>;
  isActive: boolean;
};

export const WalletItem = ({
  wallet,
  connectStatus,
  setConnectStatus,
  currentWallet,
  setCurrentWalletConnected,
  setCurrentWalletConnecting,
  isActive
}: WalletItemProps) => {
  const theme = useTheme();
  const [, setOraiAddress] = useConfigReducer('address');
  const [, setCosmosAddress] = useConfigReducer('cosmosAddress');

  const [wallets, setWallets] = useWalletReducer('wallets');

  const walletClient = {
    mainWallet: null
  };

  useEffect(() => {
    if (walletClient?.mainWallet?.walletStatus === 'Connected') {
      setCurrentWalletConnected(walletClient.mainWallet);
    }
  }, [walletClient]);

  const onClickConnect = async (e) => {
    try {
      e.preventDefault();
      if (currentWallet && currentWallet !== walletClient.mainWallet?.walletName) {
        setConnectStatus('confirming-switch');
        setCurrentWalletConnecting(walletClient.mainWallet);
      } else {
        const type = wallet.nameRegistry;
        window.Keplr = new Keplr(type);
        setStorageKey('typeWallet', type);
        const walletCollected = await collectWallet(network.chainId);
        window.client = await SigningCosmWasmClient.connectWithSigner(network.rpc, walletCollected, {
          gasPrice: GasPrice.fromString(`0.002${network.denom}`)
        });

        const oraiAddr = await window.Keplr.getKeplrAddr();
        setOraiAddress(oraiAddr);
        const { listAddressCosmos } = await getListAddressCosmos(oraiAddr);
        setCosmosAddress(listAddressCosmos);
        setCurrentWalletConnected(walletClient.mainWallet);
      }
    } catch (error) {
      console.log({ errorConnect: error });
      displayToast(TToastType.METAMASK_FAILED, {
        message: typeof error === 'object' ? error.message : JSON.stringify(error)
      });
    }
  };

  const onClickDisconnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    setCurrentWalletConnected(walletClient.mainWallet);
    setConnectStatus('confirming-disconnect');
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={walletClient?.mainWallet?.walletStatus}
      isActive={isActive}
      disconnect={<Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />}
      connecting={<Connecting />}
      connected={<Connected buttonText={'Connected'} onClick={onClickDisconnect} />}
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<ErrorBtn buttonText="Change Wallet" onClick={onClickConnect} />}
      notExist={<NotExist buttonText="Not Exist" onClick={() => {}} />}
    />
  );

  return (
    <div className={`${styles.walletItem} ${styles[theme]} ${isActive ? null : styles.disabled}`}>
      <div className={styles.walletIcon}>
        <wallet.icon />
      </div>
      <div className={styles.walletName}>{wallet.name}</div>
      {connectWalletButton}
    </div>
  );
};
