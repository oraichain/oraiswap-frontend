import {
  BigDecimal,
  CosmosChainId,
  DEFAULT_SLIPPAGE,
  GAS_ESTIMATION_SWAP_DEFAULT,
  NetworkChainId,
  TRON_DENOM,
  TokenItemType,
  getTokenOnOraichain,
  toAmount,
  toDisplay,
  TON_ORAICHAIN_DENOM,
  evmChains
} from '@oraichain/oraidex-common';
import { UniversalSwapHandler, UniversalSwapHelper } from '@oraichain/oraidex-universal-swap';
import { ReactComponent as BookIcon } from 'assets/icons/book_icon.svg';
import DownArrowIcon from 'assets/icons/down-arrow-v2.svg';
import { ReactComponent as FeeIcon } from 'assets/icons/fee.svg';
import { ReactComponent as FeeDarkIcon } from 'assets/icons/fee_dark.svg';
import { ReactComponent as IconOirSettings } from 'assets/icons/iconoir_settings.svg';
import { ReactComponent as SendIcon } from 'assets/icons/send.svg';
import { ReactComponent as SendDarkIcon } from 'assets/icons/send_dark.svg';
import SwitchLightImg from 'assets/icons/switch-new-light.svg';
import SwitchDarkImg from 'assets/icons/switch-new.svg';
import UpArrowIcon from 'assets/icons/up-arrow.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning_icon.svg';
import { ReactComponent as RefreshImg } from 'assets/images/refresh.svg';
import { assets } from 'chain-registry';
import cn from 'classnames/bind';
import Loader from 'components/Loader';
import LoadingBox from 'components/LoadingBox';
import PowerByOBridge from 'components/PowerByOBridge';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { flattenTokens } from 'config/bridgeTokens';
import { chainIcons, flattenTokensWithIcon } from 'config/chainInfos';
import { ethers } from 'ethers';
import {
  assert,
  getSpecialCoingecko,
  getTransactionUrl,
  handleCheckAddress,
  handleErrorTransaction,
  networks
} from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useCopyClipboard } from 'hooks/useCopyClipboard';
import useLoadTokens from 'hooks/useLoadTokens';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useGetFeeConfig } from 'hooks/useTokenFee';
import useWalletReducer from 'hooks/useWalletReducer';
import Metamask from 'libs/metamask';
import { getUsd, reduceString, toSubAmount } from 'libs/utils';
import mixpanel from 'mixpanel-browser';
import { calcMaxAmount } from 'pages/Balance/helpers';
import { numberWithCommas } from 'pages/Pools/helpers';
import {
  getDisableSwap,
  getPathInfo,
  getTokenBalance,
  getTokenInfo,
  isAllowAlphaSmartRouter,
  isAllowIBCWasm,
  refreshBalances
} from 'pages/UniversalSwap/helpers';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentAddressBookStep, setCurrentAddressBookStep } from 'reducer/addressBook';
import { AddressManagementStep } from 'reducer/type';
import { RootState } from 'store/configure';
import { SlippageModal } from '../Modals';
import { SmartRouteModal } from '../Modals/SmartRouteModal';
import { checkEvmAddress, getSwapType } from '../helpers';
import AIRouteSwitch from './components/AIRouteSwitch/AIRouteSwitch';
import AddressBook from './components/AddressBook';
import InputCommon from './components/InputCommon';
import InputSwap from './components/InputSwap/InputSwap';
import SwapDetail from './components/SwapDetail';
import TokenAndChainSelectors from './components/TokenAndChainSelectors';
import { TooltipSwapBridge } from './components/TooltipSwapBridge';
import { useGetTransHistory } from './hooks';
import useCalculateDataSwap, { SIMULATE_INIT_AMOUNT } from './hooks/useCalculateDataSwap';
import { useFillToken } from './hooks/useFillToken';
import useHandleEffectTokenChange from './hooks/useHandleEffectTokenChange';
import styles from './index.module.scss';
import { RELAYER_DECIMAL } from 'helper/constants';

const cx = cn.bind(styles);

const SwapComponent: React.FC<{
  fromTokenDenom: string;
  toTokenDenom: string;
  setSwapTokens: (denoms: [string, string]) => void;
}> = ({ fromTokenDenom, toTokenDenom, setSwapTokens }) => {
  // store value
  const [isAIRoute] = useConfigReducer('AIRoute');
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [oraiAddress] = useConfigReducer('address');
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');
  const [theme] = useConfigReducer('theme');
  const isLightMode = theme === 'light';
  const currentAddressManagementStep = useSelector(selectCurrentAddressBookStep);
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const dispatch = useDispatch();

  const loadTokenAmounts = useLoadTokens();
  const { refetchTransHistory } = useGetTransHistory();
  const { handleUpdateQueryURL } = useFillToken(setSwapTokens);
  const { handleReadClipboard } = useCopyClipboard();

  // info token state
  const [openDetail, setOpenDetail] = useState(false);
  const [openRoutes, setOpenRoutes] = useState(false);
  const [fromTokenDenomSwap, setFromTokenDenom] = useState(fromTokenDenom);
  const [toTokenDenomSwap, setToTokenDenom] = useState(toTokenDenom);

  // modal state
  const [isSelectChainFrom, setIsSelectChainFrom] = useState(false);
  const [isSelectChainTo, setIsSelectChainTo] = useState(false);
  const [isSelectTokenFrom, setIsSelectTokenFrom] = useState(false);
  const [isSelectTokenTo, setIsSelectTokenTo] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [openSmartRoute, setOpenSmartRoute] = useState(false);
  const [indSmartRoute, setIndSmartRoute] = useState([0, 0]);
  const [userSlippage, setUserSlippage] = useState(DEFAULT_SLIPPAGE);

  // value state
  const [coe, setCoe] = useState(0);

  // loading state
  const [swapLoading, setSwapLoading] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  const {
    originalFromToken,
    originalToToken,
    filteredToTokens,
    filteredFromTokens,
    fromToken,
    toToken,
    addressInfo,
    validAddress
  } = useHandleEffectTokenChange({ fromTokenDenomSwap, toTokenDenomSwap });
  const { addressTransfer, initAddressTransfer, setAddressTransfer } = addressInfo;

  const getDefaultChainFrom = () => originalFromToken?.chainId || ('OraiChain' as NetworkChainId);
  const getDefaultChainTo = () => originalToToken?.chainId || ('OraiChain' as NetworkChainId);
  const [selectChainFrom, setSelectChainFrom] = useState<NetworkChainId>(getDefaultChainFrom());
  const [selectChainTo, setSelectChainTo] = useState<NetworkChainId>(getDefaultChainTo());

  // hooks
  useGetFeeConfig();
  const { data: prices } = useCoinGeckoPrices();
  const { fees, outputs, tokenInfos, simulateDatas, averageSimulateDatas } = useCalculateDataSwap({
    originalFromToken,
    originalToToken,
    fromToken,
    toToken,
    userSlippage
  });

  const {
    estSwapFee,
    isDependOnNetwork,
    totalFeeEst,
    bridgeTokenFee,
    relayerFeeToken,
    relayerFee,
    fromTokenFee,
    toTokenFee
  } = fees;
  const { expectOutputDisplay, minimumReceiveDisplay, isWarningSlippage } = outputs;
  const { fromAmountTokenBalance, usdPriceShowFrom, usdPriceShowTo } = tokenInfos;
  const { averageRatio, averageSimulateData } = averageSimulateDatas;
  const { simulateData, setSwapAmount, fromAmountToken, toAmountToken, debouncedFromAmount, isPreviousSimulate } =
    simulateDatas;

  const subAmountFrom = toSubAmount(amounts, originalFromToken);
  const subAmountTo = toSubAmount(amounts, originalToToken);

  const fromTokenBalance = getTokenBalance(originalFromToken, amounts, subAmountFrom);
  const toTokenBalance = getTokenBalance(originalToToken, amounts, subAmountTo);

  const useIbcWasm = isAllowIBCWasm(originalFromToken, originalToToken, isAIRoute);
  const useAlphaSmartRouter = isAllowAlphaSmartRouter(originalFromToken, originalToToken, isAIRoute);

  const settingRef = useRef();
  const smartRouteRef = useRef();

  useOnClickOutside(settingRef, () => {
    setOpenSetting(false);
  });

  useOnClickOutside(smartRouteRef, () => {
    setOpenSmartRoute(false);
    setIndSmartRoute([0, 0]);
  });

  const onChangeFromAmount = (amount: number | undefined) => {
    if (!amount) {
      setCoe(0);
      return setSwapAmount([undefined, toAmountToken]);
    }
    setSwapAmount([amount, toAmountToken]);
  };

  const onChangePercent = (amount: bigint) => {
    const displayAmount = toDisplay(amount, originalFromToken.decimals);
    setSwapAmount([displayAmount, toAmountToken]);
  };

  const setTokenDenomFromChain = (chainId: string, type: 'from' | 'to') => {
    if (chainId) {
      const isFrom = type === 'from';
      // check current token existed on another swap token chain
      const targetToken = isFrom ? originalFromToken : originalToToken;
      const targetChain = isFrom ? selectChainTo : selectChainFrom;

      const checkExistedToken = flattenTokens.find(
        (flat) => flat?.coinGeckoId === targetToken?.coinGeckoId && flat?.chainId === targetChain
      );
      // get default token of new chain
      const tokenInfo = flattenTokens.find((flat) => flat?.chainId === chainId);
      // case new chain === another swap token chain
      // if new tokenInfo(default token of new chain) === from/to Token => check is currentToken existed on new chain
      // if one of all condition is false => handle swap normally
      if (tokenInfo.denom === (isFrom ? toTokenDenomSwap : fromTokenDenomSwap) && checkExistedToken) {
        return handleChangeToken(checkExistedToken, type);
      }

      if (tokenInfo) {
        handleChangeToken(tokenInfo, type);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      assert(fromAmountToken > 0, 'From amount should be higher than 0!');

      setSwapLoading(true);
      displayToast(TToastType.TX_BROADCASTING);
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

      const { isSpecialFromCoingecko } = getSpecialCoingecko(
        originalFromToken.coinGeckoId,
        originalToToken.coinGeckoId
      );

      if (isSpecialFromCoingecko && originalFromToken.chainId === 'Oraichain') {
        const tokenInfo = getTokenOnOraichain(originalFromToken.coinGeckoId);
        const IBC_DECIMALS = 18;
        const fromTokenInOrai = getTokenOnOraichain(tokenInfo.coinGeckoId, IBC_DECIMALS);
        const [nativeAmount, cw20Amount] = await Promise.all([
          window.client.getBalance(oraiAddress, fromTokenInOrai.denom),
          window.client.queryContractSmart(tokenInfo.contractAddress, {
            balance: {
              address: oraiAddress
            }
          })
        ]);

        amountsBalance = {
          [fromTokenInOrai.denom]: nativeAmount?.amount,
          [originalFromToken.denom]: cw20Amount.balance
        };
      }

      if (
        (originalToToken.chainId === 'injective-1' && originalToToken.coinGeckoId === 'injective-protocol') ||
        originalToToken.chainId === 'kawaii_6886-1'
      ) {
        simulateAmount = toAmount(simulateData.displayAmount, originalToToken.decimals).toString();
      }

      const isCustomRecipient = validAddress.isValid && addressTransfer !== initAddressTransfer;
      const alphaSmartRoutes = useAlphaSmartRouter && simulateData?.routes;

      let initSwapData = {
        sender: { cosmos: cosmosAddress, evm: checksumMetamaskAddress, tron: tronAddress },
        originalFromToken,
        originalToToken,
        fromAmount: fromAmountToken,
        simulateAmount,
        userSlippage,
        bridgeFee: 1,
        amounts: amountsBalance,
        simulatePrice:
          // @ts-ignore
          averageRatio?.amount && new BigDecimal(averageRatio.amount).div(SIMULATE_INIT_AMOUNT).toString(),
        relayerFee: relayerFeeUniversal,
        alphaSmartRoutes,
        affiliates: [
          {
            address: 'orai1h8rg7zknhxmffp3ut5ztsn8zcaytckfemdkp8n',
            basis_points_fee: '25'
          }
        ]
      };

      const compileSwapData = isCustomRecipient
        ? {
            ...initSwapData,
            recipientAddress: addressTransfer
          }
        : initSwapData;

      // @ts-ignore
      const univeralSwapHandler = new UniversalSwapHandler(compileSwapData, {
        cosmosWallet: window.Keplr,
        evmWallet: new Metamask(window.tronWebDapp),
        swapOptions: {
          isAlphaSmartRouter: useAlphaSmartRouter,
          isIbcWasm: useIbcWasm
        }
      });

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
          toNetwork: originalToToken.chainId,
          useAlphaSmartRouter,
          priceOfFromTokenInUsd: usdPriceShowFrom,
          priceOfToTokenInUsd: usdPriceShowTo
        };
        mixpanel.track('Universal Swap Oraidex', logEvent);
      }
    }
  };

  const onChangePercentAmount = (coeff) => {
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
  };

  const unSupportSimulateToken = ['bnb', 'bep20_wbnb', 'eth', TON_ORAICHAIN_DENOM];
  const supportedChainFunc = () => {
    if (unSupportSimulateToken.includes(originalFromToken?.denom)) {
      return ['Oraichain'];
    }

    const isOraichainDenom = [originalFromToken.denom, originalToToken.denom].includes(TON_ORAICHAIN_DENOM);
    if (isOraichainDenom) {
      return networks.filter((chainInfo) => chainInfo.networkType === 'cosmos').map((chain) => chain.chainId);
    }

    if (originalFromToken.chainId === 'injective-1') {
      if (!isAIRoute) {
        return networks.filter((chainInfo) => chainInfo.chainId === 'Oraichain').map((chain) => chain.chainId);
      }
      return networks.filter((chainInfo) => chainInfo.networkType === 'cosmos').map((chain) => chain.chainId);
    }

    if (!originalFromToken.cosmosBased) {
      return networks.filter((chainInfo) => chainInfo.chainId !== 'injective-1').map((chain) => chain.chainId);
    }
    return [];
  };

  const supportedChain = supportedChainFunc();

  const handleChangeToken = (token: TokenItemType, type) => {
    const isFrom = type === 'from';
    let setSelectChain = setSelectChainTo;
    let setIsSelect = setIsSelectTokenTo;
    let tokenDenomSwap = fromTokenDenomSwap;
    if (isFrom) {
      setSelectChain = setSelectChainFrom;
      setIsSelect = setIsSelectTokenFrom;
      tokenDenomSwap = toTokenDenomSwap;
    }

    if (token.denom === tokenDenomSwap) {
      setFromTokenDenom(toTokenDenomSwap);
      setToTokenDenom(fromTokenDenomSwap);
      setSelectChainFrom(selectChainTo);
      setSelectChainTo(selectChainFrom);

      handleUpdateQueryURL([toTokenDenomSwap, fromTokenDenomSwap]);
    } else {
      let fromTokenDenom = fromTokenDenomSwap;
      let toTokenDenom = token.denom;
      if (isFrom) {
        fromTokenDenom = token.denom;
        toTokenDenom = toTokenDenomSwap;
      }

      setFromTokenDenom(fromTokenDenom);
      setToTokenDenom(toTokenDenom);
      setSelectChain(token.chainId);
      handleUpdateQueryURL(isFrom ? [fromTokenDenom, toTokenDenomSwap] : [fromTokenDenomSwap, toTokenDenom]);
    }

    if (coe && isFrom) {
      const subAmountFrom = toSubAmount(amounts, token);
      const updateBalance = token ? BigInt(amounts[token.denom] ?? '0') + subAmountFrom : BigInt(0);

      const finalAmount = calcMaxAmount({
        maxAmount: toDisplay(updateBalance, token?.decimals),
        token,
        coeff: coe,
        gas: GAS_ESTIMATION_SWAP_DEFAULT
      });
      onChangePercent(toAmount(finalAmount * coe, token?.decimals));
    }

    setIsSelect(false);
  };

  const handleRotateSwapDirection = () => {
    // prevent switching sides if the from token has no pool on Oraichain while the to token is a non-evm token
    // because non-evm token cannot be swapped to evm token with no Oraichain pool
    if (
      UniversalSwapHelper.isSupportedNoPoolSwapEvm(fromToken.coinGeckoId) &&
      !UniversalSwapHelper.isEvmNetworkNativeSwapSupported(toToken.chainId)
    ) {
      return;
    }

    setSelectChainFrom(selectChainTo);
    setSelectChainTo(selectChainFrom);
    setSwapTokens([toTokenDenomSwap, fromTokenDenomSwap]);
    setFromTokenDenom(toTokenDenomSwap);
    setToTokenDenom(fromTokenDenomSwap);
    setSwapAmount([toAmountToken, fromAmountToken]);
    handleUpdateQueryURL([toTokenDenomSwap, fromTokenDenomSwap]);
  };

  const defaultRouterSwap = {
    amount: '0',
    displayAmount: 0,
    routes: []
  };
  let routersSwapData = defaultRouterSwap;

  if (fromAmountToken && simulateData) {
    routersSwapData = {
      ...simulateData,
      //@ts-ignore
      routes: simulateData?.routes?.routes ?? []
    };
  }
  const isRoutersSwapData = +routersSwapData.amount;

  function caculateImpactWarning() {
    let impactWarning = 0;
    const isImpactPrice = !!debouncedFromAmount && !!simulateData?.displayAmount && !!averageRatio?.amount;
    if (
      isImpactPrice &&
      simulateData?.displayAmount &&
      averageRatio?.displayAmount &&
      useAlphaSmartRouter &&
      averageSimulateData.displayAmount
    ) {
      const calculateImpactPrice = new BigDecimal(simulateData.displayAmount)
        .div(debouncedFromAmount)
        .div(averageSimulateData.displayAmount)
        .mul(100)
        .toNumber();

      if (calculateImpactPrice) impactWarning = 100 - calculateImpactPrice;
    }
    return impactWarning;
  }
  const impactWarning = caculateImpactWarning();

  const waringImpactBiggerTen = impactWarning > 10;
  const waringImpactBiggerFive = impactWarning > 5;

  const generateRatioComp = () => {
    const getClassRatio = () => {
      let classRatio = '';
      const classWarningImpactBiggerFive = waringImpactBiggerFive && 'ratio-five';
      if (isPreviousSimulate) classRatio = waringImpactBiggerTen ? 'ratio-ten' : classWarningImpactBiggerFive;
      return classRatio;
    };

    return (
      <div className={cx('ratio', getClassRatio())} onClick={() => isRoutersSwapData && setOpenRoutes(!openRoutes)}>
        <span className={cx('text')}>
          {waringImpactBiggerFive && <WarningIcon />}
          {`1 ${originalFromToken.name} ≈ ${
            averageRatio
              ? numberWithCommas(averageRatio.displayAmount / SIMULATE_INIT_AMOUNT, undefined, {
                  maximumFractionDigits: 6
                })
              : averageSimulateData
              ? numberWithCommas(averageSimulateData?.displayAmount / SIMULATE_INIT_AMOUNT, undefined, {
                  maximumFractionDigits: 6
                })
              : '0'
          }
      ${originalToToken.name}`}
        </span>
        {!!isRoutersSwapData && useAlphaSmartRouter && !isPreviousSimulate && (
          <img src={!openRoutes ? DownArrowIcon : UpArrowIcon} alt="arrow" />
        )}
      </div>
    );
  };

  const getSwitchIcon = () => (isLightMode ? SwitchLightImg : SwitchDarkImg);

  return (
    <div className={cx('swap-box-wrapper')}>
      <LoadingBox loading={loadingRefresh} className={cx('custom-loader-root')}>
        <div className={cx('swap-box')}>
          <div className={cx('header')}>
            <div className={cx('title')}>From</div>
            <div className={cx('actions')}>
              <span className={cx('icon')} onClick={() => setOpenSetting(true)}>
                <IconOirSettings onClick={() => setOpenSetting(true)} />
              </span>
              <button
                className={cx('btn')}
                onClick={async () =>
                  await refreshBalances(
                    loadingRefresh,
                    setLoadingRefresh,
                    // TODO: need add bitcoinAddress when universal swap support bitcoin
                    { metamaskAddress, tronAddress, oraiAddress },
                    loadTokenAmounts
                  )
                }
              >
                <RefreshImg />
              </button>
            </div>
          </div>
          <div className={cx('from')}>
            <div className={cx('input-wrapper')}>
              <InputSwap
                type={'from'}
                balance={fromTokenBalance}
                originalToken={originalFromToken}
                theme={theme}
                onChangePercentAmount={onChangePercentAmount}
                setIsSelectChain={setIsSelectChainFrom}
                setIsSelectToken={setIsSelectTokenFrom}
                selectChain={selectChainFrom}
                token={originalFromToken}
                amount={fromAmountToken}
                onChangeAmount={onChangeFromAmount}
                tokenFee={fromTokenFee}
                setCoe={setCoe}
                coe={coe}
                usdPrice={usdPriceShowFrom}
              />
              {/* !fromToken && !toTokenFee mean that this is internal swap operation */}
              {!fromTokenFee && !toTokenFee && !isAIRoute && isWarningSlippage && (
                <div className={cx('impact-warning')}>
                  <WarningIcon />
                  <div className={cx('title')}>
                    <span>&nbsp;Current slippage exceed configuration!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={cx('swap-center')}>
            <div className={cx('wrap-img')} onClick={handleRotateSwapDirection}>
              <img src={getSwitchIcon()} onClick={handleRotateSwapDirection} alt="ant" />
            </div>
            <div className={cx('swap-ai-dot')}>
              {originalFromToken.cosmosBased && originalToToken.cosmosBased && (
                <AIRouteSwitch isLoading={isPreviousSimulate} />
              )}
              {generateRatioComp()}
            </div>
          </div>

          {!!isRoutersSwapData && useAlphaSmartRouter && !isPreviousSimulate && (
            <div className={cx('smart', !openRoutes ? 'hidden' : '')}>
              <div className={cx('smart-router')}>
                {routersSwapData?.routes.map((route, ind) => {
                  const volumn = Math.round(
                    new BigDecimal(route.returnAmount).div(routersSwapData.amount).mul(100).toNumber()
                  );
                  return (
                    <div key={ind} className={cx('smart-router-item')}>
                      <div className={cx('smart-router-item-volumn')}>{volumn.toFixed(0)}%</div>
                      {route.paths.map((path, i, acc) => {
                        const { NetworkFromIcon, NetworkToIcon } = getPathInfo(path, chainIcons, assets);
                        return (
                          <React.Fragment key={i}>
                            <div className={cx('smart-router-item-line')}>
                              <div className={cx('smart-router-item-line-detail')} />
                            </div>
                            <div
                              className={cx('smart-router-item-pool')}
                              onClick={() => setOpenSmartRoute(!openSmartRoute)}
                            >
                              <div
                                className={cx('smart-router-item-pool-wrap')}
                                onClick={() => setIndSmartRoute([ind, i])}
                              >
                                <div className={cx('smart-router-item-pool-wrap-img')}>{<NetworkFromIcon />}</div>
                                <div className={cx('smart-router-item-pool-wrap-img')}>{<NetworkToIcon />}</div>
                              </div>
                            </div>
                            {i === acc.length - 1 && (
                              <div className={cx('smart-router-item-line')}>
                                <div className={cx('smart-router-item-line-detail')} />
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                      <div className={cx('smart-router-item-volumn')}>{volumn.toFixed(0)}%</div>
                    </div>
                  );
                })}
                <div className={cx('smart-router-price-impact')}>
                  <div className={cx('smart-router-price-impact-title')}>Price Impact:</div>
                  <div
                    className={cx(
                      'smart-router-price-impact-warning',
                      waringImpactBiggerTen
                        ? 'smart-router-price-impact-warning-ten'
                        : waringImpactBiggerFive && 'smart-router-price-impact-warning-five'
                    )}
                  >
                    <span>
                      {waringImpactBiggerFive && <WarningIcon />} ≈{' '}
                      {numberWithCommas(impactWarning, undefined, { minimumFractionDigits: 2 })}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={cx('to')}>
            <div className={cx('input-wrapper')}>
              <InputSwap
                type={'to'}
                balance={toTokenBalance}
                theme={theme}
                originalToken={originalToToken}
                disable={true}
                selectChain={selectChainTo}
                setIsSelectChain={setIsSelectChainTo}
                setIsSelectToken={setIsSelectTokenTo}
                token={originalToToken}
                amount={toAmountToken}
                tokenFee={toTokenFee}
                usdPrice={usdPriceShowTo}
                loadingSimulate={isPreviousSimulate}
              />
            </div>
          </div>

          <div className={cx('recipient')}>
            <InputCommon
              isOnViewPort={currentAddressManagementStep === AddressManagementStep.INIT}
              title="Recipient address:"
              value={addressTransfer}
              onChange={(val) => setAddressTransfer(val)}
              showPreviewOnBlur
              defaultValue={initAddressTransfer}
              prefix={isLightMode ? <SendIcon /> : <SendDarkIcon />}
              suffix={
                <div
                  className={cx('paste')}
                  onClick={() => {
                    handleReadClipboard((text) => setAddressTransfer(text));
                  }}
                >
                  PASTE
                </div>
              }
              extraButton={
                <div className={cx('extraBtnWrapper')}>
                  <div className={cx('book')}>
                    <BookIcon
                      onClick={() => {
                        dispatch(setCurrentAddressBookStep(AddressManagementStep.SELECT));
                      }}
                    />
                    <span
                      onClick={() => {
                        dispatch(setCurrentAddressBookStep(AddressManagementStep.SELECT));
                      }}
                    >
                      Address Book
                    </span>
                  </div>
                  <span
                    className={cx('currentAddress')}
                    onClick={() => {
                      setAddressTransfer(initAddressTransfer);
                    }}
                  >
                    {reduceString(initAddressTransfer, 8, 8)}
                  </span>
                </div>
              }
              error={!validAddress?.isValid && 'Invalid address'}
            />
          </div>
          <div className={cx('estFee')} onClick={() => setOpenDetail(true)}>
            <div className={cx('label')}>
              {isLightMode ? <FeeIcon /> : <FeeDarkIcon />}
              Estimated Fee:
            </div>
            <div className={cx('info')}>
              <span className={cx('value')}>
                ≈ {numberWithCommas(totalFeeEst, undefined, { maximumFractionDigits: 6 })} {originalToToken.name}
              </span>
              <span className={cx('icon')}>
                <img src={DownArrowIcon} alt="arrow" />
              </span>
            </div>
          </div>

          {(() => {
            const { disabledSwapBtn, disableMsg } = getDisableSwap({
              originalToToken,
              walletByNetworks,
              swapLoading,
              fromAmountToken,
              toAmountToken,
              fromAmountTokenBalance,
              fromTokenBalance,
              addressTransfer,
              validAddress,
              simulateData,
              isLoadingSimulate: isPreviousSimulate
            });
            return (
              <button
                className={cx('swap-btn', `${disabledSwapBtn ? 'disable' : ''}`)}
                onClick={handleSubmit}
                disabled={disabledSwapBtn}
              >
                {swapLoading && <Loader width={20} height={20} />}
                {/* hardcode check minimum tron */}
                {!swapLoading && (!fromAmountToken || !toAmountToken) && fromToken.denom === TRON_DENOM ? (
                  <span>Minimum amount: {(fromToken.minAmountSwap || '0') + ' ' + fromToken.name} </span>
                ) : (
                  <span>{disableMsg || 'Swap'}</span>
                )}
              </button>
            );
          })()}
          <PowerByOBridge theme={theme} />
        </div>
      </LoadingBox>

      <TokenAndChainSelectors
        setIsSelectTokenTo={setIsSelectTokenTo}
        setIsSelectTokenFrom={setIsSelectTokenFrom}
        setIsSelectChainTo={setIsSelectChainTo}
        setIsSelectChainFrom={setIsSelectChainFrom}
        amounts={amounts}
        prices={prices}
        handleChangeToken={handleChangeToken}
        filteredToTokens={filteredToTokens}
        filteredFromTokens={filteredFromTokens}
        theme={theme}
        selectChainTo={selectChainTo}
        selectChainFrom={selectChainFrom}
        isSelectTokenTo={isSelectTokenTo}
        isSelectTokenFrom={isSelectTokenFrom}
        isSelectChainTo={isSelectChainTo}
        isSelectChainFrom={isSelectChainFrom}
        setSelectChainTo={setSelectChainTo}
        setSelectChainFrom={setSelectChainFrom}
        setTokenDenomFromChain={setTokenDenomFromChain}
        originalFromToken={originalFromToken}
        unSupportSimulateToken={unSupportSimulateToken}
        supportedChain={supportedChain}
      />

      <AddressBook
        onSelected={(addr: string) => {
          setAddressTransfer(addr);
        }}
        tokenTo={originalToToken}
      />
      <div
        className={cx('overlay', openSetting || openSmartRoute ? 'activeOverlay' : '')}
        onClick={() => {
          setOpenSetting(false);
        }}
      />
      <div className={cx('setting', openSetting ? 'activeSetting' : '')} ref={settingRef}>
        <SlippageModal
          setVisible={setOpenSetting}
          setUserSlippage={setUserSlippage}
          userSlippage={userSlippage}
          isBotomSheet
        />
      </div>
      <div className={cx('setting', openSmartRoute ? 'activeSetting' : '')} ref={smartRouteRef}>
        <SmartRouteModal setIndSmartRoute={setIndSmartRoute} setVisible={setOpenSmartRoute} isBotomSheet>
          <div className={styles.smartRouter}>
            {openSmartRoute &&
              [routersSwapData?.routes[indSmartRoute[0]]?.paths[indSmartRoute[1]]].map((path) => {
                if (!path) return null;
                const { NetworkFromIcon, NetworkToIcon, assetList, pathChainId } = getPathInfo(
                  path,
                  chainIcons,
                  assets
                );
                return path.actions?.map((action, index, actions) => {
                  const { info, TokenInIcon, TokenOutIcon } = getTokenInfo(action, path, assetList);
                  const tokenInChainId = path.chainId;
                  const tokenOutChainId = path.tokenOutChainId;
                  const hasTypeConvert = actions.find((act) => act.type === 'Convert');
                  const width = hasTypeConvert ? actions.length - 1 : actions.length;
                  if (action.type === 'Convert') return null;
                  return (
                    <div
                      key={index}
                      className={styles.smartRouterAction}
                      style={{
                        width: `${100 / width}%`
                      }}
                    >
                      <TooltipSwapBridge
                        type={action.type}
                        pathChainId={pathChainId}
                        tokenInChainId={tokenInChainId}
                        tokenOutChainId={tokenOutChainId}
                        TokenInIcon={TokenInIcon}
                        TokenOutIcon={TokenOutIcon}
                        NetworkFromIcon={NetworkFromIcon}
                        NetworkToIcon={NetworkToIcon}
                        info={info}
                      />
                    </div>
                  );
                });
              })}
          </div>
        </SmartRouteModal>
      </div>

      <SwapDetail
        simulatePrice={averageRatio ? Number((averageRatio.displayAmount / SIMULATE_INIT_AMOUNT).toFixed(6)) : '0'}
        expected={expectOutputDisplay}
        minimumReceived={numberWithCommas(minimumReceiveDisplay, undefined, { minimumFractionDigits: 6 })}
        slippage={userSlippage}
        relayerFee={relayerFee}
        bridgeFee={numberWithCommas(bridgeTokenFee, undefined, { maximumFractionDigits: 6 })}
        totalFee={numberWithCommas(totalFeeEst, undefined, { maximumFractionDigits: 6 })}
        swapFee={isDependOnNetwork ? 0 : numberWithCommas(estSwapFee, undefined, { maximumFractionDigits: 6 })}
        isOpen={openDetail}
        onClose={() => setOpenDetail(false)}
        toTokenName={originalToToken?.name}
        fromTokenName={originalFromToken?.name}
        isOpenSetting={openSetting}
        openSlippage={() => setOpenSetting(true)}
        closeSlippage={() => setOpenSetting(false)}
      />
    </div>
  );
};

export default SwapComponent;
