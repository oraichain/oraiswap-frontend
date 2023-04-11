import { DeliverTxResponse, isDeliverTxFailure } from '@cosmjs/stargate';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/reload.svg';
import CheckBox from 'components/CheckBox';
import LoadingBox from 'components/LoadingBox';
import SearchInput from 'components/SearchInput';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { TokenItemType, tokens } from 'config/bridgeTokens';
import { chainInfos } from 'config/chainInfos';
import { KWT_SCAN, ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX } from 'config/constants';
import { getTransactionUrl, handleCheckWallet, networks, tronToEthAddress } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import useLoadTokens from 'hooks/useLoadTokens';
import { useInactiveListener } from 'hooks/useMetamask';
import Content from 'layouts/Content';
import { getTotalUsd, getUsd, toAmount, toSumDisplay, toTotalDisplay } from 'libs/utils';
import isEqual from 'lodash/isEqual';
import SelectTokenModal from 'pages/SwapV2/Modals/SelectTokenModal';
import { initEthereum } from 'polyfill';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSubAmountDetails } from 'rest/api';
import { RootState } from 'store/configure';
import styles from './Balance.module.scss';
import {
  convertKwt,
  convertTransferIBCErc20Kwt,
  findDefaultToToken,
  moveOraibToOraichain,
  transferEvmToIBC,
  transferIbcCustom,
  transferIBCKwt
} from './helpers';
import KwtModal from './KwtModal';
import StuckOraib from './StuckOraib';
import useGetOraiBridgeBalances from './StuckOraib/useGetOraiBridgeBalances';
import TokenItem from './TokenItem';

interface BalanceProps {}

const BalanceNew: React.FC<BalanceProps> = () => {
  const [searchParams] = useSearchParams();
  let tokenUrl = searchParams.get('token');
  const [oraiAddress] = useConfigReducer('address');
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [filterNetwork, setFilterNetwork] = useConfigReducer('filterNetwork');
  const [isSelectNetwork, setIsSelectNetwork] = useState(false);
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [hideOtherSmallAmount, setHideOtherSmallAmount] = useConfigReducer('hideOtherSmallAmount');
  const loadTokenAmounts = useLoadTokens();
  const [[otherChainTokens, oraichainTokens], setTokens] = useState<TokenItemType[][]>([[], []]);
  const [, setTxHash] = useState('');

  const [[from, to], setTokenBridge] = useState<TokenItemType[]>([]);

  const { data: prices } = useCoinGeckoPrices();

  const [metamaskAddress] = useConfigReducer('metamaskAddress');
  const [tronAddress] = useConfigReducer('tronAddress');

  useInactiveListener();

  useEffect(() => {
    if (!tokenUrl) return setTokens(tokens);
    const _tokenUrl = tokenUrl.toUpperCase();
    setTokens(tokens.map((childTokens) => childTokens.filter((t) => t.name.includes(_tokenUrl))));
  }, [tokenUrl]);

  useEffect(() => {
    _initEthereum();
  }, []);

  const _initEthereum = async () => {
    try {
      await initEthereum();
    } catch (error) {
      console.log(error);
    }
  };

  const processTxResult = (rpc: string, result: DeliverTxResponse, customLink?: string) => {
    if (isDeliverTxFailure(result)) {
      displayToast(TToastType.TX_FAILED, {
        message: result.rawLog
      });
    } else {
      displayToast(TToastType.TX_SUCCESSFUL, {
        customLink: customLink || `${rpc}/tx?hash=0x${result.transactionHash}`
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
      setLoadingRefresh(false);
    } catch (err) {
      setLoadingRefresh(false);
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

  const onClickTransfer = async (fromAmount: number, from: TokenItemType, to: TokenItemType) => {
    await handleCheckWallet();
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
      // [(ERC20)KWT, (ERC20)MILKY] ==> ORAICHAIN
      if (from.chainId === 'kawaii_6886-1' && to.chainId === 'Oraichain') {
        // convert erc20 to native ==> ORAICHAIN
        if (!!from.contractAddress) result = await convertTransferIBCErc20Kwt(from, to, fromAmount);
        else result = await transferIBCKwt(from, to, fromAmount, amounts);
        processTxResult(from.rpc, result, `${KWT_SCAN}/tx/${result.transactionHash}`);
        return;
      }
      if (from.cosmosBased) {
        await handleTransferIBC(from, to, fromAmount);
        return;
      }
      result = await transferEvmToIBC(from, fromAmount, { metamaskAddress, tronAddress });
      console.log('result on click transfer: ', result);
      processTxResult(from.rpc, result, getTransactionUrl(from.chainId, result.transactionHash));
    } catch (ex) {
      displayToast(TToastType.TX_FAILED, {
        message: ex.message
      });
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
        return token.chainId == chainId;
      })
      .sort((a, b) => {
        return toTotalDisplay(amounts, b) * prices[b.coinGeckoId] - toTotalDisplay(amounts, a) * prices[a.coinGeckoId];
      });
  };

  const totalUsd = getTotalUsd(amounts, prices);

  const navigate = useNavigate();

  // Move oraib2oraichain
  const [moveOraib2OraiLoading, setMoveOraib2OraiLoading] = useState(false);
  const { remainingOraib } = useGetOraiBridgeBalances(moveOraib2OraiLoading);
  const handleMoveOraib2Orai = async () => {
    try {
      setMoveOraib2OraiLoading(true);
      const result = await moveOraibToOraichain(remainingOraib);
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

  const network = networks.find((n) => n.chainId == filterNetwork);

  return (
    <Content nonBackground>
      <div className={styles.wrapper}>
        {/* Show popup that let user move stuck assets Oraibridge to Oraichain */}
        <StuckOraib remainingOraib={remainingOraib} handleMove={handleMoveOraib2Orai} loading={moveOraib2OraiLoading} />
        <div className={styles.header}>
          <div className={styles.asset}>
            <span className={styles.totalAssets}>Total Assets</span>
            <TokenBalance balance={totalUsd} className={styles.balance} decimalScale={2} />
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.action}>
          <div className={styles.search}>
            <div className={styles.search_filter} onClick={() => setIsSelectNetwork(true)}>
              <div className={styles.search_box}>
                {network && (
                  <div className={styles.search_flex}>
                    <div className={styles.search_logo}>
                      <network.Icon />
                    </div>
                    <span className={styles.search_text}>{network.chainName}</span>
                  </div>
                )}
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
                    amountDetail={{ amount: amount.toString(), usd }}
                    subAmounts={subAmounts}
                    active={from?.denom === t.denom || to?.denom === t.denom}
                    token={t}
                    onClick={() => onClickToken(t)}
                    onClickTransfer={async (
                      fromAmount: number,
                      transferFrom?: TokenItemType,
                      transferTo?: TokenItemType
                    ) => {
                      await onClickTransfer(fromAmount, transferFrom ?? from, transferTo ?? to);
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
            setFilterNetwork(chainId);
          }}
        />
      </div>
    </Content>
  );
};

export default BalanceNew;
