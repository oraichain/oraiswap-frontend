import { ReactComponent as DepositIcon } from 'assets/icons/ic_deposit.svg';
import { ReactComponent as StakingIcon } from 'assets/icons/ic_stake.svg';
import { ReactComponent as UnstakeIcon } from 'assets/icons/ic_unstake.svg';
import { ReactComponent as UnstakeLightIcon } from 'assets/icons/ic_unstake_light.svg';
import { ReactComponent as WithdrawIcon } from 'assets/icons/ic_withdraw.svg';
import { ReactComponent as WithdrawLightIcon } from 'assets/icons/ic_withdraw_light.svg';
import { ReactComponent as ArrowRightIcon } from 'assets/icons/ic_arrow_right.svg';
import img_coin from 'assets/images/img_coin.png';
import { Button } from 'components/Button';
import styles from './MyPoolInfo.module.scss';
import useTheme from 'hooks/useTheme';

export const MyPoolInfo = () => {
  const theme = useTheme();

  return (
    <section className={styles.myPoolInfo}>
      <div className={styles.liquidity}>
        <div className={styles.iconArrow}>
          <ArrowRightIcon />
        </div>
        <div>
          <div className={styles.title}>My Liquidity</div>
          <div className={styles.description}>Swap your tokens into Liquidity Points</div>
        </div>
        <div className={styles.amount}>
          <div className={styles.amountUsdt}>$0</div>
          <div className={styles.amountLp}>0.00 LP</div>
        </div>
        <div className={styles.cta}>
          <Button
            type="secondary"
            onClick={() => console.log('ok')}
            icon={theme === 'dark' ? <WithdrawIcon /> : <WithdrawLightIcon />}
          >
            Withdraw LP
          </Button>
          <Button type="primary" onClick={() => console.log('ok')} icon={<DepositIcon />}>
            Deposit
          </Button>
        </div>
      </div>
      <div className={styles.stake}>
        <div className={styles.bgCoin}>
          <img src={img_coin} alt="img-coin" />
        </div>
        <div>
          <div className={styles.title}>My Staked</div>
          <div className={styles.description}>Stake your Liquidity Provider token to earn rewards</div>
        </div>
        <div className={styles.amount}>
          <div className={styles.amountUsdt}>$0</div>
          <div className={styles.amountLp}>0.00 LP</div>
        </div>
        <div className={styles.cta}>
          <Button
            type="secondary"
            onClick={() => console.log('ok')}
            icon={theme === 'dark' ? <UnstakeIcon /> : <UnstakeLightIcon />}
          >
            Unstake LP
          </Button>
          <Button type="primary" onClick={() => console.log('ok')} icon={<StakingIcon />}>
            Stake LP
          </Button>
        </div>
      </div>
    </section>
  );
};
