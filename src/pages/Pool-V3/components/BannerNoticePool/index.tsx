import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as PepeIcon } from 'assets/icons/pepe.svg';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

import { PEPE_ORAICHAIN_EXT_DENOM, USDC_CONTRACT } from '@oraichain/oraidex-common';
import useTemporaryConfigReducer from 'hooks/useTemporaryConfigReducer';

const url = `/pools-v3/${encodeURIComponent(PEPE_ORAICHAIN_EXT_DENOM)}-${encodeURIComponent(
  USDC_CONTRACT
)}-3000000000-100`;

const BannerNoticePool = () => {
  const [isShowBanner] = useTemporaryConfigReducer('customBanner');
  const [open, setOpen] = useState(!!isShowBanner);
  const navigate = useNavigate();

  if (!open) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content} onClick={() => navigate(url)}>
        {/* <div className={styles.logo}>
          <PepeIcon />
          <UsdcIcon />
        </div> */}
        <div className={styles.text}>
          <div className={styles.logo}>
            <PepeIcon />
            <UsdcIcon />
          </div>
          <span className={styles.txtContent}>
            New Listing Alert: <span className={styles.coin}>PEPE/USDC.</span> <Link to={url}>TRADE NOW!</Link> 🚀
          </span>
        </div>
      </div>

      <div className={styles.close} onClick={() => setOpen(false)}>
        <CloseIcon />
      </div>
    </div>
  );
};

export default BannerNoticePool;
