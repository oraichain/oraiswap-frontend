import { useState } from 'react';
import { WalletProvider } from '../ChooseWallet';
import { WalletItem } from '../WalletItem';
import styles from './WalletByNetwork.module.scss';
import { Button } from 'components/Button';

export type ConnectStatus = 'init' | 'confirming' | 'failed' | 'success';
export const WalletByNetwork = ({ walletProvider }: { walletProvider: WalletProvider }) => {
  const { networks, wallets, type } = walletProvider;
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>('init');

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
      case 'confirming':
        content = (
          <div className={styles.swithWallet}>
            <h4>Switch wallet?</h4>
            <div className={styles.switchText}>Disconnect from OWallet and connect to Keplr</div>
            <div className={styles.groupBtns}>
              <Button onClick={() => setConnectStatus('init')} type="secondary">
                Cancel
              </Button>
              <Button onClick={() => setConnectStatus('confirming')} type="primary">
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
              <Button onClick={() => setConnectStatus('confirming')} type="primary">
                Try again
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

  return (
    <div className={`${styles.walletByNetwork} ${type === 'cosmos' ? styles.fullWitdth : null}`}>
      <div className={styles.header}>
        <div className={styles.networkIcons}>
          {networks.map((network, index) => {
            return (
              <div className={styles.networkIcon} key={index}>
                <network.icon />
                {network.name ? <span style={{ marginLeft: '4px' }}>{network.name}</span> : null}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.content}>{renderNetworkContent()}</div>
    </div>
  );
};
