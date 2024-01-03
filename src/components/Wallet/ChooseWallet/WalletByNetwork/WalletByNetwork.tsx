import { WalletProvider } from '../ChooseWallet';
import { WalletItem } from '../WalletItem';
import styles from './WalletByNetwork.module.scss';

export const WalletByNetwork = ({ walletProvider }: { walletProvider: WalletProvider }) => {
  const { networks, wallets, type } = walletProvider;

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
      <div className={styles.content}>
        <div className={styles.wallets}>
          {wallets.map((wallet, index) => {
            return <WalletItem key={index} wallet={wallet} />;
          })}
        </div>
      </div>
    </div>
  );
};
