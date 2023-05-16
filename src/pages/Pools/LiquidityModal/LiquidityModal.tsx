import { useQuery } from '@tanstack/react-query';
import ArrowDownImg from 'assets/images/fluent-arrow-down.svg';
import FluentAddImg from 'assets/images/fluent_add.svg';
import cn from 'classnames/bind';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { TokenItemType } from 'config/bridgeTokens';
import { ORAI } from 'config/constants';
import { network } from 'config/networks';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { PairInfo } from '@oraichain/orderbook-contracts-sdk';
import CosmJs, { HandleOptions } from 'libs/cosmjs';
import useLoadTokens from 'hooks/useLoadTokens';
import {
  buildMultipleMessages,
  getSubAmountDetails,
  getUsd,
  toAmount,
  toDecimal,
  toDisplay,
  toSumDisplay
} from 'libs/utils';
import { FC, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { isMobile } from '@walletconnect/browser-utils';
import {
  fetchTokenAllowance,
  generateContractMessages,
  generateConvertErc20Cw20Message,
  ProvideQuery,
  Type
} from 'rest/api';
import { RootState } from 'store/configure';
import { TokenInfo } from 'types/token';
import styles from './LiquidityModal.module.scss';
import { handleCheckAddress, handleErrorTransaction } from 'helper';

const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
  token1InfoData: TokenItemType;
  token2InfoData: TokenItemType;
  lpTokenInfoData: TokenInfo;
  lpTokenBalance: string;
  pairAmountInfoData: PairAmountInfo;
  refetchPairAmountInfo: Function;
  fetchCachedLpTokenAll: () => void;
  pairInfoData: PairInfo;
}

const LiquidityModal: FC<ModalProps> = ({
  isOpen,
  close,
  open,
  token1InfoData,
  token2InfoData,
  lpTokenInfoData,
  lpTokenBalance: lpTokenBalanceValue,
  pairAmountInfoData,
  refetchPairAmountInfo,
  fetchCachedLpTokenAll,
  pairInfoData
}) => {
  const token1 = token1InfoData;
  const token2 = token2InfoData;
  const token1Amount = BigInt(pairAmountInfoData.token1Amount);
  const token2Amount = BigInt(pairAmountInfoData.token2Amount);
  const lpTokenBalance = BigInt(lpTokenBalanceValue);
  const [address] = useConfigReducer('address');

  const { data: prices } = useCoinGeckoPrices();

  const [activeTab, setActiveTab] = useState(0);
  const [chosenWithdrawPercent, setChosenWithdrawPercent] = useState(-1);
  const [amountToken1, setAmountToken1] = useState<bigint>(BigInt(0));
  const [amountToken2, setAmountToken2] = useState<bigint>(BigInt(0));
  const [actionLoading, setActionLoading] = useState(false);
  const [recentInput, setRecentInput] = useState(1);
  const [lpAmountBurn, setLpAmountBurn] = useState(BigInt(0));
  const [estimatedLP, setEstimatedLP] = useState(BigInt(0));
  const amounts = useSelector((state: RootState) => state.token.amounts);

  const loadTokenAmounts = useLoadTokens();

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

  const {
    data: token1AllowanceToPair,
    isLoading: isToken1AllowanceToPairLoading,
    refetch: refetchToken1Allowance
  } = useQuery(
    ['token-allowance', JSON.stringify(pairInfoData), token1InfoData],
    () => {
      return fetchTokenAllowance(token1InfoData.contractAddress!, address, pairInfoData!.contract_addr);
    },
    {
      // enabled: !!address && !!token1InfoData.contractAddress && !!pairInfoData,
      enabled: !!address && !!pairInfoData,
      refetchOnWindowFocus: false
    }
  );

  const {
    data: token2AllowanceToPair,
    isLoading: isToken2AllowanceToPairLoading,
    refetch: refetchToken2Allowance
  } = useQuery(
    ['token-allowance', JSON.stringify(pairInfoData), token2InfoData],
    () => {
      return fetchTokenAllowance(token2InfoData.contractAddress!, address, pairInfoData!.contract_addr);
    },
    {
      enabled: !!address && !!pairInfoData,
      refetchOnWindowFocus: false
    }
  );

  useEffect(() => {
    if (recentInput === 1 && amountToken1 > 0) {
      setAmountToken2((amountToken1 * token2Amount) / token1Amount);
    } else if (recentInput === 2 && amountToken2 > BigInt(0))
      setAmountToken1((amountToken2 * token1Amount) / token2Amount);
  }, [pairAmountInfoData]);

  const onChangeAmount1 = (value: bigint) => {
    setRecentInput(1);
    setAmountToken1(value);
    if (token1Amount > 0) setAmountToken2((value * token2Amount) / token1Amount);

    const estimatedLP = (value / (value + token1Amount)) * BigInt(lpTokenInfoData.total_supply);
    setEstimatedLP(estimatedLP);
  };

  const onChangeAmount2 = (value: bigint) => {
    setRecentInput(2);
    setAmountToken2(value);
    if (token2Amount > 0) setAmountToken1((value * token1Amount) / token2Amount);

    const estimatedLP = (value / (value + token2Amount)) * BigInt(lpTokenInfoData.total_supply);

    setEstimatedLP(estimatedLP);
  };

  const onLiquidityChange = () => {
    refetchPairAmountInfo();
    fetchCachedLpTokenAll();
    loadTokenAmounts({ oraiAddress: address });
  };

  const increaseAllowance = async (amount: string, token: string, walletAddr: string) => {
    const msgs = generateContractMessages({
      type: Type.INCREASE_ALLOWANCE,
      amount,
      sender: walletAddr,
      spender: pairInfoData!.contract_addr,
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
        await increaseAllowance('9'.repeat(30), token1InfoData!.contractAddress!, oraiAddress);
        refetchToken1Allowance();
      }
      if (token2AllowanceToPair < amount2) {
        await increaseAllowance('9'.repeat(30), token2InfoData!.contractAddress!, oraiAddress);
        refetchToken2Allowance();
      }

      // hard copy of from & to token info data to prevent data from changing when calling the function
      const firstTokenConverts = generateConvertErc20Cw20Message(amounts, token1, oraiAddress);
      const secTokenConverts = generateConvertErc20Cw20Message(amounts, token2, oraiAddress);

      const msgs = generateContractMessages({
        type: Type.PROVIDE,
        sender: oraiAddress,
        fromInfo: token1InfoData!,
        toInfo: token2InfoData!,
        fromAmount: amount1.toString(),
        toAmount: amount2.toString(),
        pair: pairInfoData.contract_addr
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
        onLiquidityChange();
      }
    } catch (error) {
      console.log('error in providing liquidity: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdrawLiquidity = async (amount: string) => {
    if (!pairInfoData) return;
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const oraiAddress = await handleCheckAddress();

      const msgs = generateContractMessages({
        type: Type.WITHDRAW,
        sender: oraiAddress,
        lpAddr: lpTokenInfoData!.contractAddress!,
        amount,
        pair: pairInfoData.contract_addr
      });

      const msg = msgs[0];

      const result = await CosmJs.execute({
        address: msg.contract,
        walletAddr: oraiAddress,
        handleMsg: msg.msg.toString(),
        gasAmount: { denom: ORAI, amount: '0' },

        handleOptions: { funds: msg.sent_funds } as HandleOptions
      });

      console.log('result provide tx hash: ', result);

      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        onLiquidityChange();
      }
    } catch (error) {
      console.log('error in Withdraw Liquidity: ', error);
      handleErrorTransaction(error);
    } finally {
      setActionLoading(false);
    }
  };

  const onChangeWithdrawPercent = (option: number) => {
    setLpAmountBurn((toAmount(option, 6) * lpTokenBalance) / BigInt(100000000));
  };

  const totalSupply = BigInt(lpTokenInfoData!.total_supply ?? 0);

  const Token1Icon = token1!.Icon;
  const Token2Icon = token2!.Icon;
  const lp1BurnAmount = (token1Amount * BigInt(lpAmountBurn)) / totalSupply;
  const lp2BurnAmount = (token2Amount * BigInt(lpAmountBurn)) / totalSupply;
  const addTab = (
    <>
      <div className={cx('supply')}>
        <div className={cx('header')}>
          <div className={cx('title')}>Supply</div>
        </div>
        <div className={cx('balance')}>
          <TokenBalance
            balance={{
              amount: token1Balance.toString(),
              denom: token1InfoData?.name ?? '',
              decimals: token1InfoData?.decimals
            }}
            prefix="Balance: "
            decimalScale={6}
          />
          <div className={cx('btn')} onClick={() => onChangeAmount1(token1Balance)}>
            MAX
          </div>
          <div className={cx('btn')} onClick={() => onChangeAmount1(token1Balance / BigInt(2))}>
            HALF
          </div>
          <TokenBalance
            balance={getUsd(token1Balance, token1, prices)}
            style={{ flexGrow: 1, textAlign: 'right' }}
            decimalScale={2}
          />
        </div>
        <div className={cx('input')}>
          <div className={cx('token')}>
            {Token1Icon && <Token1Icon className={cx('logo')} />}
            <div className={cx('title')}>
              <div>{token1InfoData?.name}</div>
              <div className={cx('des')}>Oraichain</div>
            </div>
          </div>
          <NumberFormat
            className={cx('amount')}
            thousandSeparator
            decimalScale={6}
            placeholder={'0'}
            // type="input"
            value={toDisplay(amountToken1, token1InfoData.decimals)}
            // onValueChange={({ floatValue }) => onChangeAmount1(floatValue)}
            allowNegative={false}
            onChange={(e: any) => {
              onChangeAmount1(toAmount(Number(e.target.value.replaceAll(',', '')), token1InfoData.decimals));
            }}
          />
        </div>
      </div>
      <div className={cx('swap-icon')}>
        <img src={FluentAddImg} onClick={() => {}} />
      </div>
      <div className={cx('supply')}>
        <div className={cx('header')}>
          <div className={cx('title')}>Supply</div>
        </div>
        <div className={cx('balance')}>
          <TokenBalance
            balance={{
              amount: token2Balance.toString(),
              denom: token2InfoData?.name ?? '',
              decimals: token2InfoData?.decimals
            }}
            prefix="Balance: "
            decimalScale={6}
          />
          <div className={cx('btn')} onClick={() => onChangeAmount2(token2Balance)}>
            MAX
          </div>
          <div className={cx('btn')} onClick={() => onChangeAmount2(token2Balance / BigInt(2))}>
            HALF
          </div>
          <TokenBalance
            balance={getUsd(token2Balance, token2, prices)}
            style={{ flexGrow: 1, textAlign: 'right' }}
            decimalScale={2}
          />
        </div>
        <div className={cx('input')}>
          <div className={cx('token')}>
            {Token2Icon && <Token2Icon className={cx('logo')} />}
            <div className={cx('title')}>
              <div>{token2InfoData?.name}</div>
              <div className={cx('des')}>Oraichain</div>
            </div>
          </div>
          <NumberFormat
            className={cx('amount')}
            thousandSeparator
            decimalScale={6}
            placeholder={'0'}
            // type="input"
            allowNegative={false}
            value={toDisplay(amountToken2, token2InfoData.decimals)}
            onChange={(e: any) => {
              onChangeAmount2(toAmount(Number(e.target.value.replaceAll(',', '')), token2InfoData.decimals));
            }}
          />
        </div>
      </div>
      <div className={cx('detail')}>
        <div className={cx('row')}>
          <div className={cx('row-title')}>
            <span>Total supply</span>
            {/* <TooltipIcon /> */}
          </div>

          <TokenBalance
            balance={pairAmountInfoData.tokenUsd}
            style={{ flexGrow: 1, textAlign: 'right' }}
            decimalScale={2}
          />
        </div>
        <div className={cx('row')}>
          <div className={cx('row-title')}>
            <span>Received LP asset</span>
          </div>
          <TokenBalance
            balance={{
              amount: lpTokenBalance,
              denom: lpTokenInfoData?.symbol,
              decimals: lpTokenInfoData?.decimals
            }}
            decimalScale={6}
          />
        </div>

        <div className={cx('row')}>
          <div className={cx('row-title')}>
            <span>Estimated received LP asset</span>
          </div>
          <TokenBalance
            balance={{
              amount: estimatedLP.toString(),
              denom: lpTokenInfoData?.symbol
            }}
            decimalScale={6}
          />
        </div>
      </div>
      {(() => {
        let disableMsg: string;
        if (amountToken1 <= 0 || amountToken2 <= 0) disableMsg = 'Enter an amount';
        if (amountToken1 > token1Balance) disableMsg = `Insufficient ${token1InfoData?.name} balance`;
        else if (amountToken2 > token2Balance) disableMsg = `Insufficient ${token2InfoData?.name} balance`;

        const disabled =
          actionLoading ||
          !token1InfoData ||
          !token2InfoData ||
          !pairInfoData ||
          isToken1AllowanceToPairLoading ||
          isToken2AllowanceToPairLoading ||
          !!disableMsg;
        return (
          <button
            className={cx('swap-btn', {
              disabled: disabled
            })}
            onClick={() => {
              return handleAddLiquidity(amountToken1, amountToken2);
            }}
            disabled={disabled}
          >
            {actionLoading && <Loader width={20} height={20} />}
            <span>{disableMsg || 'Add Liquidity'}</span>
          </button>
        );
      })()}
    </>
  );
  const withdrawTab = (
    <>
      <div className={cx('supply')}>
        <div className={cx('header')}>
          <div className={cx('title')}>WITHDRAW</div>
        </div>
        <div className={cx('balance')}>
          <TokenBalance
            balance={{
              amount: lpTokenBalance,
              denom: lpTokenInfoData?.symbol,
              decimals: lpTokenInfoData?.decimals
            }}
            prefix="LP Token Balance: "
            decimalScale={6}
          />

          {!!pairAmountInfoData && !!lpTokenInfoData && (
            <TokenBalance
              balance={pairAmountInfoData?.tokenUsd * toDecimal(lpTokenBalance, totalSupply)}
              style={{ flexGrow: 1, textAlign: 'right' }}
              decimalScale={2}
            />
          )}
        </div>
        <div className={cx('input')}>
          <NumberFormat
            className={cx('amount')}
            thousandSeparator
            decimalScale={6}
            placeholder={'0'}
            value={toDisplay(lpAmountBurn, lpTokenInfoData?.decimals)}
            allowNegative={false}
            onValueChange={({ floatValue }) => setLpAmountBurn(toAmount(floatValue, lpTokenInfoData?.decimals))}
          />
        </div>
        <div className={cx('options')}>
          {[25, 50, 75, 100].map((option, idx) => (
            <div
              className={cx('item', {
                isChosen: chosenWithdrawPercent === idx
              })}
              key={idx}
              onClick={() => {
                onChangeWithdrawPercent(option);
                setChosenWithdrawPercent(idx);
              }}
            >
              {option}%
            </div>
          ))}
          <div
            className={cx('item', 'border', {
              isChosen: chosenWithdrawPercent === 4
            })}
            onClick={() => setChosenWithdrawPercent(4)}
          >
            <input
              placeholder="0.00"
              type={'number'}
              className={cx('input')}
              // value={
              //   chosenWithdrawPercent === 4 && !!withdrawPercent
              //     ? withdrawPercent
              //     : ''
              // }
              onChange={(event) => {
                onChangeWithdrawPercent(+event.target.value);
              }}
            />
            %
          </div>
        </div>
      </div>
      <div className={cx('swap-icon')}>
        <img src={ArrowDownImg} />
      </div>
      <div className={cx('receive')}>
        <div className={cx('header')}>
          <div className={cx('title')}>RECEIVE</div>
        </div>
        {!!pairAmountInfoData && !!lpTokenInfoData && (
          <>
            <div className={cx('row')}>
              {Token1Icon && <Token1Icon className={cx('logo')} />}
              <div className={cx('title')}>
                <div>{token1InfoData?.name}</div>
                <div className={cx('des')}>Oraichain</div>
              </div>
              <div className={cx('value')}>
                <TokenBalance
                  balance={{
                    amount: lp1BurnAmount,
                    decimals: token1.decimals
                  }}
                  decimalScale={6}
                  prefix={''}
                />
                <TokenBalance balance={getUsd(lp1BurnAmount, token1, prices)} className={cx('des')} decimalScale={2} />
              </div>
            </div>{' '}
            <div className={cx('seperator')} />
            <div className={cx('row')}>
              {Token2Icon && <Token2Icon className={cx('logo')} />}
              <div className={cx('title')}>
                <div>{token2InfoData?.name}</div>
                <div className={cx('des')}>Oraichain</div>
              </div>
              <div className={cx('value')}>
                <TokenBalance
                  balance={{
                    amount: lp2BurnAmount,
                    decimals: token2.decimals
                  }}
                  decimalScale={6}
                  prefix={''}
                />

                <TokenBalance balance={getUsd(lp2BurnAmount, token2, prices)} className={cx('des')} decimalScale={2} />
              </div>
            </div>
          </>
        )}
      </div>
      {(() => {
        let disableMsg: string;
        if (lpAmountBurn <= 0) disableMsg = 'Enter an amount';
        if (lpAmountBurn > lpTokenBalance) disableMsg = `Insufficient LP token balance`;
        const disabled = actionLoading || !lpTokenInfoData || !pairInfoData || !!disableMsg;
        return (
          <button
            className={cx('swap-btn', {
              disabled: disabled
            })}
            onClick={() => handleWithdrawLiquidity(lpAmountBurn.toString())}
            disabled={disabled}
          >
            {actionLoading && <Loader width={20} height={20} />}
            <span>{disableMsg || 'Withdraw Liquidity'}</span>
          </button>
        );
      })()}
    </>
  );

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true} className={cx('modal')}>
      <div
        className={cx('container')}
        style={{
          paddingBottom: isMobile() ? 200 : 0
        }}
      >
        <div className={cx('title')}>{`${token1InfoData?.name}/${token2InfoData?.name} Pool`}</div>
        <div className={cx('switch')}>
          <div className={cx({ 'active-tab': activeTab === 0 })} onClick={() => setActiveTab(0)}>
            Add
          </div>
          <div className={cx({ 'active-tab': activeTab === 1 })} onClick={() => setActiveTab(1)}>
            Withdraw
          </div>
        </div>
        {activeTab === 0 ? addTab : withdrawTab}
      </div>
    </Modal>
  );
};

export default LiquidityModal;
