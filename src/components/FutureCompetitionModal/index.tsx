// import Banner from 'assets/images/ftc_deadline_extended.png';
import Banner from 'assets/images/oraidex_proposal.png';

// import BannerDark from 'assets/images/competiton-future-banner-dark.png';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

const TIMEOUT_CLOSE = 10000;

const FutureCompetition = () => {
  const [active, setActive] = useState(true);
  const [theme] = useConfigReducer('theme');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setActive(false);
    }, TIMEOUT_CLOSE);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={`${styles.competition} ${active ? styles.active : ''}`}>
      <img
        src={Banner}
        alt=""
        style={{
          cursor: 'pointer'
        }}
        onClick={() =>
          window.open(
            'https://daodao.zone/dao/orai1y7z3gw0al5lx9yygs800zfvnkr065xjrpld9wt6950y897grppxsrf4zcr/proposals/A3'
          )
        }
      />
      <div className={styles.content}>
        {/* <div className={styles.header}>Futures Trading Competition is live! 🎁</div> */}
        <div className={styles.header}>DAO Proposal A3 is live! ⭐️</div>
        {/* <div className={styles.desc}>
          Join now and showcase your trading skills for a chance to win big from the $15,000 USD prize pool!
        </div> */}
        <div className={styles.desc}>Your voice matters - Vote now 👆</div>
        <div className={styles.btnGroup}>
          <button
            onClick={() => {
              setActive(false);
            }}
          >
            Skip
          </button>
          <a
            className={styles.learnMore}
            href="https://daodao.zone/dao/orai1y7z3gw0al5lx9yygs800zfvnkr065xjrpld9wt6950y897grppxsrf4zcr/proposals/A3"
            target="_blank"
            rel="noreferrer"
          >
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default FutureCompetition;
