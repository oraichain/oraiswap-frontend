import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
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
import { CW20_DECIMALS } from 'config/constants';
import { network } from 'config/networks';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import useTheme from 'hooks/useTheme';
import { toDisplay } from 'libs/utils';
import { fetchLpPoolsFromContract, useGetMyStake, useGetPoolDetail, useGetPools } from 'pages/Pools/hookV3';
import { useGetPairInfo } from 'pages/Pools/hooks/useGetPairInfo';
import { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateLpPools } from 'reducer/token';
import AddLiquidityModal from '../AddLiquidityModal/AddLiquidityModal';
import WithdrawLiquidityModal from '../WithdrawLiquidityModal/WithdrawLiquidityModal';
import styles from './MyPoolInfo.module.scss';
import StakeLPModal from './StakeLPModal/StakeLPModal';
import UnstakeLPModal from './UnstakeLPModal/UnstakeLPModal';

type ModalPool = 'deposit' | 'withdraw' | 'stake' | 'unstake';
type Props = { myLpBalance: bigint };
export const MyPoolInfo: FC<Props> = ({ myLpBalance }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { poolUrl } = useParams();
  const [address] = useConfigReducer('address');
  const [modal, setModal] = useState<ModalPool>();
  const [lpBalance, setLpBalance] = useState({
    myStakeInLp: 0n,
    myLiquidityInUsdt: 0n
  });
  const loadTokenAmounts = useLoadTokens();
  const setCachedLpPools = (payload: LpPoolDetails) => dispatch(updateLpPools(payload));

  const pools = useGetPools();
  const poolDetail = useGetPoolDetail({ pairDenoms: poolUrl });
  const { totalStaked } = useGetMyStake({
    stakerAddress: address,
    pairDenoms: poolUrl
  });

  const { lpTokenInfoData, refetchPairAmountInfo, refetchLpTokenInfoData } = useGetPairInfo(poolDetail);

  useEffect(() => {
    if (!poolDetail.info) return;
    const totalSupply = lpTokenInfoData?.total_supply;
    if (!totalSupply) return;

    const lpPrice = poolDetail.info.totalLiquidity / Number(totalSupply);
    if (!lpPrice) return;

    const myStake = totalStaked / lpPrice;
    const myLiquidityInUsdt = Number(myLpBalance) * lpPrice;
    setLpBalance({
      myStakeInLp: BigInt(Math.trunc(myStake)),
      myLiquidityInUsdt: BigInt(Math.trunc(myLiquidityInUsdt))
    });
  }, [lpTokenInfoData, myLpBalance, poolDetail.info, totalStaked]);

  const refetchAllLpPools = useCallback(async () => {
    if (pools.length === 0) return;
    const lpAddresses = pools.map((pool) => pool.liquidityAddr);
    const lpTokenData = await fetchLpPoolsFromContract(
      lpAddresses,
      address,
      new MulticallQueryClient(window.client, network.multicall)
    );
    setCachedLpPools(lpTokenData);
  }, [pools]);

  const handleLiquidityChange = useCallback(() => {
    refetchPairAmountInfo();
    refetchLpTokenInfoData();
    refetchAllLpPools();
    loadTokenAmounts({ oraiAddress: address });
  }, [address, pools]);

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
          onLiquidityChange={handleLiquidityChange}
        />
      )}
      {modal === 'withdraw' && (
        <WithdrawLiquidityModal
          isOpen={modal === 'withdraw'}
          open={() => setModal('withdraw')}
          close={() => setModal(undefined)}
          onLiquidityChange={handleLiquidityChange}
          myLpUsdt={lpBalance.myLiquidityInUsdt}
          myLpBalance={myLpBalance}
        />
      )}
      {modal === 'stake' && (
        <StakeLPModal isOpen={modal === 'stake'} open={() => setModal('stake')} close={() => setModal(undefined)} />
      )}
      {modal === 'unstake' && (
        <UnstakeLPModal
          isOpen={modal === 'unstake'}
          open={() => setModal('unstake')}
          close={() => setModal(undefined)}
        />
      )}
    </section>
  );
};
