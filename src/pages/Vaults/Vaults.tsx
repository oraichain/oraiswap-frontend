import Content from 'layouts/Content';
import styles from './Vaults.module.scss';
import { WhatIsVault, WhatIsVaultMobile } from './components/WhatIsVault';
import { ListVaults } from './components/ListVaults';
import { isMobile } from '@walletconnect/browser-utils';

export const Vaults = () => {
  const mobileMode = isMobile();
  return (
    <Content nonBackground>
      <div className={styles.vaults}>
        {mobileMode ? <WhatIsVaultMobile /> : <WhatIsVault />}
        <ListVaults />
      </div>
    </Content>
  );
};
