import {
  BigDecimal,
  CosmosChainId,
  DEFAULT_SLIPPAGE,
  GAS_ESTIMATION_SWAP_DEFAULT,
  INJECTIVE_CONTRACT,
  INJECTIVE_ORAICHAIN_DENOM,
  TRON_DENOM,
  TokenItemType,
  calculateMinReceive,
  getTokenOnOraichain,
  network,
  toAmount,
  toDisplay
} from '@oraichain/oraidex-common';
import { OraiswapRouterQueryClient } from '@oraichain/oraidex-contracts-sdk';
import {
  UniversalSwapHandler,
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
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { tokenMap } from 'config/bridgeTokens';
import { ethers } from 'ethers';
import {
  floatToPercent,
  getAddressTransfer,
  getTransactionUrl,
  handleCheckAddress,
  handleErrorTransaction,
  networks
} from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import useTokenFee, { useGetFeeConfig, useRelayerFeeToken } from 'hooks/useTokenFee';
import Metamask from 'libs/metamask';
import { getUsd, toSubAmount } from 'libs/utils';
import mixpanel from 'mixpanel-browser';
import { calcMaxAmount } from 'pages/Balance/helpers';
import { numberWithCommas } from 'pages/Pools/helpers';
import { generateNewSymbol } from 'pages/UniversalSwap/helpers';
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
  getSwapType
} from '../helpers';
import InputSwap from './InputSwapV3';
import { useGetTransHistory, useSimulate } from './hooks';
import { useGetPriceByUSD } from './hooks/useGetPriceByUSD';
import { useSwapFee } from './hooks/useSwapFee';
import styles from './index.module.scss';
import { useFillToken } from './hooks/useFillToken';
import useWalletReducer from 'hooks/useWalletReducer';
import { isMobile } from '@walletconnect/browser-utils';
import { reduceString } from 'libs/utils';

const cx = cn.bind(styles);
// TODO: hardcode decimal relayerFee
const RELAYER_DECIMAL = 6;

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
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');
  const [addressTransfer, setAddressTransfer] = useState('');
  useGetFeeConfig();

  const { handleUpdateQueryURL } = useFillToken(setSwapTokens);

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
    const displayAmount = toDisplay(amount, originalFromToken.decimals);
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

  const remoteTokenDenomFrom = originalFromToken.contractAddress
    ? originalFromToken.prefix + originalFromToken.contractAddress
    : originalFromToken.denom;
  const remoteTokenDenomTo = originalToToken.contractAddress
    ? originalToToken.prefix + originalToToken.contractAddress
    : originalToToken.denom;
  const fromTokenFee = useTokenFee(remoteTokenDenomFrom, fromToken.chainId, toToken.chainId);
  const toTokenFee = useTokenFee(remoteTokenDenomTo, fromToken.chainId, toToken.chainId);

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

  const { fee } = useSwapFee({
    fromToken: originalFromToken,
    toToken: originalToToken
  });

  // const taxRate = useTaxRate();
  const routerClient = new OraiswapRouterQueryClient(window.client, network.router);
  const { simulateData, setSwapAmount, fromAmountToken, toAmountToken } = useSimulate(
    'simulate-data',
    fromTokenInfoData,
    toTokenInfoData,
    originalFromToken,
    originalToToken,
    routerClient
  );

  const isFromBTC = originalFromToken.coinGeckoId === 'bitcoin';

  const INIT_SIMULATE_NOUGHT_POINT_OH_ONE_AMOUNT = 0.00001;

  let INIT_AMOUNT = 1;

  if (isFromBTC) {
    INIT_AMOUNT = INIT_SIMULATE_NOUGHT_POINT_OH_ONE_AMOUNT;
  }

  const { simulateData: averageRatio } = useSimulate(
    'simulate-average-data',
    fromTokenInfoData,
    toTokenInfoData,
    originalFromToken,
    originalToToken,
    routerClient,
    INIT_AMOUNT
  );

  const { price } = useGetPriceByUSD({
    denom: originalFromToken.denom,
    contractAddress: originalFromToken.contractAddress,
    cachePrices: prices
  });

  let usdPriceShow = ((price || prices?.[originalFromToken?.coinGeckoId]) * fromAmountToken).toFixed(6);
  if (!Number(usdPriceShow)) {
    usdPriceShow = (prices?.[originalToToken?.coinGeckoId] * simulateData?.displayAmount).toFixed(6);
  }

  const { relayerFee, relayerFeeInOraiToAmount: relayerFeeToken } = useRelayerFeeToken(
    originalFromToken,
    originalToToken
  );
  useEffect(() => {
    const newTVPair = generateNewSymbol(fromToken, toToken, currentPair);
    if (newTVPair) dispatch(setCurrentToken(newTVPair));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken]);

  const fromAmountTokenBalance = fromTokenInfoData && toAmount(fromAmountToken, fromTokenInfoData!.decimals);
  const isAverageRatio = averageRatio && averageRatio.amount;
  const isSimulateDataDisplay = simulateData && simulateData.displayAmount;
  const minimumReceive = isAverageRatio
    ? calculateMinReceive(
        // @ts-ignore
        new BigDecimal(averageRatio.amount).div(INIT_AMOUNT).toString(),
        fromAmountTokenBalance.toString(),
        userSlippage,
        originalFromToken.decimals
      )
    : '0';
  const isWarningSlippage = +minimumReceive > +simulateData?.amount;
  const simulateDisplayAmount = simulateData && simulateData.displayAmount ? simulateData.displayAmount : 0;
  const bridgeTokenFee =
    simulateDisplayAmount && (fromTokenFee || toTokenFee)
      ? (simulateDisplayAmount * fromTokenFee + simulateDisplayAmount * toTokenFee) / 100
      : 0;

  const minimumReceiveDisplay = isSimulateDataDisplay
    ? new BigDecimal(
        simulateDisplayAmount - (simulateDisplayAmount * userSlippage) / 100 - relayerFee - bridgeTokenFee
      ).toNumber()
    : 0;

  const expectOutputDisplay = isSimulateDataDisplay
    ? numberWithCommas(simulateData.displayAmount, undefined, { minimumFractionDigits: 6 })
    : 0;

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
      const relayerFeeUniversal = relayerFeeToken && {
        relayerAmount: relayerFeeToken.toString(),
        relayerDecimals: RELAYER_DECIMAL
      };

      let amountsBalance = amounts;
      let simulateAmount = simulateData.amount;
      if (originalToToken.chainId === 'injective-1' && originalToToken.coinGeckoId === 'injective-protocol') {
        const [nativeAmount, cw20Amount] = await Promise.all([
          window.client.getBalance(oraiAddress, INJECTIVE_ORAICHAIN_DENOM),
          window.client.queryContractSmart(INJECTIVE_CONTRACT, {
            balance: {
              address: oraiAddress
            }
          })
        ]);
        amountsBalance = {
          [INJECTIVE_ORAICHAIN_DENOM]: nativeAmount?.amount,
          [INJECTIVE_CONTRACT]: cw20Amount?.balance,
          injective: cw20Amount?.balance
        };
        simulateAmount = toAmount(simulateData.displayAmount, originalToToken.decimals).toString();
      }

      const univeralSwapHandler = new UniversalSwapHandler(
        {
          sender: { cosmos: cosmosAddress, evm: checksumMetamaskAddress, tron: tronAddress },
          originalFromToken,
          originalToToken,
          fromAmount: fromAmountToken,
          simulateAmount,
          userSlippage,
          amounts: amountsBalance,
          simulatePrice:
            // @ts-ignore
            averageRatio?.amount && new BigDecimal(averageRatio.amount).div(INIT_AMOUNT).toString(),
          relayerFee: relayerFeeUniversal
        },
        { cosmosWallet: window.Keplr, evmWallet: new Metamask(window.tronWebDapp) }
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
      console.trace({ error });
      handleErrorTransaction(error, {
        tokenName: originalToToken.name,
        chainName: originalToToken.chainId
      });
    } finally {
      setSwapLoading(false);
      if (process.env.REACT_APP_SENTRY_ENVIRONMENT === 'production') {
        const address = [oraiAddress, metamaskAddress, tronAddress].filter(Boolean).join(' ');
        const logEvent = {
          address,
          fromToken: `${originalFromToken.name} - ${originalFromToken.chainId}`,
          fromAmount: `${fromAmountToken}`,
          toToken: `${originalToToken.name} - ${originalToToken.chainId}`,
          toAmount: `${toAmountToken}`,
          fromNetwork: originalFromToken.chainId,
          toNetwork: originalToToken.chainId
        };
        mixpanel.track('Universal Swap Oraidex', logEvent);
      }
    }
  };

  const FromIcon = theme === 'light' ? originalFromToken.IconLight || originalFromToken.Icon : originalFromToken.Icon;
  const ToIcon = theme === 'light' ? originalToToken.IconLight || originalToToken.Icon : originalToToken.Icon;

  useEffect(() => {
    (async () => {
      if (!isMobile()) {
        if (!walletByNetworks.evm && !walletByNetworks.cosmos && !walletByNetworks.tron) {
          return setAddressTransfer('');
        }

        if (originalToToken.cosmosBased && !walletByNetworks.cosmos) {
          return setAddressTransfer('');
        }

        if (!originalToToken.cosmosBased && originalToToken.chainId === '0x2b6653dc' && !walletByNetworks.tron) {
          return setAddressTransfer('');
        }

        if (!originalToToken.cosmosBased && !walletByNetworks.evm) {
          return setAddressTransfer('');
        }
      }

      if (originalToToken.chainId) {
        const findNetwork = networks.find((net) => net.chainId === originalToToken.chainId);
        const address = await getAddressTransfer(findNetwork, walletByNetworks);
        setAddressTransfer(address);
      }
    })();
  }, [
    originalToToken,
    oraiAddress,
    metamaskAddress,
    tronAddress,
    walletByNetworks.evm,
    walletByNetworks.cosmos,
    walletByNetworks.tron
  ]);

  return (
    <div className={cx('swap-box-wrapper')}>
      <LoadingBox loading={loadingRefresh} className={cx('custom-loader-root')}>
        <div className={cx('swap-box')}>
          <div className={cx('header')}>
            <div className={cx('title')}>Universal Swap & Bridge</div>
            <TooltipIcon
              placement="bottom-end"
              visible={visible}
              setVisible={setVisible}
              content={
                <SlippageModal setVisible={setVisible} setUserSlippage={setUserSlippage} userSlippage={userSlippage} />
              }
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
                Icon={FromIcon}
                setIsSelectFrom={setIsSelectFrom}
                token={originalFromToken}
                amount={fromAmountToken}
                onChangeAmount={onChangeFromAmount}
                tokenFee={fromTokenFee}
                setCoe={setCoe}
                usdPrice={usdPriceShow}
              />
              {/* !fromToken && !toTokenFee mean that this is internal swap operation */}
              {!fromTokenFee && !toTokenFee && isWarningSlippage && (
                <div className={cx('impact-warning')}>
                  <div className={cx('title')}>
                    <span>Current slippage exceed configuration!</span>
                  </div>
                </div>
              )}
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
                      const finalAmount = calcMaxAmount({
                        maxAmount: toDisplay(fromTokenBalance, originalFromToken.decimals),
                        token: originalFromToken,
                        coeff,
                        gas: GAS_ESTIMATION_SWAP_DEFAULT
                      });
                      onChangePercent(toAmount(finalAmount * coeff, originalFromToken.decimals));
                      setCoe(coeff);
                    }}
                  >
                    {text}
                  </button>
                ))}
              </div>
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
                Icon={ToIcon}
                setIsSelectFrom={setIsSelectTo}
                token={originalToToken}
                amount={toAmountToken}
                tokenFee={toTokenFee}
                usdPrice={usdPriceShow}
              />

              <div className={cx('ratio')}>
                {`1 ${originalFromToken.name} ≈ ${
                  averageRatio ? Number((averageRatio.displayAmount / INIT_AMOUNT).toFixed(6)) : '0'
                } ${originalToToken.name}`}
              </div>
            </div>
          </div>

          <div className={cx('recipient')}>
            <div className={cx('label')}>Recipient address:</div>
            <div>
              <span className={cx('address')}>{reduceString(addressTransfer, 10, 8)}</span>
              {/* <span className={cx('paste')}>PASTE</span> */}
            </div>
          </div>

          {(() => {
            const mobileMode = isMobile();
            const canSwapToCosmos = !mobileMode && originalToToken.cosmosBased && !walletByNetworks.cosmos;
            const canSwapToEvm = !mobileMode && !originalToToken.cosmosBased && !walletByNetworks.evm;
            const canSwapToTron = !mobileMode && originalToToken.chainId === '0x2b6653dc' && !walletByNetworks.tron;
            const canSwapTo = canSwapToCosmos || canSwapToEvm || canSwapToTron;
            const disabledSwapBtn =
              swapLoading ||
              !fromAmountToken ||
              !toAmountToken ||
              fromAmountTokenBalance > fromTokenBalance || // insufficent fund
              !addressTransfer ||
              canSwapTo;

            let disableMsg: string;
            if (!addressTransfer) disableMsg = `Recipient address not found`;
            if (canSwapToCosmos) disableMsg = `Please connect cosmos wallet`;
            if (canSwapToEvm) disableMsg = `Please connect evm wallet`;
            if (canSwapToTron) disableMsg = `Please connect tron wallet`;
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
            <div className={cx('row')}>
              <div className={cx('title')}>
                <span> Expected Output</span>
              </div>
              <div className={cx('value')}>
                ≈ {expectOutputDisplay} {originalToToken.name}
              </div>
            </div>
            <div className={cx('row')}>
              <div className={cx('title')}>
                <span>Minimum Received after slippage ( {userSlippage}% )</span>
              </div>
              <div className={cx('value')}>
                {numberWithCommas(minimumReceiveDisplay, undefined, { minimumFractionDigits: 6 })}{' '}
                {originalToToken.name}
              </div>
            </div>

            {!userSlippage && (
              <div className={cx('row')}>
                <span className={cx('warning-slippage-0')}>
                  That transaction may failed if configured slippage is 0%!
                </span>
              </div>
            )}
            {!!relayerFeeToken && (
              <div className={cx('row')}>
                <div className={cx('title')}>
                  <span>Relayer Fee</span>
                </div>
                <div className={cx('value')}>
                  ≈ {relayerFee} {originalToToken.name}
                </div>
              </div>
            )}
            {!fromTokenFee && !toTokenFee && fee && (
              <div className={cx('row')}>
                <div className={cx('title')}>
                  <span>Swap Fees</span>
                </div>
                {/* <span>{taxRate && floatToPercent(parseFloat(taxRate)) + '%'}</span> */}
                <span>{fee && floatToPercent(fee) + '%'}</span>
              </div>
            )}
          </div>
        </div>
      </LoadingBox>

      {isSelectTo && (
        <SelectTokenModalV2
          close={() => setIsSelectTo(false)}
          prices={prices}
          items={filteredToTokens}
          amounts={amounts}
          setToken={(denom) => {
            setSwapTokens([fromTokenDenom, denom]);
            handleUpdateQueryURL([fromTokenDenom, denom]);
          }}
          setSearchTokenName={setSearchTokenName}
          searchTokenName={searchTokenName}
          title="Receive Token List"
        />
      )}

      {isSelectFrom && (
        <SelectTokenModalV2
          close={() => setIsSelectFrom(false)}
          prices={prices}
          items={filteredFromTokens}
          amounts={amounts}
          setToken={(denom) => {
            setSwapTokens([denom, toTokenDenom]);
            handleUpdateQueryURL([denom, toTokenDenom]);
          }}
          setSearchTokenName={setSearchTokenName}
          searchTokenName={searchTokenName}
          title="Pay Token List"
        />
      )}
    </div>
  );
};

export default SwapComponent;
