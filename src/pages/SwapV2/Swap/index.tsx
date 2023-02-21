import React, { useState, useEffect } from 'react';
import cn from 'classnames/bind';
import styles from './index.module.scss';
import useGlobalState from 'hooks/useGlobalState';
import {
  buildMultipleMessages,
  parseAmount,
  parseAmountToWithDecimal,
  parseDisplayAmount,
} from 'libs/utils';
import { Contract } from 'config/contracts';
import { contracts } from 'libs/contracts';
import { filteredTokens } from 'config/bridgeTokens';
import { useQuery } from '@tanstack/react-query';
import {
  fetchTokenInfo,
  generateContractMessages,
  generateConvertErc20Cw20Message,
  simulateSwap,
  SwapQuery,
  Type,
} from 'rest/api';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import CosmJs from 'libs/cosmjs';
import { MILKY, ORAI, STABLE_DENOM } from 'config/constants';
import { network } from 'config/networks';
import TokenBalance from 'components/TokenBalance';
import NumberFormat from 'react-number-format';
import { TaxRateResponse } from 'libs/contracts/OraiswapOracle.types';
import SettingModal from 'pages/Swap/Modals/SettingModal';
import SelectTokenModal from 'pages/Swap/Modals/SelectTokenModal';
import { poolTokens } from 'config/pools';
import Loader from 'components/Loader';
import { calculateSubAmounts } from 'helper';
import { RootState } from 'store/configure';
import { useSelector } from 'react-redux';

const cx = cn.bind(styles);

const SwapComponent: React.FC<{
  fromTokenDenom: string;
  toTokenDenom: string;
  setSwapTokens: any;
}> = ({ fromTokenDenom, toTokenDenom, setSwapTokens }) => {
  const [isOpenSettingModal, setIsOpenSettingModal] = useState(false);
  const [isSelectFrom, setIsSelectFrom] = useState(false);
  const [isSelectTo, setIsSelectTo] = useState(false);
  const [[fromAmount, toAmount], setSwapAmount] = useState([
    undefined,
    undefined,
  ]);
  const [averageRatio, setAverageRatio] = useState('0');
  const [slippage, setSlippage] = useState(1);
  const [address] = useGlobalState('address');
  const [swapLoading, setSwapLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const amounts = useSelector((state: RootState) => state.amount.amounts);

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

  const fromTokenBalance = fromToken
    ? amounts[fromToken.denom]?.amount +
        calculateSubAmounts(amounts[fromToken.denom]) ?? 0
    : 0;
  const toTokenBalance = toToken
    ? amounts[toToken.denom]?.amount +
        calculateSubAmounts(amounts[toToken.denom]) ?? 0
    : 0;

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
        amounts,
        fromTokenInfoData,
        address
      );
      const msgConvertTo = await generateConvertErc20Cw20Message(
        amounts,
        toTokenInfoData,
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
    <div className={cx('swap-box')}>
      <div className={cx('from')}>
        <div className={cx('header')}>
          <div className={cx('title')}>FROM</div>
          <button onClick={() => setRefresh(!refresh)}>
            <img
              className={cx('btn')}
              src={require('assets/icons/refresh.svg').default}
              alt="btn"
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
        </div>
        <div className={cx('input')}>
          <div className={cx('token')} onClick={() => setIsSelectFrom(true)}>
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
        </div>
      </div>
      <div className={cx('swap-icon')}>
        <img
          src={require('assets/icons/ant_swap.svg').default}
          onClick={() => {
            setSwapTokens([toTokenDenom, fromTokenDenom]);
            setSwapAmount([toAmount, fromAmount]);
          }}
          alt="ant"
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
          <div className={cx('token')} onClick={() => setIsSelectTo(true)}>
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
          />
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
          </div>
          <TokenBalance
            balance={{
              amount: simulateData ? simulateData?.amount : 0,
              denom: toTokenInfoData?.symbol ?? '',
            }}
            decimalScale={6}
          />
        </div>
        <div className={cx('row')}>
          <div className={cx('title')}>
            <span>Tax rate</span>
          </div>
          <span>{parseFloat((taxRate as TaxRateResponse)?.rate) * 100} %</span>
        </div>
        {(fromToken?.denom === MILKY || toToken?.denom === MILKY) && (
          <div className={cx('row')}>
            <div className={cx('title')}>
              <span>*Additional: 5% entry tax rate for MILKY transactions</span>
            </div>
          </div>
        )}
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
  );
};

export default SwapComponent;
