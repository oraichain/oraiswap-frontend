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
import { useState } from 'react';
import AddLiquidityModal from '../AddLiquidityModal/AddLiquidityModal';
import WithdrawLiquidityModal from './WithdrawLiquidityModal/WithdrawLiquidityModal';
import StakeLPModal from './StakeLPModal/StakeLPModal';
import UnstakeLPModal from './UnstakeLPModal/UnstakeLPModal';

export const MyPoolInfo = () => {
  const theme = useTheme();
  const [isOpenDepositPool, setIsOpenDepositPool] = useState(false);
  const [isOpenWithdrawPool, setIsOpenWithdrawPool] = useState(false);
  const [isOpenStakeLP, setIsOpenStakeLP] = useState(false);
  const [isOpenUnstakeLP, setIsOpenUnstakeLP] = useState(false);

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
            onClick={() => setIsOpenWithdrawPool(true)}
            icon={theme === 'dark' ? <WithdrawIcon /> : <WithdrawLightIcon />}
          >
            Withdraw LP
          </Button>
          <Button type="primary" onClick={() => setIsOpenDepositPool(true)} icon={<DepositIcon />}>
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
            onClick={() => setIsOpenUnstakeLP(true)}
            icon={theme === 'dark' ? <UnstakeIcon /> : <UnstakeLightIcon />}
          >
            Unstake LP
          </Button>
          <Button type="primary" onClick={() => setIsOpenStakeLP(true)} icon={<StakingIcon />}>
            Stake LP
          </Button>{' '}
        </div>
      </div>
      {isOpenDepositPool && (
        <AddLiquidityModal
          isOpen={isOpenDepositPool}
          open={() => setIsOpenDepositPool(true)}
          close={() => setIsOpenDepositPool(false)}
        />
      )}
      {isOpenWithdrawPool && (
        <WithdrawLiquidityModal
          isOpen={isOpenWithdrawPool}
          open={() => setIsOpenWithdrawPool(true)}
          close={() => setIsOpenWithdrawPool(false)}
        />
      )}

      {isOpenStakeLP && (
        <StakeLPModal
          isOpen={isOpenStakeLP}
          open={() => setIsOpenStakeLP(true)}
          close={() => setIsOpenStakeLP(false)}
        />
      )}
      {isOpenUnstakeLP && (
        <UnstakeLPModal
          isOpen={isOpenUnstakeLP}
          open={() => setIsOpenUnstakeLP(true)}
          close={() => setIsOpenUnstakeLP(false)}
        />
      )}
    </section>
  );
};
