import { CW20_DECIMALS } from '@oraichain/oraidex-common/build/constant';
import { toDisplay } from '@oraichain/oraidex-common/build/helper';
import { ReactComponent as ArrowRightIcon } from 'assets/icons/ic_arrow_right.svg';
import { ReactComponent as DepositIcon } from 'assets/icons/ic_deposit.svg';
import { ReactComponent as StakingIcon } from 'assets/icons/ic_stake.svg';
import { ReactComponent as UnstakeIcon } from 'assets/icons/ic_unstake.svg';
import { ReactComponent as UnstakeLightIcon } from 'assets/icons/ic_unstake_light.svg';
import { ReactComponent as WithdrawIcon } from 'assets/icons/ic_withdraw.svg';
import { ReactComponent as WithdrawLightIcon } from 'assets/icons/ic_withdraw_light.svg';
import img_coin from 'assets/images/img_coin.png';
import { Button } from 'components/Button';
import TokenBalance from 'components/TokenBalance';
import useTheme from 'hooks/useTheme';
import { useMyPoolInfo } from 'pages/Pools/hooks/useMyPoolInfo';
import { FC, useState } from 'react';
import { AddLiquidityModal } from '../AddLiquidityModal';
import { StakeLPModal } from '../StakeLPModal';
import { UnstakeLPModal } from '../UnstakeLPModal';
import { WithdrawLiquidityModal } from '../WithdrawLiquidityModal';
import styles from './MyPoolInfo.module.scss';

type ModalPool = 'deposit' | 'withdraw' | 'stake' | 'unstake';
type Props = { myLpBalance: bigint; onLiquidityChange: () => void };

export const MyPoolInfo: FC<Props> = ({ myLpBalance, onLiquidityChange }) => {
  const theme = useTheme();
  const [modal, setModal] = useState<ModalPool>();
  const { poolUrl, lpBalance, totalBondAmount, totalBondAmountInUsdt } = useMyPoolInfo(myLpBalance);

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
          <div className={styles.amountUsdt}>${toDisplay(lpBalance.myLiquidityInUsdt)}</div>
          <div className={styles.amountLp}>{toDisplay(myLpBalance)} LP</div>
        </div>
        <div className={styles.cta}>
          <Button
            type="secondary"
            onClick={() => setModal('withdraw')}
            icon={theme === 'dark' ? <WithdrawIcon /> : <WithdrawLightIcon />}
          >
            Withdraw LP
          </Button>
          <Button type="primary" onClick={() => setModal('deposit')} icon={<DepositIcon />}>
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
          <div className={styles.amountUsdt}>
            <TokenBalance
              balance={{
                amount: totalBondAmountInUsdt,
                decimals: CW20_DECIMALS
              }}
              prefix="$"
              decimalScale={4}
            />
          </div>
          <div className={styles.amountLp}>
            <TokenBalance
              balance={{
                amount: totalBondAmount,
                decimals: CW20_DECIMALS
              }}
              suffix=" LP"
              decimalScale={4}
            />
          </div>
        </div>
        <div className={styles.cta}>
          <Button
            type="secondary"
            onClick={() => setModal('unstake')}
            icon={theme === 'dark' ? <UnstakeIcon /> : <UnstakeLightIcon />}
          >
            Unstake LP
          </Button>
          <Button type="primary" onClick={() => setModal('stake')} icon={<StakingIcon />}>
            Stake LP
          </Button>{' '}
        </div>
      </div>

      {modal === 'deposit' && (
        <AddLiquidityModal
          isOpen={modal === 'deposit'}
          open={() => setModal('deposit')}
          close={() => setModal(undefined)}
          onLiquidityChange={onLiquidityChange}
          pairDenoms={poolUrl}
          assetToken={undefined}
        />
      )}
      {modal === 'withdraw' && (
        <WithdrawLiquidityModal
          isOpen={modal === 'withdraw'}
          open={() => setModal('withdraw')}
          close={() => setModal(undefined)}
          onLiquidityChange={onLiquidityChange}
          myLpUsdt={lpBalance.myLiquidityInUsdt}
          myLpBalance={myLpBalance}
          assetToken={undefined}
        />
      )}
      {modal === 'stake' && (
        <StakeLPModal
          isOpen={modal === 'stake'}
          open={() => setModal('stake')}
          close={() => setModal(undefined)}
          onLiquidityChange={onLiquidityChange}
          myLpUsdt={lpBalance.myLiquidityInUsdt}
          myLpBalance={myLpBalance}
          assetToken={undefined}
        />
      )}
      {modal === 'unstake' && (
        <UnstakeLPModal
          isOpen={modal === 'unstake'}
          open={() => setModal('unstake')}
          close={() => setModal(undefined)}
          onLiquidityChange={onLiquidityChange}
          myLpUsdt={lpBalance.myLiquidityInUsdt}
          myLpBalance={myLpBalance}
          assetToken={undefined}
          lpPrice={lpBalance.lpPrice}
        />
      )}
    </section>
  );
};
