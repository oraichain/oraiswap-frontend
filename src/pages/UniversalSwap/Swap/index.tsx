import {
  BigDecimal,
  CW20_DECIMALS,
  CosmosChainId,
  DEFAULT_SLIPPAGE,
  GAS_ESTIMATION_SWAP_DEFAULT,
  NetworkChainId,
  TRON_DENOM,
  TokenItemType,
  calculateMinReceive,
  checkValidateAddressWithNetwork,
  getTokenOnOraichain,
  network,
  toAmount,
  toDisplay
} from '@oraichain/oraidex-common';
import { OraiswapRouterQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { UniversalSwapHandler, UniversalSwapHelper } from '@oraichain/oraidex-universal-swap';
import { useQuery } from '@tanstack/react-query';
import { isMobile } from '@walletconnect/browser-utils';
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
import { flattenTokens, tokenMap } from 'config/bridgeTokens';
import { chainIcons } from 'config/chainInfos';
import { ethers } from 'ethers';
import {
  getAddressTransfer,
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
import useTokenFee, { useGetFeeConfig, useRelayerFeeToken } from 'hooks/useTokenFee';
import useWalletReducer from 'hooks/useWalletReducer';
import Metamask from 'libs/metamask';
import { getUsd, reduceString, toSubAmount } from 'libs/utils';
import mixpanel from 'mixpanel-browser';
import { calcMaxAmount } from 'pages/Balance/helpers';
import { numberWithCommas } from 'pages/Pools/helpers';
import {
  genCurrentChain,
  generateNewSymbolV2,
  getDisableSwap,
  getFromToToken,
  getPathInfo,
  getRemoteDenom,
  getTokenBalance,
  getTokenInfo,
  isAllowAlphaSmartRouter,
  refreshBalances
} from 'pages/UniversalSwap/helpers';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentAddressBookStep, setCurrentAddressBookStep } from 'reducer/addressBook';
import {
  selectCurrentToChain,
  selectCurrentToken,
  setCurrentFromToken,
  setCurrentToChain,
  setCurrentToToken,
  setCurrentToken
} from 'reducer/tradingSlice';
import { AddressManagementStep } from 'reducer/type';
import { fetchTokenInfos } from 'rest/api';
import { RootState } from 'store/configure';
import { SlippageModal } from '../Modals';
import { checkEvmAddress, getSwapType } from '../helpers';
import AddressBook from './components/AddressBook';
import InputCommon from './components/InputCommon';
import InputSwap from './components/InputSwap/InputSwap';
import SelectChain from './components/SelectChain/SelectChain';
import SelectToken from './components/SelectToken/SelectToken';
import SwapDetail from './components/SwapDetail';
import { TooltipSwapBridge } from './components/TooltipSwapBridge';
import { useGetTransHistory, useSimulate } from './hooks';
import { useFillToken } from './hooks/useFillToken';
import useFilteredTokens from './hooks/useFilteredTokens';
import { useSwapFee } from './hooks/useSwapFee';
import styles from './index.module.scss';
import { SmartRouteModal } from '../Modals/SmartRouteModal';
import AIRouteSwitch from './components/AIRouteSwitch/AIRouteSwitch';

const cx = cn.bind(styles);
// TODO: hardcode decimal relayerFee
const RELAYER_DECIMAL = 6;

const SwapComponent: React.FC<{
  fromTokenDenom: string;
  toTokenDenom: string;
  setSwapTokens: (denoms: [string, string]) => void;
}> = ({ fromTokenDenom, toTokenDenom, setSwapTokens }) => {
  const { handleUpdateQueryURL } = useFillToken(setSwapTokens);
  const [openDetail, setOpenDetail] = useState(false);
  const [openRoutes, setOpenRoutes] = useState(false);

  const [fromTokenDenomSwap, setFromTokenDenom] = useState(fromTokenDenom);
  const [toTokenDenomSwap, setToTokenDenom] = useState(toTokenDenom);

  // get token on oraichain to simulate swap amount.
  const originalFromToken = tokenMap[fromTokenDenomSwap];
  const originalToToken = tokenMap[toTokenDenomSwap];

  const { data: prices } = useCoinGeckoPrices();

  const [selectChainFrom, setSelectChainFrom] = useState<NetworkChainId>(
    originalFromToken?.chainId || ('OraiChain' as NetworkChainId)
  );
  const [selectChainTo, setSelectChainTo] = useState<NetworkChainId>(
    originalToToken?.chainId || ('OraiChain' as NetworkChainId)
  );

  const [isSelectChainFrom, setIsSelectChainFrom] = useState(false);
  const [isSelectChainTo, setIsSelectChainTo] = useState(false);
  const [isSelectFrom, setIsSelectFrom] = useState(false);
  const [isSelectTo, setIsSelectTo] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const [openSmartRoute, setOpenSmartRoute] = useState(false);
  const [indSmartRoute, setIndSmartRoute] = useState([0, 0]);

  const [userSlippage, setUserSlippage] = useState(DEFAULT_SLIPPAGE);
  const [coe, setCoe] = useState(0);
  const [searchTokenName] = useState('');
  const [swapLoading, setSwapLoading] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [oraiAddress] = useConfigReducer('address');
  const [theme] = useConfigReducer('theme');
  const isLightMode = theme === 'light';
  const loadTokenAmounts = useLoadTokens();
  const dispatch = useDispatch();
  const currentPair = useSelector(selectCurrentToken);
  const currentToChain = useSelector(selectCurrentToChain);
  const { refetchTransHistory } = useGetTransHistory();
  const [walletByNetworks] = useWalletReducer('walletsByNetwork');
  const [addressTransfer, setAddressTransfer] = useState('');
  const [initAddressTransfer, setInitAddressTransfer] = useState('');
  const currentAddressManagementStep = useSelector(selectCurrentAddressBookStep);
  const { handleReadClipboard } = useCopyClipboard();

  const { fromToken, toToken } = getFromToToken(
    originalFromToken,
    originalToToken,
    fromTokenDenomSwap,
    toTokenDenomSwap
  );

  const remoteTokenDenomFrom = getRemoteDenom(originalFromToken);
  const remoteTokenDenomTo = getRemoteDenom(originalToToken);
  const fromTokenFee = useTokenFee(remoteTokenDenomFrom, fromToken.chainId, toToken.chainId);
  const toTokenFee = useTokenFee(remoteTokenDenomTo, fromToken.chainId, toToken.chainId);

  const subAmountFrom = toSubAmount(amounts, originalFromToken);
  const subAmountTo = toSubAmount(amounts, originalToToken);
  const INIT_AMOUNT = 1;

  useGetFeeConfig();

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

  const {
    data: [fromTokenInfoData, toTokenInfoData]
  } = useQuery(['token-infos', fromToken, toToken], () => fetchTokenInfos([fromToken!, toToken!]), { initialData: [] });

  const fromTokenBalance = getTokenBalance(originalFromToken, amounts, subAmountFrom);
  const toTokenBalance = getTokenBalance(originalToToken, amounts, subAmountTo);

  const [isAIRoute] = useConfigReducer('AIRoute');
  const useAlphaSmartRouter = isAllowAlphaSmartRouter(originalFromToken, originalToToken) && isAIRoute;
  const routerClient = new OraiswapRouterQueryClient(window.client, network.router);
  const { simulateData, setSwapAmount, fromAmountToken, toAmountToken, debouncedFromAmount, isPreviousSimulate } =
    useSimulate(
      'simulate-data',
      fromTokenInfoData,
      toTokenInfoData,
      originalFromToken,
      originalToToken,
      routerClient,
      null,
      {
        useAlphaSmartRoute: useAlphaSmartRouter
      },
      isAIRoute
    );

  const { simulateData: averageSimulateData } = useSimulate(
    'average-simulate-data',
    fromTokenInfoData,
    toTokenInfoData,
    originalFromToken,
    originalToToken,
    routerClient,
    INIT_AMOUNT,
    {
      useAlphaSmartRoute: useAlphaSmartRouter
    },
    isAIRoute
  );

  let averageRatio = undefined;
  if (simulateData && fromAmountToken) {
    const displayAmount = new BigDecimal(simulateData.displayAmount).div(fromAmountToken).toNumber();
    averageRatio = {
      amount: toAmount(displayAmount ? displayAmount : averageSimulateData?.displayAmount, originalFromToken.decimals),
      displayAmount: displayAmount ? displayAmount : averageSimulateData?.displayAmount ?? 0
    };
  }

  const usdPriceShow = (prices?.[originalFromToken?.coinGeckoId] * fromAmountToken).toFixed(6);
  const usdPriceShowTo = (prices?.[originalToToken?.coinGeckoId] * simulateData?.displayAmount).toFixed(6);

  const { filteredToTokens, filteredFromTokens } = useFilteredTokens(
    originalFromToken,
    originalToToken,
    searchTokenName,
    fromTokenDenomSwap,
    toTokenDenomSwap
  );

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

  const { fee, isDependOnNetwork } = useSwapFee({
    fromToken: originalFromToken,
    toToken: originalToToken
  });

  const { relayerFee, relayerFeeInOraiToAmount: relayerFeeToken } = useRelayerFeeToken(
    originalFromToken,
    originalToToken
  );

  useEffect(() => {
    const newTVPair = generateNewSymbolV2(fromToken, toToken, currentPair);

    if (newTVPair) dispatch(setCurrentToken(newTVPair));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken]);

  useEffect(() => {
    const newCurrentToChain = genCurrentChain({ toToken: originalToToken, currentToChain });

    if (toToken && originalToToken) {
      dispatch(setCurrentToChain(newCurrentToChain));
      dispatch(setCurrentToToken(originalToToken));
    }
  }, [originalToToken, toToken]);

  useEffect(() => {
    if (fromToken && originalFromToken) {
      dispatch(setCurrentFromToken(originalFromToken));
    }
  }, [originalFromToken, fromToken]);

  const fromAmountTokenBalance =
    fromTokenInfoData &&
    toAmount(fromAmountToken, originalFromToken?.decimals || fromTokenInfoData?.decimals || CW20_DECIMALS);

  const isAverageRatio = averageRatio && averageRatio.amount;
  const isSimulateDataDisplay = simulateData && simulateData.displayAmount;
  const minimumReceive =
    isAverageRatio && fromAmountTokenBalance
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
      ? new BigDecimal(simulateDisplayAmount)
          .mul(fromTokenFee)
          .add(new BigDecimal(simulateDisplayAmount).mul(toTokenFee).toString())
          .div(100)
          .toNumber()
      : 0;

  const minimumReceiveDisplay = isSimulateDataDisplay
    ? new BigDecimal(simulateDisplayAmount)
        .sub(new BigDecimal(simulateDisplayAmount).mul(userSlippage).div(100).toString())
        .sub(relayerFee)
        .sub(bridgeTokenFee)
        .toNumber()
    : 0;

  const expectOutputDisplay = isSimulateDataDisplay
    ? numberWithCommas(simulateData.displayAmount, undefined, { minimumFractionDigits: 6 })
    : 0;
  const estSwapFee = new BigDecimal(simulateDisplayAmount || 0).mul(fee || 0).toNumber();
  const totalFeeEst = new BigDecimal(bridgeTokenFee).add(relayerFee).add(estSwapFee).toNumber() || 0;

  const handleSubmit = async () => {
    if (fromAmountToken <= 0)
      return displayToast(TToastType.TX_FAILED, {
        message: 'From amount should be higher than 0!'
      });

    setSwapLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      // await handleCheckChainEvmWallet(originalFromToken.chainId);

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
      const alphaSmartRoutes = useAlphaSmartRouter && simulateData && simulateData?.routes;

      let initSwapData = {
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
        relayerFee: relayerFeeUniversal,
        alphaSmartRoutes
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
          isAlphaSmartRouter: useAlphaSmartRouter
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
          toNetwork: originalToToken.chainId
        };
        mixpanel.track('Universal Swap Oraidex', logEvent);
      }
    }
  };

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
        setInitAddressTransfer(address);
      }
    })();
  }, [
    originalToToken,
    oraiAddress,
    metamaskAddress,
    tronAddress,
    walletByNetworks.evm,
    walletByNetworks.cosmos,
    walletByNetworks.tron,
    window?.ethereumDapp,
    window?.tronWebDapp
  ]);

  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setIsSelectFrom(false);
    setIsSelectTo(false);
    setIsSelectChainFrom(false);
    setIsSelectChainTo(false);
  });

  const settingRef = useRef();
  const smartRouteRef = useRef();

  useOnClickOutside(settingRef, () => {
    setOpenSetting(false);
  });

  useOnClickOutside(smartRouteRef, () => {
    setOpenSmartRoute(false);
    setIndSmartRoute([0, 0]);
  });

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

  const unSupportSimulateToken = ['bnb', 'bep20_wbnb', 'eth'];

  const handleChangeToken = (token: TokenItemType, type) => {
    const isFrom = type === 'from';
    const setSelectChain = isFrom ? setSelectChainFrom : setSelectChainTo;
    const setIsSelect = isFrom ? setIsSelectFrom : setIsSelectTo;

    if (token.denom === (isFrom ? toTokenDenomSwap : fromTokenDenomSwap)) {
      setFromTokenDenom(toTokenDenomSwap);
      setToTokenDenom(fromTokenDenomSwap);
      setSelectChainFrom(selectChainTo);
      setSelectChainTo(selectChainFrom);

      handleUpdateQueryURL([toTokenDenomSwap, fromTokenDenomSwap]);
    } else {
      setFromTokenDenom(isFrom ? token.denom : fromTokenDenomSwap);
      setToTokenDenom(isFrom ? toTokenDenomSwap : token.denom);
      setSelectChain(token.chainId);
      handleUpdateQueryURL(isFrom ? [token.denom, toTokenDenomSwap] : [fromTokenDenomSwap, token.denom]);
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

  const isConnectedWallet =
    walletByNetworks.cosmos || walletByNetworks.bitcoin || walletByNetworks.evm || walletByNetworks.tron;

  let validAddress = {
    isValid: true
  };

  if (isConnectedWallet) validAddress = checkValidateAddressWithNetwork(addressTransfer, originalToToken?.chainId);

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

  const isImpactPrice = !!debouncedFromAmount && !!simulateData?.displayAmount && !!averageRatio?.amount;
  let impactWarning = 0;
  if (
    isImpactPrice &&
    simulateData?.displayAmount &&
    averageRatio?.displayAmount &&
    useAlphaSmartRouter &&
    averageSimulateData
  ) {
    const calculateImpactPrice = new BigDecimal(simulateData.displayAmount)
      .div(debouncedFromAmount)
      .div(averageSimulateData.displayAmount)
      .mul(100)
      .toNumber();

    if (calculateImpactPrice) impactWarning = 100 - calculateImpactPrice;
  }

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
                setIsSelectToken={setIsSelectFrom}
                selectChain={selectChainFrom}
                token={originalFromToken}
                amount={fromAmountToken}
                onChangeAmount={onChangeFromAmount}
                tokenFee={fromTokenFee}
                setCoe={setCoe}
                coe={coe}
                usdPrice={usdPriceShow}
              />
              {/* !fromToken && !toTokenFee mean that this is internal swap operation */}
              {!fromTokenFee && !toTokenFee && isWarningSlippage && (
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
              <img src={isLightMode ? SwitchLightImg : SwitchDarkImg} onClick={handleRotateSwapDirection} alt="ant" />
            </div>
            <div className={cx('swap-ai-dot')}>
              <AIRouteSwitch />
              <div
                className={cx(
                  'ratio',
                  isPreviousSimulate
                    ? ''
                    : Number(impactWarning) > 10
                    ? 'ratio-ten'
                    : Number(impactWarning) > 5 && 'ratio-five'
                )}
                onClick={() => isRoutersSwapData && setOpenRoutes(!openRoutes)}
              >
                <span className={cx('text')}>
                  {Number(impactWarning) > 5 && <WarningIcon />}
                  {`1 ${originalFromToken.name} ≈ ${
                    averageRatio
                      ? numberWithCommas(averageRatio.displayAmount / INIT_AMOUNT, undefined, {
                          maximumFractionDigits: 6
                        })
                      : averageSimulateData
                      ? numberWithCommas(averageSimulateData?.displayAmount / INIT_AMOUNT, undefined, {
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
                      Number(impactWarning) > 10
                        ? 'smart-router-price-impact-warning-ten'
                        : Number(impactWarning) > 5 && 'smart-router-price-impact-warning-five'
                    )}
                  >
                    <span>
                      {Number(impactWarning) > 5 && <WarningIcon />} ≈{' '}
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
                setIsSelectToken={setIsSelectTo}
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

      <div ref={ref}>
        <SelectToken
          setIsSelectToken={setIsSelectTo}
          amounts={amounts}
          prices={prices}
          handleChangeToken={(token) => {
            handleChangeToken(token, 'to');
          }}
          items={filteredToTokens}
          theme={theme}
          selectChain={selectChainTo}
          isSelectToken={isSelectTo}
        />
        <SelectToken
          setIsSelectToken={setIsSelectFrom}
          amounts={amounts}
          prices={prices}
          theme={theme}
          selectChain={selectChainFrom}
          items={filteredFromTokens}
          handleChangeToken={(token) => {
            handleChangeToken(token, 'from');
          }}
          isSelectToken={isSelectFrom}
        />
        <SelectChain
          filterChainId={unSupportSimulateToken.includes(originalFromToken?.denom) ? ['Oraichain'] : []}
          setIsSelectToken={setIsSelectChainTo}
          amounts={amounts}
          theme={theme}
          selectChain={selectChainTo}
          setSelectChain={(chain: NetworkChainId) => {
            setSelectChainTo(chain);
            setTokenDenomFromChain(chain, 'to');
          }}
          prices={prices}
          isSelectToken={isSelectChainTo}
        />
        <SelectChain
          setIsSelectToken={setIsSelectChainFrom}
          amounts={amounts}
          theme={theme}
          prices={prices}
          selectChain={selectChainFrom}
          setSelectChain={(chain: NetworkChainId) => {
            setSelectChainFrom(chain);
            setTokenDenomFromChain(chain, 'from');
          }}
          isSelectToken={isSelectChainFrom}
        />
      </div>

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
                if (!path) return;
                const { NetworkFromIcon, NetworkToIcon, assetList, pathChainId } = getPathInfo(
                  path,
                  chainIcons,
                  assets
                );
                return path.actions?.map((action, index, actions) => {
                  const { info, TokenInIcon, TokenOutIcon } = getTokenInfo(action, path, flattenTokens, assetList);
                  const tokenInChainId = path.chainId;
                  const tokenOutChainId = path.tokenOutChainId;
                  const hasTypeConvert = actions.find((act) => act.type === 'Convert');
                  const width = hasTypeConvert ? actions.length - 1 : actions.length;
                  if (action.type === 'Convert') return;
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
        simulatePrice={averageRatio ? Number((averageRatio.displayAmount / INIT_AMOUNT).toFixed(6)) : '0'}
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
