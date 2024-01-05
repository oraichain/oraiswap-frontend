import { useState } from 'react';
import { WalletProvider } from '../ModalChooseWallet';
import { WalletItem } from '../WalletItem';
import styles from './WalletByNetwork.module.scss';
import { Button } from 'components/Button';
import useTheme from 'hooks/useTheme';

export type ConnectStatus = 'init' | 'confirming-switch' | 'confirming-disconnect' | 'loading' | 'failed' | 'success';
export const WalletByNetwork = ({ walletProvider }: { walletProvider: WalletProvider }) => {
  const { networks, wallets, type } = walletProvider;
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>('init');
  const theme = useTheme();
  const renderNetworkContent = () => {
    let content;
    switch (connectStatus) {
      case 'init':
        content = (
          <div className={styles.wallets}>
            {wallets.map((wallet, index) => {
              return (
                <WalletItem
                  connectStatus={connectStatus}
                  setConnectStatus={setConnectStatus}
                  key={index}
                  wallet={wallet}
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
            <div className={styles.switchText}>Disconnect from OWallet and connect to Keplr</div>
            <div className={styles.groupBtns}>
              <Button onClick={() => setConnectStatus('init')} type="secondary">
                Cancel
              </Button>
              <Button onClick={() => setConnectStatus('confirming-switch')} type="primary">
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
              <Button onClick={() => setConnectStatus('confirming-switch')} type="primary">
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
            <div className={styles.switchText}>Are you sure you want to disconnect Owallet?</div>
            <div className={styles.groupBtns}>
              <Button onClick={() => setConnectStatus('init')} type="secondary">
                Cancel
              </Button>
              <Button onClick={() => setConnectStatus('confirming-disconnect')} type="primary">
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
    return networks.map((network) => {
      return (
        <div className={styles.networkIcon} key={network.name}>
          <network.icon />
          {network.name ? <span style={{ marginLeft: '4px' }}>{network.name}</span> : null}
        </div>
      );
    });
  };

  return (
    <div className={`${styles.walletByNetwork} ${styles[theme]} ${type === 'cosmos' ? styles.fullWitdth : null}`}>
      <div className={styles.header}>
        <div className={styles.networkIcons}>{renderNetworkIcons()}</div>
      </div>
      <div className={styles.content}>{renderNetworkContent()}</div>
    </div>
  );
};
