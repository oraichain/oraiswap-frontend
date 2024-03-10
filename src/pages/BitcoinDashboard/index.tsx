import React from 'react';
import { Header } from './components/Header';
import Content from 'layouts/Content';
import styles from './index.module.scss';
import Checkpoint from './components/Checkpoint/Checkpoint';
import { PendingDeposits } from './components/PendingDeposits';
import { Tabs, KeysFilter } from './components/Tabs/Tabs';
import { useSearchParams } from 'react-router-dom';

const BitcoinDashboard: React.FC<{}> = () => {
  const [searchParams, _] = useSearchParams();
  const tab = searchParams.get('tab');
  return (
    <Content nonBackground otherBackground>
      <div className={styles.container}>
        <Header />
        <Tabs />
        {tab == KeysFilter.checkpoint ? <Checkpoint /> : <PendingDeposits />}
      </div>
    </Content>
  );
};

export default BitcoinDashboard;
