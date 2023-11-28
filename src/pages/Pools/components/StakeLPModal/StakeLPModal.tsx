import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { network } from 'config/networks';
import { handleCheckAddress, handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import CosmJs from 'libs/cosmjs';
import { toFixedIfNecessary } from 'pages/Pools/helpers';
import { useGetPairInfo } from 'pages/Pools/hooks/useGetPairInfo';
import { useGetPoolDetail, useGetRewardInfo } from 'pages/Pools/hookV3';
import { FC, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { generateMiningMsgs, Type } from 'rest/api';
import { RootState } from 'store/configure';
import { ModalProps } from '../MyPoolInfo/type';
import styles from './StakeLPModal.module.scss';
import { ORAI, toDisplay, toAmount } from '@oraichain/oraidex-common';
import { Pairs } from 'config/pools';

const cx = cn.bind(styles);

export const StakeLPModal: FC<ModalProps> = ({
  isOpen,
  close,
  open,
  myLpBalance,
  myLpUsdt,
  onLiquidityChange,
}) => {
  let { poolUrl } = useParams();
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  const [theme] = useConfigReducer('theme');
  const [address] = useConfigReducer('address');
  const poolDetail = useGetPoolDetail({ pairDenoms: poolUrl });
  const { info: pairInfoData } = poolDetail;
  const { lpTokenInfoData } = useGetPairInfo(poolDetail);

  const liquidityToken = poolDetail?.info?.liquidityAddr
  const { refetchRewardInfo } = useGetRewardInfo({
    stakerAddr: address,
    stakingToken: liquidityToken
  });
  const [bondAmount, setBondAmount] = useState<bigint | null>(null);
  const [bondAmountInUsdt, setBondAmountInUsdt] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  const lpTokenBalance = BigInt(pairInfoData ? lpPools[pairInfoData?.liquidityAddr]?.balance || '0' : 0);

  // handle update bond amount in usdt
  useEffect(() => {
    if (!myLpBalance) return;
    const bondAmountInUsdt = (Number(bondAmount) / Number(myLpBalance)) * Number(myLpUsdt);
    setBondAmountInUsdt(bondAmountInUsdt);
  }, [bondAmount, myLpBalance, myLpUsdt]);

  const onBonedSuccess = () => {
    onLiquidityChange();
    refetchRewardInfo();
  };

  const handleBond = async (parsedAmount: bigint) => {
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {

      const oraiAddress = await handleCheckAddress('Oraichain');
      // generate bonding msg
      const msg = generateMiningMsgs({
        type: Type.BOND_LIQUIDITY,
        sender: oraiAddress,
        amount: parsedAmount.toString(),
        lpAddress: liquidityToken
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
        onBonedSuccess();
      }
    } catch (error) {
      console.log('error in bond: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={false} className={cx('modal')}>
      <div className={cx('container', theme)}>
        <div className={cx('header')}>
          <div className={cx('title', theme)}>Stake LP</div>
          <div className={cx('btn-group')}>
            <div className={cx('btn-close')} onClick={close}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <div className={cx('apr')}>Current APR: {toFixedIfNecessary(pairInfoData?.apr.toString() || '0', 2)}%</div>
        <div className={cx('supply', theme)}>
          <div className={cx('balance')}>
            <div className={cx('amount', theme)}>
              <TokenBalance
                balance={{
                  amount: lpTokenBalance,
                  denom: lpTokenInfoData?.symbol,
                  decimals: lpTokenInfoData?.decimals
                }}
                decimalScale={6}
                prefix="Balance: "
              />
            </div>
            <div className={cx('btn-group')}>
              <Button type="primary-sm" onClick={() => setBondAmount(lpTokenBalance / BigInt(2))}>
                Half
              </Button>
              <Button type="primary-sm" onClick={() => setBondAmount(lpTokenBalance)}>
                Max
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
                allowNegative={false}
                value={bondAmount === null ? '' : toDisplay(bondAmount, lpTokenInfoData.decimals)}
                onValueChange={({ floatValue }) => {
                  if (floatValue === undefined) setBondAmount(null);
                  else setBondAmount(toAmount(floatValue, lpTokenInfoData.decimals));
                }}
              />
              <div className={cx('amount-usd', theme)}>
                <TokenBalance
                  balance={{
                    amount: BigInt(Math.trunc(bondAmountInUsdt || 0)),
                    decimals: lpTokenInfoData?.decimals
                  }}
                  prefix="~$"
                  decimalScale={2}
                />
              </div>
            </div>
          </div>
        </div>
        {(() => {
          let disableMsg: string;
          if (bondAmount <= 0) disableMsg = 'Enter an amount';
          if (bondAmount > lpTokenBalance) disableMsg = `Insufficient LP token balance`;

          const disabled = actionLoading || bondAmount <= 0 || bondAmount > lpTokenBalance;
          return (
            <div className={cx('btn-confirm')}>
              <Button onClick={() => handleBond(bondAmount)} type="primary" disabled={disabled}>
                {actionLoading && <Loader width={30} height={30} />}
                {disableMsg || 'Stake'}
              </Button>
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
