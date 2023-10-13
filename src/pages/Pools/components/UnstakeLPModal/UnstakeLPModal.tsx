import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { CW20_DECIMALS, ORAI } from 'config/constants';
import { network } from 'config/networks';
import { Pairs } from 'config/pools';
import { handleCheckAddress, handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import CosmJs from 'libs/cosmjs';
import { toAmount, toDisplay } from 'libs/utils';
import { toFixedIfNecessary } from 'pages/Pools/helpers';
import { useGetPairInfo } from 'pages/Pools/hooks/useGetPairInfo';
import { useGetStakingAssetInfo } from 'pages/Pools/hooks/useGetStakingAssetInfo';
import { useGetPoolDetail, useGetRewardInfo } from 'pages/Pools/hookV3';
import { FC, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useParams } from 'react-router-dom';
import { generateMiningMsgsV3, Type } from 'rest/api';
import { ModalProps } from '../MyPoolInfo/type';
import styles from './UnstakeLPModal.module.scss';

const cx = cn.bind(styles);

export const UnstakeLPModal: FC<ModalProps> = ({
  isOpen,
  close,
  open,
  myLpBalance,
  myLpUsdt,
  onLiquidityChange,
  assetToken,
  lpPrice
}) => {
  let { poolUrl } = useParams();
  const [theme] = useConfigReducer('theme');
  const [address] = useConfigReducer('address');

  const [actionLoading, setActionLoading] = useState(false);
  const [chosenOption, setChosenOption] = useState(-1);
  const [unbondAmount, setUnbondAmount] = useState(BigInt(0));
  const [unbondAmountInUsdt, setUnBondAmountInUsdt] = useState(0);

  const poolDetail = useGetPoolDetail({ pairDenoms: poolUrl });
  const { info: pairInfoData } = poolDetail;
  const { lpTokenInfoData } = useGetPairInfo(poolDetail);

  const stakingAssetInfo = useGetStakingAssetInfo();
  const { totalRewardInfoData, refetchRewardInfo } = useGetRewardInfo({
    stakerAddr: address,
    assetInfo: stakingAssetInfo
  });

  const totalBondAmount = BigInt(totalRewardInfoData.reward_infos[0].bond_amount || '0');

  // handle update unbond amount in usdt
  useEffect(() => {
    if (!totalBondAmount) return;
    const unbondAmountInUsdt = Number(unbondAmount) * Number(lpPrice);
    console.log({ unbondAmountInUsdt });
    setUnBondAmountInUsdt(unbondAmountInUsdt);
  }, [unbondAmount, totalBondAmount, lpPrice]);

  const onChangeUnbondPercent = (percent: number) => {
    const HUNDRED_PERCENT_IN_CW20_DECIMALS = 100000000;
    setUnbondAmount((toAmount(percent, CW20_DECIMALS) * totalBondAmount) / BigInt(HUNDRED_PERCENT_IN_CW20_DECIMALS));
  };

  const onUnbonedSuccess = () => {
    onLiquidityChange();
    refetchRewardInfo();
  };

  const handleUnbond = async (parsedAmount: bigint) => {
    const oraiAddress = await handleCheckAddress();

    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const msgs = generateMiningMsgsV3({
        type: Type.UNBOND_LIQUIDITY,
        sender: oraiAddress,
        amount: parsedAmount.toString(),
        assetToken
      });

      const msg = msgs[0];
      const result = await CosmJs.execute({
        address: msg.contract,
        walletAddr: oraiAddress,
        handleMsg: msg.msg.toString(),
        gasAmount: { denom: ORAI, amount: '0' },
        funds: msg.funds
      });
      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        onUnbonedSuccess();
      }
    } catch (error) {
      console.log('error in unbond: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={false} className={cx('modal')}>
      <div className={cx('container', theme)}>
        <div className={cx('header')}>
          <div className={cx('title', theme)}>Unstake LP</div>
          <div className={cx('btn-group')}>
            <div className={cx('btn-close')} onClick={close}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <div className={cx('apr')}>Current APR: {toFixedIfNecessary(pairInfoData?.apr.toString() || '0', 2)}%</div>
        <div className={cx('supply', theme)}>
          <div className={cx('balance')}>
            <div className={cx('amount')}>
              <TokenBalance
                balance={{
                  amount: totalBondAmount,
                  denom: lpTokenInfoData?.symbol,
                  decimals: lpTokenInfoData?.decimals
                }}
                decimalScale={6}
                prefix="Staked LP Balance: "
              />
            </div>
            <div className={cx('btn-group')}>
              <Button type="primary-sm" onClick={() => setUnbondAmount(totalBondAmount)}>
                Max
              </Button>
              <Button type="primary-sm" onClick={() => setUnbondAmount(totalBondAmount / BigInt(2))}>
                Half
              </Button>
            </div>
          </div>
          <div className={cx('input')}>
            <div className={cx('input-amount')}>
              <NumberFormat
                className={cx('amount', theme)}
                thousandSeparator
                decimalScale={6}
                placeholder={'0'}
                value={toDisplay(unbondAmount, lpTokenInfoData?.decimals)}
                allowNegative={false}
                onValueChange={({ floatValue }) => setUnbondAmount(toAmount(floatValue, lpTokenInfoData?.decimals))}
              />

              <div className={cx('amount-usd')}>
                <TokenBalance
                  balance={{
                    amount: BigInt(Math.trunc(unbondAmountInUsdt)),
                    decimals: CW20_DECIMALS
                  }}
                  prefix="~$"
                  decimalScale={4}
                />
              </div>
            </div>
          </div>
          <div className={cx('options')}>
            {[25, 50, 75, 100].map((option, idx) => (
              <div
                className={cx('item', theme, {
                  isChosen: chosenOption === idx
                })}
                key={idx}
                onClick={() => {
                  setUnbondAmount((BigInt(option) * totalBondAmount) / BigInt(100));
                  setChosenOption(idx);
                }}
              >
                {option}%
              </div>
            ))}
            <div
              className={cx('item', theme, 'border', {
                isChosen: chosenOption === 4
              })}
              onClick={() => setChosenOption(4)}
            >
              <input
                placeholder="0.00"
                type={'number'}
                className={cx('input', theme)}
                onChange={(event) => {
                  onChangeUnbondPercent(+event.target.value);
                }}
              />
              %
            </div>
          </div>
        </div>
        {(() => {
          let disableMsg: string;
          if (unbondAmount <= 0) disableMsg = 'Enter an amount';
          if (unbondAmount > totalBondAmount) disableMsg = `Insufficient LP token balance`;
          const disabled = actionLoading || unbondAmount <= 0 || unbondAmount > totalBondAmount || !pairInfoData;

          return (
            <div className={cx('btn-confirm')}>
              <Button onClick={() => handleUnbond(unbondAmount)} type="primary" disabled={disabled}>
                {actionLoading && <Loader width={30} height={30} />}
                {disableMsg || 'Unstake'}
              </Button>
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
