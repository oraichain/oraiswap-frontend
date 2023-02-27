import { FC, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import style from './LiquidityModal.module.scss';
import cn from 'classnames/bind';
import { getPair } from 'config/pools';
import { useQuery } from '@tanstack/react-query';
import {
  generateContractMessages,
  fetchTokenAllowance,
  ProvideQuery,
  generateConvertErc20Cw20Message
} from 'rest/api';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { filteredTokens, TokenItemType } from 'config/bridgeTokens';
import { buildMultipleMessages } from 'libs/utils';
import TokenBalance from 'components/TokenBalance';
import { toAmount, toDisplay } from 'libs/utils';
import NumberFormat from 'react-number-format';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { Type } from 'rest/api';
import CosmJs, { HandleOptions } from 'libs/cosmjs';
import { ORAI } from 'config/constants';
import { network } from 'config/networks';
import Loader from 'components/Loader';
import useConfigReducer from 'hooks/useConfigReducer';
import { TokenInfo } from 'types/token';
import { RootState } from 'store/configure';
import { useSelector } from 'react-redux';
import FluentAddImg from 'assets/images/fluent_add.svg';
import ArrowDownImg from 'assets/images/fluent-arrow-down.svg';
import { CacheTokens } from 'libs/token';
import { useDispatch } from 'react-redux';

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
  pairAmountInfoData: any;
  refetchPairAmountInfo: any;
  fetchCachedLpTokenAll: () => void;
  pairInfoData: any;
}

const LiquidityModal: FC<ModalProps> = ({
  isOpen,
  close,
  open,
  token1InfoData,
  token2InfoData,
  lpTokenInfoData,
  lpTokenBalance,
  pairAmountInfoData,
  refetchPairAmountInfo,
  fetchCachedLpTokenAll,
  pairInfoData
}) => {
  const token1 = token1InfoData;
  const token2 = token2InfoData;
  const [address] = useConfigReducer('address');

  const { data: prices } = useCoinGeckoPrices(
    filteredTokens.map((t) => t.coingeckoId)
  );

  type PriceKey = keyof typeof prices;

  const [activeTab, setActiveTab] = useState(0);
  const [chosenWithdrawPercent, setChosenWithdrawPercent] = useState(-1);
  const [amountToken1, setAmountToken1] = useState(0);
  const [amountToken2, setAmountToken2] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [recentInput, setRecentInput] = useState(1);
  const [lpAmountBurn, setLpAmountBurn] = useState(0);
  const [estimatedLP, setEstimatedLP] = useState(0);
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const dispatch = useDispatch();
  const token1Balance = Number(amounts[token1?.denom] ?? '0');
  const token2Balance = Number(amounts[token2?.denom] ?? '0');

  const {
    data: token1AllowanceToPair,
    isLoading: isToken1AllowanceToPairLoading,
    refetch: refetchToken1Allowance
  } = useQuery(
    ['token-allowance', JSON.stringify(pairInfoData), token1InfoData],
    () => {
      return fetchTokenAllowance(
        token1InfoData.contractAddress!,
        address,
        pairInfoData!.contract_addr
      );
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
      return fetchTokenAllowance(
        token2InfoData.contractAddress!,
        address,
        pairInfoData!.contract_addr
      );
    },
    {
      enabled: !!address && !!pairInfoData,
      refetchOnWindowFocus: false
    }
  );

  useEffect(() => {
    if (!pairAmountInfoData?.ratio) {
    } else if (recentInput === 1 && !!+amountToken1) {
      setAmountToken2(amountToken1 / pairAmountInfoData.ratio);
    } else if (recentInput === 2 && !!+amountToken2)
      setAmountToken1(amountToken2 * pairAmountInfoData.ratio);
  }, [JSON.stringify(pairAmountInfoData)]);

  const getValueUsd = (token: any, amount: number | string) => {
    let t =
      toDisplay(amount, token!.decimals) *
      prices[token!.coingeckoId as PriceKey];
    return t;
  };

  const onChangeAmount1 = (floatValue: number) => {
    setRecentInput(1);
    setAmountToken1(floatValue);
    setAmountToken2(floatValue / pairAmountInfoData?.ratio);
    const amount1 = floatValue
      ? Number(toAmount(+floatValue, token1InfoData!.decimals))
      : 0;
    const estimatedLP =
      (amount1 / (amount1 + pairAmountInfoData.token1Amount)) *
      +lpTokenInfoData.total_supply;
    setEstimatedLP(estimatedLP);
  };

  const onChangeAmount2 = (floatValue: number) => {
    setRecentInput(2);
    setAmountToken2(floatValue);
    setAmountToken1(floatValue * pairAmountInfoData?.ratio);

    const amount2 = floatValue
      ? Number(toAmount(+floatValue, token2InfoData!.decimals))
      : 0;
    const estimatedLP =
      (amount2 / (amount2 + pairAmountInfoData.token2Amount)) *
      +lpTokenInfoData.total_supply;
    setEstimatedLP(estimatedLP);
  };

  const onLiquidityChange = () => {
    refetchPairAmountInfo();
    fetchCachedLpTokenAll();
    CacheTokens.factory({ dispatch, address }).loadTokensCosmos();
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
      token
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

  const handleAddLiquidity = async (amount1: number, amount2: number) => {
    if (!pairInfoData) return;
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);

    try {
      if (!!token1AllowanceToPair && token1AllowanceToPair < BigInt(amount1)) {
        await increaseAllowance(
          '9'.repeat(30),
          token1InfoData!.contractAddress!,
          address
        );
        refetchToken1Allowance();
      }
      if (!!token2AllowanceToPair && token2AllowanceToPair < BigInt(amount2)) {
        await increaseAllowance(
          '9'.repeat(30),
          token2InfoData!.contractAddress!,
          address
        );
        refetchToken2Allowance();
      }

      // hard copy of from & to token info data to prevent data from changing when calling the function
      const firstTokenConverts = await generateConvertErc20Cw20Message(
        amounts,
        token1,
        address,
        prices
      );
      const secTokenConverts = await generateConvertErc20Cw20Message(
        amounts,
        token2,
        address,
        prices
      );

      const msgs = await generateContractMessages({
        type: Type.PROVIDE,
        sender: address,
        fromInfo: token1InfoData!,
        toInfo: token2InfoData!,
        fromAmount: amount1,
        toAmount: amount2,
        pair: pairInfoData.contract_addr
      } as ProvideQuery);

      const msg = msgs[0];

      var messages = buildMultipleMessages(
        msg,
        firstTokenConverts,
        secTokenConverts
      );

      const result = await CosmJs.executeMultiple({
        msgs: messages,
        walletAddr: address,
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
      console.log('error in swap form: ', error);
      let finalError = '';
      if (typeof error === 'string' || error instanceof String) {
        finalError = error as string;
      } else finalError = String(error);
      displayToast(TToastType.TX_FAILED, {
        message: finalError
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdrawLiquidity = async (amount: string) => {
    if (!pairInfoData) return;
    setActionLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const msgs = await generateContractMessages({
        type: Type.WITHDRAW,
        sender: address,
        lpAddr: lpTokenInfoData!.contractAddress!,
        amount,
        pair: pairInfoData.contract_addr
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

        handleOptions: { funds: msg.sent_funds } as HandleOptions
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
      console.log('error in swap form: ', error);
      let finalError = '';
      if (typeof error === 'string' || error instanceof String) {
        finalError = error as string;
      } else finalError = String(error);
      displayToast(TToastType.TX_FAILED, {
        message: finalError
      });
    } finally {
      setActionLoading(false);
    }
  };

  const onChangeWithdrawPercent = (option: number) => {
    setLpAmountBurn(
      +toDisplay(
        Math.round((option * lpTokenBalance) / 100).toString(),
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
              decimals: token1InfoData?.decimals,
            }}
            prefix="Balance: "
            decimalScale={6}
          />
          <div
            className={cx('btn')}
            onClick={() =>
              onChangeAmount1(
                toDisplay(token1Balance, token1InfoData?.decimals ?? 0)
              )
            }
          >
            MAX
          </div>
          <div
            className={cx('btn')}
            onClick={() =>
              onChangeAmount1(
                toDisplay(
                  Math.round(Number(token1Balance) / 2),
                  token1InfoData?.decimals ?? 0
                )
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
        <img src={FluentAddImg} onClick={() => {}} />
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
              decimals: token2InfoData?.decimals,
            }}
            prefix="Balance: "
            decimalScale={6}
          />
          <div
            className={cx('btn')}
            onClick={() =>
              onChangeAmount2(
                toDisplay(token2Balance, token2InfoData?.decimals ?? 0)
              )
            }
          >
            MAX
          </div>
          <div
            className={cx('btn')}
            onClick={() =>
              onChangeAmount2(
                toDisplay(
                  Math.round(Number(token2Balance) / 2),
                  token2InfoData?.decimals ?? 0
                )
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
          </div>
          <TokenBalance
            balance={{
              amount: lpTokenBalance ? lpTokenBalance : 0,
              denom: lpTokenInfoData?.symbol ?? '',
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
              amount: estimatedLP ? estimatedLP : 0,
              denom: lpTokenInfoData?.symbol ?? ''
            }}
            decimalScale={6}
          />
        </div>
      </div>
      {(() => {
        const amount1 = amountToken1
            ? Number(toAmount(+amountToken1, token1InfoData!.decimals))
            : 0,
          amount2 = amountToken2
            ? Number(toAmount(+amountToken2, token2InfoData!.decimals))
            : 0;
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
              return handleAddLiquidity(amount1, amount2);
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
              decimals: lpTokenInfoData?.decimals,
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
                    Math.round((lpAmountBurn *
                      10 ** lpTokenInfoData.decimals *
                      pairAmountInfoData?.token1Amount) /
                      +lpTokenInfoData!.total_supply)
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
                    Math.round((lpAmountBurn *
                      10 ** lpTokenInfoData.decimals *
                      pairAmountInfoData?.token2Amount) /
                      +lpTokenInfoData!.total_supply)
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
        const amount = lpAmountBurn
          ? Number(toAmount(+lpAmountBurn, lpTokenInfoData!.decimals))
          : 0;
        let disableMsg: string;
        if (amount <= 0) disableMsg = 'Enter an amount';
        if (amount > lpTokenBalance)
          disableMsg = `Insufficient LP token balance`;
        const disabled =
          actionLoading || !lpTokenInfoData || !pairInfoData || !!disableMsg;
        return (
          <button
            className={cx('swap-btn', {
              disabled: disabled
            })}
            onClick={() => handleWithdrawLiquidity(amount.toString())}
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
