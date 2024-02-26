import { toAmount, toDisplay } from '@oraichain/oraidex-common';
import { Cw20StakingClient } from '@oraichain/oraidex-contracts-sdk';
import { LockInfoResponse } from '@oraichain/oraidex-contracts-sdk/build/Cw20Staking.types';
import { ReactComponent as OraiXIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as OraiXLightIcon } from 'assets/icons/oraix_light.svg';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { handleErrorTransaction } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import { getUsd } from 'libs/utils';
import { TIMER } from 'pages/CoHarvest/constants';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { ORAIX_TOKEN_INFO, STAKE_TAB, STAKING_PERIOD } from 'pages/Staking/constants';
import { getDiffDay } from 'pages/Staking/helpers';
import { useGetLockInfo, useGetMyStakeRewardInfo, useGetStakeInfo } from 'pages/Staking/hooks';
import { useState } from 'react';
import InputBalance from '../InputBalance';
import styles from './index.module.scss';

const UnStakeTab = () => {
  const { data: prices } = useCoinGeckoPrices();
  const [theme] = useConfigReducer('theme');
  const [address] = useConfigReducer('address');
  const loadTokenAmounts = useLoadTokens();
  const [amount, setAmount] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>(false);

  const { refetchStakeInfo } = useGetStakeInfo(ORAIX_TOKEN_INFO.contractAddress);
  const { myStakeRewardInfo, refetchMyStakeRewardInfo } = useGetMyStakeRewardInfo(
    ORAIX_TOKEN_INFO.contractAddress,
    address
  );
  const { lockInfo, refetchLockInfo } = useGetLockInfo(ORAIX_TOKEN_INFO.contractAddress, address);

  const stakedAmount = myStakeRewardInfo?.stakedAmount || '0';

  const listUnstake: LockInfoResponse[] = lockInfo?.lock_infos || [];

  const isEnableWithdraw = listUnstake.find((unstakeItem) => {
    const timeLeft = getDiffDay(Date.now(), unstakeItem.unlock_time * TIMER.MILLISECOND);

    return !timeLeft;
  });

  const handleUnstake = async () => {
    if (!amount) return displayToast(TToastType.TX_FAILED, { message: 'Unstake Amount is required' });

    setLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const cw20StakingClient = new Cw20StakingClient(window.client, address, network.staking_oraix);

      const result = await cw20StakingClient.unbond({
        amount: toAmount(amount).toString(),
        stakingToken: ORAIX_TOKEN_INFO.contractAddress
      });

      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        refetchStakeInfo();
        refetchMyStakeRewardInfo();
        refetchLockInfo();
        loadTokenAmounts({ oraiAddress: address });
      }
    } catch (error) {
      console.log('error in unbond: ', error);
      handleErrorTransaction(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    // if (!amount) return displayToast(TToastType.TX_FAILED, { message: 'Stake Amount is required' });

    setLoadingWithdraw(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const cw20StakingClient = new Cw20StakingClient(window.client, address, network.staking_oraix);

      const result = await cw20StakingClient.unbond({
        amount: '0',
        stakingToken: ORAIX_TOKEN_INFO.contractAddress
      });

      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });

        refetchStakeInfo();
        refetchMyStakeRewardInfo();
        refetchLockInfo();
        loadTokenAmounts({ oraiAddress: address });
      }
    } catch (error) {
      console.log('error in withdraw: ', error);
      handleErrorTransaction(error);
    } finally {
      setLoadingWithdraw(false);
    }
  };

  return (
    <div className={styles.unstakeTab}>
      <InputBalance
        onSubmit={() => handleUnstake()}
        balance={stakedAmount}
        label="Stake amount"
        type={STAKE_TAB.UnStake}
        amount={amount}
        loading={loading}
        setAmount={setAmount}
      />

      <div className={styles.note}>
        To withdraw your stake, you will need to activate a{' '}
        <span className={styles.noteHighlight}>30-day unbonding period</span>. You may withdraw at any time, but your
        tokens will become available again only after this duration
      </div>

      <div className={styles.result}>
        {listUnstake?.length <= 0 ? null : (
          <div className={styles.header}>
            <span>Available to withdraw</span>
            <Button type="primary-sm" onClick={() => handleWithdraw()} disabled={loadingWithdraw || !isEnableWithdraw}>
              {loadingWithdraw && <Loader width={18} height={18} />}&nbsp; Withdraw All
            </Button>
          </div>
        )}

        {listUnstake?.length <= 0 ? null : (
          <div className={styles.list}>
            {listUnstake.map((unstakeItem, key) => {
              const amountUsd = getUsd(unstakeItem.amount, ORAIX_TOKEN_INFO, prices);
              const timeLeft = getDiffDay(Date.now(), unstakeItem.unlock_time * TIMER.MILLISECOND);
              const percent = (timeLeft * 100) / STAKING_PERIOD;

              return (
                <div className={styles.item} key={`${key}-${unstakeItem.unlock_time}`}>
                  <div className={styles.title}>
                    <div className={`${styles.usd} ${!timeLeft ? styles.active : ''}`}>
                      {formatDisplayUsdt(amountUsd)}
                    </div>
                    {!timeLeft ? null : (
                      <div className={styles.timeleft}>
                        <span>{timeLeft} days left</span>
                        <div className={styles.pie}>
                          <div
                            className={styles.progress}
                            style={{
                              background:
                                theme === 'light'
                                  ? `conic-gradient(#2F5711 ${percent}%, #EFEFEF ${percent}%)`
                                  : `conic-gradient(#92E54C ${percent}%, #494949 ${percent}%)`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`${styles.value} ${!timeLeft ? styles.activeValue : ''}`}>
                    {theme === 'light' ? <OraiXLightIcon /> : <OraiXIcon />}
                    <span>{numberWithCommas(toDisplay(unstakeItem.amount))}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnStakeTab;
