import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { ORAI } from 'config/constants';
import { network } from 'config/networks';
import { Pairs } from 'config/pools';
import { handleCheckAddress, handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import CosmJs from 'libs/cosmjs';
import { toAmount, toDisplay } from 'libs/utils';
import { toFixedIfNecessary } from 'pages/Pools/helpers';
import { useGetPairInfo } from 'pages/Pools/hooks/useGetPairInfo';
import { useGetPoolDetail } from 'pages/Pools/hookV3';
import { FC, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { generateMiningMsgsV3, Type } from 'rest/api';
import { RootState } from 'store/configure';
import { ModalProps } from '../MyPoolInfo/type';
import styles from './StakeLPModal.module.scss';

const cx = cn.bind(styles);

export const StakeLPModal: FC<ModalProps> = ({
  isOpen,
  close,
  open,
  myLpBalance,
  myLpUsdt,
  onLiquidityChange,
  assetToken
}) => {
  let { poolUrl } = useParams();
  const lpPools = useSelector((state: RootState) => state.token.lpPools);
  const [theme] = useConfigReducer('theme');
  const poolDetail = useGetPoolDetail({ pairDenoms: poolUrl });
  const { info: pairInfoData } = poolDetail;
  const { lpTokenInfoData } = useGetPairInfo(poolDetail);

  const [bondAmount, setBondAmount] = useState(BigInt(0));
  const [bondAmountInUsdt, setBondAmountInUsdt] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  const lpTokenBalance = BigInt(pairInfoData ? lpPools[pairInfoData?.liquidityAddr]?.balance || '0' : 0);

  // handle update bond amount in usdt
  useEffect(() => {
    if (!myLpBalance) return;
    const bondAmountInUsdt = (Number(bondAmount) / Number(myLpBalance)) * Number(myLpUsdt);
    setBondAmountInUsdt(bondAmountInUsdt);
  }, [bondAmount, myLpBalance, myLpUsdt]);

  const handleBond = async (parsedAmount: bigint) => {
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const oraiAddress = await handleCheckAddress();
      // generate bonding msg
      const msgs = generateMiningMsgsV3({
        type: Type.BOND_LIQUIDITY,
        sender: oraiAddress,
        amount: parsedAmount.toString(),
        lpToken: lpTokenInfoData.contractAddress!,
        assetToken
      });

      // execute msg
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
        onLiquidityChange();
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
            <div className={cx('amount')}>
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
              <Button type="primary-sm" onClick={() => setBondAmount(lpTokenBalance)}>
                Max
              </Button>
              <Button type="primary-sm" onClick={() => setBondAmount(lpTokenBalance / BigInt(2))}>
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
                allowNegative={false}
                value={toDisplay(bondAmount, lpTokenInfoData.decimals)}
                onChange={(e: { target: { value: string } }) => {
                  setBondAmount(toAmount(Number(e.target.value.replaceAll(',', '')), lpTokenInfoData.decimals));
                }}
              />
              <div className={cx('amount-usd')}>
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
