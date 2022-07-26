import React, { FC, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import style from './LiquidityModal.module.scss';
import cn from 'classnames/bind';
import { TooltipIcon } from 'components/Tooltip';
import { pairs, getPair } from 'config/pools';
import { useQuery } from 'react-query';
import {
  fetchBalance,
  fetchPairInfo,
  fetchPoolInfoAmount,
  generateContractMessages,
  fetchTokenAllowance,
  ProvideQuery,
  generateConvertMsgs,
  fetchBalanceWithMapping,
  generateConvertErc20Cw20Message,
} from 'rest/api';
import { useCoinGeckoPrices } from '@sunnyag/react-coingecko';
import { filteredTokens, TokenItemType } from 'config/bridgeTokens';
import { buildMultipleMessages, getUsd, parseAmountToWithDecimal } from 'libs/utils';
import TokenBalance from 'components/TokenBalance';
import { parseAmount, parseDisplayAmount } from 'libs/utils';
import NumberFormat from 'react-number-format';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { Type } from 'rest/api';
import CosmJs, { HandleOptions } from 'libs/cosmjs';
import { DECIMAL_FRACTION, KWT_DENOM, ORAI } from 'config/constants';
import { network } from 'config/networks';
import Loader from 'components/Loader';
import useGlobalState from 'hooks/useGlobalState';
import { TokenInfo } from 'types/token';

const cx = cn.bind(style);

interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
  token1InfoData: TokenItemType;
  token2InfoData: TokenItemType;
  lpTokenInfoData: TokenInfo;
  lpTokenBalance: any;
  setLiquidityHash: any;
  liquidityHash: any;
}

const LiquidityModal: FC<ModalProps> = ({
  isOpen,
  close,
  open,
  token1InfoData,
  token2InfoData,
  lpTokenInfoData,
  lpTokenBalance,
  setLiquidityHash: setTxHash,
  liquidityHash: txHash,
}) => {
  const token1 = token1InfoData;
  const token2 = token2InfoData;
  const [address] = useGlobalState('address');

  const { prices } = useCoinGeckoPrices(
    filteredTokens.map((t) => t.coingeckoId)
  );

  type PriceKey = keyof typeof prices;

  const [activeTab, setActiveTab] = useState(0);
  const [chosenWithdrawPercent, setChosenWithdrawPercent] = useState(-1);
  const [withdrawPercent, setWithdrawPercent] = useState(10);
  const [amountToken1, setAmountToken1] = useState('');
  const [amountToken2, setAmountToken2] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [recentInput, setRecentInput] = useState(1);
  const [lpAmountBurn, setLpAmountBurn] = useState(0);

  let {
    data: pairAmountInfoData,
    error: pairAmountInfoError,
    isError: isPairAmountInfoError,
    isLoading: isPairAmountInfoLoading,
  } = useQuery(
    ['pair-amount-info', token1InfoData, token2InfoData, prices, txHash],
    () => {
      return getPairAmountInfo();
    },
    {
      enabled: !!prices && !!token1InfoData && !!token2InfoData,
      refetchOnWindowFocus: false,
      refetchInterval: 10000,
    }
  );

  const {
    data: pairInfoData,
    error: pairInfoError,
    isError: isPairInfoError,
    isLoading: isPairInfoLoading,
  } = useQuery(
    [
      'pair-info',
      JSON.stringify(token1InfoData),
      JSON.stringify(token2InfoData),
    ],
    () => getPairInfo(),
    {
      enabled: !!token1InfoData && !!token2InfoData,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: token1Balance = 0,
    error: token1BalanceError,
    isError: isToken1BalanceError,
    isLoading: isToken1BalanceLoading,
  } = useQuery(
    ['token-balance', token1?.denom, txHash],
    () =>
      token1?.erc20Cw20Map ? fetchBalanceWithMapping(address, token1) : fetchBalance(
        address,
        token1!.denom,
        token1!.contractAddress,
        token1!.lcd
      ),
    {
      enabled: !!address && !!token1,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: token2Balance = 0,
    error: token2BalanceError,
    isError: isToken2BalanceError,
    isLoading: isLoadingToken2Balance,
  } = useQuery(
    ['token-balance', token2?.denom, txHash],
    () =>
      token2?.erc20Cw20Map ? fetchBalanceWithMapping(address, token2) : fetchBalance(
        address,
        token2!.denom,
        token2!.contractAddress,
        token2!.lcd
      ),
    {
      enabled: !!address && !!token2,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: token1AllowanceToPair,
    error: token1AllowanceToPairError,
    isError: isToken1AllowanceToPairError,
    isLoading: isToken1AllowanceToPairLoading,
  } = useQuery(
    ['token-allowance', JSON.stringify(pairInfoData), token1InfoData, txHash],
    () => {
      return fetchTokenAllowance(
        token1InfoData.contractAddress!,
        address,
        pairInfoData!.contract_addr
      );
    },
    {
      enabled: !!address && !!token1InfoData.contractAddress && !!pairInfoData,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: token2AllowanceToPair,
    error: token2AllowanceToPairError,
    isError: isToken2AllowanceToPairError,
    isLoading: isToken2AllowanceToPairLoading,
  } = useQuery(
    ['token-allowance', JSON.stringify(pairInfoData), token2InfoData, txHash],
    () => {
      return fetchTokenAllowance(
        token2InfoData.contractAddress!,
        address,
        pairInfoData!.contract_addr
      );
    },
    {
      enabled: !!address && !!token2InfoData.contractAddress && !!pairInfoData,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!pairAmountInfoData?.ratio) {
    } else if (recentInput === 1 && !!+amountToken1) {
      setAmountToken2(`${+amountToken1 / pairAmountInfoData.ratio}`);
    } else if (recentInput === 2 && !!+amountToken2)
      setAmountToken1(`${+amountToken2 * pairAmountInfoData.ratio}`);
  }, [JSON.stringify(pairAmountInfoData)]);

  const getValueUsd = (token: any, amount: number) => {
    let t = getUsd(
      amount,
      prices[token!.coingeckoId as PriceKey].price,
      token!.decimals
    );
    return t;
  };

  // const sortKwtPair = (amount1: number, amount2: number) => {
  //   if (token1InfoData.denom === KWT_DENOM) {
  //     return [
  //       {
  //         token: token2InfoData,
  //         amount: amount2,
  //       },
  //       {
  //         token: token1InfoData,
  //         amount: amount1,
  //       },
  //     ];
  //   } else if (token2InfoData.denom === KWT_DENOM) {
  //     return [
  //       {
  //         token: token1InfoData,
  //         amount: amount1,
  //       },
  //       {
  //         token: token2InfoData,
  //         amount: amount2,
  //       },
  //     ];
  //   } else {
  //     return false;
  //   }
  // };

  const onChangeAmount1 = (floatValue: string) => {
    setRecentInput(1);
    setAmountToken1(floatValue);
    setAmountToken2(`${+floatValue / pairAmountInfoData?.ratio!}`);
  };

  const onChangeAmount2 = (floatValue: string) => {
    setRecentInput(2);
    setAmountToken2(floatValue);
    setAmountToken1(`${+floatValue * pairAmountInfoData?.ratio!}`);
  };

  const getPairAmountInfo = async () => {
    const poolData = await fetchPoolInfoAmount(
      token1InfoData!,
      token2InfoData!
    );

    const fromAmount = getUsd(
      poolData.offerPoolAmount,
      prices[token1!.coingeckoId as PriceKey].price,
      token1!.decimals
    );
    const toAmount = getUsd(
      poolData.askPoolAmount,
      prices[token2!.coingeckoId as PriceKey].price,
      token2!.decimals
    );

    return {
      token1Amount: poolData.offerPoolAmount,
      token2Amount: poolData.askPoolAmount,
      usdAmount: fromAmount + toAmount,
      ratio: poolData.offerPoolAmount / poolData.askPoolAmount,
    };
  };

  const getPairInfo = async () => {
    const pair = getPair(token1InfoData.denom, token2InfoData.denom);
    const pairData = await fetchPairInfo([token1InfoData!, token2InfoData!]);
    return { pair, ...pairData };
  };

  const increaseAllowance = async (
    amount: string,
    token: string,
    walletAddr: string
  ) => {
    const msgs = await generateContractMessages({
      type: Type.INCREASE_ALLOWANCE,
      amount,
      sender: walletAddr,
      spender: pairInfoData!.contract_addr,
      token,
    });

    const msg = msgs[0];

    // console.log(
    //   'msgs: ',
    //   msgs.map((msg) => ({ ...msg, msg: Buffer.from(msg.msg).toString() }))
    // );

    const result = await CosmJs.execute({
      address: msg.contract,
      walletAddr,
      handleMsg: msg.msg.toString(),
      gasAmount: { denom: ORAI, amount: '0' },
      handleOptions: { funds: msg.sent_funds } as HandleOptions,
    });
    console.log('result increase allowance tx hash: ', result);

    if (result) {
      console.log('in correct result');
      displayToast(TToastType.TX_SUCCESSFUL, {
        customLink: `${network.explorer}/txs/${result.transactionHash}`,
      });
      setTxHash(result.transactionHash);
    }
  };

  const handleAddLiquidity = async (amount1: number, amount2: number) => {
    if (!pairInfoData?.pair) return;
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);

    try {
      if (!!token1AllowanceToPair && +token1AllowanceToPair < amount1)
        await increaseAllowance(
          '9'.repeat(30),
          token1InfoData!.contractAddress!,
          address
        );
      if (!!token2AllowanceToPair && +token2AllowanceToPair < amount2)
        await increaseAllowance(
          '9'.repeat(30),
          token2InfoData!.contractAddress!,
          address
        );

      // hard copy of from & to token info data to prevent data from changing when calling the function
      const firstTokenConverts = await generateConvertErc20Cw20Message(JSON.parse(JSON.stringify(token1)), address);
      const secTokenConverts = await generateConvertErc20Cw20Message(JSON.parse(JSON.stringify(token2)), address);

      const msgs = await generateContractMessages({
        type: Type.PROVIDE,
        sender: address,
        fromInfo: token1InfoData!,
        toInfo: token2InfoData!,
        fromAmount: amount1,
        toAmount: amount2,
        pair: pairInfoData.pair.contract_addr,
      } as ProvideQuery);

      const msg = msgs[0];

      var messages = buildMultipleMessages(msg, firstTokenConverts, secTokenConverts);

      const result = await CosmJs.executeMultiple({
        msgs: messages,
        walletAddr: address,
        gasAmount: { denom: ORAI, amount: '0' },
      });
      console.log('result provide tx hash: ', result);

      if (result) {
        console.log('in correct result');
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`,
        });

        setTxHash(result.transactionHash);
      }
    } catch (error) {
      console.log('error in swap form: ', error);
      let finalError = '';
      if (typeof error === 'string' || error instanceof String) {
        finalError = error as string;
      } else finalError = String(error);
      displayToast(TToastType.TX_FAILED, {
        message: finalError,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // const handleAddLiquidityWithKWT = async (
  //   pairedAmount: number,
  //   pairedToken: TokenItemType,
  //   kwtAmount: number,
  //   kwtToken: TokenItemType
  // ) => {
  //   if (!pairInfoData?.pair) return;
  //   setActionLoading(true);
  //   displayToast(TToastType.TX_BROADCASTING);

  //   try {
  //     const _kwtAmount = parseAmountToWithDecimal(
  //       kwtAmount,
  //       kwtToken.decimals
  //     ).toFixed(0);

  //     const convertNativeKwtMsg = (
  //       await generateConvertMsgs({
  //         type: Type.CONVERT_TOKEN,
  //         sender: address,
  //         inputAmount: _kwtAmount,
  //         inputToken: kwtToken,
  //       })
  //     )[0];
  //     const increaseAllowanceKwtMsg = (
  //       await generateContractMessages({
  //         type: Type.INCREASE_ALLOWANCE,
  //         amount: '9'.repeat(30),
  //         sender: address,
  //         spender: pairInfoData!.contract_addr,
  //         token: kwtToken?.contractAddress,
  //       })
  //     )[0];

  //     const provideLiqMsg = (
  //       await generateContractMessages({
  //         type: Type.PROVIDE,
  //         sender: address,
  //         fromInfo: pairedToken,
  //         toInfo: kwtToken,
  //         fromAmount: pairedAmount,
  //         toAmount: kwtAmount,
  //         pair: pairInfoData.pair.contract_addr,
  //       } as ProvideQuery)
  //     )[0];
  //     const msgs = [
  //       {
  //         contractAddress: convertNativeKwtMsg.contract,
  //         handleMsg: convertNativeKwtMsg.toString(),
  //         handleOptions: {
  //           funds: convertNativeKwtMsg.sent_funds,
  //         } as HandleOptions,
  //       },
  //       {
  //         contractAddress: increaseAllowanceKwtMsg.contract,
  //         handleMsg: increaseAllowanceKwtMsg.toString(),
  //         handleOptions: {
  //           funds: increaseAllowanceKwtMsg.sent_funds,
  //         } as HandleOptions,
  //       },
  //       {
  //         contractAddress: provideLiqMsg.contract,
  //         handleMsg: provideLiqMsg.toString(),
  //         handleOptions: { funds: provideLiqMsg.sent_funds } as HandleOptions,
  //       },
  //     ];

  //     console.log('msgs: ', msgs);

  //     const result = await CosmJs.executeMultiple({
  //       prefix: ORAI,
  //       walletAddr: address,
  //       msgs,
  //       gasAmount: { denom: ORAI, amount: '0' },
  //     });
  //     console.log('result provide tx hash: ', result);

  //     if (result) {
  //       console.log('in correct result');
  //       displayToast(TToastType.TX_SUCCESSFUL, {
  //         customLink: `${network.explorer}/txs/${result.transactionHash}`,
  //       });

  //       setTxHash(result.transactionHash);
  //     }
  //   } catch (error) {
  //     console.log('error in swap form: ', error);
  //     let finalError = '';
  //     if (typeof error === 'string' || error instanceof String) {
  //       finalError = error as string;
  //     } else finalError = String(error);
  //     displayToast(TToastType.TX_FAILED, {
  //       message: finalError,
  //     });
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

  const handleWithdrawLiquidity = async (amount: number) => {
    if (!pairInfoData?.pair) return;
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const msgs = await generateContractMessages({
        type: Type.WITHDRAW,
        sender: address,
        lpAddr: lpTokenInfoData!.contractAddress!,
        amount,
        pair: pairInfoData!.pair.contract_addr,
      });

      const msg = msgs[0];

      // console.log(
      //   'msgs: ',
      //   msgs.map((msg) => ({ ...msg, msg: Buffer.from(msg.msg).toString() }))
      // );

      const result = await CosmJs.execute({
        address: msg.contract,
        walletAddr: address,
        handleMsg: msg.msg.toString(),
        gasAmount: { denom: ORAI, amount: '0' },

        handleOptions: { funds: msg.sent_funds } as HandleOptions,
      });

      console.log('result provide tx hash: ', result);

      if (result) {
        console.log('in correct result');
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`,
        });
        setTxHash(result.transactionHash);
      }
    } catch (error) {
      console.log('error in swap form: ', error);
      let finalError = '';
      if (typeof error === 'string' || error instanceof String) {
        finalError = error as string;
      } else finalError = String(error);
      displayToast(TToastType.TX_FAILED, {
        message: finalError,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const onChangeWithdrawPercent = (option: number) => {
    setWithdrawPercent(option);
    setLpAmountBurn(
      +parseDisplayAmount(
        ((option * lpTokenBalance) / 100).toString(),
        lpTokenInfoData?.decimals ?? 0
      )
    );
  };

  const Token1Icon = token1!.Icon;
  const Token2Icon = token2!.Icon;

  const addTab = (
    <>
      <div className={cx('supply')}>
        <div className={cx('header')}>
          <div className={cx('title')}>Supply</div>
        </div>
        <div className={cx('balance')}>
          <TokenBalance
            balance={{
              amount: token1Balance ? token1Balance : 0,
              denom: token1InfoData?.name ?? '',
            }}
            prefix="Balance: "
            decimalScale={6}
          />
          <div
            className={cx('btn')}
            onClick={() =>
              onChangeAmount1(
                parseDisplayAmount(
                  token1Balance,
                  token1InfoData?.decimals ?? 0
                ).toString()
              )
            }
          >
            MAX
          </div>
          <div
            className={cx('btn')}
            onClick={() =>
              onChangeAmount1(
                parseDisplayAmount(
                  (token1Balance / 2)?.toString(),
                  token1InfoData?.decimals ?? 0
                ).toString()
              )
            }
          >
            HALF
          </div>
          <TokenBalance
            balance={getValueUsd(token1, token1Balance)}
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
            value={amountToken1 ?? ''}
            // onValueChange={({ floatValue }) => onChangeAmount1(floatValue)}
            allowNegative={false}
            onChange={(e: any) => {
              onChangeAmount1(e.target.value.replaceAll(',', ''));
            }}
          />
        </div>
      </div>
      <div className={cx('swap-icon')}>
        <img
          src={require('assets/icons/fluent_add.svg').default}
          onClick={() => { }}
        />
      </div>
      <div className={cx('supply')}>
        <div className={cx('header')}>
          <div className={cx('title')}>Supply</div>
        </div>
        <div className={cx('balance')}>
          <TokenBalance
            balance={{
              amount: token2Balance ? token2Balance : 0,
              denom: token2InfoData?.name ?? '',
            }}
            prefix="Balance: "
            decimalScale={6}
          />
          <div
            className={cx('btn')}
            onClick={() =>
              onChangeAmount2(
                parseDisplayAmount(
                  token2Balance,
                  token2InfoData?.decimals ?? 0
                ).toString()
              )
            }
          >
            MAX
          </div>
          <div
            className={cx('btn')}
            onClick={() =>
              onChangeAmount2(
                parseDisplayAmount(
                  (token2Balance / 2)?.toString(),
                  token2InfoData?.decimals ?? 0
                ).toString()
              )
            }
          >
            HALF
          </div>
          <TokenBalance
            balance={getValueUsd(token2, token2Balance)}
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
            value={amountToken2 ?? ''}
            onChange={(e: any) => {
              onChangeAmount2(e.target.value.replaceAll(',', ''));
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
            balance={
              pairAmountInfoData?.usdAmount ? pairAmountInfoData?.usdAmount : 0
            }
            style={{ flexGrow: 1, textAlign: 'right' }}
            decimalScale={2}
          />
        </div>
        <div className={cx('row')}>
          <div className={cx('row-title')}>
            <span>Received LP asset</span>
            {/* <TooltipIcon /> */}
          </div>
          <TokenBalance
            balance={{
              amount: lpTokenBalance ? lpTokenBalance : 0,
              denom: lpTokenInfoData?.symbol ?? '',
            }}
            decimalScale={6}
          />
        </div>
      </div>
      {(() => {
        const amount1 = +parseAmount(
          amountToken1.toString(),
          token1InfoData!.decimals
        ),
          amount2 = +parseAmount(
            amountToken2.toString(),
            token2InfoData!.decimals
          );
        let disableMsg: string;
        if (amount1 <= 0 || amount2 <= 0) disableMsg = 'Enter an amount';
        if (amount1 > token1Balance)
          disableMsg = `Insufficient ${token1InfoData?.name} balance`;
        else if (amount2 > token2Balance)
          disableMsg = `Insufficient ${token2InfoData?.name} balance`;

        const disabled =
          actionLoading ||
          !token1InfoData ||
          !token2InfoData ||
          !pairInfoData?.pair ||
          isToken1AllowanceToPairLoading ||
          isToken2AllowanceToPairLoading ||
          !!disableMsg;
        return (
          <button
            className={cx('swap-btn', {
              disabled: disabled,
            })}
            onClick={() => {
              // const sortedKwtPair = sortKwtPair(amount1, amount2);
              // if (!sortedKwtPair) return handleAddLiquidity(amount1, amount2);
              return handleAddLiquidity(amount1, amount2);
              // return handleAddLiquidityWithKWT(
              //   sortKwtPair[0].amount,
              //   sortKwtPair[0].token,
              //   sortKwtPair[1].amount,
              //   sortKwtPair[1].token
              // );
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
              amount: lpTokenBalance ? lpTokenBalance : 0,
              denom: lpTokenInfoData?.symbol ?? '',
            }}
            prefix="LP Token Balance: "
            decimalScale={6}
          />

          {!!pairAmountInfoData && !!lpTokenInfoData && (
            <TokenBalance
              balance={
                (pairAmountInfoData?.usdAmount * +lpTokenBalance) /
                +lpTokenInfoData?.total_supply
              }
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
            value={!!lpAmountBurn ? lpAmountBurn : ''}
            allowNegative={false}
            onValueChange={({ floatValue }) => setLpAmountBurn(floatValue ?? 0)}
          />
        </div>
        <div className={cx('options')}>
          {[25, 50, 75, 100].map((option, idx) => (
            <div
              className={cx('item', {
                isChosen: chosenWithdrawPercent === idx,
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
              isChosen: chosenWithdrawPercent === 4,
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
        <img src={require('assets/icons/fluent-arrow-down.svg').default} />
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
                  balance={
                    (lpAmountBurn * pairAmountInfoData?.token1Amount) /
                    +lpTokenInfoData!.total_supply
                  }
                  decimalScale={6}
                  prefix={''}
                />

                <TokenBalance
                  balance={getValueUsd(
                    token1,
                    (lpAmountBurn *
                      10 ** lpTokenInfoData.decimals *
                      pairAmountInfoData?.token1Amount) /
                    +lpTokenInfoData!.total_supply
                  )}
                  className={cx('des')}
                  decimalScale={2}
                />
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
                  balance={
                    (lpAmountBurn * pairAmountInfoData?.token2Amount) /
                    +lpTokenInfoData!.total_supply
                  }
                  decimalScale={6}
                  prefix={''}
                />

                <TokenBalance
                  balance={getValueUsd(
                    token2,
                    (lpAmountBurn *
                      10 ** lpTokenInfoData.decimals *
                      pairAmountInfoData?.token2Amount) /
                    +lpTokenInfoData!.total_supply
                  )}
                  className={cx('des')}
                  decimalScale={2}
                />
              </div>
            </div>
          </>
        )}
      </div>
      {(() => {
        const amount = +parseAmount(
          lpAmountBurn.toString(),
          lpTokenInfoData!.decimals
        );
        let disableMsg: string;
        if (amount <= 0) disableMsg = 'Enter an amount';
        if (amount > lpTokenBalance)
          disableMsg = `Insufficient LP token balance`;
        const disabled =
          actionLoading ||
          !lpTokenInfoData ||
          !pairInfoData?.pair ||
          !!disableMsg;
        return (
          <button
            className={cx('swap-btn', {
              disabled: disabled,
            })}
            onClick={() => handleWithdrawLiquidity(amount)}
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
    <Modal
      isOpen={isOpen}
      close={close}
      open={open}
      isCloseBtn={true}
      className={cx('modal')}
    >
      <div className={cx('container')}>
        <div
          className={cx('title')}
        >{`${token1InfoData?.name}/${token2InfoData?.name} Pool`}</div>
        <div className={cx('switch')}>
          <div
            className={cx({ 'active-tab': activeTab === 0 })}
            onClick={() => setActiveTab(0)}
          >
            Add
          </div>
          <div
            className={cx({ 'active-tab': activeTab === 1 })}
            onClick={() => setActiveTab(1)}
          >
            Withdraw
          </div>
        </div>
        {activeTab === 0 ? addTab : withdrawTab}
      </div>
    </Modal>
  );
};

export default LiquidityModal;
