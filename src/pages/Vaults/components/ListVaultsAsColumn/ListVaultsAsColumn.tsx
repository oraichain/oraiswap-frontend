import { useGetVaults } from 'pages/Vaults/hooks/useVaults';
import { VaultItem } from '../VaultItem';
import styles from './ListVaultsAsColumn.module.scss';

export const ListVaultsAsColumn = () => {
  const { totalVaultInfos } = useGetVaults();

  return (
    <div className={styles.listVault}>
      {totalVaultInfos.map((info, index) => (
        <VaultItem key={index} info={info} />
      ))}
    </div>
  );
};
