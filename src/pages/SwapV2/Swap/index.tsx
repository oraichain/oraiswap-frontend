import { useQuery } from '@tanstack/react-query';
import AntSwapImg from 'assets/images/ant_swap.svg';
import RefreshImg from 'assets/images/refresh.svg';
import cn from 'classnames/bind';
import Loader from 'components/Loader';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { tokenMap } from 'config/bridgeTokens';
import { DEFAULT_SLIPPAGE, GAS_ESTIMATION_SWAP_DEFAULT, MILKY, ORAI, STABLE_DENOM, TRON_DENOM } from 'config/constants';
import { network } from 'config/networks';
import { poolTokens } from 'config/pools';
import { feeEstimate, handleCheckAddress } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useLoadTokens from 'hooks/useLoadTokens';
import CosmJs from 'libs/cosmjs';
import { toAmount, toDisplay, toSubAmount } from 'libs/utils';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import {
  fetchTokenInfos, simulateSwap
} from 'rest/api';
import { RootState } from 'store/configure';
import { generateMsgsSwap } from '../helpers';
import SelectTokenModal from '../Modals/SelectTokenModal';
import { TooltipIcon } from '../Modals/SettingTooltip';
import SlippageModal from '../Modals/SlippageModal';
import styles from './index.module.scss';

const cx = cn.bind(styles);

const SwapComponent: React.FC<{
  fromTokenDenom: string;
  toTokenDenom: string;
  setSwapTokens: (denoms: [string, string]) => void;
}> = ({ fromTokenDenom, toTokenDenom, setSwapTokens }) => {
  const { data: prices } = useCoinGeckoPrices();
  const [isSelectFrom, setIsSelectFrom] = useState(false);
  const [isSelectTo, setIsSelectTo] = useState(false);
  const [[fromAmountToken, toAmountToken], setSwapAmount] = useState([0, 0]);
  const [averageRatio, setAverageRatio] = useState('0');
  const [userSlippage, setUserSlippage] = useState(DEFAULT_SLIPPAGE);
  const [visible, setVisible] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const amounts = useSelector((state: RootState) => state.token.amounts);

  const loadTokenAmounts = useLoadTokens();

  const onChangeFromAmount = (amount: number | undefined) => {
    if (!amount) return setSwapAmount([undefined, toAmountToken]);
    setSwapAmount([amount, toAmountToken]);
  };

  const onMaxFromAmount = async (amount: bigint, type: 'max' | 'half') => {
    const displayAmount = toDisplay(amount, fromTokenInfoData?.coinDecimals);
    let finalAmount = displayAmount;

    // hardcode fee when swap token orai
    if (fromTokenDenom === ORAI) {
      const useFeeEstimate = await feeEstimate(fromTokenInfoData, GAS_ESTIMATION_SWAP_DEFAULT);
      const fromTokenBalanceDisplay = toDisplay(fromTokenBalance, fromTokenInfoData?.coinDecimals);
      if (type === 'max') {
        finalAmount = useFeeEstimate > displayAmount ? 0 : displayAmount - useFeeEstimate;
      }
      if (type === 'half') {
        finalAmount = useFeeEstimate > fromTokenBalanceDisplay - displayAmount ? 0 : displayAmount;
      }
    }
    setSwapAmount([finalAmount, toAmountToken]);
  };

  const fromToken = tokenMap[fromTokenDenom];
  const toToken = tokenMap[toTokenDenom];

  const {
    data: [fromTokenInfoData, toTokenInfoData]
  } = useQuery(['token-infos', fromToken, toToken], () => fetchTokenInfos([fromToken!, toToken!]), { initialData: [] });

  const subAmountFrom = toSubAmount(amounts, fromToken);
  const subAmountTo = toSubAmount(amounts, toToken);
  const fromTokenBalance = fromToken ? BigInt(amounts[fromToken.coinDenom] ?? '0') + subAmountFrom : BigInt(0);
  const toTokenBalance = toToken ? BigInt(amounts[toToken.coinDenom] ?? '0') + subAmountTo : BigInt(0);
  const { data: simulateData } = useQuery(
    ['simulate-data', fromTokenInfoData, toTokenInfoData, fromAmountToken],
    () =>
      simulateSwap({
        fromInfo: fromTokenInfoData!,
        toInfo: toTokenInfoData!,
        amount: toAmount(fromAmountToken, fromTokenInfoData!.coinDecimals).toString()
      }),
    { enabled: !!fromTokenInfoData && !!toTokenInfoData && fromAmountToken > 0 }
  );

  const { data: simulateAverageData } = useQuery(
    ['simulate-average-data', fromTokenInfoData, toTokenInfoData],
    () =>
      simulateSwap({
        fromInfo: fromTokenInfoData!,
        toInfo: toTokenInfoData!,
        amount: toAmount(1, fromTokenInfoData!.coinDecimals).toString()
      }),
    { enabled: !!fromTokenInfoData && !!toTokenInfoData }
  );

  useEffect(() => {
    setAverageRatio(toDisplay(simulateAverageData?.amount, toTokenInfoData?.coinDecimals).toString());
  }, [simulateAverageData, toTokenInfoData]);

  useEffect(() => {
    setSwapAmount([fromAmountToken, toDisplay(simulateData?.amount, toTokenInfoData?.coinDecimals)]);
  }, [simulateData, fromAmountToken, toTokenInfoData]);

  const handleSubmit = async () => {
    if (fromAmountToken <= 0)
      return displayToast(TToastType.TX_FAILED, {
        message: 'From amount should be higher than 0!'
      });

    setSwapLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const oraiAddress = await handleCheckAddress();

      const messages = generateMsgsSwap(
        fromTokenInfoData,
        fromAmountToken,
        toTokenInfoData,
        amounts,
        simulateData,
        userSlippage,
        oraiAddress
      );

      const result = await CosmJs.executeMultiple({
        prefix: ORAI,
        walletAddr: oraiAddress,
        msgs: messages,
        gasAmount: { denom: ORAI, amount: '0' }
      });
      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        loadTokenAmounts({ oraiAddress });

        setSwapLoading(false);
      }
    } catch (error) {
      let finalError = '';
      if (typeof error === 'string' || error instanceof String) {
        finalError = error as string;
      } else finalError = String(error);
      displayToast(TToastType.TX_FAILED, {
        message: finalError
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
          <TooltipIcon
            placement="bottom-end"
            visible={visible}
            setVisible={setVisible}
            content={<SlippageModal setVisible={setVisible} setUserSlippage={setUserSlippage} />}
          />
          <button onClick={() => setRefresh(!refresh)}>
            <img className={cx('btn')} src={RefreshImg} alt="btn" />
          </button>
        </div>
        <div className={cx('balance')}>
          <TokenBalance
            balance={{
              amount: fromTokenBalance,
              decimals: fromTokenInfoData?.coinDecimals,
              denom: fromTokenInfoData?.symbol ?? ''
            }}
            prefix="Balance: "
            decimalScale={6}
          />

          <div
            className={cx('btn')}
            onClick={() => onMaxFromAmount(fromTokenBalance - BigInt(fromToken?.maxGas ?? 0), 'max')}
          >
            MAX
          </div>
          <div className={cx('btn')} onClick={() => onMaxFromAmount(fromTokenBalance / BigInt(2), 'half')}>
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
            value={fromAmountToken}
            onValueChange={({ floatValue }) => {
              onChangeFromAmount(floatValue);
            }}
          />
        </div>
      </div>
      <div className={cx('swap-icon')}>
        <img
          src={AntSwapImg}
          onClick={() => {
            setSwapTokens([toTokenDenom, fromTokenDenom]);
            setSwapAmount([toAmountToken, fromAmountToken]);
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
              amount: toTokenBalance,
              denom: toTokenInfoData?.symbol ?? '',
              decimals: toTokenInfoData?.coinDecimals
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

          <NumberFormat className={cx('amount')} thousandSeparator decimalScale={6} type="text" value={toAmountToken} />
        </div>
      </div>
      <button
        className={cx('swap-btn')}
        onClick={handleSubmit}
        disabled={swapLoading || !fromAmountToken || !toAmountToken}
      >
        {swapLoading && <Loader width={40} height={40} />}
        {/* hardcode check minimum tron */}
        {!swapLoading && (!fromAmountToken || !toAmountToken) && fromToken.coinDenom === TRON_DENOM ? (
          <span>Minimum amount: {(fromToken.minAmountSwap || '0') + ' ' + fromToken.name} </span>
        ) : (
          <span>Swap</span>
        )}
      </button>
      <div className={cx('detail')}>
        <div className={cx('row')}>
          <div className={cx('title')}>
            <span>Minimum Received</span>
          </div>
          <TokenBalance
            balance={{
              amount: simulateData?.amount,
              denom: toTokenInfoData?.symbol,
              decimals: toTokenInfoData?.coinDecimals
            }}
            decimalScale={6}
          />
        </div>
        <div className={cx('row')}>
          <div className={cx('title')}>
            <span>Tax rate</span>
          </div>
          <span>0.3 %</span>
        </div>
        {(fromToken?.coinDenom === MILKY || toToken?.coinDenom === MILKY) && (
          <div className={cx('row')}>
            <div className={cx('title')}>
              <span>*Additional: 5% entry tax rate for MILKY transactions</span>
            </div>
          </div>
        )}
      </div>
      {isSelectFrom ? (
        <SelectTokenModal
          isOpen={isSelectFrom}
          open={() => setIsSelectFrom(true)}
          close={() => setIsSelectFrom(false)}
          prices={prices}
          listToken={poolTokens.filter((token) =>
            toTokenDenom === MILKY ? token.coinDenom === STABLE_DENOM : token.coinDenom !== toTokenDenom
          )}
          amounts={amounts}
          setToken={(denom) => {
            setSwapTokens([denom, denom === MILKY ? STABLE_DENOM : toTokenDenom]);
          }}
        />
      ) : (
        <SelectTokenModal
          isOpen={isSelectTo}
          open={() => setIsSelectTo(true)}
          close={() => setIsSelectTo(false)}
          prices={prices}
          amounts={amounts}
          listToken={poolTokens.filter((token) =>
            fromTokenDenom === MILKY ? token.coinDenom === STABLE_DENOM : token.coinDenom !== fromTokenDenom
          )}
          setToken={(denom) => {
            setSwapTokens([denom === MILKY ? STABLE_DENOM : fromTokenDenom, denom]);
          }}
        />
      )}
    </div>
  );
};

export default SwapComponent;
