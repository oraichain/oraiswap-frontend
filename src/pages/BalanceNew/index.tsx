import {
  coin,
  DeliverTxResponse, isDeliverTxFailure
} from '@cosmjs/stargate';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/reload.svg';
import CheckBox from 'components/CheckBox';
import LoadingBox from 'components/LoadingBox';
import SearchInput from 'components/SearchInput';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { kawaiiTokens, TokenItemType, tokens } from 'config/bridgeTokens';
import {
  BSC_SCAN,
  ETHEREUM_SCAN,
  KWT_SCAN,
  KWT_SUBNETWORK_CHAIN_ID, ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID
} from 'config/constants';
import { ibcInfos, ibcInfosOld, oraichain2oraib } from 'config/ibcInfos';
import { network } from 'config/networks';
import { handleCheckWallet, networks, renderLogoNetwork } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useInactiveListener } from 'hooks/useMetamask';
import Content from 'layouts/Content';
import { CacheTokens } from 'libs/token';
import {
  getTotalUsd,
  getUsd,
  parseBep20Erc20Name,
  toAmount,
  toDisplay,
  toSumDisplay,
  toTotalDisplay
} from 'libs/utils';
import isEqual from 'lodash/isEqual';
import SelectTokenModal from 'pages/SwapV2/Modals/SelectTokenModal';
import { initEthereum } from 'polyfill';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getSubAmountDetails,
} from 'rest/api';
import { RootState } from 'store/configure';
import { IBCInfo } from 'types/ibc';
import styles from './Balance.module.scss';
import { broadcastConvertTokenTx, convertKwt, convertTransferIBCErc20Kwt, findDefaultToToken, transferEvmToIBC, transferIBC, transferIBCKwt, transferTokenErc20Cw20Map, transferToRemoteChainIbcWasm } from './helpers';
import KwtModal from './KwtModal';
import StuckOraib from './StuckOraib';
import useGetOraiBridgeBalances from './StuckOraib/useGetOraiBridgeBalances';
import TokenItem from './TokenItem';

interface BalanceProps { }

const BalanceNew: React.FC<BalanceProps> = () => {
  const [searchParams] = useSearchParams();
  let tokenUrl = searchParams.get('token');
  const [keplrAddress] = useConfigReducer('address');
  const [from, setFrom] = useState<TokenItemType>();
  const [to, setTo] = useState<TokenItemType>();
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [filterNetwork, setFilterNetwork] = useConfigReducer('filterNetwork');
  const [isSelectNetwork, setIsSelectNetwork] = useState(false);
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [hideOtherSmallAmount, setHideOtherSmallAmount] = useConfigReducer('hideOtherSmallAmount');

  const [[fromTokens, toTokens], setTokens] = useState<TokenItemType[][]>([[], []]);
  const [txHash, setTxHash] = useState('');
  const dispatch = useDispatch();

  const { data: prices } = useCoinGeckoPrices();

  const [metamaskAddress] = useConfigReducer('metamaskAddress');

  useInactiveListener();

  useEffect(() => {
    if (!tokenUrl) return setTokens(tokens);
    const _tokenUrl = tokenUrl.toUpperCase();
    setTokens(tokens.map((childTokens) => childTokens.filter((t) => t.name.includes(_tokenUrl))));
  }, [tokenUrl]);

  useEffect(() => {
    _initEthereum();
  }, []);

  const cacheTokens = useMemo(() => CacheTokens.factory({ dispatch, address: keplrAddress }), [dispatch, keplrAddress]);

  useEffect(() => {
    if (keplrAddress) cacheTokens.loadTokenAmounts();
  }, [keplrAddress]);

  useEffect(() => {
    if (metamaskAddress) cacheTokens.loadTokenAmounts(true, metamaskAddress, false);
  }, [metamaskAddress]);

  const _initEthereum = async () => {
    try {
      await initEthereum();
    } catch (error) {
      console.log(error);
    }
  };

  const processTxResult = (token: TokenItemType, result: DeliverTxResponse, customLink?: string) => {
    if (isDeliverTxFailure(result)) {
      displayToast(TToastType.TX_FAILED, {
        message: result.rawLog
      });
    } else {
      displayToast(TToastType.TX_SUCCESSFUL, {
        customLink: customLink || `${token.rpc}/tx?hash=0x${result.transactionHash}`
      });
    }
    setTxHash(result.transactionHash);
  };

  const onClickToken = useCallback(
    (type: string, token: TokenItemType) => {
      if (type === 'to') {
        if (isEqual(to, token)) {
          setTo(undefined);
        } else setTo(token);
      } else {
        if (isEqual(from, token)) {
          setFrom(undefined);
          setTo(undefined);
        } else {
          setFrom(token);
          const toToken = findDefaultToToken(toTokens, token);
          setTo(toToken);
        }
      }
    },
    [toTokens, from, to]
  );

  const onClickTokenFrom = useCallback(
    (token: TokenItemType) => {
      onClickToken('from', token);
    },
    [onClickToken]
  );

  const onClickTokenTo = useCallback(
    (token: TokenItemType) => {
      onClickToken('to', token);
    },
    [onClickToken]
  );

  // Oraichain (Orai)
  const transferIbcCustom = async (fromToken: TokenItemType, toToken: TokenItemType, transferAmount: number) => {
    try {
      if (transferAmount === 0) throw new Error('Transfer amount is empty');
      await handleCheckWallet();

      await window.Keplr.suggestChain(toToken.chainId as string);
      // enable from to send transaction
      await window.Keplr.suggestChain(fromToken.chainId as string);
      // check address
      const fromAddress = await window.Keplr.getKeplrAddr(fromToken.chainId as string);
      const toAddress = await window.Keplr.getKeplrAddr(toToken.chainId as string);
      if (!fromAddress || !toAddress) {
        displayToast(TToastType.TX_FAILED, {
          message: 'Please login keplr!'
        });
        return;
      }

      if (toToken.chainId === ORAI_BRIDGE_CHAIN_ID && !toToken.prefix) {
        displayToast(TToastType.TX_FAILED, {
          message: 'Prefix Token not found!'
        });
        return;
      }

      let amount = coin(toAmount(transferAmount, fromToken.decimals).toString(), fromToken.denom);
      const ibcMemo = toToken.chainId === ORAI_BRIDGE_CHAIN_ID ? toToken.prefix + metamaskAddress : '';
      let ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];
      // only allow transferring back to ethereum / bsc only if there's metamask address and when the metamask address is used, which is in the ibcMemo variable
      if (!metamaskAddress && (fromToken.evmDenoms || ibcInfo.channel === oraichain2oraib)) {
        displayToast(TToastType.TX_FAILED, {
          message: 'Please login metamask!'
        });
        return;
      }
      // for KWT & MILKY tokens, we use the old ibc info channel
      if (fromToken.evmDenoms || kawaiiTokens.find(i => i.name === fromToken.name))
        ibcInfo = ibcInfosOld[fromToken.chainId][toToken.chainId];
      if (fromToken.evmDenoms) {
        const result = await transferTokenErc20Cw20Map({
          amounts,
          transferAmount,
          fromToken,
          fromAddress,
          toAddress,
          ibcInfo,
          ibcMemo
        });
        processTxResult(fromToken, result, `${network.explorer}/txs/${result.transactionHash}`);
        return;
      }
      // if it includes wasm in source => ibc wasm case
      if (ibcInfo.channel === oraichain2oraib) {
        const result = await transferToRemoteChainIbcWasm(ibcInfo, fromToken, toToken, toAddress, amount.amount, ibcMemo);
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        setTxHash(result.transactionHash);
        return;
      }
      const result = await transferIBC({
        fromToken,
        fromAddress,
        toAddress,
        amount,
        ibcInfo
      });
      processTxResult(fromToken, result);
    } catch (ex: any) {
      displayToast(TToastType.TX_FAILED, {
        message: ex.message
      });
    }
  };

  const refreshBalances = async () => {
    try {
      if (loadingRefresh) return;
      setLoadingRefresh(true);
      await cacheTokens.loadTokenAmounts(true, metamaskAddress);
      setLoadingRefresh(false);
    } catch (err) {
      setLoadingRefresh(false);
    }
  };

  const onClickTransfer = async (fromAmount: number, from: TokenItemType, to: TokenItemType) => {
    // disable send amount < 0
    if (!from || !to) {
      displayToast(TToastType.TX_FAILED, {
        message: 'Please choose both from and to tokens'
      });
      return;
    }
    const tokenAmount = amounts[from.denom];
    const subAmounts = getSubAmountDetails(amounts, from);
    const subAmount = toAmount(toSumDisplay(subAmounts), from.decimals);
    const fromBalance = from && tokenAmount ? subAmount + BigInt(tokenAmount) : BigInt(0);
    if (fromAmount <= 0 || toAmount(fromAmount, from.decimals) > fromBalance) {
      displayToast(TToastType.TX_FAILED, {
        message: 'Your balance is insufficient to make this transfer'
      });
      return;
    }
    displayToast(TToastType.TX_BROADCASTING);

    try {
      let result: DeliverTxResponse;
      if (from.chainId === KWT_SUBNETWORK_CHAIN_ID && to.chainId === ORAICHAIN_ID && !!from.contractAddress) {
        result = await convertTransferIBCErc20Kwt(from, to, fromAmount);
        processTxResult(from, result, `${KWT_SCAN}/tx/${result.transactionHash}`);
        return;
      }
      if (from.chainId === KWT_SUBNETWORK_CHAIN_ID && to.chainId === ORAICHAIN_ID) {
        result = await transferIBCKwt(from, to, fromAmount, amounts);
        processTxResult(from, result, `${KWT_SCAN}/tx/${result.transactionHash}`);
        return;
      }
      if (from.cosmosBased) {
        return await transferIbcCustom(from, to, fromAmount);
      }
      result = await transferEvmToIBC(from, metamaskAddress, fromAmount);
      processTxResult(
        from,
        result,
        window.Metamask.isEth() // TODO: need to merge this with the dynamic chain id check update
          ? `${ETHEREUM_SCAN}/tx/${result?.transactionHash}`
          : `${BSC_SCAN}/tx/${result?.transactionHash}`
      );
    } catch (ex) {
      displayToast(TToastType.TX_FAILED, {
        message: ex.message
      });
    }
  };

  const convertToken = async (
    amount: number,
    token: TokenItemType,
    type: 'cw20ToNative' | 'nativeToCw20',
    outputToken?: TokenItemType
  ) => {
    if (amount <= 0)
      return displayToast(TToastType.TX_FAILED, {
        message: 'From amount should be higher than 0!'
      });

    displayToast(TToastType.TX_BROADCASTING);
    try {
      const result = await broadcastConvertTokenTx(amount, token, type, outputToken);
      if (result) {
        processTxResult(token, result as any, `${network.explorer}/txs/${result.transactionHash}`);
      }
    } catch (error) {
      let finalError = '';
      if (typeof error === 'string' || error instanceof String) {
        finalError = `${error}`;
      } else finalError = String(error);
      displayToast(TToastType.TX_FAILED, {
        message: finalError
      });
    }
  };

  const getFilterTokens = (chainId: string | number): TokenItemType[] => {
    return [...fromTokens, ...toTokens]
      .filter((token) => {
        // not display because it is evm map and no bridge to option
        if (!token.bridgeTo && !token.prefix) return false;
        if (hideOtherSmallAmount && !toTotalDisplay(amounts, token)) {
          return false;
        }
        return token.chainId == chainId;
      })
      .sort((a, b) => {
        return toTotalDisplay(amounts, b) * prices[b.coingeckoId] - toTotalDisplay(amounts, a) * prices[a.coingeckoId];
      });
  };

  const totalUsd = getTotalUsd(amounts, prices);

  const navigate = useNavigate();

  // Move oraib2oraichain
  const [moveOraib2OraiLoading, setMoveOraib2OraiLoading] = useState(false);
  const { remainingOraib } = useGetOraiBridgeBalances(moveOraib2OraiLoading);

  const moveOraibToOraichain = async () => {
    try {
      setMoveOraib2OraiLoading(true);
      // TODO: Transfer multiple IBC messages in a single transaction only
      for (const fromToken of remainingOraib) {
        const toToken = toTokens.find(t => t.chainId === ORAICHAIN_ID && t.name === fromToken.name)
        const transferAmount = toDisplay(fromToken.amount, fromToken.decimals);
        await transferIbcCustom(fromToken, toToken, transferAmount)
      }
    } catch (error) {
      console.log('error move stuck oraib: ', error)
    } finally {
      setMoveOraib2OraiLoading(false)
    }
  };

  return (
    <Content nonBackground>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.asset}>
            <span className={styles.totalAssets}>Total Assets</span>
            <TokenBalance balance={totalUsd} className={styles.balance} decimalScale={2} />
          </div>

          {/* Show popup that let user move stuck assets Oraibridge to Oraichain */}
          <StuckOraib remainingOraib={remainingOraib} handleMove={moveOraibToOraichain} loading={moveOraib2OraiLoading} />

        </div>
        <div className={styles.divider} />
        <div className={styles.action}>
          <div className={styles.search}>
            <div className={styles.search_filter} onClick={() => setIsSelectNetwork(true)}>
              <div className={styles.search_box}>
                <div className={styles.search_flex}>
                  <div className={styles.search_logo}>{renderLogoNetwork(filterNetwork)}</div>
                  <span className={styles.search_text}>{networks.find((n) => n.chainId == filterNetwork)?.title}</span>
                </div>
                <div>
                  <ArrowDownIcon />
                </div>
              </div>
            </div>

            <SearchInput
              placeholder="Search Token of Network"
              onSearch={(text) => {
                if (!text) return navigate('');
                navigate(`?token=${text}`);
              }}
            />
          </div>
        </div>
        <div className={styles.balances}>
          <div className={styles.box}>
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
            <div className={styles.tokens_form}>
              {getFilterTokens(filterNetwork).map((t: TokenItemType) => {
                const name = parseBep20Erc20Name(t.name);
                const tokenOraichain = filterNetwork == ORAICHAIN_ID;
                const transferToToken =
                  tokenOraichain &&
                  fromTokens.find(
                    (token) => token.cosmosBased && token.name.includes(name) && token.chainId !== ORAI_BRIDGE_CHAIN_ID
                  );

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
                    className={styles.tokens_element}
                    key={t.denom}
                    amountDetail={[amount.toString(), usd]}
                    subAmounts={subAmounts}
                    active={tokenOraichain ? to?.denom === t.denom : from?.denom === t.denom}
                    token={t}
                    onClick={tokenOraichain ? onClickTokenTo : onClickTokenFrom}
                    convertToken={convertToken}
                    transferIBC={transferIbcCustom}
                    onClickTransfer={
                      tokenOraichain
                        ? !!transferToToken
                          ? (fromAmount: number) => onClickTransfer(fromAmount, to, transferToToken)
                          : undefined
                        : !!to
                          ? (fromAmount: number) => {
                            onClickTransfer(fromAmount, from, to);
                          }
                          : undefined
                    }
                    convertKwt={t.chainId === KWT_SUBNETWORK_CHAIN_ID ? convertKwt : undefined}
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
          listToken={networks}
          setToken={(chainId) => {
            setFilterNetwork(chainId);
          }}
        />
      </div>
    </Content>
  );
};

export default BalanceNew;
