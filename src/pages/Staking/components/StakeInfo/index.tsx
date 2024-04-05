import { toDisplay } from '@oraichain/oraidex-common';
import { ReactComponent as OraiXIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as OraiXLightIcon } from 'assets/icons/oraix_light.svg';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';

import useConfigReducer from 'hooks/useConfigReducer';

import { Cw20StakingClient } from '@oraichain/oraidex-contracts-sdk';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { handleErrorTransaction } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { getUsd } from 'libs/utils';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { ORAIX_TOKEN_INFO, USDC_TOKEN_INFO } from 'pages/Staking/constants';
import { useGetLockInfo, useGetMyStakeRewardInfo } from 'pages/Staking/hooks';
import { useState } from 'react';
import styles from './index.module.scss';
import { useLoadOraichainTokens } from 'hooks/useLoadTokens';

const StakeInfo = () => {
  const [theme] = useConfigReducer('theme');
  const [address] = useConfigReducer('address');
  const { data: prices } = useCoinGeckoPrices();
  const loadOraichainToken = useLoadOraichainTokens();
  const { myStakeRewardInfo, refetchMyStakeRewardInfo } = useGetMyStakeRewardInfo(
    ORAIX_TOKEN_INFO.contractAddress,
    address
  );
  const { lockInfo, refetchLockInfo } = useGetLockInfo(ORAIX_TOKEN_INFO.contractAddress, address);

  const stakedAmount = myStakeRewardInfo?.stakedAmount || '0';
  const reward = myStakeRewardInfo?.rewardPending || '0';
  const lockAmount = lockInfo?.lockAmount || '0';

  const stakeAmountUsd = getUsd(stakedAmount, ORAIX_TOKEN_INFO, prices);
  const rewardUsd = getUsd(reward, USDC_TOKEN_INFO, prices);
  const lockUsd = getUsd(lockAmount, ORAIX_TOKEN_INFO, prices);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClaim = async () => {
    // if (!amount) return displayToast(TToastType.TX_FAILED, { message: 'Stake Amount is required' });

    setLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const cw20StakingClient = new Cw20StakingClient(window.client, address, network.staking_oraix);

      const result = await cw20StakingClient.withdraw({
        stakingToken: ORAIX_TOKEN_INFO.contractAddress
      });

      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        loadOraichainToken(address, [USDC_TOKEN_INFO.contractAddress]);
        refetchMyStakeRewardInfo();
        refetchLockInfo();
      }
    } catch (error) {
      console.log('error in claim: ', error);
      handleErrorTransaction(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.stakeInfo}>
      <div className={styles.info}>
        <div className={styles.item}>
          <div className={styles.title}>Staked Amount</div>

          <div className={styles.usd}>{formatDisplayUsdt(stakeAmountUsd)}</div>

          <div className={styles.value}>
            {theme === 'light' ? <OraiXLightIcon /> : <OraiXIcon />}
            <span>{numberWithCommas(toDisplay(stakedAmount))} ORAIX</span>
          </div>
        </div>

        {/* <div className={styles.item}>
        <div className={styles.title}>Unstaking</div>

        <div className={styles.usd}>{formatDisplayUsdt(lockUsd)}</div>

        <div className={styles.value}>
          {theme === 'light' ? <OraiXLightIcon /> : <OraiXIcon />}
          <span>{numberWithCommas(toDisplay(lockAmount))} ORAIX</span>
        </div>
      </div> */}

        <div className={styles.item}>
          <div className={styles.title}>Claimable Rewards</div>

          <div className={styles.usd}>{formatDisplayUsdt(rewardUsd)}</div>

          <div className={styles.value}>
            <UsdcIcon />
            <span>{numberWithCommas(toDisplay(reward))} USDC</span>
          </div>
        </div>
      </div>

      <div className={styles.itemBtn}>
        <Button type="primary" onClick={() => handleClaim()} disabled={loading || toDisplay(reward) <= 0}>
          {loading && <Loader width={22} height={22} />}&nbsp;
          <span>Claim Rewards</span>
        </Button>
      </div>
    </div>
  );
};

export default StakeInfo;
