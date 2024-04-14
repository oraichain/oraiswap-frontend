import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as BackIcon } from 'assets/icons/ic_back.svg';
import Content from 'layouts/Content';
import { useVaultDetail } from 'pages/Vaults/hooks/useVaults';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './VaultDetail.module.scss';
import { MySharePerformance } from './components/MySharePerformance';
import { VaultDetailInfo } from './components/VaultDetailInfo';

export const VaultDetail: React.FC = () => {
  const mobileMode = isMobile();
  const navigate = useNavigate();
  const { vaultUrl } = useParams();
  const { vaultDetail } = useVaultDetail(vaultUrl);

  if (!vaultDetail) return null;

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
          <VaultDetailInfo vaultDetail={vaultDetail} />
          {!mobileMode && <MySharePerformance vaultDetail={vaultDetail} />}
        </div>
      </div>
    </Content>
  );
};
