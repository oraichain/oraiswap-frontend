import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as HamsterIcon } from 'assets/icons/hmstr.svg';
import { ReactComponent as PepeIcon } from 'assets/icons/pepe.svg';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

import { PEPE_ORAICHAIN_EXT_DENOM, HMSTR_ORAICHAIN_DENOM, USDC_CONTRACT } from '@oraichain/oraidex-common';
import useTemporaryConfigReducer from 'hooks/useTemporaryConfigReducer';

const urlPepe = `/pools-v3/${encodeURIComponent(PEPE_ORAICHAIN_EXT_DENOM)}-${encodeURIComponent(
  USDC_CONTRACT
)}-3000000000-100`;

const urlHmstr = `/pools-v3/${encodeURIComponent(HMSTR_ORAICHAIN_DENOM)}-${encodeURIComponent(
  USDC_CONTRACT
)}-3000000000-100`;

const INTERVAL_TIME = 3000;

const NoticeList = [
  {
    url: urlHmstr,
    XIcon: HamsterIcon,
    YIcon: UsdcIcon,
    Xname: 'HMSTR',
    Yname: 'USDC'
  },
  {
    url: urlPepe,
    XIcon: PepeIcon,
    YIcon: UsdcIcon,
    Xname: 'PEPE',
    Yname: 'USDC'
  }
];

const BannerNoticePool = () => {
  const [isShowBanner] = useTemporaryConfigReducer('customBanner');
  const [open, setOpen] = useState(!!isShowBanner);
  const [bannerIdx, setBannersIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (NoticeList.length === 1) return;

    const carousel = () => {
      setBannersIdx((bannerIdx) => {
        if (bannerIdx === NoticeList.length - 1) {
          return 0;
        }
        return bannerIdx + 1;
      });
    };

    const interval = setInterval(carousel, INTERVAL_TIME);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!open) {
    return null;
  }

  const { XIcon, YIcon, Xname, Yname, url } = NoticeList[bannerIdx];

  return (
    <div className={styles.banner}>
      <div className={styles.content} onClick={() => navigate(url)}>
        {/* <div className={styles.logo}>
          <PepeIcon />
          <UsdcIcon />
        </div> */}
        <div className={styles.text}>
          <div className={styles.logo}>
            <XIcon />
            <YIcon />
          </div>
          <span className={styles.txtContent}>
            New Listing Alert:{' '}
            <span className={styles.coin}>
              {Xname}/{Yname}.
            </span>{' '}
            <Link to={url}>Add LP Now!</Link> 🚀
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
