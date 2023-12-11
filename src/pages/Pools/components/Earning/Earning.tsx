import { CW20_DECIMALS } from '@oraichain/oraidex-common/build/constant';
import { toDisplay } from '@oraichain/oraidex-common/build/helper';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import TokenBalance from 'components/TokenBalance';
import useConfigReducer from 'hooks/useConfigReducer';
import useTheme from 'hooks/useTheme';
import { getUsd } from 'libs/utils';
import { TokenItemTypeExtended, useEarningReward } from 'pages/Pools/hooks/useEarningReward';
import styles from './Earning.module.scss';

export const Earning = ({ onLiquidityChange }: { onLiquidityChange: () => void }) => {
  const { actionLoading, myStakes, pendingRewards, handleClaimReward } = useEarningReward({ onLiquidityChange });
  const theme = useTheme();
  const [cachePrices] = useConfigReducer('coingecko');

  const generateIcon = (pendingReward: TokenItemTypeExtended) => {
    return pendingReward.Icon ? (
      theme === 'light' ? (
        pendingReward.IconLight ? (
          <pendingReward.IconLight style={{ width: 18, marginRight: 6 }} />
        ) : (
          <pendingReward.Icon style={{ width: 18, marginRight: 6 }} />
        )
      ) : (
        <pendingReward.Icon style={{ width: 18, marginRight: 6 }} />
      )
    ) : (
      <></>
    );
  };

  const disabledClaim = actionLoading || !pendingRewards.some((pendingReward) => pendingReward.amount !== 0n);

  const totalEarned = myStakes[0]?.earnAmountInUsdt || 0;

  return (
    <section className={styles.earning}>
      <div className={styles.earningLeft}>
        <div className={`${styles.assetEarning}${' '}${pendingRewards.length === 1 ? styles.single : ''}`}>
          <div className={styles.title}>
            <span>Total Earned</span>
          </div>
          <div className={styles.amount}>
            <TokenBalance
              balance={toDisplay(BigInt(Math.trunc(totalEarned)), CW20_DECIMALS)}
              prefix="$"
              decimalScale={4}
            />
          </div>
        </div>
        {pendingRewards.length > 0 &&
          pendingRewards
            .sort((a, b) => a.denom.localeCompare(b.denom))
            .map((pendingReward, idx) => {
              return (
                <div className={styles.assetEarning} key={idx}>
                  <div className={styles.title}>
                    {generateIcon(pendingReward)}
                    <span>{pendingReward.denom.toUpperCase()} Earning</span>
                  </div>
                  <div className={styles.amount}>
                    <TokenBalance
                      balance={getUsd(pendingReward.amount, pendingReward, cachePrices)}
                      prefix="$"
                      decimalScale={4}
                    />
                  </div>
                  <div className={styles.amountOrai}>
                    <TokenBalance
                      balance={{
                        amount: pendingReward.amount,
                        denom: pendingReward?.denom.toUpperCase(),
                        decimals: 6
                      }}
                      decimalScale={6}
                    />
                  </div>
                </div>
              );
            })}
      </div>

      <div className={styles.claim}>
        <Button
          type="primary"
          onClick={() => handleClaimReward()}
          disabled={disabledClaim}
          icon={actionLoading ? <Loader width={20} height={20} /> : null}
        >
          Claim Rewards
        </Button>
      </div>
    </section>
  );
};
