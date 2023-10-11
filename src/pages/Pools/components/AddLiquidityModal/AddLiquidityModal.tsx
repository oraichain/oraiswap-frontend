import { ReactComponent as ArrowDownIcon } from 'assets/icons/ic_arrow_down.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/ic_close_modal.svg';
import cn from 'classnames/bind';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { CW20_DECIMALS, ORAI } from 'config/constants';
import { network } from 'config/networks';
import { handleCheckAddress, handleErrorTransaction } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import CosmJs, { HandleOptions } from 'libs/cosmjs';
import { buildMultipleMessages, getSubAmountDetails, getUsd, toAmount, toDisplay, toSumDisplay } from 'libs/utils';
import { estimateShare } from 'pages/Pools/helpers';
import { useGetPairInfo } from 'pages/Pools/hooks/useGetPairInfo';
import { useTokenAllowance } from 'pages/Pools/hooks/useTokenAllowance';
import { useGetPoolDetail } from 'pages/Pools/hookV3';
import { FC, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { generateContractMessages, generateConvertErc20Cw20Message, ProvideQuery, Type } from 'rest/api';
import { RootState } from 'store/configure';
import { ModalProps } from '../MyPoolInfo/type';
import styles from './AddLiquidityModal.module.scss';

const cx = cn.bind(styles);

export const AddLiquidityModal: FC<ModalProps> = ({ isOpen, close, onLiquidityChange, pairDenoms }) => {
  const { data: prices } = useCoinGeckoPrices();
  const [theme] = useConfigReducer('theme');

  const [baseAmount, setBaseAmount] = useState<bigint>(BigInt(0));
  const [quoteAmount, setQuoteAmount] = useState<bigint>(BigInt(0));
  const [actionLoading, setActionLoading] = useState(false);
  const [recentInput, setRecentInput] = useState(1);
  const [estimatedShare, setEstimatedShare] = useState(0);

  const amounts = useSelector((state: RootState) => state.token.amounts);

  const poolDetail = useGetPoolDetail({ pairDenoms });
  const { token1, token2, info: pairInfoData } = poolDetail;
  const { lpTokenInfoData, pairAmountInfoData } = useGetPairInfo(poolDetail);
  const totalBaseAmount = BigInt(pairAmountInfoData?.token1Amount ?? 0);
  const totalQuoteAmount = BigInt(pairAmountInfoData?.token2Amount ?? 0);

  let token1Balance = BigInt(amounts[token1?.denom] ?? '0');
  let token2Balance = BigInt(amounts[token2?.denom] ?? '0');
  let subAmounts: AmountDetails;
  if (token1.contractAddress && token1.evmDenoms) {
    subAmounts = getSubAmountDetails(amounts, token1);
    const subAmount = toAmount(toSumDisplay(subAmounts), token1.decimals);
    token1Balance += subAmount;
  }

  if (token2.contractAddress && token2.evmDenoms) {
    subAmounts = getSubAmountDetails(amounts, token2);
    const subAmount = toAmount(toSumDisplay(subAmounts), token2.decimals);
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
    if (recentInput === 1 && baseAmount > 0) {
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
    const msgs = generateContractMessages({
      type: Type.INCREASE_ALLOWANCE,
      amount,
      sender: walletAddr,
      spender: pairInfoData.pairAddr,
      token
    });

    const msg = msgs[0];

    const result = await CosmJs.execute({
      address: msg.contract,
      walletAddr,
      handleMsg: msg.msg.toString(),
      gasAmount: { denom: ORAI, amount: '0' },
      handleOptions: { funds: msg.sent_funds } as HandleOptions
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
      const oraiAddress = await handleCheckAddress();

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

      const msgs = generateContractMessages({
        type: Type.PROVIDE,
        sender: oraiAddress,
        fromInfo: token1!,
        toInfo: token2!,
        fromAmount: amount1.toString(),
        toAmount: amount2.toString(),
        pair: pairInfoData.pairAddr
        // slippage: (userSlippage / 100).toString() // TODO: enable this again and fix in the case where the pool is empty
      } as ProvideQuery);

      const msg = msgs[0];

      var messages = buildMultipleMessages(msg, firstTokenConverts, secTokenConverts);

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
        onLiquidityChange(amountUsdt);
      }
    } catch (error) {
      console.log('error in providing liquidity: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
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
        <div className={cx('supply', theme)}>
          <div className={cx('balance')}>
            <div className={cx('amount')}>
              <TokenBalance
                balance={{
                  amount: token1Balance.toString(),
                  denom: token1?.name ?? '',
                  decimals: token1?.decimals
                }}
                prefix="Balance: "
                decimalScale={6}
              />
            </div>
            <div className={cx('btn-group')}>
              <Button type="primary-sm" onClick={() => onChangeAmount1(token1Balance)}>
                Max
              </Button>
              <Button type="primary-sm" onClick={() => onChangeAmount1(token1Balance / BigInt(2))}>
                Half
              </Button>
            </div>
          </div>
          <div className={cx('input')}>
            <div className={cx('token')}>
              {Token1Icon && <Token1Icon className={cx('logo')} />}
              <div className={cx('title', theme)}>
                <div>{token1?.name}</div>
                <div className={cx('des')}>Oraichain</div>
              </div>
            </div>
            <div className={cx('input-amount')}>
              <NumberFormat
                className={cx('amount', theme)}
                thousandSeparator
                decimalScale={6}
                placeholder={'0'}
                value={toDisplay(baseAmount, token1.decimals)}
                allowNegative={false}
                onChange={(e: any) => {
                  onChangeAmount1(toAmount(Number(e.target.value.replaceAll(',', '')), token1.decimals));
                }}
              />
              <div className={cx('amount-usd')}>
                <TokenBalance balance={getUsd(baseAmount, token1, prices)} decimalScale={2} />
              </div>
            </div>
          </div>
        </div>

        <div className={cx('supply', theme)}>
          <div className={cx('balance')}>
            <div className={cx('amount')}>
              <TokenBalance
                balance={{
                  amount: token2Balance.toString(),
                  denom: token2?.name ?? '',
                  decimals: token2?.decimals
                }}
                prefix="Balance: "
                decimalScale={6}
              />
            </div>
            <div className={cx('btn-group')}>
              <Button type="primary-sm" onClick={() => onChangeAmount2(token2Balance)}>
                Max
              </Button>
              <Button type="primary-sm" onClick={() => onChangeAmount2(token2Balance / BigInt(2))}>
                Half
              </Button>
            </div>
          </div>
          <div className={cx('input')}>
            <div className={cx('token')}>
              {Token2Icon && <Token2Icon className={cx('logo')} />}
              <div className={cx('title', theme)}>
                <div>{token2?.name}</div>
                <div className={cx('des')}>Oraichain</div>
              </div>
            </div>
            <div className={cx('input-amount')}>
              <NumberFormat
                className={cx('amount', theme)}
                thousandSeparator
                decimalScale={6}
                placeholder={'0'}
                allowNegative={false}
                value={toDisplay(quoteAmount, token2.decimals)}
                onChange={(e: any) => {
                  onChangeAmount2(toAmount(Number(e.target.value.replaceAll(',', '')), token2.decimals));
                }}
              />
              <div className={cx('amount-usd')}>
                <TokenBalance balance={getUsd(quoteAmount, token2, prices)} decimalScale={2} />
              </div>
            </div>
          </div>
        </div>
        <div className={cx('detail')}>
          <div className={cx('arrow-down', theme)}>
            <div className={cx('inner-arrow', theme)}>
              <ArrowDownIcon />
            </div>
          </div>
          <div className={cx('row', theme)}>
            <div className={cx('row-title')}>
              <span>Receive</span>
            </div>
            <div className={cx('row-amount')}>
              <TokenBalance
                balance={{
                  amount: estimatedShare.toString(),
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
            !token1 ||
            !token2 ||
            !pairInfoData ||
            isToken1AllowanceToPairLoading ||
            isToken2AllowanceToPairLoading ||
            !!disableMsg;
          return (
            <div className={cx('btn-confirm')}>
              <Button onClick={() => handleAddLiquidity(baseAmount, quoteAmount)} type="primary" disabled={disabled}>
                {actionLoading && <Loader width={30} height={30} />}
                {disableMsg || 'Confirm'}
              </Button>
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};
