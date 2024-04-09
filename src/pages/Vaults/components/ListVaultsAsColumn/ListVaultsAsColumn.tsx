import { VaultItem } from '../VaultItem';
import styles from './ListVaultsAsColumn.module.scss';

export const ListVaultsAsColumn = () => {
  return (
    <div className={styles.listVault}>
      <VaultItem />
      <VaultItem />
      <VaultItem />
      <VaultItem />
      <VaultItem />
      <VaultItem />
      <VaultItem />
      <VaultItem />
      <VaultItem />
    </div>
  );
};
