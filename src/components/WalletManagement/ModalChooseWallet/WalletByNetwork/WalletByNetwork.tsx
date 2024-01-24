import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { WalletType as WalletCosmosType } from '@oraichain/oraidex-common';
import { Button } from 'components/Button';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import type { WalletNetwork, WalletProvider } from 'components/WalletManagement/walletConfig';
import { network } from 'config/networks';
import { getListAddressCosmos, setStorageKey } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import useWalletReducer from 'hooks/useWalletReducer';
import { collectWallet } from 'libs/cosmjs';
import Keplr from 'libs/keplr';
import { useState } from 'react';
import { WalletItem } from '../WalletItem';
import styles from './WalletByNetwork.module.scss';

export type ConnectStatus = 'init' | 'confirming-switch' | 'confirming-disconnect' | 'loading' | 'failed' | 'success';
export const WalletByNetwork = ({ walletProvider }: { walletProvider: WalletProvider }) => {
  const { networks, wallets, networkType } = walletProvider;
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>('init');
  const [currentWalletConnecting, setCurrentWalletConnecting] = useState<WalletNetwork | null>(null);
  const theme = useTheme();
  const [_oraiAddress, setOraiAddress] = useConfigReducer('address');
  const [, setTronAddress] = useConfigReducer('tronAddress');
  const [, setMetamaskAddress] = useConfigReducer('metamaskAddress');
  const [, setCosmosAddress] = useConfigReducer('cosmosAddress');
  console.log({ _oraiAddress });
  const [walletByNetworks, setWalletByNetworks] = useWalletReducer('walletsByNetwork');

  const handleConfirmSwitch = async () => {
    setConnectStatus('loading');
    await handleConnectWalletByNetwork(currentWalletConnecting);
  };
  console.log({ connectStatus, currentWalletConnecting });

  const handleConnectWalletInCosmosNetwork = async (walletType: WalletCosmosType) => {
    window.Keplr = new Keplr(walletType);
    setStorageKey('typeWallet', walletType);
    const walletCollected = await collectWallet(network.chainId);
    window.client = await SigningCosmWasmClient.connectWithSigner(network.rpc, walletCollected, {
      gasPrice: GasPrice.fromString(`0.002${network.denom}`)
    });
    const oraiAddr = await window.Keplr.getKeplrAddr();
    setOraiAddress(oraiAddr);
    const { listAddressCosmos } = await getListAddressCosmos(oraiAddr);
    setCosmosAddress(listAddressCosmos);
  };

  const handleConnectWalletByNetwork = async (wallet: WalletNetwork) => {
    try {
      setConnectStatus('loading');
      switch (networkType) {
        case 'cosmos':
          await handleConnectWalletInCosmosNetwork(wallet.nameRegistry as WalletCosmosType);
          break;
        case 'evm':
          //  TODO: handle connect evm
          break;
        case 'tron':
          //  TODO: handle connect tron
          break;
        default:
          setConnectStatus('init');
          break;
      }
      setWalletByNetworks({
        ...walletByNetworks,
        [networkType]: wallet.nameRegistry
      });
      setCurrentWalletConnecting(null);
      setConnectStatus('init');
    } catch (error) {
      setConnectStatus('failed');
    }
  };

  /**
   * NOTE: we can check current network type and wallet name so we can update walletByNetworks to storage
   * TODO:
   * 1, with cosmos, we can update window.Keplr then reassigg window.client
   * 2, with evm, we update window.Ethereum follow by owallet or metamask, then polyfill window.Metamask = window.Metamask = new Metamask(window.tronWeb, window.Ethereum);
   * 3, with tron, we update window.tronWeb = window.tronWeb of owallet or tron then polyfill window.Metamask = new Metamask(window.tronWeb, window.Ethereum),
   * @param
   */
  const handleClickConnect = async (wallet: WalletNetwork) => {
    try {
      setCurrentWalletConnecting(wallet);
      if (walletByNetworks[networkType] && walletByNetworks[networkType] !== wallet.nameRegistry) {
        setConnectStatus('confirming-switch');
      } else {
        await handleConnectWalletByNetwork(wallet);
      }
    } catch (error) {
      // TODO: handle error correctly
      console.log({ errorConnect: error });
      displayToast(TToastType.METAMASK_FAILED, {
        message: typeof error === 'object' ? error.message : JSON.stringify(error)
      });
    }
  };

  const handleClickDisconnect = async () => {
    setConnectStatus('confirming-disconnect');
  };

  const handleDisconnect = async () => {
    setWalletByNetworks({
      ...walletByNetworks,
      [networkType]: null
    });
    switch (networkType) {
      case 'cosmos':
        setOraiAddress(undefined);
        break;
      case 'evm':
        setMetamaskAddress(undefined);
        break;
      case 'tron':
        setTronAddress(undefined);
        break;
      default:
        break;
    }
    setConnectStatus('init');
  };

  const renderNetworkContent = () => {
    const currentWalletType = walletByNetworks[networkType];
    const currentWalletName = currentWalletType
      ? wallets.find((w) => w.nameRegistry === currentWalletType)?.name
      : null;

    let content;
    switch (connectStatus) {
      case 'init':
      case 'loading':
        content = (
          <div className={styles.wallets}>
            {wallets.map((w) => {
              return (
                <WalletItem
                  isActive={w.isActive}
                  key={w.name + Math.random()}
                  wallet={w}
                  handleClickConnect={handleClickConnect}
                  handleClickDisconnect={handleClickDisconnect}
                  networkType={networkType}
                  connectStatus={connectStatus}
                  currentWalletConnecting={currentWalletConnecting}
                />
              );
            })}
          </div>
        );
        break;
      case 'confirming-switch':
        content = (
          <div className={styles.swithWallet}>
            <h4>Switch wallet?</h4>
            <div className={styles.switchText}>
              Disconnect from {currentWalletName} and connect to {currentWalletConnecting?.name}
            </div>
            <div className={styles.groupBtns}>
              <Button onClick={() => setConnectStatus('init')} type="secondary">
                Cancel
              </Button>
              <Button onClick={handleConfirmSwitch} type="primary">
                Switch
              </Button>
            </div>
          </div>
        );
        break;
      case 'failed':
        content = (
          <div className={styles.swithWallet}>
            <h4>Fail to connect to wallet</h4>
            <div className={styles.switchText}>Unfortunately, we did not receive the confirmation.</div>
            <div className={styles.groupBtns}>
              <Button onClick={() => setConnectStatus('init')} type="secondary">
                Cancel
              </Button>
              <Button onClick={handleConfirmSwitch} type="primary">
                Try again
              </Button>
            </div>
          </div>
        );
        break;
      case 'confirming-disconnect':
        content = (
          <div className={styles.swithWallet}>
            <h4>Disconnect wallet?</h4>
            <div className={styles.switchText}>Are you sure you want to disconnect {currentWalletName}?</div>
            <div className={styles.groupBtns}>
              <Button onClick={() => setConnectStatus('init')} type="secondary">
                Cancel
              </Button>
              <Button onClick={handleDisconnect} type="primary">
                Disconnect
              </Button>
            </div>
          </div>
        );
        break;
      default:
        content = <></>;
    }
    return content;
  };

  const renderNetworkIcons = () => {
    return networks.map((network, index) => {
      return (
        <div className={styles.networkIcon} key={network.chainName + index}>
          {theme === 'dark' ? <network.Icon width={18} height={18} /> : <network.IconLight width={18} height={18} />}
        </div>
      );
    });
  };

  return (
    <div
      className={`${styles.walletByNetwork} ${styles[theme]} ${networkType === 'cosmos' ? styles.fullWitdth : null}`}
    >
      <div className={styles.header}>
        <div className={styles.networkIcons}>{renderNetworkIcons()}</div>
      </div>
      <div className={styles.content}>{renderNetworkContent()}</div>
    </div>
  );
};
