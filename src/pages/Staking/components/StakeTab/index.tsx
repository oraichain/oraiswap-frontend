import { ORAI, USDC_CONTRACT, toAmount } from '@oraichain/oraidex-common';
import { ReactComponent as BlinkIcon } from 'assets/icons/blinkIcon.svg';
import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { handleCheckAddress, handleErrorTransaction } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens, { useLoadOraichainTokens } from 'hooks/useLoadTokens';
import CosmJs from 'libs/cosmjs';
import { getUsd } from 'libs/utils';
import { formatDisplayUsdt, numberWithCommas } from 'pages/Pools/helpers';
import { MONTHLY_SECOND, ORAIX_TOKEN_INFO, USDC_TOKEN_INFO, YEARLY_SECOND } from 'pages/Staking/constants';
import { calcAPY, calcYearlyReward } from 'pages/Staking/helpers';
import {
  useGetAllStakerRewardInfo,
  useGetMyStakeRewardInfo,
  useGetRewardPerSecInfo,
  useGetStakeInfo
} from 'pages/Staking/hooks';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Type, generateMiningMsgs } from 'rest/api';
import { RootState } from 'store/configure';
import InputBalance from '../InputBalance';
import styles from './index.module.scss';

const StakeTab = () => {
  const [address] = useConfigReducer('address');
  const { data: prices } = useCoinGeckoPrices();
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const loadTokenAmounts = useLoadTokens();
  const loadOraichainToken = useLoadOraichainTokens();

  const balance = amounts['oraix'];
  const [amount, setAmount] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  const { rewardPerSec } = useGetRewardPerSecInfo(ORAIX_TOKEN_INFO.contractAddress);
  const { stakeInfo, refetchStakeInfo } = useGetStakeInfo(ORAIX_TOKEN_INFO.contractAddress);
  const { refetchMyStakeRewardInfo } = useGetMyStakeRewardInfo(ORAIX_TOKEN_INFO.contractAddress, address);
  // const { refetchAllStakerRewardInfo } = useGetAllStakerRewardInfo(ORAIX_TOKEN_INFO.contractAddress);

  const rewardPerSecInfo = rewardPerSec?.[0] || {
    amount: '0',
    info: {
      token: {
        contract_addr: USDC_CONTRACT
      }
    },
    token: USDC_TOKEN_INFO
  };

  const apy = calcAPY(rewardPerSecInfo.amount, stakeInfo?.total_bond_amount || '0', prices);
  const yearlyReward = calcYearlyReward(amount, apy, prices) || 0;
  const monthlyReward = (MONTHLY_SECOND / YEARLY_SECOND) * yearlyReward;

  const monthlyUSD = getUsd(toAmount(monthlyReward), rewardPerSecInfo.token, prices);
  const yearlyUSD = getUsd(toAmount(yearlyReward), rewardPerSecInfo.token, prices);

  const handleBond = async () => {
    if (!amount) return displayToast(TToastType.TX_FAILED, { message: 'Stake Amount is required' });

    setLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const oraiAddress = await handleCheckAddress('Oraichain');

      // generate bonding msg
      const msg = generateMiningMsgs({
        type: Type.BOND_STAKING_CW20,
        sender: oraiAddress,
        amount: toAmount(amount).toString(),
        lpAddress: ORAIX_TOKEN_INFO.contractAddress
      });

      // execute msg
      const result = await CosmJs.execute({
        address: msg.contractAddress,
        walletAddr: oraiAddress,
        handleMsg: msg.msg,
        gasAmount: { denom: ORAI, amount: '0' },
        funds: msg.funds
      });
      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });

        refetchMyStakeRewardInfo();
        refetchStakeInfo();
        // refetchAllStakerRewardInfo();
        loadOraichainToken(address, [ORAIX_TOKEN_INFO.contractAddress]);
      }
    } catch (error) {
      console.log('error in bond: ', error);
      handleErrorTransaction(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.stakeTab}>
      <InputBalance loading={loading} onSubmit={handleBond} balance={balance} amount={amount} setAmount={setAmount} />

      {/* <div className={styles.result}>
        <div className={styles.header}>
          <span>You’ll earn</span>

          <div className={styles.highlight}>
            <BlinkIcon />
            <span>More benefits to come</span>
          </div>
        </div>

        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.title}>
              <div className={styles.usd}>{formatDisplayUsdt(monthlyUSD)}</div>
              <span>Monthly</span>
            </div>

            <div className={styles.value}>
              <UsdcIcon />
              <span>{numberWithCommas(monthlyReward)}</span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.title}>
              <div className={styles.usd}>{formatDisplayUsdt(yearlyUSD)}</div>
              <span>Yearly</span>
            </div>

            <div className={styles.value}>
              <UsdcIcon />
              <span>{numberWithCommas(yearlyReward)}</span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default StakeTab;
