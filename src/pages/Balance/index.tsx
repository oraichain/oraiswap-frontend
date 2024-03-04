import { DeliverTxResponse, isDeliverTxFailure } from '@cosmjs/stargate';
import {
  KWT_SCAN,
  NetworkChainId,
  ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
  TokenItemType,
  findToTokenOnOraiBridge,
  toAmount,
  tronToEthAddress,
  CosmosChainId
} from '@oraichain/oraidex-common';
import { UniversalSwapHandler, isSupportedNoPoolSwapEvm, addOraiBridgeRoute } from '@oraichain/oraidex-universal-swap';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow.svg';
import { ReactComponent as ArrowDownIconLight } from 'assets/icons/arrow_light.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/reload.svg';
import classNames from 'classnames';
import CheckBox from 'components/CheckBox';
import LoadingBox from 'components/LoadingBox';
import SearchInput from 'components/SearchInput';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { cosmosTokens, tokens } from 'config/bridgeTokens';
import { chainInfos } from 'config/chainInfos';
import {
  getTransactionUrl,
  handleErrorMsg,
  handleCheckWallet,
  handleErrorTransaction,
  networks,
  EVM_CHAIN_ID,
  handleCheckAddress
} from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import Content from 'layouts/Content';
import Metamask from 'libs/metamask';
import { generateError, getTotalUsd, getUsd, initEthereum, toSumDisplay, toTotalDisplay } from 'libs/utils';
import isEqual from 'lodash/isEqual';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSubAmountDetails } from 'rest/api';
import { RootState } from 'store/configure';
import styles from './Balance.module.scss';
import KwtModal from './KwtModal';
import StuckOraib from './StuckOraib';
import useGetOraiBridgeBalances from './StuckOraib/useGetOraiBridgeBalances';
import TokenItem from './TokenItem';
import {
  convertKwt,
  convertTransferIBCErc20Kwt,
  findDefaultToToken,
  moveOraibToOraichain,
  transferIBCKwt,
  transferIbcCustom
} from './helpers';
import { useGetFeeConfig } from 'hooks/useTokenFee';
import useOnClickOutside from 'hooks/useOnClickOutside';
import * as Sentry from '@sentry/react';
import { SelectTokenModal } from 'components/Modals/SelectTokenModal';
import { useResetBalance } from 'components/ConnectWallet/useResetBalance';

interface BalanceProps {}

const Balance: React.FC<BalanceProps> = () => {
  // hook
  const [searchParams] = useSearchParams();
  let tokenUrl = searchParams.get('token');
  const navigate = useNavigate();
  const amounts = useSelector((state: RootState) => state.token.amounts);

  // state internal
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [isSelectNetwork, setIsSelectNetwork] = useState(false);
  const [, setTxHash] = useState('');
  const [[from, to], setTokenBridge] = useState<TokenItemType[]>([]);
  const [[otherChainTokens, oraichainTokens], setTokens] = useState<TokenItemType[][]>([[], []]);

  const [theme] = useConfigReducer('theme');
  const [oraiAddress] = useConfigReducer('address');
  const [hideOtherSmallAmount, setHideOtherSmallAmount] = useConfigReducer('hideOtherSmallAmount');
  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [filterNetworkUI, setFilterNetworkUI] = useConfigReducer('filterNetwork');
  const [tronAddress] = useConfigReducer('tronAddress');
  const ref = useRef(null);
  const { handleResetBalance } = useResetBalance();

  useOnClickOutside(ref, () => {
    setTokenBridge([undefined, undefined]);
  });

  // custom hooks
  const loadTokenAmounts = useLoadTokens();
  const { data: prices } = useCoinGeckoPrices();
  useGetFeeConfig();

  useEffect(() => {
    if (!tokenUrl) return setTokens(tokens);
    const _tokenUrl = tokenUrl.toUpperCase();
    setTokens(tokens.map((childTokens) => childTokens.filter((t) => t.name.includes(_tokenUrl))));
  }, [tokenUrl]);

  useEffect(() => {
    initEthereum().catch((error) => {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    setTokenBridge([undefined, undefined]);
  }, [filterNetworkUI]);

  const processTxResult = (rpc: string, result: DeliverTxResponse, customLink?: string) => {
    if (isDeliverTxFailure(result)) {
      displayToast(TToastType.TX_FAILED, {
        message: result.rawLog
      });
    } else {
      displayToast(TToastType.TX_SUCCESSFUL, {
        customLink: customLink ?? `${rpc}/tx?hash=0x${result.transactionHash}`
      });
    }
    setTxHash(result.transactionHash);
  };

  const onClickToken = useCallback(
    (token: TokenItemType) => {
      if (isEqual(from, token)) {
        setTokenBridge([undefined, undefined]);
        return;
      }
      const toToken = findDefaultToToken(token);
      setTokenBridge([token, toToken]);
    },
    [otherChainTokens, oraichainTokens, from, to]
  );

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

  const handleTransferIBC = async (fromToken: TokenItemType, toToken: TokenItemType, transferAmount: number) => {
    let transferAddress = metamaskAddress;
    // check tron network and convert address
    if (toToken.prefix === ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX) {
      transferAddress = tronToEthAddress(tronAddress);
    }
    const result = await transferIbcCustom(fromToken, toToken, transferAmount, amounts, transferAddress);
    processTxResult(fromToken.rpc, result);
  };

  const onClickTransfer = async (
    fromAmount: number,
    from: TokenItemType,
    to: TokenItemType,
    toNetworkChainId?: NetworkChainId
  ) => {
    await handleCheckWallet();
    // disable send amount < 0
    if (!from || !to) {
      displayToast(TToastType.TX_FAILED, {
        message: 'Please choose both from and to tokens'
      });
      return;
    }

    // get & check balance
    const initFromBalance = amounts[from.denom];
    const subAmounts = getSubAmountDetails(amounts, from);
    const subAmount = toAmount(toSumDisplay(subAmounts), from.decimals);
    const fromBalance = from && initFromBalance ? subAmount + BigInt(initFromBalance) : BigInt(0);
    if (fromAmount <= 0 || toAmount(fromAmount, from.decimals) > fromBalance) {
      displayToast(TToastType.TX_FAILED, {
        message: 'Your balance is insufficient to make this transfer'
      });
      return;
    }

    displayToast(TToastType.TX_BROADCASTING);
    try {
      let result: DeliverTxResponse | string | any;

      // [(ERC20)KWT, (ERC20)MILKY] ==> ORAICHAIN
      if (from.chainId === 'kawaii_6886-1' && to.chainId === 'Oraichain') {
        // convert erc20 to native ==> ORAICHAIN
        if (from.contractAddress) result = await convertTransferIBCErc20Kwt(from, to, fromAmount);
        else result = await transferIBCKwt(from, to, fromAmount, amounts);
        processTxResult(from.rpc, result, `${KWT_SCAN}/tx/${result.transactionHash}`);
        return;
      }

      let newToToken = to;
      if (toNetworkChainId) {
        // ORAICHAIN -> EVM (BSC/ETH/TRON) ( TO: TOKEN ORAIBRIDGE)
        newToToken = findToTokenOnOraiBridge(from.coinGeckoId, toNetworkChainId);

        const isBridgeToCosmosNetwork = !EVM_CHAIN_ID.includes(toNetworkChainId);
        if (isBridgeToCosmosNetwork) {
          newToToken = cosmosTokens.find((t) => t.chainId === toNetworkChainId && t.coinGeckoId === from.coinGeckoId);
        }
        if (!newToToken) throw generateError('Cannot find newToToken token that matches from token to bridge!');
      }

      if (newToToken.coinGeckoId !== from.coinGeckoId)
        throw generateError(`From token ${from.coinGeckoId} is different from to token ${newToToken.coinGeckoId}`);

      // TODO: hardcode check case USDC oraichain -> USDC noble
      const isToNobleChain = toNetworkChainId === 'noble-1';
      if (from.cosmosBased && !isToNobleChain) {
        return await handleTransferIBC(from, newToToken, fromAmount);
      }

      // remaining tokens, we override from & to of onClickTransfer on index.tsx of Balance based on the user's token destination choice
      // to is Oraibridge tokens
      // or other token that have same coingeckoId that show in at least 2 chain.
      const cosmosAddress = await handleCheckAddress(from.cosmosBased ? (from.chainId as CosmosChainId) : 'Oraichain');

      const isFromEvmNotTron = from.chainId !== '0x2b6653dc' && EVM_CHAIN_ID.includes(from.chainId);
      const isToNetworkEvmNotTron = toNetworkChainId !== '0x2b6653dc' && EVM_CHAIN_ID.includes(toNetworkChainId);
      // switch network for metamask, exclude TRON
      if (isFromEvmNotTron) {
        await window.Metamask.switchNetwork(from.chainId);
      }

      let latestEvmAddress = metamaskAddress;
      // TODO: need to get latest tron address if cached
      if (isFromEvmNotTron || isToNetworkEvmNotTron) {
        latestEvmAddress = await window.Metamask.getEthAddress();
      }

      const universalSwapHandler = new UniversalSwapHandler(
        {
          sender: { cosmos: cosmosAddress, evm: latestEvmAddress, tron: tronAddress },
          originalFromToken: from,
          originalToToken: newToToken,
          fromAmount,
          simulateAmount: toAmount(fromAmount, newToToken.decimals).toString()
        },
        { cosmosWallet: window.Keplr, evmWallet: new Metamask(window.tronWeb) }
      );

      const { swapRoute } = addOraiBridgeRoute(cosmosAddress, from, newToToken);
      // TODO: processUniversalSwap can lead to error when bridge INJ (sdk block injective network),
      // so we use this func just for Noble, and handleTransferIBC for other.
      if (isToNobleChain) result = await universalSwapHandler.processUniversalSwap(); // Oraichain -> Noble
      else result = await universalSwapHandler.transferEvmToIBC(swapRoute); // EVM -> Oraichain

      processTxResult(from.rpc, result, getTransactionUrl(from.chainId, result.transactionHash));
    } catch (ex) {
      handleErrorTransaction(ex, {
        tokenName: from.name,
        chainName: toNetworkChainId
      });
      // Add log sentry Oraichain -> Noble-1
      if (from.chainId === 'Oraichain' && toNetworkChainId === 'noble-1') {
        const errorMsg = handleErrorMsg(ex);
        Sentry.captureException(
          `${from.chainId} to ${toNetworkChainId}: ${fromAmount} ${from.denom} - ${oraiAddress} - ${errorMsg}`
        );
      }
    }
  };

  const getFilterTokens = (chainId: string | number): TokenItemType[] => {
    return [...otherChainTokens, ...oraichainTokens]
      .filter((token) => {
        // not display because it is evm map and no bridge to option, also no smart contract and is ibc native
        if (!token.bridgeTo && !token.contractAddress) return false;
        if (hideOtherSmallAmount && !toTotalDisplay(amounts, token)) {
          return false;
        }
        if (isSupportedNoPoolSwapEvm(token.coinGeckoId)) return false;
        return token.chainId === chainId;
      })
      .sort((a, b) => {
        return toTotalDisplay(amounts, b) * prices[b.coinGeckoId] - toTotalDisplay(amounts, a) * prices[a.coinGeckoId];
      });
  };

  const totalUsd = getTotalUsd(amounts, prices);

  // Move oraib2oraichain
  const [moveOraib2OraiLoading, setMoveOraib2OraiLoading] = useState(false);
  const { remainingOraib } = useGetOraiBridgeBalances(moveOraib2OraiLoading, oraiAddress);
  const handleMoveOraib2Orai = async () => {
    try {
      setMoveOraib2OraiLoading(true);
      const result = await moveOraibToOraichain(remainingOraib, oraiAddress);
      processTxResult(chainInfos.find((c) => c.chainId === 'oraibridge-subnet-2').rpc, result);
    } catch (error) {
      console.log('error move stuck oraib: ', error);
      displayToast(TToastType.TX_FAILED, {
        message: error.message
      });
    } finally {
      setMoveOraib2OraiLoading(false);
    }
  };

  const network = networks.find((n) => n.chainId === filterNetworkUI) ?? networks[0];
  return (
    <Content nonBackground>
      <div className={styles.wrapper}>
        {/* Show popup that let user move stuck assets Oraibridge to Oraichain */}
        <StuckOraib remainingOraib={remainingOraib} handleMove={handleMoveOraib2Orai} loading={moveOraib2OraiLoading} />
        <div className={styles.header}>
          <div className={styles.asset}>
            <span className={styles.totalAssets}>Total Assets</span>
            <TokenBalance balance={totalUsd} className={classNames(styles.balance, styles[theme])} decimalScale={2} />
          </div>
        </div>
        <div className={classNames(styles.divider, styles[theme])} />
        <div className={styles.action}>
          <div className={styles.search}>
            <div className={classNames(styles.search_filter, styles[theme])} onClick={() => setIsSelectNetwork(true)}>
              <div className={styles.search_box}>
                {network && (
                  <div className={styles.search_flex}>
                    <div className={styles.search_logo}>
                      {theme === 'light' ? (
                        network.IconLight ? (
                          <network.IconLight />
                        ) : (
                          <network.Icon />
                        )
                      ) : (
                        <network.Icon />
                      )}
                    </div>
                    <span className={classNames(styles.search_text, styles[theme])}>{network.chainName}</span>
                  </div>
                )}
                <div>{theme === 'light' ? <ArrowDownIconLight /> : <ArrowDownIcon />}</div>
              </div>
            </div>

            <SearchInput
              placeholder="Search Token"
              onSearch={(text) => {
                if (!text) return navigate('');
                navigate(`?token=${text}`);
              }}
              theme={theme}
            />
          </div>
        </div>
        <div className={styles.balances}>
          <div className={classNames(styles.box, styles[theme])}>
            <div>
              <CheckBox label="Hide small balances" checked={hideOtherSmallAmount} onCheck={setHideOtherSmallAmount} />
            </div>
            <div className={styles.refresh} onClick={refreshBalances}>
              <span>Refresh balances</span>
              <RefreshIcon />
            </div>
          </div>
        </div>
        <br />
        <LoadingBox loading={loadingRefresh}>
          <div className={styles.tokens}>
            <div className={styles.tokens_form} ref={ref}>
              {getFilterTokens(filterNetworkUI).map((t: TokenItemType) => {
                // check balance cw20
                let amount = BigInt(amounts[t.denom] ?? 0);
                let usd = getUsd(amount, t, prices);
                let subAmounts: AmountDetails;
                if (t.contractAddress && t.evmDenoms) {
                  subAmounts = getSubAmountDetails(amounts, t);
                  const subAmount = toAmount(toSumDisplay(subAmounts), t.decimals);
                  amount += subAmount;
                  usd += getUsd(subAmount, t, prices);
                }
                return (
                  <TokenItem
                    className={classNames(styles.tokens_element, styles[theme])}
                    key={t.denom}
                    amountDetail={{ amount: amount.toString(), usd }}
                    subAmounts={subAmounts}
                    active={from?.denom === t.denom}
                    token={t}
                    theme={theme}
                    onClick={() => {
                      if (t.denom !== from?.denom) {
                        onClickToken(t);
                      }
                    }}
                    onClickTransfer={async (fromAmount: number, filterNetwork?: NetworkChainId) => {
                      await onClickTransfer(fromAmount, from, to, filterNetwork);
                    }}
                    convertKwt={async (transferAmount: number, fromToken: TokenItemType) => {
                      try {
                        const result = await convertKwt(transferAmount, fromToken);
                        processTxResult(from.rpc, result, getTransactionUrl(from.chainId, result.transactionHash));
                      } catch (ex) {
                        displayToast(TToastType.TX_FAILED, {
                          message: ex.message
                        });
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        </LoadingBox>
        {tokenUrl === 'kwt' && <KwtModal />}
        <SelectTokenModal
          isOpen={isSelectNetwork}
          open={() => setIsSelectNetwork(true)}
          close={() => setIsSelectNetwork(false)}
          prices={prices}
          amounts={amounts}
          type="network"
          items={networks}
          setToken={(chainId) => {
            setFilterNetworkUI(chainId);
          }}
        />
      </div>
    </Content>
  );
};

export default Balance;
