import classNames from 'classnames';
import { FC } from 'react';
import styles from './style.module.scss';
import { useSearchParams } from 'react-router-dom';

export enum KeysFilter {
  pending_deposits = 'pending_deposits',
  checkpoint = 'checkpoint'
}

const LIST_FILTERS = [
  {
    key: KeysFilter.pending_deposits,
    text: 'Pending Deposits'
  },
  {
    key: KeysFilter.checkpoint,
    text: 'Checkpoint'
  }
];

export const Tabs: FC<{}> = ({}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  return (
    <div className={styles.pool_filter}>
      <div className={styles.pool_filter_list}>
        {LIST_FILTERS.map((item) => (
          <div
            key={item.key}
            className={classNames(item.key === tab ? styles.filter_active : null, styles.filter_item)}
            onClick={() => {
              setSearchParams({
                tab: item.key
              });
            }}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};
