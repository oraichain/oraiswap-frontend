import { ReactComponent as BackIcon } from 'assets/icons/ic_back.svg';
import Content from 'layouts/Content';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VaultDetail.module.scss';
import { VaultDetailInfo } from './components/VaultDetailInfo';
import { MySharePerformance } from './components/MySharePerformance';

export const VaultDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Content nonBackground>
      <div className={styles.vaultDetail}>
        <div className={styles.backWrapper}>
          <div
            className={styles.back}
            onClick={() => {
              navigate(`/vaults`);
            }}
          >
            <BackIcon className={styles.backIcon} />
            <span>Back to all vaults</span>
          </div>
        </div>

        <div className={styles.vaultDetailContent}>
          <VaultDetailInfo />
          <MySharePerformance />
        </div>
      </div>
    </Content>
  );
};
