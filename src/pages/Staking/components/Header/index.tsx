import styles from './index.module.scss';
import StakingImg from 'assets/images/staking.webp';
import StakingDarkImg from 'assets/images/staking_dark.webp';
import useConfigReducer from 'hooks/useConfigReducer';

const Header = () => {
  const [theme] = useConfigReducer('theme');
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.text}>
            OraiDEX (ORAIX)&nbsp;
            <span className={styles.highlight}>Staking</span>
          </div>
          <div className={styles.desc}>Stake your ORAIX to earn yield and more</div>
        </div>

        <div className={styles.img}>
          <img src={theme === 'light' ? StakingImg : StakingDarkImg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Header;
