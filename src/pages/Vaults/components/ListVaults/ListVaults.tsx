import { useState } from 'react';
import styles from './ListVaults.module.scss';
import { ListVaultsAsColumn } from '../ListVaultsAsColumn';
import { ReactComponent as ViewAsColumn } from 'assets/icons/ic_view_column.svg';
import { ReactComponent as ViewAsList } from 'assets/icons/ic_view_list.svg';
import { ListVaultsAsList } from '../ListVaultsAsList';

export type ViewType = 'column' | 'list';

export const ListVaults = () => {
  const [viewType, setViewType] = useState<ViewType>('column');

  const generateVaultList = () => {
    return viewType === 'column' ? <ListVaultsAsColumn /> : <ListVaultsAsList />;
  };

  return (
    <div className={styles.listVaultsWrapper}>
      <div className={styles.header}>
        <h3>Vaults</h3>
        <div className={styles.viewType}>
          <div
            title="View as list"
            className={viewType === 'column' && styles.active}
            onClick={() => setViewType('column')}
          >
            <ViewAsColumn width={24} height={24} />
          </div>
          <div
            title="View as column"
            className={viewType === 'list' && styles.active}
            onClick={() => setViewType('list')}
          >
            <ViewAsList width={24} height={24} />
          </div>
        </div>
      </div>
      {generateVaultList()}
    </div>
  );
};
