import { buildMultipleExecuteMessages, ORAI, toAmount, DEFAULT_SLIPPAGE } from '@oraichain/oraidex-common';
import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import ImgPairPath from 'assets/images/pair_path.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { network } from 'config/networks';
import { handleCheckAddress, handleErrorTransaction } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import CosmJs from 'libs/cosmjs';
import { getUsd, toSumDisplay } from 'libs/utils';
import { estimateShare } from 'pages/Pools/helpers';
import { useGetPairInfo } from 'pages/Pools/hooks/useGetPairInfo';
import { useTokenAllowance } from 'pages/Pools/hooks/useTokenAllowance';
import { useGetPoolDetail } from 'pages/Pools/hooks';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  generateContractMessages,
  generateConvertErc20Cw20Message,
  generateMiningMsgs,
  getSubAmountDetails,
  ProvideQuery,
  Type
} from 'rest/api';
import { RootState } from 'store/configure';
import { ModalProps } from '../MyPoolInfo/type';
import styles from './AddLiquidityModal.module.scss';
import InputWithOptionPercent from '../InputWithOptionPercent';
import { SlippageModal, TooltipIcon } from 'pages/UniversalSwap/Modals';

const cx = cn.bind(styles);

export const AddLiquidityModal: FC<ModalProps> = ({ isOpen, close, onLiquidityChange, pairDenoms }) => {
  const { data: prices } = useCoinGeckoPrices();
  const [theme] = useConfigReducer('theme');

  const [baseAmount, setBaseAmount] = useState<bigint | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<bigint | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionAllLoading, setActionAllLoading] = useState(false);
  const [recentInput, setRecentInput] = useState(1);
  const [estimatedShare, setEstimatedShare] = useState(0);

  const [userSlippage, setUserSlippage] = useState(DEFAULT_SLIPPAGE);
  const [visible, setVisible] = useState(false);
  const amounts = useSelector((state: RootState) => state.token.amounts);

  const poolDetail = useGetPoolDetail({ pairDenoms });
  const { token1, token2, info: pairInfoData } = poolDetail;
  const { lpTokenInfoData, pairAmountInfoData } = useGetPairInfo(poolDetail);
  const totalBaseAmount = BigInt(pairAmountInfoData?.token1Amount ?? 0);
  const totalQuoteAmount = BigInt(pairAmountInfoData?.token2Amount ?? 0);

  let token1Balance = BigInt(amounts[token1?.denom] ?? '0');
  let token2Balance = BigInt(amounts[token2?.denom] ?? '0');
  let subAmounts: AmountDetails;
  if (token1?.contractAddress && token1?.evmDenoms) {
    subAmounts = getSubAmountDetails(amounts, token1);
    const subAmount = toAmount(toSumDisplay(subAmounts), token1?.decimals);
    token1Balance += subAmount;
  }

  if (token2.contractAddress && token2.evmDenoms) {
    subAmounts = getSubAmountDetails(amounts, token2);
    const subAmount = toAmount(toSumDisplay(subAmounts), token2?.decimals);
    token2Balance += subAmount;
  }

  // fetch token allowance
  const {
    data: token1AllowanceToPair,
    isLoading: isToken1AllowanceToPairLoading,
    refetch: refetchToken1Allowance
  } = useTokenAllowance(pairInfoData?.pairAddr, token1);
  const {
    data: token2AllowanceToPair,
    isLoading: isToken2AllowanceToPairLoading,
    refetch: refetchToken2Allowance
  } = useTokenAllowance(pairInfoData?.pairAddr, token2);

  useEffect(() => {
    if (baseAmount === 0n || quoteAmount === 0n) return;

    const share = estimateShare({
      baseAmount: Number(baseAmount),
      quoteAmount: Number(quoteAmount),
      totalShare: Number(lpTokenInfoData?.total_supply),
      totalBaseAmount: Number(totalBaseAmount),
      totalQuoteAmount: Number(totalQuoteAmount)
    });
    setEstimatedShare(Math.trunc(share));
  }, [baseAmount, quoteAmount, lpTokenInfoData, totalBaseAmount, totalQuoteAmount]);

  useEffect(() => {
    if (recentInput === 1 && baseAmount > BigInt(0)) {
      setQuoteAmount((baseAmount * totalQuoteAmount) / totalBaseAmount);
    } else if (recentInput === 2 && quoteAmount > BigInt(0))
      setBaseAmount((quoteAmount * totalBaseAmount) / totalQuoteAmount);
  }, [pairAmountInfoData]);

  const onChangeAmount1 = (value: bigint) => {
    setRecentInput(1);
    setBaseAmount(value);
    if (totalBaseAmount > 0) setQuoteAmount((value * totalQuoteAmount) / totalBaseAmount);
  };
  const onChangeAmount2 = (value: bigint) => {
    setRecentInput(2);
    setQuoteAmount(value);
    if (totalQuoteAmount > 0) setBaseAmount((value * totalBaseAmount) / totalQuoteAmount);
  };

  const increaseAllowance = async (amount: string, token: string, walletAddr: string) => {
    const msg = generateContractMessages({
      type: Type.INCREASE_ALLOWANCE,
      amount,
      sender: walletAddr,
      spender: pairInfoData.pairAddr,
      token
    });

    const result = await CosmJs.execute({
      address: msg.contractAddress,
      walletAddr,
      handleMsg: msg.msg,
      gasAmount: { denom: ORAI, amount: '0' },
      funds: msg.funds
    });
    console.log('result increase allowance tx hash: ', result);

    if (result) {
      console.log('in correct result');
      displayToast(TToastType.TX_SUCCESSFUL, {
        customLink: `${network.explorer}/txs/${result.transactionHash}`
      });
    }
  };

  const handleAddLiquidity = async (amount1: bigint, amount2: bigint) => {
    if (!pairInfoData) return;
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);

    try {
      const oraiAddress = await handleCheckAddress('Oraichain');

      if (token1AllowanceToPair < amount1) {
        await increaseAllowance('9'.repeat(30), token1!.contractAddress!, oraiAddress);
        refetchToken1Allowance();
      }
      if (token2AllowanceToPair < amount2) {
        await increaseAllowance('9'.repeat(30), token2!.contractAddress!, oraiAddress);
        refetchToken2Allowance();
      }

      // hard copy of from & to token info data to prevent data from changing when calling the function
      const firstTokenConverts = generateConvertErc20Cw20Message(amounts, token1, oraiAddress);
      const secTokenConverts = generateConvertErc20Cw20Message(amounts, token2, oraiAddress);

      const msg = generateContractMessages({
        type: Type.PROVIDE,
        sender: oraiAddress,
        fromInfo: token1!,
        toInfo: token2!,
        fromAmount: amount1.toString(),
        toAmount: amount2.toString(),
        pair: pairInfoData.pairAddr,
        slippage: (userSlippage / 100).toString()
      } as ProvideQuery);

      const messages = buildMultipleExecuteMessages(msg, ...firstTokenConverts, ...secTokenConverts);

      const result = await CosmJs.executeMultiple({
        msgs: messages,
        walletAddr: oraiAddress,
        gasAmount: { denom: ORAI, amount: '0' }
      });
      console.log('result provide tx hash: ', result);

      if (result) {
        console.log('in correct result');
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });

        const amountUsdt = Number(toAmount(getUsd(baseAmount, token1, prices) * 2));

        if (typeof onLiquidityChange == 'function') {
          onLiquidityChange(amountUsdt);
        }
      }
    } catch (error) {
      console.log('error in providing liquidity: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDepositAndStakeAll = async (amount1: bigint, amount2: bigint) => {
    if (!pairInfoData) return displayToast(TToastType.TX_FAILED, { message: 'Pool information does not exist' });

    setActionAllLoading(true);
    displayToast(TToastType.TX_BROADCASTING);

    try {
      const oraiAddress = await handleCheckAddress('Oraichain');

      if (token1AllowanceToPair < amount1) {
        await increaseAllowance('9'.repeat(30), token1!.contractAddress!, oraiAddress);
        refetchToken1Allowance();
      }
      if (token2AllowanceToPair < amount2) {
        await increaseAllowance('9'.repeat(30), token2!.contractAddress!, oraiAddress);
        refetchToken2Allowance();
      }

      // hard copy of from & to token info data to prevent data from changing when calling the function
      const firstTokenConverts = generateConvertErc20Cw20Message(amounts, token1, oraiAddress);
      const secTokenConverts = generateConvertErc20Cw20Message(amounts, token2, oraiAddress);

      const msg = generateContractMessages({
        type: Type.PROVIDE,
        sender: oraiAddress,
        fromInfo: token1!,
        toInfo: token2!,
        fromAmount: amount1.toString(),
        toAmount: amount2.toString(),
        pair: pairInfoData.pairAddr,
        slippage: (userSlippage / 100).toString()
      } as ProvideQuery);

      // generate staking msg
      const msgStake = generateMiningMsgs({
        type: Type.BOND_LIQUIDITY,
        sender: oraiAddress,
        amount: estimatedShare.toString(),
        lpAddress: pairInfoData.liquidityAddr
      });

      const messages = buildMultipleExecuteMessages(msg, ...firstTokenConverts, ...secTokenConverts);

      const result = await CosmJs.executeMultiple({
        msgs: [...messages, msgStake],
        walletAddr: oraiAddress,
        gasAmount: { denom: ORAI, amount: '0' }
      });
      console.log('result provide tx hash: ', result);

      if (result) {
        console.log('in correct result');
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });

        const amountUsdt = Number(toAmount(getUsd(baseAmount, token1, prices) * 2));

        if (typeof onLiquidityChange == 'function') {
          onLiquidityChange(amountUsdt);
        }
      }
    } catch (error) {
      console.log('error in providing liquidity: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionAllLoading(false);
    }
  };

  const Token1Icon = theme === 'light' ? token1?.IconLight || token1?.Icon : token1?.Icon;
  const Token2Icon = theme === 'light' ? token2?.IconLight || token2?.Icon : token2?.Icon;

  return (
    <Modal isOpen={isOpen} close={close} isCloseBtn={false} className={cx('modal')}>
      <div className={cx('container', theme)}>
        <div className={cx('header')}>
          <div className={cx('title', theme)}>Deposit</div>
          <div className={cx('btn-group')}>
            <div className={cx('btn-close')} onClick={close}>
              <CloseIcon />
            </div>
          </div>
        </div>
        <div className={cx('pair-path')}>
          <img src={ImgPairPath} alt="pair_path" width={'100%'} height={'100%'} />
        </div>

        <InputWithOptionPercent
          TokenIcon={Token1Icon}
          onChange={(e: any) => {
            onChangeAmount1(toAmount(Number(e.target.value.replaceAll(',', '')), token1?.decimals));
          }}
          slippage={
            <TooltipIcon
              placement="bottom-end"
              visible={visible}
              setVisible={setVisible}
              content={
                <SlippageModal setVisible={setVisible} setUserSlippage={setUserSlippage} userSlippage={userSlippage} />
              }
            />
          }
          value={baseAmount}
          token={token1}
          setAmountFromPercent={onChangeAmount1}
          totalAmount={token1Balance}
          isFocus={recentInput === 1}
          hasPath
          showIcon
        />

        <InputWithOptionPercent
          TokenIcon={Token2Icon}
          value={quoteAmount}
          onChange={(e: any) => {
            onChangeAmount2(toAmount(Number(e.target.value.replaceAll(',', '')), token2?.decimals));
          }}
          token={token2}
          setAmountFromPercent={onChangeAmount2}
          totalAmount={token2Balance}
          isFocus={recentInput === 2}
          hasPath
          showIcon
        />
        <div className={cx('detail')}>
          <div className={cx('row', theme)}>
            <div className={cx('row-title')}>
              <span>Receive</span>
            </div>
            <div className={cx('row-amount')}>
              <TokenBalance
                balance={{
                  amount: estimatedShare.toString() || '0',
                  decimals: lpTokenInfoData?.decimals
                }}
                suffix=" LP"
                decimalScale={6}
              />
            </div>
          </div>
        </div>
        {(() => {
          let disableMsg: string;
          if (baseAmount <= 0 || quoteAmount <= 0) disableMsg = 'Enter an amount';
          if (baseAmount > token1Balance) disableMsg = `Insufficient ${token1?.name} balance`;
          else if (quoteAmount > token2Balance) disableMsg = `Insufficient ${token2?.name} balance`;

          const disabled =
            actionLoading ||
            actionAllLoading ||
            !token1 ||
            !token2 ||
            !pairInfoData ||
            isToken1AllowanceToPairLoading ||
            isToken2AllowanceToPairLoading ||
            !!disableMsg;
          return (
            <div className={cx('btn-confirm')}>
              {disableMsg ? (
                <Button onClick={() => handleAddLiquidity(baseAmount, quoteAmount)} type="primary" disabled={disabled}>
                  {actionLoading && <Loader width={30} height={30} />}
                  {disableMsg || 'Confirm'}
                </Button>
              ) : (
                <div className={cx('btn-group')}>
                  <Button
                    onClick={() => handleAddLiquidity(baseAmount, quoteAmount)}
                    type="secondary"
                    disabled={disabled}
                  >
                    {actionLoading && <Loader width={22} height={22} />}
                    {'Deposit'}
                  </Button>
                  <Button
                    onClick={() => handleDepositAndStakeAll(baseAmount, quoteAmount)}
                    type="primary"
                    disabled={disabled}
                  >
                    {actionAllLoading && <Loader width={22} height={22} />}
                    {'Deposit & Stake All'}
                  </Button>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
