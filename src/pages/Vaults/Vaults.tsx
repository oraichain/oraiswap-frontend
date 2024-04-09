import Content from 'layouts/Content';
import styles from './Vaults.module.scss';
import { WhatIsVault } from './components/WhatIsVault';
import { ListVaults } from './components/ListVaults';

export const Vaults = () => {
  return (
    <Content nonBackground>
      <div className={styles.vaults}>
        <WhatIsVault />
        <ListVaults />
      </div>
    </Content>
  );
};
