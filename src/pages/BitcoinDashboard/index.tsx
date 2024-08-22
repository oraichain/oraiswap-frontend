import React from 'react';
import { Header } from './components/Header';
import Content from 'layouts/Content';
import styles from './index.module.scss';
import Checkpoint from './components/Checkpoint/Checkpoint';
import { PendingDeposits } from './components/PendingDeposits';
import { Tabs, KeysFilter } from './components/Tabs/Tabs';
import { useSearchParams } from 'react-router-dom';
import { PendingWithdraws } from './components/PendingWithdraws';

const BitcoinDashboard: React.FC<{}> = () => {
  const [searchParams, _] = useSearchParams();
  const tab = searchParams.get('tab');
  const renderTabs = () => {
    switch (tab) {
      case KeysFilter.pending_deposits:
        return <PendingDeposits />;
      case KeysFilter.checkpoint:
        return <Checkpoint />;
      case KeysFilter.pending_withdraws:
        return <PendingWithdraws />;
    }
  };
  return (
    <Content nonBackground otherBackground>
      <div className={styles.container}>
        <Header />
        <Tabs />
        {renderTabs()}
      </div>
    </Content>
  );
};

export default BitcoinDashboard;
