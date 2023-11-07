import {
  CosmosChainId,
  DEFAULT_SLIPPAGE,
  ORAI,
  TRON_DENOM,
  TokenItemType,
  calculateMinReceive,
  getTokenOnOraichain,
  network,
  toAmount,
  toDisplay,
  truncDecimals
} from '@oraichain/oraidex-common';
import { OraiswapRouterQueryClient } from '@oraichain/oraidex-contracts-sdk';
import {
  UniversalSwapHandler,
  getRoute,
  isEvmNetworkNativeSwapSupported,
  isEvmSwappable,
  isSupportedNoPoolSwapEvm
} from '@oraichain/oraidex-universal-swap';
import { useQuery } from '@tanstack/react-query';
import SwitchDarkImg from 'assets/icons/switch.svg';
import SwitchLightImg from 'assets/icons/switch_light.svg';
import { ReactComponent as RefreshImg } from 'assets/images/refresh.svg';
import cn from 'classnames/bind';
import Loader from 'components/Loader';
import LoadingBox from 'components/LoadingBox';
import { generateNewSymbol } from 'components/TVChartContainer/helpers/utils';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { tokenMap } from 'config/bridgeTokens';
import { ethers } from 'ethers';
import { floatToPercent, getTransactionUrl, handleCheckAddress, handleErrorTransaction } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import useTokenFee from 'hooks/useTokenFee';
import { getUsd, toSubAmount } from 'libs/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentToken, setCurrentToken } from 'reducer/tradingSlice';
import { fetchTokenInfos } from 'rest/api';
import { RootState } from 'store/configure';
import { SelectTokenModalV2, SlippageModal, TooltipIcon } from '../Modals';
import {
  AMOUNT_BALANCE_ENTRIES,
  SwapDirection,
  checkEvmAddress,
  filterNonPoolEvmTokens,
  getSwapType,
  relayerFeeInfo
} from '../helpers';
import InputSwap from './InputSwapV3';
import { useGetTransHistory, useSimulate, useTaxRate } from './hooks';
import { useRelayerFee } from './hooks/useRelayerFee';
import styles from './index.module.scss';
import Metamask from 'libs/metamask';

const cx = cn.bind(styles);
const RELAYER_DECIMAL = 6; // TODO: hardcode decimal relayerFee

const SwapComponent: React.FC<{
  fromTokenDenom: string;
  toTokenDenom: string;
  setSwapTokens: (denoms: [string, string]) => void;
}> = ({ fromTokenDenom, toTokenDenom, setSwapTokens }) => {
  const { data: prices } = useCoinGeckoPrices();
  const [isSelectFrom, setIsSelectFrom] = useState(false);
  const [isSelectTo, setIsSelectTo] = useState(false);
  const [userSlippage, setUserSlippage] = useState(DEFAULT_SLIPPAGE);
  const [coe, setCoe] = useState(0);
  const [visible, setVisible] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [oraiAddress] = useConfigReducer('address');
  const [theme] = useConfigReducer('theme');
  const loadTokenAmounts = useLoadTokens();
  const dispatch = useDispatch();
  const [searchTokenName, setSearchTokenName] = useState('');
  const [filteredToTokens, setFilteredToTokens] = useState([] as TokenItemType[]);
  const [filteredFromTokens, setFilteredFromTokens] = useState([] as TokenItemType[]);
  const currentPair = useSelector(selectCurrentToken);
  const { refetchTransHistory } = useGetTransHistory();

  const refreshBalances = async () => {
    try {
      if (loadingRefresh) return;
      setLoadingRefresh(true);
      await loadTokenAmounts({ metamaskAddress, tronAddress, oraiAddress });
    } catch (err) {
      console.log({ err });
    } finally {
      setTimeout(() => {
        setLoadingRefresh(false);
      }, 2000);
    }
  };

  const onChangeFromAmount = (amount: number | undefined) => {
    if (!amount) {
      setCoe(0);
      setSwapAmount([undefined, toAmountToken]);
      return;
    }
    setSwapAmount([amount, toAmountToken]);
  };

  const onChangePercent = (amount: bigint) => {
    const displayAmount = toDisplay(amount, originalFromToken?.decimals);
    setSwapAmount([displayAmount, toAmountToken]);
  };

  // get token on oraichain to simulate swap amount.
  const originalFromToken = tokenMap[fromTokenDenom];
  const originalToToken = tokenMap[toTokenDenom];
  const isEvmSwap = isEvmSwappable({
    fromChainId: originalFromToken.chainId,
    toChainId: originalToToken.chainId,
    fromContractAddr: originalFromToken.contractAddress,
    toContractAddr: originalToToken.contractAddress
  });

  // if evm swappable then no need to get token on oraichain because we can swap on evm. Otherwise, get token on oraichain. If cannot find => fallback to original token
  const fromToken = isEvmSwap
    ? tokenMap[fromTokenDenom]
    : getTokenOnOraichain(tokenMap[fromTokenDenom].coinGeckoId) ?? tokenMap[fromTokenDenom];
  const toToken = isEvmSwap
    ? tokenMap[toTokenDenom]
    : getTokenOnOraichain(tokenMap[toTokenDenom].coinGeckoId) ?? tokenMap[toTokenDenom];

  const fromTokenFee = useTokenFee(
    originalFromToken.prefix + originalFromToken.contractAddress,
    fromToken.chainId,
    toToken.chainId
  );
  const toTokenFee = useTokenFee(
    originalToToken.prefix + originalToToken.contractAddress,
    fromToken.chainId,
    toToken.chainId
  );

  const {
    data: [fromTokenInfoData, toTokenInfoData]
  } = useQuery(['token-infos', fromToken, toToken], () => fetchTokenInfos([fromToken!, toToken!]), { initialData: [] });

  const subAmountFrom = toSubAmount(amounts, originalFromToken);
  const subAmountTo = toSubAmount(amounts, originalToToken);
  const fromTokenBalance = originalFromToken
    ? BigInt(amounts[originalFromToken.denom] ?? '0') + subAmountFrom
    : BigInt(0);
  const toTokenBalance = originalToToken ? BigInt(amounts[originalToToken.denom] ?? '0') + subAmountTo : BigInt(0);

  // process filter from & to tokens
  useEffect(() => {
    const filteredToTokens = filterNonPoolEvmTokens(
      originalFromToken.chainId,
      originalFromToken.coinGeckoId,
      originalFromToken.denom,
      searchTokenName,
      SwapDirection.To
    );
    setFilteredToTokens(filteredToTokens);

    const filteredFromTokens = filterNonPoolEvmTokens(
      originalToToken.chainId,
      originalToToken.coinGeckoId,
      originalToToken.denom,
      searchTokenName,
      SwapDirection.From
    );
    setFilteredFromTokens(filteredFromTokens);
  }, [fromTokenDenom, toTokenDenom]);

  const taxRate = useTaxRate();
  const routerClient = new OraiswapRouterQueryClient(window.client, network.router);
  const { simulateData, setSwapAmount, fromAmountToken, toAmountToken } = useSimulate(
    'simulate-data',
    fromTokenInfoData,
    toTokenInfoData,
    originalFromToken,
    originalToToken,
    routerClient
  );

  //TODO: Need to fix after migrating contract ( AIRI/USDC)
  const { simulateData: averageRatio } = useSimulate(
    'simulate-average-data',
    fromTokenInfoData,
    toTokenInfoData,
    originalFromToken,
    originalToToken,
    routerClient,
    1000
  );

  const relayerFee = useRelayerFee();
  const relayerFeeToken = relayerFee.reduce((acc, cur) => {
    if (
      originalFromToken.chainId !== originalToToken.chainId &&
      (cur.prefix === originalFromToken.prefix || cur.prefix === originalToToken.prefix)
    ) {
      return +cur.amount + acc;
    }
    return acc;
  }, 0);

  useEffect(() => {
    const newTVPair = generateNewSymbol(fromToken, toToken, currentPair);
    if (newTVPair) dispatch(setCurrentToken(newTVPair));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken]);

  const fromAmountTokenBalance = fromTokenInfoData && toAmount(fromAmountToken, fromTokenInfoData!.decimals);

  const minimumReceive = averageRatio?.amount
    ? calculateMinReceive(
      (BigInt(averageRatio.amount) / 1000n).toString(),
      fromAmountTokenBalance.toString(),
      userSlippage,
      originalFromToken.decimals
    )
    : '0';

  const isWarningSlippage = +minimumReceive > +simulateData?.amount;

  const handleSubmit = async () => {
    if (fromAmountToken <= 0)
      return displayToast(TToastType.TX_FAILED, {
        message: 'From amount should be higher than 0!'
      });

    setSwapLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const cosmosAddress = await handleCheckAddress(
        originalFromToken.cosmosBased ? (originalFromToken.chainId as CosmosChainId) : 'Oraichain'
      );
      const oraiAddress = await handleCheckAddress('Oraichain');
      const checksumMetamaskAddress = metamaskAddress && ethers.utils.getAddress(metamaskAddress);
      checkEvmAddress(originalFromToken.chainId, metamaskAddress, tronAddress);
      checkEvmAddress(originalToToken.chainId, metamaskAddress, tronAddress);
      const relayerFee = relayerFeeToken && {
        relayerAmount: relayerFeeToken.toString(),
        relayerDecimals: RELAYER_DECIMAL
      };

      const univeralSwapHandler = new UniversalSwapHandler(
        {
          sender: { cosmos: cosmosAddress, evm: checksumMetamaskAddress, tron: tronAddress },
          originalFromToken,
          originalToToken,
          fromAmount: fromAmountToken,
          simulateAmount: simulateData.amount,
          userSlippage,
          simulatePrice: averageRatio && (BigInt(averageRatio.amount) / 1000n).toString(),
          relayerFee
        },
        { cosmosWallet: window.Keplr, evmWallet: new Metamask(window.tronWeb) }
      );
      const { transactionHash } = await univeralSwapHandler.processUniversalSwap();
      if (transactionHash) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: getTransactionUrl(originalFromToken.chainId, transactionHash)
        });
        loadTokenAmounts({ oraiAddress, metamaskAddress, tronAddress });
        setSwapLoading(false);

        // save to duckdb
        const swapType = getSwapType({
          fromChainId: originalFromToken.chainId,
          toChainId: originalToToken.chainId,
          fromCoingeckoId: originalFromToken.coinGeckoId,
          toCoingeckoId: originalToToken.coinGeckoId
        });
        await window.duckDb.addTransHistory({
          initialTxHash: transactionHash,
          fromCoingeckoId: originalFromToken.coinGeckoId,
          toCoingeckoId: originalToToken.coinGeckoId,
          fromChainId: originalFromToken.chainId,
          toChainId: originalToToken.chainId,
          fromAmount: fromAmountToken.toString(),
          toAmount: toAmountToken.toString(),
          fromAmountInUsdt: getUsd(fromAmountTokenBalance, originalFromToken, prices).toString(),
          toAmountInUsdt: getUsd(toAmount(toAmountToken, originalToToken.decimals), originalToToken, prices).toString(),
          status: 'success',
          type: swapType,
          timestamp: Date.now(),
          userAddress: oraiAddress
        });
        refetchTransHistory();
      }
    } catch (error) {
      console.log({ error });
      handleErrorTransaction(error);
    } finally {
      setSwapLoading(false);
    }
  };

  const FromIcon =
    theme === 'light' ? originalFromToken?.IconLight || originalFromToken?.Icon : originalFromToken?.Icon;
  const ToIcon = theme === 'light' ? originalToToken?.IconLight || originalToToken?.Icon : originalToToken?.Icon;

  return (
    <LoadingBox loading={loadingRefresh}>
      <div className={cx('swap-box')}>
        <div className={cx('header')}>
          <div className={cx('title')}>Universal Swap & Bridge</div>
          <TooltipIcon
            placement="bottom-end"
            visible={visible}
            setVisible={setVisible}
            content={<SlippageModal setVisible={setVisible} setUserSlippage={setUserSlippage} />}
          />
          <button className={cx('btn')} onClick={refreshBalances}>
            <RefreshImg />
          </button>
        </div>
        <div className={cx('from')}>
          <div className={cx('input-wrapper')}>
            <InputSwap
              balance={fromTokenBalance}
              originalToken={originalFromToken}
              prices={prices}
              Icon={FromIcon}
              setIsSelectFrom={setIsSelectFrom}
              token={originalFromToken}
              amount={fromAmountToken}
              onChangeAmount={onChangeFromAmount}
              tokenFee={fromTokenFee}
              setCoe={setCoe}
            />
            {isSelectFrom && (
              <SelectTokenModalV2
                close={() => setIsSelectFrom(false)}
                prices={prices}
                items={filteredFromTokens}
                amounts={amounts}
                setToken={(denom) => {
                  setSwapTokens([denom, toTokenDenom]);
                }}
                setSearchTokenName={setSearchTokenName}
                searchTokenName={searchTokenName}
              />
            )}
            {/* !fromToken && !toTokenFee mean that this is internal swap operation */}
            {!fromTokenFee && !toTokenFee && isWarningSlippage && (
              <div className={cx('impact-warning')}>
                <div className={cx('title')}>
                  <span>Current slippage exceed configuration!</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={cx('swap-icon')}>
          <div className={cx('wrap-img')}>
            <img
              src={theme === 'light' ? SwitchLightImg : SwitchDarkImg}
              onClick={() => {
                // prevent switching sides if the from token has no pool on Oraichain while the to token is a non-evm token
                // because non-evm token cannot be swapped to evm token with no Oraichain pool
                if (
                  isSupportedNoPoolSwapEvm(fromToken.coinGeckoId) &&
                  !isEvmNetworkNativeSwapSupported(toToken.chainId)
                )
                  return;
                setSwapTokens([toTokenDenom, fromTokenDenom]);
                setSwapAmount([toAmountToken, fromAmountToken]);
              }}
              alt="ant"
            />
          </div>
        </div>
        <div className={cx('to')}>
          <div className={cx('input-wrapper')}>
            <InputSwap
              balance={toTokenBalance}
              originalToken={originalToToken}
              disable={true}
              prices={prices}
              Icon={ToIcon}
              setIsSelectFrom={setIsSelectTo}
              token={originalToToken}
              amount={toAmountToken}
              tokenFee={toTokenFee}
            />
            {isSelectTo && (
              <SelectTokenModalV2
                close={() => setIsSelectTo(false)}
                prices={prices}
                items={filteredToTokens}
                amounts={amounts}
                setToken={(denom) => {
                  setSwapTokens([fromTokenDenom, denom]);
                }}
                setSearchTokenName={setSearchTokenName}
                searchTokenName={searchTokenName}
              />
            )}
          </div>
        </div>
        <div className={cx('coeff')}>
          {AMOUNT_BALANCE_ENTRIES.map(([coeff, text, type]) => (
            <button
              className={cx(`${coe === coeff && 'is-active'}`)}
              key={coeff}
              onClick={(event) => {
                event.stopPropagation();
                if (coeff === coe) {
                  setCoe(0);
                  setSwapAmount([0, 0]);
                  return;
                }
                setCoe(coeff);
                if (type === 'max') {
                  onChangePercent(fromTokenBalance - BigInt(originalFromToken.maxGas ?? 0));
                } else {
                  onChangePercent((fromTokenBalance * BigInt(coeff * 1e6)) / BigInt(1e6));
                }
              }}
            >
              {text}
            </button>
          ))}
        </div>

        {(() => {
          const disabledSwapBtn =
            swapLoading || !fromAmountToken || !toAmountToken || fromAmountTokenBalance > fromTokenBalance; // insufficent fund

          let disableMsg: string;
          if (!simulateData || simulateData.displayAmount <= 0) disableMsg = 'Enter an amount';
          if (fromAmountTokenBalance > fromTokenBalance) disableMsg = `Insufficient funds`;
          return (
            <button
              className={cx('swap-btn', `${disabledSwapBtn ? 'disable' : ''}`)}
              onClick={handleSubmit}
              disabled={disabledSwapBtn}
            >
              {swapLoading && <Loader width={35} height={35} />}
              {/* hardcode check minimum tron */}
              {!swapLoading && (!fromAmountToken || !toAmountToken) && fromToken.denom === TRON_DENOM ? (
                <span>Minimum amount: {(fromToken.minAmountSwap || '0') + ' ' + fromToken.name} </span>
              ) : (
                <span>{disableMsg || 'Swap'}</span>
              )}
            </button>
          );
        })()}

        <div className={cx('detail')}>
          {
            <div className={cx('row')}>
              <div className={cx('title')}>
                <span> Expected Output</span>
              </div>
              <div className={cx('value')} >
                ≈ {(simulateData && simulateData.displayAmount) || '0'} {originalToToken && originalToToken.name}
              </div>
            </div>
          }
          <div className={cx('row')}>
            <div className={cx('title')}>
              <span>Minimum Received after slippage ( {userSlippage}% )</span>
            </div>
            <div className={cx('value')}>
              <TokenBalance
                balance={{
                  amount: minimumReceive,
                  decimals: originalFromToken?.decimals,
                  denom: originalToToken?.name
                }}
                decimalScale={truncDecimals}
              />
            </div>
          </div>

          {!!relayerFeeToken && (
            <div className={cx('row')}>
              <div className={cx('title')}>
                <span>Relayer Fee</span>
              </div>
              <div className={cx('value')}>
                <TokenBalance
                  balance={{
                    amount: relayerFeeToken.toString(),
                    // decimals: relayerFeeInfo[relayerFeeToken.prefix],
                    decimals: RELAYER_DECIMAL,
                    denom: ORAI.toUpperCase() // TODO: later on we may change this to dynamic relay fee denom
                  }}
                  decimalScale={truncDecimals}
                />
              </div>
            </div>
          )}
          {!fromTokenFee && !toTokenFee && (
            <div className={cx('row')}>
              <div className={cx('title')}>
                <span>Tax rate</span>
              </div>
              <span>{taxRate && floatToPercent(parseFloat(taxRate)) + '%'}</span>
            </div>
          )}
        </div>
      </div>
    </LoadingBox>
  );
};

export default SwapComponent;
