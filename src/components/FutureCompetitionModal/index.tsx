// import Banner from 'assets/images/ftc_deadline_extended.png';
import Banner from 'assets/images/proposal_oraidex_a5.png';

// import BannerDark from 'assets/images/competiton-future-banner-dark.png';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import ModalConfirm from 'components/ConfirmModal';
import React from 'react';

const TIMEOUT_CLOSE = 10000;

const FutureCompetition = () => {
  const [active, setActive] = useState(true);
  const [open, setOpen] = useState(false);
  const [theme] = useConfigReducer('theme');
  const [_, setBannerTime] = useConfigReducer('bannerTime');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setActive(false);
    }, TIMEOUT_CLOSE);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <React.Fragment>
      <ModalConfirm
        loading={false}
        open={open}
        onOpen={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setBannerTime(Date.now());
          setOpen(false);
        }}
        showIcon={false}
        content={<>Would you like to hide this banner for 24 hours?</>}
        title="Hide Banner"
      />
      <div className={`${styles.competition} ${active ? styles.active : ''}`}>
        <img
          src={Banner}
          alt=""
          style={{
            cursor: 'pointer'
          }}
          onClick={() =>
            window.open(
              'https://daodao.zone/dao/orai1y7z3gw0al5lx9yygs800zfvnkr065xjrpld9wt6950y897grppxsrf4zcr/proposals/A5'
            )
          }
        />
        <div className={styles.content}>
          {/* <div className={styles.header}>Futures Trading Competition is live! 🎁</div> */}
          <div className={styles.header}>DAO Proposal A5 is live! ⭐️</div>
          {/* <div className={styles.desc}>
          Join now and showcase your trading skills for a chance to win big from the $15,000 USD prize pool!
        </div> */}
          <div className={styles.desc}>Your voice matters - Vote now 👆</div>

          <div className={styles.btnGroup}>
            <button
              onClick={() => {
                setActive(false);
                setOpen(true);
              }}
            >
              Skip
            </button>
            <a
              className={styles.learnMore}
              href="https://daodao.zone/dao/orai1y7z3gw0al5lx9yygs800zfvnkr065xjrpld9wt6950y897grppxsrf4zcr/proposals/A5"
              target="_blank"
              rel="noreferrer"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FutureCompetition;
