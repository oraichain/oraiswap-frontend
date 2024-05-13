import {
  BigDecimal,
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
  toDisplay,
  parseTokenInfoRawDenom
} from '@oraichain/oraidex-common';
import { OraiswapRouterQueryClient } from '@oraichain/oraidex-contracts-sdk';
import { UniversalSwapHandler, UniversalSwapHelper } from '@oraichain/oraidex-universal-swap';
import { useQuery } from '@tanstack/react-query';
import { isMobile } from '@walletconnect/browser-utils';
import ArrowImg from 'assets/icons/arrow_new.svg';
import { ReactComponent as SendIcon } from 'assets/icons/send.svg';
import { ReactComponent as FeeIcon } from 'assets/icons/fee.svg';
import { ReactComponent as SendDarkIcon } from 'assets/icons/send_dark.svg';
import { ReactComponent as FeeDarkIcon } from 'assets/icons/fee_dark.svg';
import { ReactComponent as BookIcon } from 'assets/icons/book_icon.svg';
import { ReactComponent as IconOirSettings } from 'assets/icons/iconoir_settings.svg';
import SwitchLightImg from 'assets/icons/switch-new-light.svg';
import SwitchDarkImg from 'assets/icons/switch-new.svg';
import { ReactComponent as RefreshImg } from 'assets/images/refresh.svg';
import { ReactComponent as ObridgeDarkImg } from 'assets/icons/obridge_full_dark.svg';
import { ReactComponent as ObridgeLightImg } from 'assets/icons/obridge_full_light.svg';
import cn from 'classnames/bind';
import Loader from 'components/Loader';
import LoadingBox from 'components/LoadingBox';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { flattenTokens, tokenMap } from 'config/bridgeTokens';
import { chainInfosWithIcon } from 'config/chainInfos';
import { ethers } from 'ethers';
import {
  floatToPercent,
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
  generateNewSymbol,
  generateNewSymbolV2,
  getDisableSwap,
  getFromToToken,
  getRemoteDenom,
  getTokenBalance,
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
import { SlippageModal, TooltipIcon } from '../Modals';
import { SwapDirection, checkEvmAddress, filterNonPoolEvmTokens, getSwapType } from '../helpers';
import AddressBook from './components/AddressBook';
import InputCommon from './components/InputCommon';
import InputSwap from './components/InputSwap/InputSwap';
import SelectChain from './components/SelectChain/SelectChain';
import SelectToken from './components/SelectToken/SelectToken';
import { useGetTransHistory, useSimulate } from './hooks';
import { useFillToken } from './hooks/useFillToken';
import { useGetPriceByUSD } from './hooks/useGetPriceByUSD';
import { useSwapFee } from './hooks/useSwapFee';
import styles from './index.module.scss';
import SwapDetail from './components/SwapDetail';
import useFilteredTokens from './hooks/useFilteredTokens';

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

  const [fromTokenDenomSwap, setFromTokenDenom] = useState(fromTokenDenom);
  const [toTokenDenomSwap, setToTokenDenom] = useState(toTokenDenom);

  // get token on oraichain to simulate swap amount.
  const originalFromToken = tokenMap[fromTokenDenomSwap];
  const originalToToken = tokenMap[toTokenDenomSwap];

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

  const { data: prices } = useCoinGeckoPrices();

  const [openSetting, setOpenSetting] = useState(false);
  const [userSlippage, setUserSlippage] = useState(DEFAULT_SLIPPAGE);
  const [coe, setCoe] = useState(0);
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

  const isFromBTC = originalFromToken.coinGeckoId === 'bitcoin';
  const INIT_SIMULATE_NOUGHT_POINT_OH_ONE_AMOUNT = 0.00001;
  let INIT_AMOUNT = 1;
  if (isFromBTC) INIT_AMOUNT = INIT_SIMULATE_NOUGHT_POINT_OH_ONE_AMOUNT;

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

  const { price } = useGetPriceByUSD({
    denom: originalFromToken.denom,
    contractAddress: originalFromToken.contractAddress,
    cachePrices: prices
  });

  const routerClient = new OraiswapRouterQueryClient(window.client, network.router);
  const { simulateData, setSwapAmount, fromAmountToken, toAmountToken } = useSimulate(
    'simulate-data',
    fromTokenInfoData,
    toTokenInfoData,
    originalFromToken,
    originalToToken,
    routerClient
  );

  const { simulateData: averageRatio } = useSimulate(
    'simulate-average-data',
    fromTokenInfoData,
    toTokenInfoData,
    originalFromToken,
    originalToToken,
    routerClient,
    INIT_AMOUNT
  );

  let usdPriceShow = ((price || prices?.[originalFromToken?.coinGeckoId]) * fromAmountToken).toFixed(6);
  if (!Number(usdPriceShow)) {
    usdPriceShow = (prices?.[originalToToken?.coinGeckoId] * simulateData?.displayAmount).toFixed(6);
  }

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
      const checkExistedToken = isFrom
        ? flattenTokens.find(
            (flat) => flat?.coinGeckoId === originalFromToken?.coinGeckoId && flat?.chainId === selectChainTo
          )
        : flattenTokens.find(
            (flat) => flat?.coinGeckoId === originalToToken?.coinGeckoId && flat?.chainId === selectChainFrom
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
    // const newTVPair = generateNewSymbol(fromToken, toToken, currentPair);
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

  const estSwapFee = new BigDecimal(simulateDisplayAmount || 0).mul(fee || 0).toNumber();

  const totalFeeEst =
    new BigDecimal(bridgeTokenFee || 0)
      .add(relayerFee || 0)
      .add(estSwapFee)
      .toNumber() || 0;

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

      const initSwapData = {
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
      };

      const compileSwapData = isCustomRecipient
        ? {
            ...initSwapData,
            recipientAddress: addressTransfer
          }
        : initSwapData;

      const univeralSwapHandler = new UniversalSwapHandler(compileSwapData, {
        cosmosWallet: window.Keplr,
        evmWallet: new Metamask(window.tronWebDapp)
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

  const FromIcon = theme === 'light' ? originalFromToken.IconLight || originalFromToken.Icon : originalFromToken.Icon;
  const ToIcon = theme === 'light' ? originalToToken.IconLight || originalToToken.Icon : originalToToken.Icon;
  const fromNetwork = chainInfosWithIcon.find((chain) => chain.chainId === originalFromToken.chainId);
  const toNetwork = chainInfosWithIcon.find((chain) => chain.chainId === originalToToken.chainId);
  const FromIconNetwork = theme === 'light' ? fromNetwork.IconLight || fromNetwork.Icon : fromNetwork.Icon;
  const ToIconNetwork = theme === 'light' ? toNetwork.IconLight || toNetwork.Icon : toNetwork.Icon;

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

  const validAddress =
    !(walletByNetworks.cosmos || walletByNetworks.bitcoin || walletByNetworks.evm || walletByNetworks.tron) &&
    !isMobile()
      ? {
          isValid: true
        }
      : checkValidateAddressWithNetwork(addressTransfer, originalToToken?.chainId);

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
                Icon={FromIcon}
                theme={theme}
                onChangePercentAmount={onChangePercentAmount}
                setIsSelectChain={setIsSelectChainFrom}
                setIsSelectToken={setIsSelectFrom}
                selectChain={selectChainFrom}
                token={originalFromToken}
                IconNetwork={FromIconNetwork}
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
                  <div className={cx('title')}>
                    <span>Current slippage exceed configuration!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={cx('swap-center')}>
            <div className={cx('title')}>To</div>
            <div className={cx('wrap-img')} onClick={handleRotateSwapDirection}>
              <img
                src={theme === 'light' ? SwitchLightImg : SwitchDarkImg}
                onClick={handleRotateSwapDirection}
                alt="ant"
              />
            </div>
            <div className={cx('ratio')} onClick={() => setOpenDetail(true)}>
              {`1 ${originalFromToken.name} ≈ ${
                averageRatio ? Number((averageRatio.displayAmount / INIT_AMOUNT).toFixed(6)) : '0'
              } ${originalToToken.name}`}

              {/* <img src={ArrowImg} alt="arrow" /> */}
            </div>
          </div>
          <div className={cx('to')}>
            <div className={cx('input-wrapper')}>
              <InputSwap
                type={'to'}
                balance={toTokenBalance}
                theme={theme}
                originalToken={originalToToken}
                disable={true}
                Icon={ToIcon}
                selectChain={selectChainTo}
                setIsSelectChain={setIsSelectChainTo}
                setIsSelectToken={setIsSelectTo}
                token={originalToToken}
                amount={toAmountToken}
                tokenFee={toTokenFee}
                IconNetwork={ToIconNetwork}
                usdPrice={usdPriceShow}
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
              prefix={theme === 'light' ? <SendIcon /> : <SendDarkIcon />}
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
              {theme === 'light' ? <FeeIcon /> : <FeeDarkIcon />}
              Estimated Fee:
            </div>
            <div className={cx('info')}>
              <span className={cx('value')}>
                ≈ {numberWithCommas(totalFeeEst, undefined, { maximumFractionDigits: 6 })} {originalToToken.name}
              </span>
              <span className={cx('icon')}>
                <img src={ArrowImg} alt="arrow" />
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
              simulateData
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
          <div className={styles.powered}>
            <div>Powered by</div>
            {theme === 'light' ? <ObridgeDarkImg /> : <ObridgeLightImg />}
          </div>
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
        className={cx('overlay', openSetting ? 'activeOverlay' : '')}
        onClick={() => {
          setOpenSetting(false);
        }}
      />
      <div className={cx('setting', openSetting ? 'activeSetting' : '')}>
        <SlippageModal
          setVisible={setOpenSetting}
          setUserSlippage={setUserSlippage}
          userSlippage={userSlippage}
          isBotomSheet
        />
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
        openSlippage={() => setOpenSetting(true)}
      />
    </div>
  );
};

export default SwapComponent;
