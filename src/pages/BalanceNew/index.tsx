import { createWasmAminoConverters, ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import {
  AminoTypes,
  Coin,
  coin,
  DeliverTxResponse,
  GasPrice,
  isDeliverTxFailure,
  SigningStargateClient
} from '@cosmjs/stargate';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/reload.svg';
import CheckBox from 'components/CheckBox';
import LoadingBox from 'components/LoadingBox';
import SearchInput from 'components/SearchInput';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { filteredTokens, gravityContracts, TokenItemType, tokenMap, tokens, kawaiiTokens } from 'config/bridgeTokens';
import {
  BSC_SCAN,
  ETHEREUM_SCAN,
  KWT,
  KWT_SCAN,
  KWT_SUBNETWORK_CHAIN_ID,
  ORAI,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID
} from 'config/constants';
import { Contract } from 'config/contracts';
import { ibcInfos, ibcInfosOld, oraichain2oraib } from 'config/ibcInfos';
import { network } from 'config/networks';
import { getNetworkGasPrice, handleCheckWallet, networks, renderLogoNetwork } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useInactiveListener } from 'hooks/useMetamask';
import Content from 'layouts/Content';
import { TransferBackMsg } from 'libs/contracts';
import CosmJs, { getExecuteContractMsgs, HandleOptions, parseExecuteContractMultiple } from 'libs/cosmjs';
import KawaiiverseJs from 'libs/kawaiiversejs';
import customRegistry, { customAminoTypes } from 'libs/registry';
import { CacheTokens } from 'libs/token';
import {
  buildMultipleMessages,
  getTotalUsd,
  getUsd,
  parseBep20Erc20Name,
  toAmount,
  toSumDisplay,
  toTotalDisplay
} from 'libs/utils';
import isEqual from 'lodash/isEqual';
import Long from 'long';
import SelectTokenModal from 'pages/SwapV2/Modals/SelectTokenModal';
import { initEthereum } from 'polyfill';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  generateConvertCw20Erc20Message,
  generateConvertMsgs,
  getSubAmountDetails,
  parseTokenInfo,
  Type
} from 'rest/api';
import { RootState } from 'store/configure';
import { IBCInfo } from 'types/ibc';
import { MsgTransfer } from '../../libs/proto/ibc/applications/transfer/v1/tx';
import styles from './Balance.module.scss';
import { getOneStepKeplrAddr } from './helpers';
import KwtModal from './KwtModal';
import TokenItem from './TokenItem';

interface BalanceProps {}

const Balance: React.FC<BalanceProps> = () => {
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
    cacheTokens.loadTokenAmounts(metamaskAddress);
  }, [keplrAddress, metamaskAddress, txHash, prices]);

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
      console.log('onClickTokenFrom');
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

  const transferToRemoteChainIbcWasm = async (
    ibcInfo: IBCInfo,
    fromToken: TokenItemType,
    toToken: TokenItemType,
    fromAddress: string,
    toAddress: string,
    amount: string,
    ibcMemo: string
  ): Promise<void> => {
    const ibcWasmContractAddress = ibcInfo.source.split('.')[1];
    if (!ibcWasmContractAddress)
      throw {
        message: 'IBC Wasm source port is invalid. Cannot transfer to the destination chain'
      };

    const { info: assetInfo } = parseTokenInfo(fromToken);
    const ibcWasmContract = Contract.ibcwasm(ibcWasmContractAddress);
    try {
      // query if the cw20 mapping has been registered for this pair or not. If not => we switch to erc20cw20 map case
      await ibcWasmContract.pairMappingsFromAssetInfo({ assetInfo });
    } catch (error) {
      console.log('error ibc wasm transfer back to remote chain: ', error);
      console.log(
        'We dont need to handle error for non-registered pair case. We just simply switch to the old case, which is through native IBC'
      );
      // switch ibc info to erc20cw20 map case, where we need to convert between ibc & cw20 for backward compatibility
      throw new Error('Cannot transfer to remote chain because cannot find mapping pair');
    }

    // if asset info is native => send native way, else send cw20 way
    const msg = {
      localChannelId: ibcInfo.channel,
      remoteAddress: toAddress,
      remoteDenom: toToken.denom,
      timeout: ibcInfo.timeout,
      memo: ibcMemo
    };
    let result: ExecuteResult;
    if (assetInfo.native_token) {
      result = await ibcWasmContract.transferToRemote(msg, 'auto', undefined, [{ amount, denom: fromToken.denom }]);
    } else {
      const transferBackMsgCw20Msg: TransferBackMsg = {
        local_channel_id: msg.localChannelId,
        remote_address: msg.remoteAddress,
        remote_denom: msg.remoteDenom,
        timeout: msg.timeout,
        memo: msg.memo
      };
      const cw20Token = Contract.token(fromToken.contractAddress);
      result = await cw20Token.send(
        {
          amount,
          contract: ibcWasmContractAddress,
          msg: Buffer.from(JSON.stringify(transferBackMsgCw20Msg)).toString('base64')
        },
        'auto'
      );
      console.log('result: ', result);
    }

    displayToast(TToastType.TX_SUCCESSFUL, {
      customLink: `${network.explorer}/txs/${result.transactionHash}`
    });
    setTxHash(result.transactionHash);
  };

  const transferTokenErc20Cw20Map = async ({
    amount,
    transferAmount,
    fromToken,
    fromAddress,
    toAddress,
    ibcInfo,
    ibcMemo
  }: {
    amount: Coin;
    transferAmount: number;
    fromToken: TokenItemType;
    fromAddress: string;
    toAddress: string;
    ibcInfo: IBCInfo;
    ibcMemo?: string;
  }) => {
    const evmToken = tokenMap[fromToken.evmDenoms[0]];
    const evmAmount = coin(toAmount(transferAmount, evmToken.decimals).toString(), evmToken.denom);

    const msgConvertReverses = await generateConvertCw20Erc20Message(amounts, fromToken, fromAddress, evmAmount);

    const executeContractMsgs = getExecuteContractMsgs(
      fromAddress,
      parseExecuteContractMultiple(buildMultipleMessages(undefined, msgConvertReverses))
    );

    // note need refactor
    // get raw ibc tx
    const msgTransfer = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: MsgTransfer.fromPartial({
        sourcePort: ibcInfo.source,
        sourceChannel: ibcInfo.channel,
        token: evmAmount,
        sender: fromAddress,
        receiver: toAddress,
        memo: ibcMemo,
        timeoutTimestamp: Long.fromNumber(Math.floor(Date.now() / 1000) + ibcInfo.timeout)
          .multiply(1000000000)
          .toString()
      })
    };

    const offlineSigner = await window.Keplr.getOfflineSigner(fromToken.chainId as string);
    const aminoTypes = new AminoTypes({
      ...createWasmAminoConverters(),
      ...customAminoTypes
    });
    // Initialize the gaia api with the offline signer that is injected by Keplr extension.
    const client = await SigningStargateClient.connectWithSigner(fromToken.rpc, offlineSigner, {
      registry: customRegistry,
      aminoTypes,
      gasPrice: GasPrice.fromString(`${(await getNetworkGasPrice()).average}${network.denom}`)
    });
    const result = await client.signAndBroadcast(fromAddress, [...executeContractMsgs, msgTransfer], 'auto');
    processTxResult(fromToken, result, `${network.explorer}/txs/${result.transactionHash}`);
  };

  // Oraichain (Orai)
  const transferIbcCustom = async (fromToken: TokenItemType, toToken: TokenItemType, transferAmount: number) => {
    try {
      console.log('from token: ', fromToken);
      console.log('to token: ', toToken);
      if (transferAmount === 0) throw new Error('Transfer amount is empty');
      await handleCheckWallet();

      // disable Oraichain -> Oraibridge Ledger
      // const keplr = await window.Keplr.getKeplr();
      // const key = await keplr.getKey(network.chainId);
      // if (key.isNanoLedger) {
      //   displayToast(TToastType.TX_FAILED, {
      //     message: 'Ethereum signing with Ledger is not yet supported!'
      //   });
      //   return;
      // }

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

      let amount = coin(toAmount(transferAmount, fromToken.decimals).toString(), fromToken.denom);
      const ibcMemo = toToken.chainId === ORAI_BRIDGE_CHAIN_ID ? toToken.prefix + metamaskAddress : '';
      let ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];
      if (fromToken.evmDenoms) {
        ibcInfo = ibcInfosOld[fromToken.chainId][toToken.chainId];
        await transferTokenErc20Cw20Map({
          amount,
          transferAmount,
          fromToken,
          fromAddress,
          toAddress,
          ibcInfo,
          ibcMemo
        });
        return;
      }
      // if it includes wasm in source => ibc wasm case
      if (ibcInfo.channel === oraichain2oraib) {
        await transferToRemoteChainIbcWasm(ibcInfo, fromToken, toToken, fromAddress, toAddress, amount.amount, ibcMemo);
        return;
      }
      await transferIBC({
        fromToken,
        fromAddress,
        toAddress,
        amount,
        ibcInfo
      });
      // }
    } catch (ex: any) {
      console.log('error in transfer ibc custom: ', ex);
      displayToast(TToastType.TX_FAILED, {
        message: ex.message
      });
    }
  };

  const transferIBC = async (data: {
    fromToken: TokenItemType;
    fromAddress: string;
    toAddress: string;
    amount: Coin;
    ibcInfo: IBCInfo;
  }) => {
    const { fromToken, fromAddress, toAddress, amount, ibcInfo } = data;

    try {
      const offlineSigner = await window.Keplr.getOfflineSigner(fromToken.chainId as string);
      const client = await SigningStargateClient.connectWithSigner(fromToken.rpc, offlineSigner);
      const result = await client.sendIbcTokens(
        fromAddress,
        toAddress,
        amount,
        ibcInfo.source,
        ibcInfo.channel,
        undefined,
        Math.floor(Date.now() / 1000) + ibcInfo.timeout,
        {
          gas: '200000',
          amount: []
        }
      );
      processTxResult(fromToken, result);
    } catch (ex: any) {
      displayToast(TToastType.TX_FAILED, {
        message: ex.message
      });
    }
  };

  const transferIBCKwt = async (fromToken: TokenItemType, toToken: TokenItemType, transferAmount: number) => {
    try {
      if (transferAmount === 0) throw new Error('Transfer amount is empty');
      const keplr = await window.Keplr.getKeplr();
      if (!keplr) return;
      await window.Keplr.suggestChain(toToken.chainId as string);
      // enable from to send transaction
      await window.Keplr.suggestChain(fromToken.chainId as string);
      const fromAddress = await window.Keplr.getKeplrAddr(fromToken.chainId as string);
      const toAddress = await window.Keplr.getKeplrAddr(toToken.chainId as string);
      if (!fromAddress || !toAddress) {
        displayToast(TToastType.TX_FAILED, {
          message: 'Please login keplr!'
        });
        return;
      }

      var amount = coin(toAmount(transferAmount, fromToken.decimals).toString(), fromToken.denom);

      const ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];
      var customMessages: any[];

      // check if from token has erc20 map then we need to convert back to bep20 / erc20 first. TODO: need to filter if convert to ERC20 or BEP20
      if (fromToken.evmDenoms) {
        const msgConvertReverses = await generateConvertCw20Erc20Message(amounts, fromToken, fromAddress, amount);
        const executeContractMsgs = getExecuteContractMsgs(
          fromAddress,
          parseExecuteContractMultiple(buildMultipleMessages(undefined, msgConvertReverses))
        );
        customMessages = executeContractMsgs.map((msg) => ({
          message: msg.value,
          path: msg.typeUrl.substring(1)
        }));
      }

      const result = await KawaiiverseJs.transferIBC({
        sender: fromAddress,
        gasAmount: { denom: '200000', amount: '0' },
        ibcInfo: {
          sourcePort: ibcInfo.source,
          sourceChannel: ibcInfo.channel,
          amount: amount.amount,
          denom: amount.denom,
          sender: fromAddress,
          receiver: toAddress,
          timeoutTimestamp: Math.floor(Date.now() / 1000) + ibcInfo.timeout
        },
        customMessages
      });

      processTxResult(fromToken, result, `${KWT_SCAN}/tx/${result.transactionHash}`);
    } catch (ex: any) {
      displayToast(TToastType.TX_FAILED, {
        message: ex.message
      });
    }
  };

  const convertTransferIBCErc20Kwt = async (
    fromToken: TokenItemType,
    toToken: TokenItemType,
    transferAmount: number
  ) => {
    try {
      if (transferAmount === 0) throw new Error('Transfer amount is empty');
      const keplr = await window.Keplr.getKeplr();
      if (!keplr) return;
      await window.Keplr.suggestChain(toToken.chainId as string);
      // enable from to send transaction
      await window.Keplr.suggestChain(fromToken.chainId as string);
      const fromAddress = await window.Keplr.getKeplrAddr(fromToken.chainId as string);
      const toAddress = await window.Keplr.getKeplrAddr(toToken.chainId as string);
      if (!fromAddress || !toAddress) {
        displayToast(TToastType.TX_FAILED, {
          message: 'Please login keplr!'
        });
        return;
      }
      const nativeToken = kawaiiTokens.find(
        (token) => token.cosmosBased && token.coingeckoId === fromToken.coingeckoId
      ); // collect kawaiiverse cosmos based token for conversion

      const amount = coin(toAmount(transferAmount, fromToken.decimals).toString(), nativeToken.denom);
      const ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];

      const result = await KawaiiverseJs.convertIbcTransferERC20({
        sender: fromAddress,
        gasAmount: { denom: '200000', amount: '0' },
        ibcInfo: {
          sourcePort: ibcInfo.source,
          sourceChannel: ibcInfo.channel,
          amount: amount.amount,
          denom: amount.denom,
          sender: fromAddress,
          receiver: toAddress,
          timeoutTimestamp: Math.floor(Date.now() / 1000) + ibcInfo.timeout
        },
        amount: amount.amount,
        contractAddr: fromToken?.contractAddress
      });

      processTxResult(fromToken, result, `${KWT_SCAN}/tx/${result.transactionHash}`);
    } catch (ex: any) {
      displayToast(TToastType.TX_FAILED, {
        message: ex.message
      });
    }
  };

  const transferEvmToIBC = async (fromAmount: number) => {
    await window.Metamask.switchNetwork(from!.chainId);
    if (!metamaskAddress || !keplrAddress) {
      displayToast(TToastType.TX_FAILED, {
        message: 'Please login both metamask and keplr!'
      });
      return;
    }
    try {
      const gravityContractAddr = gravityContracts[from!.chainId!] as string;
      if (!gravityContractAddr || !from) {
        return;
      }

      await window.Metamask.checkOrIncreaseAllowance(
        from!.chainId as string,
        from!.contractAddress!,
        metamaskAddress,
        gravityContractAddr,
        fromAmount.toString()
      );
      let oneStepKeplrAddr = getOneStepKeplrAddr(keplrAddress, from.contractAddress);
      const result = await window.Metamask.transferToGravity(
        from!.chainId as string,
        fromAmount.toString(),
        from!.contractAddress!,
        metamaskAddress,
        oneStepKeplrAddr
      );
      console.log(result);
      processTxResult(
        from,
        result,
        window.Metamask.isEth()
          ? `${ETHEREUM_SCAN}/tx/${result?.transactionHash}`
          : `${BSC_SCAN}/tx/${result?.transactionHash}`
      );
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
      await cacheTokens.loadTokenAmounts(metamaskAddress);
      setLoadingRefresh(false);
    } catch (err) {
      console.log({ err });
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
      if (from.chainId === KWT_SUBNETWORK_CHAIN_ID && to.chainId === ORAICHAIN_ID && !!from.contractAddress) {
        await convertTransferIBCErc20Kwt(from, to, fromAmount);
      } else if (from.chainId === KWT_SUBNETWORK_CHAIN_ID && to.chainId === ORAICHAIN_ID) {
        await transferIBCKwt(from, to, fromAmount);
      } else if (from.cosmosBased) {
        return await transferIbcCustom(from, to, fromAmount);
      } else {
        await transferEvmToIBC(fromAmount);
      }
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
      const _fromAmount = toAmount(amount, token.decimals).toString();
      console.log('convertToken');

      let msgs;
      if (type === 'nativeToCw20') {
        msgs = generateConvertMsgs({
          type: Type.CONVERT_TOKEN,
          sender: keplrAddress,
          inputAmount: _fromAmount,
          inputToken: token
        });
      } else if (type === 'cw20ToNative') {
        msgs = generateConvertMsgs({
          type: Type.CONVERT_TOKEN_REVERSE,
          sender: keplrAddress,
          inputAmount: _fromAmount,
          inputToken: token,
          outputToken
        });
      }
      const msg = msgs[0];
      console.log(
        'msgs: ',
        msgs.map((msg) => ({ ...msg, msg: Buffer.from(msg.msg).toString() }))
      );
      const result = await CosmJs.execute({
        prefix: ORAI,
        address: msg.contract,
        walletAddr: keplrAddress,
        handleMsg: msg.msg.toString(),
        gasAmount: { denom: ORAI, amount: '0' },
        handleOptions: { funds: msg.sent_funds } as HandleOptions
      });

      if (result) {
        console.log('in correct result');
        console.log(result);
        processTxResult(token, result as any, `${network.explorer}/txs/${result.transactionHash}`);
      }
    } catch (error) {
      console.log('error in swap form: ', error);
      let finalError = '';
      if (typeof error === 'string' || error instanceof String) {
        finalError = `${error}`;
      } else finalError = String(error);
      displayToast(TToastType.TX_FAILED, {
        message: finalError
      });
    }
  };

  const findDefaultToToken = (toTokens: TokenItemType[], from: TokenItemType) => {
    if (from?.chainId === KWT_SUBNETWORK_CHAIN_ID) {
      const name = parseBep20Erc20Name(from.name);
      return toTokens.find((t) => t.name.includes(name));
    }

    return toTokens.find((t) => !from || (from.chainId !== ORAI_BRIDGE_CHAIN_ID && t.name === from.name));
  };

  const convertKwt = async (transferAmount: number, fromToken: TokenItemType) => {
    try {
      if (transferAmount === 0) throw new Error('Transfer amount is empty');
      const keplr = await window.Keplr.getKeplr();
      if (!keplr) return;
      await window.Keplr.suggestChain(fromToken.chainId as string);
      const fromAddress = await window.Keplr.getKeplrAddr(fromToken.chainId as string);

      if (!fromAddress) {
        return;
      }

      const amount = coin(toAmount(transferAmount, fromToken.decimals).toString(), fromToken.denom);

      let result: DeliverTxResponse;

      if (!fromToken.contractAddress) {
        result = await KawaiiverseJs.convertCoin({
          sender: fromAddress,
          gasAmount: { amount: '0', denom: KWT },
          coin: amount
        });
      } else {
        result = await KawaiiverseJs.convertERC20({
          sender: fromAddress,
          gasAmount: { amount: '0', denom: KWT },
          amount: amount.amount,
          contractAddr: fromToken?.contractAddress
        });
      }
      processTxResult(fromToken, result, `${KWT_SCAN}/tx/${result.transactionHash}`);
    } catch (ex: any) {
      console.log(ex);
      displayToast(TToastType.TX_FAILED, {
        message: ex.message
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

  return (
    <Content nonBackground>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <span className={styles.totalAssets}>Total Assets</span>
          <TokenBalance balance={totalUsd} className={styles.balance} decimalScale={2} />
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

export default Balance;
