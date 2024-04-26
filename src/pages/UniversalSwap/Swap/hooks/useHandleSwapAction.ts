import { mixpanel } from 'mixpanel-browser';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { ethers } from 'ethers';
import { getSpecialCoingecko, getTransactionUrl, handleCheckAddress, handleErrorTransaction } from 'helper';
import useConfigReducer from 'hooks/useConfigReducer';
import { checkEvmAddress, getFromToToken, getSwapType, getTokenBalance } from 'pages/UniversalSwap/helpers';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { flattenTokens, tokenMap } from 'config/bridgeTokens';
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
import { SimulateResponse, UniversalSwapHandler, UniversalSwapHelper } from '@oraichain/oraidex-universal-swap';
import Metamask from 'libs/metamask';
import useLoadTokens from 'hooks/useLoadTokens';
import { getUsd, toSubAmount } from 'libs/utils';
import { useGetTransHistory } from './useGetTransHistory';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { useFillToken } from './useFillToken';
import { calcMaxAmount } from 'pages/Balance/helpers';

// TODO: hardcode decimal relayerFee
export const RELAYER_DECIMAL = 6;

const useHandleSwapAction = ({
  fromToken,
  toToken,
  fromAmountToken,
  toAmountToken,
  relayerFeeToken,
  customRecipient,
  simulateData,
  averageRatio,
  userSlippage,
  fromAmountTokenBalance,

  fromTokenDenomSwap,
  toTokenDenomSwap,
  originalFromToken,
  originalToToken,
  initAmountSimulate,

  setSwapTokens,
  setSwapAmount,
  setFromTokenDenom,
  setToTokenDenom
}: {
  fromToken: TokenItemType;
  toToken: TokenItemType;
  fromAmountToken: number;
  toAmountToken: number;
  relayerFeeToken: bigint;
  customRecipient: string;
  simulateData: SimulateResponse;
  averageRatio: SimulateResponse;
  userSlippage: number;
  fromAmountTokenBalance: bigint;

  fromTokenDenomSwap: string;
  toTokenDenomSwap: string;
  originalFromToken: TokenItemType;
  originalToToken: TokenItemType;
  initAmountSimulate: number;

  setFromTokenDenom: React.Dispatch<React.SetStateAction<string>>;
  setToTokenDenom: React.Dispatch<React.SetStateAction<string>>;

  setSwapTokens: (denoms: [string, string]) => void;
  setSwapAmount: React.Dispatch<React.SetStateAction<[number, number]>>;
}) => {
  const { data: prices } = useCoinGeckoPrices();
  const loadTokenAmounts = useLoadTokens();
  const { refetchTransHistory } = useGetTransHistory();
  const { handleUpdateQueryURL } = useFillToken(setSwapTokens);
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress] = useConfigReducer('tronAddress');
  const [oraiAddress] = useConfigReducer('address');
  const amounts = useSelector((state: RootState) => state.token.amounts);

  const [swapLoading, setSwapLoading] = useState(false);
  const [coe, setCoe] = useState(0);

  const [selectChainFrom, setSelectChainFrom] = useState(originalFromToken.chainId);
  const [selectChainTo, setSelectChainTo] = useState(originalToToken.chainId);

  const subAmountFrom = toSubAmount(amounts, originalFromToken);
  const subAmountTo = toSubAmount(amounts, originalToToken);

  const fromTokenBalance = getTokenBalance(originalFromToken, amounts, subAmountFrom);
  const toTokenBalance = getTokenBalance(originalToToken, amounts, subAmountTo);

  const [isSelectFrom, setIsSelectFrom] = useState(false);
  const [isSelectTo, setIsSelectTo] = useState(false);

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

      const initSwapData = {
        sender: { cosmos: cosmosAddress, evm: checksumMetamaskAddress, tron: tronAddress },
        originalFromToken,
        originalToToken,
        fromAmount: fromAmountToken,
        simulateAmount,
        userSlippage,
        amounts: amountsBalance,
        simulatePrice: averageRatio?.amount && new BigDecimal(averageRatio.amount).div(initAmountSimulate).toString(),
        relayerFee: relayerFeeUniversal
      };

      const compileSwapData = !!customRecipient
        ? {
            ...initSwapData,
            recipientAddress: customRecipient
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

  return {
    swapLoading,
    fromTokenDenomSwap,
    toTokenDenomSwap,
    originalFromToken,
    originalToToken,
    selectChainFrom,
    selectChainTo,
    subAmountFrom,
    subAmountTo,
    fromTokenBalance,
    toTokenBalance,
    isSelectFrom,
    isSelectTo,
    coe,

    setCoe,
    setIsSelectFrom,
    setIsSelectTo,
    setSelectChainTo,
    setSelectChainFrom,
    handleSubmit,
    handleRotateSwapDirection,
    handleChangeToken,
    onChangeFromAmount,
    onChangePercent,
    onChangePercentAmount,
    setTokenDenomFromChain
  };
};

export default useHandleSwapAction;
