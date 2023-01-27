import React, { useEffect, useState } from 'react';
import style from './index.module.scss';
import cn from 'classnames/bind';
import SettingModal from './Modals/SettingModal';
import SelectTokenModal from './Modals/SelectTokenModal';
import { useQuery } from '@tanstack/react-query';
import useGlobalState from 'hooks/useGlobalState';
import {
  fetchBalance,
  fetchTokenInfo,
  fetchBalanceWithMapping,
  generateContractMessages,
  generateConvertMsgs,
  simulateSwap,
  SwapQuery,
  generateConvertErc20Cw20Message,
} from 'rest/api';
import CosmJs, { HandleOptions } from 'libs/cosmjs';
import { MILKY, ORAI, STABLE_DENOM } from 'config/constants';
import {
  buildMultipleMessages,
  parseAmount,
  parseAmountToWithDecimal,
  parseDisplayAmount,
} from 'libs/utils';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { network } from 'config/networks';
import NumberFormat from 'react-number-format';
import { filteredTokens } from 'config/bridgeTokens';
import { Type } from 'rest/api';
import Loader from 'components/Loader';
import Content from 'layouts/Content';
import { poolTokens } from 'config/pools';
import { contracts } from 'libs/contracts';
import { Contract } from 'config/contracts';
import { TaxRateResponse } from 'libs/contracts/OraiswapOracle.types';
import ChartComponent from './Chart';
import { TransitionGroup } from 'react-transition-group';
import InfoLiquidity from './InfoLiquidity';
import { renderLogoNetwork } from 'helpers';
import { ReactComponent as SYMBOLIcon } from 'assets/icons/symbols_swap.svg';

const cx = cn.bind(style);

const initialData = [
  { time: '2018-12-22', value: 20.92 },
  { time: '2018-12-23', value: 21.92 },
  { time: '2018-12-24', value: 27.02 },
  { time: '2018-12-25', value: 27.32 },
  { time: '2018-12-26', value: 25.17 },
  { time: '2018-12-27', value: 28.89 },
  { time: '2018-12-28', value: 25.46 },
  { time: '2018-12-29', value: 23.92 },
  { time: '2018-12-30', value: 32.51 },
  { time: '2018-12-31', value: 32.51 },
];

const Swap: React.FC = () => {
  const [isOpenSettingModal, setIsOpenSettingModal] = useState(false);
  const [isSelectFrom, setIsSelectFrom] = useState(false);
  const [isSelectTo, setIsSelectTo] = useState(false);
  // const [isSelectFee, setIsSelectFee] = useState(false);
  const [[fromTokenDenom, toTokenDenom], setSwapTokens] = useState<
    [string, string]
  >(['orai', 'usdt']);
  // const [feeToken, setFeeToken] = useState<string>('airi');
  const [[fromAmount, toAmount], setSwapAmount] = useState([
    undefined,
    undefined,
  ]);
  // const [currentPair, setCurrentPair] = useState<PairName>("ORAI-AIRI");
  const [averageRatio, setAverageRatio] = useState('0');
  const [slippage, setSlippage] = useState(1);
  const [address] = useGlobalState('address');
  const [swapLoading, setSwapLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const onChangeFromAmount = (amount: number | undefined) => {
    if (!amount) return setSwapAmount([undefined, toAmount]);
    setSwapAmount([amount, toAmount]);
  };

  const onMaxFromAmount = (amount: number) => {
    let finalAmount = parseFloat(
      parseDisplayAmount(amount, fromTokenInfoData?.decimals) as string
    );
    setSwapAmount([finalAmount, toAmount]);
  };

  Contract.sender = address;

  const { data: taxRate, isLoading: isTaxRateLoading } =
    contracts.OraiswapOracle.useOraiswapOracleTreasuryQuery({
      client: Contract.oracle,
      input: {
        tax_rate: {},
      },
    });

  const fromToken = filteredTokens.find(
    (token) => token.denom === fromTokenDenom
  );
  const toToken = filteredTokens.find((token) => token.denom === toTokenDenom);

  const { data: fromTokenInfoData } = useQuery(
    ['from-token-info', fromToken],
    () => fetchTokenInfo(fromToken!)
  );

  const { data: toTokenInfoData } = useQuery(['to-token-info', toToken], () =>
    fetchTokenInfo(toToken!)
  );

  // suggest tokens
  // useEffect(() => {
  //   if (fromToken && toToken) {
  //     window.Keplr.suggestToken(fromToken);
  //     window.Keplr.suggestToken(toToken);
  //   }
  // }, [fromToken, toToken]);

  const { data: fromTokenBalance = 0, refetch: refetchFromTokenBalance } =
    useQuery(
      ['balance', fromToken.denom, address],
      async () =>
        fromToken.erc20Cw20Map
          ? (await fetchBalanceWithMapping(address, fromToken)).amount
          : fetchBalance(
              address,
              fromToken!.denom,
              fromToken!.contractAddress,
              fromToken!.lcd
            ),
      { enabled: !!address && !!fromToken }
    );

  const { data: toTokenBalance, refetch: refetchToTokenBalance } = useQuery(
    ['balance', toToken.denom, address],
    async () =>
      toToken.erc20Cw20Map
        ? (await fetchBalanceWithMapping(address, toToken)).amount
        : fetchBalance(
            address,
            toToken!.denom,
            toToken!.contractAddress,
            toToken!.lcd
          ),
    { enabled: !!address && !!toToken }
  );

  const { data: simulateData } = useQuery(
    ['simulate-data', fromTokenInfoData, toTokenInfoData, fromAmount],
    () =>
      simulateSwap({
        fromInfo: fromTokenInfoData!,
        toInfo: toTokenInfoData!,
        amount: parseAmount(fromAmount, fromTokenInfoData!.decimals),
      }),
    { enabled: !!fromTokenInfoData && !!toTokenInfoData && fromAmount > 0 }
  );

  const { data: simulateAverageData, isLoading: isSimulateAverageDataLoading } =
    useQuery(
      ['simulate-average-data', fromTokenInfoData, toTokenInfoData],
      () =>
        simulateSwap({
          fromInfo: fromTokenInfoData!,
          toInfo: toTokenInfoData!,
          amount: parseAmount('1', fromTokenInfoData!.decimals),
        }),
      { enabled: !!fromTokenInfoData && !!toTokenInfoData }
    );

  useEffect(() => {
    console.log('simulate average data: ', simulateAverageData);
    setAverageRatio(
      parseFloat(
        parseDisplayAmount(
          simulateAverageData?.amount,
          toTokenInfoData?.decimals
        )
      ).toFixed(6)
    );
  }, [simulateAverageData]);

  useEffect(() => {
    setSwapAmount([
      fromAmount,
      parseFloat(
        parseDisplayAmount(simulateData?.amount, toTokenInfoData?.decimals)
      ),
    ]);
  }, [simulateData]);

  const refetchTokenBalances = () => {
    refetchFromTokenBalance();
    refetchToTokenBalance();
  };

  const handleSubmit = async () => {
    if (fromAmount <= 0)
      return displayToast(TToastType.TX_FAILED, {
        message: 'From amount should be higher than 0!',
      });

    setSwapLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      var _fromAmount = parseAmountToWithDecimal(
        fromAmount,
        fromTokenInfoData.decimals
      ).toFixed(0);

      // hard copy of from & to token info data to prevent data from changing when calling the function
      const msgConvertsFrom = await generateConvertErc20Cw20Message(
        JSON.parse(JSON.stringify(fromTokenInfoData)),
        address
      );
      const msgConvertTo = await generateConvertErc20Cw20Message(
        JSON.parse(JSON.stringify(toTokenInfoData)),
        address
      );

      const msgs = await generateContractMessages({
        type: Type.SWAP,
        sender: address,
        amount: _fromAmount,
        fromInfo: fromTokenInfoData!,
        toInfo: toTokenInfoData!,
      } as SwapQuery);

      const msg = msgs[0];

      var messages = buildMultipleMessages(msg, msgConvertsFrom, msgConvertTo);

      const result = await CosmJs.executeMultiple({
        prefix: ORAI,
        walletAddr: address,
        msgs: messages,
        gasAmount: { denom: ORAI, amount: '0' },
      });
      console.log('result swap tx hash: ', result);

      if (result) {
        console.log('in correct result');
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`,
        });
        refetchTokenBalances();
        setSwapLoading(false);
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
      setSwapLoading(false);
    }
  };

  const FromIcon = fromToken?.Icon;
  const ToIcon = toToken?.Icon;

  return (
    <Content>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 44,
          paddingLeft: 44,
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            width: '80%',
            height: '50%',
            position: 'relative',
            border: '0.76361px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 12,
            padding: 24,
          }}
        >
          {/* <TransitionGroup
            transitionName="fade"
            className={cx('test')}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          > */}
          <div
            style={{
              width: '100%',
            }}
          >
            <div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div style={{}}>{renderLogoNetwork('BNB Chain')}</div>
                  <span
                    style={{
                      paddingLeft: 6,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    BNB
                  </span>
                  <span
                    style={{
                      paddingLeft: 6,
                      fontSize: 20,
                      fontWeight: 600,
                    }}
                  >
                    /
                  </span>
                  <div style={{ paddingLeft: 6 }}>
                    {renderLogoNetwork('Osmosis')}
                  </div>
                  <span
                    style={{
                      paddingLeft: 6,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    OSMO
                  </span>
                  <span
                    style={{
                      paddingLeft: 16,
                      color: '#179942',
                      fontSize: 14,
                      fontWeight: 400,
                    }}
                  >
                    +0.51 (+0.39%)
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <SYMBOLIcon />
                  <span
                    style={{
                      color: '#fff',
                      fontWeight: 500,
                      fontSize: 30,
                      paddingLeft: 14,
                    }}
                  >
                    73.03
                  </span>
                </div>
                <div
                  style={{ background: '#1E1E21', padding: 3, fontSize: 13 }}
                >
                  <button
                    style={{
                      padding: '2px 6px',
                      color: '#fff',
                      fontWeight: 500,
                      background: '#2C2F34',
                    }}
                  >
                    24H
                  </button>
                  <button style={{ padding: '2px 6px' }}>1W</button>
                  <button style={{ padding: '2px 6px' }}>1M</button>
                  <button style={{ padding: '2px 6px' }}>1Y</button>
                </div>
              </div>
              <p style={{ color: '#777E90', fontSize: 12, fontWeight: 400 }}>
                DEC 23, 2022, 01:00 AM
              </p>
            </div>
          </div>
          <div
            className={cx('charContainer')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: '1',
              width: '100%',
              height: '100%',
            }}
          >
            <ChartComponent
              data={initialData}
              colors={{
                backgroundColor: 'rgba(31, 33, 40,0)',
                lineColor: '#A871DF',
                textColor: 'black',
                areaTopColor: '#A871DF',
                areaBottomColor: 'rgba(86, 42, 209, 0)',
              }}
            />
          </div>
          {/* </TransitionGroup> */}
        </div>
        <div style={{ width: '50%', height: '50%' }}>
          <div className={cx('container')}>
            <div className={cx('from')}>
              <div className={cx('header')}>
                <div className={cx('title')}>FROM</div>
                <button onClick={() => setRefresh(!refresh)}>
                  <img
                    className={cx('btn')}
                    src={require('assets/icons/refresh.svg').default}
                  />
                </button>
              </div>
              <div className={cx('balance')}>
                <TokenBalance
                  balance={{
                    amount: fromTokenBalance,
                    decimals: fromTokenInfoData?.decimals,
                    denom: fromTokenInfoData?.symbol ?? '',
                  }}
                  prefix="Balance: "
                  decimalScale={6}
                />

                <div
                  className={cx('btn')}
                  onClick={() =>
                    onMaxFromAmount(fromTokenBalance - (fromToken?.maxGas ?? 0))
                  }
                >
                  MAX
                </div>
                <div
                  className={cx('btn')}
                  onClick={() => onMaxFromAmount(fromTokenBalance / 2)}
                >
                  HALF
                </div>
                {/* <span style={{ flexGrow: 1, textAlign: "right" }}>
                {`~$${numberWithCommas(
                  +(
                    mockBalance[fromToken] *
                    mockPrice[fromToken]
                  ).toFixed(2)
                )}`}
              </span> */}
              </div>
              <div className={cx('input')}>
                <div
                  className={cx('token')}
                  onClick={() => setIsSelectFrom(true)}
                >
                  {FromIcon && <FromIcon className={cx('logo')} />}
                  <span>{fromTokenInfoData?.symbol}</span>
                  <div className={cx('arrow-down')} />
                </div>

                <NumberFormat
                  placeholder="0"
                  className={cx('amount')}
                  thousandSeparator
                  decimalScale={6}
                  type="text"
                  value={fromAmount}
                  onValueChange={({ floatValue }) => {
                    onChangeFromAmount(floatValue);
                  }}
                />

                {/* <input
                className={cx('amount')}
                value={fromAmount ? fromAmount : ''}
                placeholder="0"
                type="number"
                step={`${parseDisplayAmount(1, fromTokenInfoData?.decimals)}`}
                onChange={(e) => {
                  onChangeFromAmount(e.target.value);
                }}
              /> */}
              </div>
              {/* <div className={cx('fee')}>
              <span>Fee</span>
              <div className={cx('token')} onClick={() => setIsSelectFee(true)}>
                <FeeIcon className={cx('logo')} />
                <span>{feeToken}</span>
                <div className={cx('arrow-down')} />
              </div>
            </div> */}
            </div>
            <div className={cx('swap-icon')}>
              <img
                src={require('assets/icons/ant_swap.svg').default}
                onClick={() => {
                  setSwapTokens([toTokenDenom, fromTokenDenom]);
                  setSwapAmount([toAmount, fromAmount]);
                }}
              />
            </div>
            <div className={cx('to')}>
              <div className={cx('header')}>
                <div className={cx('title')}>TO</div>
              </div>
              <div className={cx('balance')}>
                <TokenBalance
                  balance={{
                    amount: toTokenBalance ? toTokenBalance : 0,
                    denom: toTokenInfoData?.symbol ?? '',
                  }}
                  prefix="Balance: "
                  decimalScale={6}
                />

                <span style={{ flexGrow: 1, textAlign: 'right' }}>
                  {`1 ${fromTokenInfoData?.symbol} ≈ ${averageRatio} ${toTokenInfoData?.symbol}`}
                </span>
              </div>
              <div className={cx('input')}>
                <div
                  className={cx('token')}
                  onClick={() => setIsSelectTo(true)}
                >
                  {ToIcon && <ToIcon className={cx('logo')} />}
                  <span>{toTokenInfoData?.symbol}</span>
                  <div className={cx('arrow-down')} />
                </div>

                <NumberFormat
                  className={cx('amount')}
                  thousandSeparator
                  decimalScale={6}
                  type="text"
                  value={toAmount}
                  // onValueChange={({ floatValue }) => {
                  //   onChangeToAmount(floatValue);
                  // }}
                />

                {/* <input
                className={cx('amount')}
                value={toAmount ? toAmount : ''}
                placeholder="0"
                type="number"
                step={`${parseDisplayAmount(1, toTokenInfoData?.decimals)}`}
                // onChange={(e) => {
                //   onChangeToAmount(e.target.value);
                // }}
                // disabled={true}
              /> */}
              </div>
            </div>
            <button
              className={cx('swap-btn')}
              onClick={handleSubmit}
              disabled={swapLoading}
            >
              {swapLoading && <Loader width={40} height={40} />}
              <span>Swap</span>
            </button>
            <div className={cx('detail')}>
              <div className={cx('row')}>
                <div className={cx('title')}>
                  <span>Minimum Received</span>
                  {/* <TooltipIcon /> */}
                </div>

                <TokenBalance
                  balance={{
                    amount: simulateData ? simulateData?.amount : 0,
                    denom: toTokenInfoData?.symbol ?? '',
                  }}
                  decimalScale={6}
                />

                {/* <span>{`${parseDisplayAmount(
                  simulateData?.amount,
                  toTokenInfoData?.decimals
                )} ${toTokenInfoData?.symbol.toUpperCase()}`}</span> */}
              </div>
              <div className={cx('row')}>
                <div className={cx('title')}>
                  <span>Tax rate</span>
                  {/* <TooltipIcon /> */}
                </div>
                <span>
                  {parseFloat((taxRate as TaxRateResponse)?.rate) * 100} %
                </span>
              </div>
              {(fromToken?.denom == MILKY || toToken?.denom == MILKY) && (
                <div className={cx('row')}>
                  <div className={cx('title')}>
                    <span>
                      *Additional: 5% entry tax rate for MILKY transactions
                    </span>
                  </div>
                </div>
              )}
              {/* <div className={cx('row')}>
              <div className={cx('title')}>
                <span>Exchange rate</span>
                <TooltipIcon />
              </div>
              <span>{parseFloat(exchangeRate).toFixed(6)}</span>
            </div> */}
            </div>
            <SettingModal
              isOpen={isOpenSettingModal}
              open={() => setIsOpenSettingModal(true)}
              close={() => setIsOpenSettingModal(false)}
              slippage={slippage}
              setSlippage={setSlippage}
            />

            {isSelectFrom ? (
              <SelectTokenModal
                isOpen={isSelectFrom}
                open={() => setIsSelectFrom(true)}
                close={() => setIsSelectFrom(false)}
                listToken={poolTokens.filter((token) =>
                  toTokenDenom === MILKY
                    ? token.denom === STABLE_DENOM
                    : token.denom !== toTokenDenom
                )}
                setToken={(denom) => {
                  setSwapTokens([
                    denom,
                    denom === MILKY ? STABLE_DENOM : toTokenDenom,
                  ]);
                }}
              />
            ) : (
              <SelectTokenModal
                isOpen={isSelectTo}
                open={() => setIsSelectTo(true)}
                close={() => setIsSelectTo(false)}
                listToken={poolTokens.filter((token) =>
                  fromTokenDenom === MILKY
                    ? token.denom === STABLE_DENOM
                    : token.denom !== fromTokenDenom
                )}
                setToken={(denom) => {
                  setSwapTokens([
                    denom === MILKY ? STABLE_DENOM : fromTokenDenom,
                    denom,
                  ]);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Content>
  );
};

export default Swap;
