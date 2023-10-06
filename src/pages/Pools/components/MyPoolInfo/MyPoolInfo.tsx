import { useQuery } from '@tanstack/react-query';
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
import { TokenItemType } from 'config/bridgeTokens';
import { CW20_DECIMALS } from 'config/constants';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { toDisplay } from 'libs/utils';
import { useGetMyStake, useGetPoolDetail } from 'pages/Pools/hookV3';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTokenInfo } from 'rest/api';
import AddLiquidityModal from '../AddLiquidityModal/AddLiquidityModal';
import styles from './MyPoolInfo.module.scss';
import StakeLPModal from './StakeLPModal/StakeLPModal';
import UnstakeLPModal from './UnstakeLPModal/UnstakeLPModal';
import WithdrawLiquidityModal from './WithdrawLiquidityModal/WithdrawLiquidityModal';

type Props = {
  myLpBalance: bigint;
};

export const MyPoolInfo: FC<Props> = ({ myLpBalance }) => {
  const theme = useTheme();
  const { poolUrl } = useParams();
  const [address] = useConfigReducer('address');
  const [isOpenDepositPool, setIsOpenDepositPool] = useState(false);
  const [isOpenWithdrawPool, setIsOpenWithdrawPool] = useState(false);
  const [isOpenStakeLP, setIsOpenStakeLP] = useState(false);
  const [isOpenUnstakeLP, setIsOpenUnstakeLP] = useState(false);
  const [lpBalance, setLpBalance] = useState({
    myStakeInLp: 0n,
    myLiquidityInUsdt: 0n
  });
  const poolDetailData = useGetPoolDetail({ pairDenoms: poolUrl });
  const { totalStaked } = useGetMyStake({
    stakerAddress: address,
    pairDenoms: poolUrl
  });

  const { data: lpTokenInfoData } = useQuery(
    ['token-info'],
    () =>
      fetchTokenInfo({
        contractAddress: poolDetailData?.info.liquidityAddr
      } as TokenItemType),
    {
      enabled: !!poolDetailData,
      refetchOnWindowFocus: false
    }
  );

  useEffect(() => {
    if (!poolDetailData.info) return;
    const totalSupply = lpTokenInfoData?.total_supply;
    if (!totalSupply) return;

    const lpPrice = poolDetailData.info.totalLiquidity / Number(totalSupply);
    if (!lpPrice) return;

    const myStake = totalStaked / lpPrice;
    const myLiquidityInUsdt = Number(myLpBalance) * lpPrice;
    setLpBalance({
      myStakeInLp: BigInt(Math.trunc(myStake)),
      myLiquidityInUsdt: BigInt(Math.trunc(myLiquidityInUsdt))
    });
  }, [lpTokenInfoData, myLpBalance, poolDetailData.info, totalStaked]);

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
          <div className={styles.amountUsdt}>
            <TokenBalance
              balance={{
                amount: BigInt(Math.trunc(totalStaked)),
                decimals: CW20_DECIMALS
              }}
              prefix="$"
              decimalScale={4}
            />
          </div>
          <div className={styles.amountLp}>
            <TokenBalance
              balance={{
                amount: lpBalance.myStakeInLp,
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
