import React, { useCallback, useEffect, useState } from 'react';
import { coin } from '@cosmjs/proto-signing';
import {
  arrayLoadToken,
  calSumAmounts,
  getNetworkGasPrice,
  handleCheckWallet,
  handleLedgerDevice,
  networks
} from 'helper';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/reload.svg';
import { renderLogoNetwork } from 'helper';
import SelectTokenModal from './Modals/SelectTokenModal';
import { IBCInfo } from 'types/ibc';
import styles from './Balance.module.scss';
import tokenABI from 'config/abi/erc20.json';
import { Multicall, ContractCallResults } from 'libs/ethereum-multicall';
import {
  AminoTypes,
  DeliverTxResponse,
  GasPrice,
  isDeliverTxFailure,
  SigningStargateClient,
  StargateClient
} from '@cosmjs/stargate';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import {
  ibcInfos,
  ibcInfosOld,
  oraib2oraichain,
  oraichain2oraib
} from 'config/ibcInfos';
import {
  Erc20Cw20Map,
  evmTokens,
  filteredTokens,
  gravityContracts,
  kawaiiTokens,
  TokenItemType,
  tokens
} from 'config/bridgeTokens';
import { network } from 'config/networks';
import {
  generateConvertCw20Erc20Message,
  generateConvertMsgs,
  simulateSwap,
  Type,
  getSubAmount,
  parseTokenInfo
} from 'rest/api';
import Content from 'layouts/Content';
import {
  buildMultipleMessages,
  getEvmAddress,
  getFunctionExecution,
  getUsd,
  parseAmountToWithDecimal,
  parseBep20Erc20Name
} from 'libs/utils';
import {
  BSC_CHAIN_ID,
  BSC_RPC,
  BSC_SCAN,
  ETHEREUM_CHAIN_ID,
  ETHEREUM_RPC,
  ETHEREUM_SCAN,
  KAWAII_SUBNET_RPC,
  KWT,
  KWT_BSC_CONTRACT,
  KWT_SCAN,
  KWT_SUBNETWORK_CHAIN_ID,
  KWT_SUBNETWORK_EVM_CHAIN_ID,
  MILKY_BSC_CONTRACT,
  NOTI_INSTALL_OWALLET,
  ORAI,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_FEE,
  ORAI_BRIDGE_CHAIN_ID,
  ORAI_BRIDGE_EVM_FEE
} from 'config/constants';
import CosmJs, {
  getExecuteContractMsgs,
  HandleOptions,
  parseExecuteContractMultiple
} from 'libs/cosmjs';
import { initEthereum } from 'polyfill';
import { useNavigate, useSearchParams } from 'react-router-dom';
import KawaiiverseJs from 'libs/kawaiiversejs';
import { useInactiveListener } from 'hooks/useMetamask';
import TokenItem from './TokenItem';
import KwtModal from './KwtModal';
import { MsgTransfer } from '../../libs/proto/ibc/applications/transfer/v1/tx';
import Long from 'long';
import { createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate/build/modules/wasm/aminomessages';
import customRegistry, { customAminoTypes } from 'libs/registry';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import CheckBox from 'components/CheckBox';
import { Contract } from 'config/contracts';
import { ExecuteResult, fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import {
  BalanceResponse,
  QueryMsg as TokenQueryMsg
} from 'libs/contracts/OraiswapToken.types';
import LoadingBox from 'components/LoadingBox';
import { TransferBackMsg } from 'libs/contracts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/configure';
import { updateAmounts } from 'reducer/token';
import useConfigReducer from 'hooks/useConfigReducer';
import Input from 'components/Input';
import flatten from 'lodash/flatten';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';

interface BalanceProps {}

const Balance: React.FC<BalanceProps> = () => {
  const [searchParams] = useSearchParams();
  let tokenUrl = searchParams.get('token');
  const [keplrAddress] = useConfigReducer('address');
  const [from, setFrom] = useState<TokenItemType>();
  const [to, setTo] = useState<TokenItemType>();
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [filterNetwork, setFilterNetwork] = useConfigReducer('chainId');
  const [isSelectNetwork, setIsSelectNetwork] = useState(false);
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [hideOtherSmallAmount, setHideOtherSmallAmount] = useConfigReducer(
    'hideOtherSmallAmount'
  );

  const [[fromTokens, toTokens], setTokens] = useState<TokenItemType[][]>([
    [],
    []
  ]);
  const [txHash, setTxHash] = useState('');
  const dispatch = useDispatch();

  const forceUpdate = (amountDetails: AmountDetails) => {
    dispatch(updateAmounts(amountDetails));
  };

  const { data: prices } = useCoinGeckoPrices(
    filteredTokens.map((t) => t.coingeckoId)
  );

  const [metamaskAddress] = useConfigReducer('metamaskAddress');

  useInactiveListener();

  useEffect(() => {
    if (!tokenUrl) return setTokens(tokens);
    const _tokenUrl = tokenUrl.toUpperCase();
    setTokens(
      tokens.map((childTokens) =>
        childTokens.filter((t) => t.name.includes(_tokenUrl))
      )
    );
  }, [tokenUrl]);

  useEffect(() => {
    _initEthereum();
  }, []);

  useEffect(() => {
    loadTokenAmounts();
  }, [keplrAddress, metamaskAddress, txHash, prices]);

  const loadTokens = async () => {
    await handleCheckWallet();
    for (const token of arrayLoadToken) {
      window.Keplr.getKeplrAddr(token.chainId).then((address) =>
        loadNativeBalance(address, token.rpc)
      );
    }
  };

  const _initEthereum = async () => {
    try {
      await initEthereum();
    } catch (error) {
      console.log(error);
    }
  };

  const loadEvmEntries = async (
    address: string,
    tokens: TokenItemType[],
    rpc: string,
    chainId: number,
    multicallCustomContractAddress?: string
  ): Promise<[string, AmountDetail][]> => {
    const multicall = new Multicall({
      nodeUrl: rpc,
      multicallCustomContractAddress,
      chainId
    });
    const input = tokens.map((token) => ({
      reference: token.denom,
      contractAddress: token.contractAddress,
      abi: tokenABI,
      calls: [
        {
          reference: token.denom,
          methodName: 'balanceOf(address)',
          methodParameters: [address]
        }
      ]
    }));

    const results: ContractCallResults = await multicall.call(input);
    return tokens.map((token) => {
      const amount = Number(
        results.results[token.denom].callsReturnContext[0].returnValues[0].hex
      );

      return [
        token.denom,
        {
          amount,
          usd: getUsd(amount, prices[token.coingeckoId] ?? 0, token.decimals)
        } as AmountDetail
      ];
    });
  };

  // update concurrency
  const loadEvmOraiAmounts = async (evmAddress: string) => {
    const amountDetails = Object.fromEntries(
      flatten(
        await Promise.all([
          loadEvmEntries(
            evmAddress,
            evmTokens.filter((t) => t.chainId === BSC_CHAIN_ID),
            BSC_RPC,
            BSC_CHAIN_ID
          ),

          loadEvmEntries(
            evmAddress,
            evmTokens.filter((t) => t.chainId === ETHEREUM_CHAIN_ID),
            ETHEREUM_RPC,
            ETHEREUM_CHAIN_ID
          )
        ])
      )
    );
    console.log('loadEvmOraiAmounts');
    forceUpdate(amountDetails);
  };

  const loadKawaiiSubnetAmount = async (kwtSubnetAddress: string) => {
    let amountDetails = Object.fromEntries(
      await loadEvmEntries(
        kwtSubnetAddress,
        kawaiiTokens.filter((t) => !!t.contractAddress),
        KAWAII_SUBNET_RPC,
        KWT_SUBNETWORK_EVM_CHAIN_ID,
        '0x74876644692e02459899760B8b9747965a6D3f90'
      )
    );
    console.log('loadKawaiiSubnetAmount');
    // update amounts
    forceUpdate(amountDetails);
  };

  const loadNativeBalance = async (address: string, rpc: string) => {
    const client = await StargateClient.connect(rpc);
    let erc20MapTokens = [];
    for (let token of filteredTokens) {
      if (token.contractAddress && token.erc20Cw20Map) {
        erc20MapTokens = erc20MapTokens.concat(
          token.erc20Cw20Map.map((t) => ({
            denom: t.erc20Denom,
            coingeckoId: token.coingeckoId,
            decimals: t.decimals.erc20Decimals
          }))
        );
      }
    }
    const filteredTokensWithErc20Map = filteredTokens.concat(erc20MapTokens);
    const amountAll = await client.getAllBalances(address);
    let amountDetails: AmountDetails = {};
    for (const token of filteredTokensWithErc20Map) {
      const foundToken = amountAll.find((t) => token.denom === t.denom);
      if (!foundToken) continue;
      const amount = parseInt(foundToken.amount);
      amountDetails[token.denom] = {
        amount,
        usd: getUsd(amount, prices[token.coingeckoId] ?? 0, token.decimals)
      };
    }
    console.log('loadNativeBalance', address);
    forceUpdate(amountDetails);
  };

  const loadCw20Balance = async (address: string) => {
    // get all cw20 token contract
    const cw20Tokens = filteredTokens.filter((t) => t.contractAddress);
    const data = toBinary({
      balance: { address }
    } as TokenQueryMsg);

    const res = await Contract.multicall.aggregate({
      queries: cw20Tokens.map((t) => ({
        address: t.contractAddress,
        data
      }))
    });

    const amountDetails = Object.fromEntries(
      cw20Tokens.map((t, ind) => {
        if (!res.return_data[ind].success) {
          return [t.denom, { amount: 0, usd: 0 }];
        }
        const balanceRes = fromBinary(
          res.return_data[ind].data
        ) as BalanceResponse;
        const amount = parseInt(balanceRes.balance);
        return [
          t.denom,
          {
            amount,
            usd: getUsd(amount, prices[t.coingeckoId] ?? 0, t.decimals)
          }
        ];
      })
    );

    console.log('loadCw20Balance');
    forceUpdate(amountDetails);
  };

  const loadTokenAmounts = async () => {
    try {
      // let chainId = network.chainId;
      // we enable oraichain then use pubkey to calculate other address
      const keplr = await window.Keplr.getKeplr();
      if (!keplr) {
        return displayToast(TToastType.TX_INFO, NOTI_INSTALL_OWALLET, {
          toastId: 'install_keplr'
        });
      }

      const kwtSubnetAddress = getEvmAddress(
        await window.Keplr.getKeplrAddr(KWT_SUBNETWORK_CHAIN_ID)
      );

      await Promise.all(
        [
          getFunctionExecution(loadTokens),
          metamaskAddress &&
            getFunctionExecution(loadEvmOraiAmounts, [metamaskAddress]),
          kwtSubnetAddress &&
            getFunctionExecution(loadKawaiiSubnetAmount, [kwtSubnetAddress]),
          // keplrAddress &&
          // getFunctionExecution(loadNativeBalance, [
          //   keplrAddress,
          //   network.rpc
          // ]),
          keplrAddress && getFunctionExecution(loadCw20Balance, [keplrAddress])
        ].filter(Boolean)
      );
      // // run later
      // const amountDetails = Object.fromEntries(
      //   filteredTokens
      //     .filter((c) => c.contractAddress && c.erc20Cw20Map)
      //     .map((t) => {
      //       const detail = amounts[t.denom];
      //       const subAmounts = getSubAmount(amounts, t, prices);
      //       return [
      //         t.denom,
      //         {
      //           ...detail,
      //           subAmounts
      //         }
      //       ];
      //     })
      // );
      // forceUpdate(amountDetails);
    } catch (ex) {
      console.log(ex);
    }
  };

  const processTxResult = (
    token: TokenItemType,
    result: DeliverTxResponse,
    customLink?: string
  ) => {
    if (isDeliverTxFailure(result)) {
      displayToast(TToastType.TX_FAILED, {
        message: result.rawLog
      });
    } else {
      displayToast(TToastType.TX_SUCCESSFUL, {
        customLink:
          customLink || `${token.rpc}/tx?hash=0x${result.transactionHash}`
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
        message:
          'IBC Wasm source port is invalid. Cannot transfer to the destination chain'
      };

    const { info: assetInfo } = parseTokenInfo(fromToken);
    Contract.sender = fromAddress;
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
      throw 'Cannot transfer to remote chain because cannot find mapping pair';
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
      result = await ibcWasmContract.transferToRemote(msg, 'auto', undefined, [
        { amount, denom: fromToken.denom }
      ]);
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
          msg: Buffer.from(JSON.stringify(transferBackMsgCw20Msg)).toString(
            'base64'
          )
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
    amount = coin(
      parseAmountToWithDecimal(
        transferAmount,
        fromToken.erc20Cw20Map[0].decimals.erc20Decimals
      ).toString(),
      fromToken.erc20Cw20Map[0].erc20Denom
    );

    const msgConvertReverses = await generateConvertCw20Erc20Message(
      amounts,
      fromToken,
      fromAddress,
      amount
    );

    const executeContractMsgs = getExecuteContractMsgs(
      fromAddress,
      parseExecuteContractMultiple(
        buildMultipleMessages(undefined, msgConvertReverses)
      )
    );

    // note need refactor
    // get raw ibc tx
    const msgTransfer = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: MsgTransfer.fromPartial({
        sourcePort: ibcInfo.source,
        sourceChannel: ibcInfo.channel,
        token: amount,
        sender: fromAddress,
        receiver: toAddress,
        memo: ibcMemo,
        timeoutTimestamp: Long.fromNumber(
          Math.floor(Date.now() / 1000) + ibcInfo.timeout
        )
          .multiply(1000000000)
          .toString()
      })
    };

    const offlineSigner = await window.Keplr.getOfflineSigner(
      fromToken.chainId as string
    );
    const aminoTypes = new AminoTypes({
      ...createWasmAminoConverters(),
      ...customAminoTypes
    });
    // Initialize the gaia api with the offline signer that is injected by Keplr extension.
    const client = await SigningStargateClient.connectWithSigner(
      fromToken.rpc,
      offlineSigner,
      {
        registry: customRegistry,
        aminoTypes,
        gasPrice: GasPrice.fromString(
          `${(await getNetworkGasPrice()).average}${network.denom}`
        )
      }
    );
    const result = await client.signAndBroadcast(
      fromAddress,
      [...executeContractMsgs, msgTransfer],
      'auto'
    );
    processTxResult(
      fromToken,
      result,
      `${network.explorer}/txs/${result.transactionHash}`
    );
  };

  // Oraichain (Orai)
  const transferIbcCustom = async (
    fromToken: TokenItemType,
    toToken: TokenItemType,
    transferAmount: number
  ) => {
    try {
      console.log('from token: ', fromToken);
      console.log('to token: ', toToken);
      if (transferAmount === 0) throw { message: 'Transfer amount is empty' };
      await handleCheckWallet();
      // disable Oraichain -> Oraibridge Ledger
      await handleLedgerDevice();

      await window.Keplr.suggestChain(toToken.chainId as string);
      // enable from to send transaction
      await window.Keplr.suggestChain(fromToken.chainId as string);
      // check address
      const fromAddress = await window.Keplr.getKeplrAddr(
        fromToken.chainId as string
      );
      const toAddress = await window.Keplr.getKeplrAddr(
        toToken.chainId as string
      );
      if (!fromAddress || !toAddress) {
        displayToast(TToastType.TX_FAILED, {
          message: 'Please login keplr!'
        });
        return;
      }

      let amount = coin(
        parseAmountToWithDecimal(transferAmount, fromToken.decimals).toString(),
        fromToken.denom
      );
      const ibcMemo =
        toToken.chainId === ORAI_BRIDGE_CHAIN_ID
          ? toToken.prefix + metamaskAddress
          : '';
      let ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];
      if (fromToken.erc20Cw20Map) {
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
        await transferToRemoteChainIbcWasm(
          ibcInfo,
          fromToken,
          toToken,
          fromAddress,
          toAddress,
          amount.amount,
          ibcMemo
        );
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
      const offlineSigner = await window.Keplr.getOfflineSigner(
        fromToken.chainId as string
      );
      const client = await SigningStargateClient.connectWithSigner(
        fromToken.rpc,
        offlineSigner
      );
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

  const transferIBCKwt = async (
    fromToken: TokenItemType,
    toToken: TokenItemType,
    transferAmount: number
  ) => {
    try {
      if (transferAmount === 0) throw { message: 'Transfer amount is empty' };
      const keplr = await window.Keplr.getKeplr();
      if (!keplr) return;
      await window.Keplr.suggestChain(toToken.chainId as string);
      // enable from to send transaction
      await window.Keplr.suggestChain(fromToken.chainId as string);
      const fromAddress = await window.Keplr.getKeplrAddr(
        fromToken.chainId as string
      );
      const toAddress = await window.Keplr.getKeplrAddr(
        toToken.chainId as string
      );
      if (!fromAddress || !toAddress) {
        displayToast(TToastType.TX_FAILED, {
          message: 'Please login keplr!'
        });
        return;
      }

      var amount = coin(
        parseAmountToWithDecimal(transferAmount, fromToken.decimals).toString(),
        fromToken.denom
      );

      const ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];
      var customMessages: any[];

      // check if from token has erc20 map then we need to convert back to bep20 / erc20 first. TODO: need to filter if convert to ERC20 or BEP20
      if (fromToken.erc20Cw20Map) {
        const msgConvertReverses = await generateConvertCw20Erc20Message(
          amounts,
          fromToken,
          fromAddress,
          amount
        );
        const executeContractMsgs = getExecuteContractMsgs(
          fromAddress,
          parseExecuteContractMultiple(
            buildMultipleMessages(undefined, msgConvertReverses)
          )
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

      processTxResult(
        fromToken,
        result,
        `${KWT_SCAN}/tx/${result.transactionHash}`
      );
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
      if (transferAmount === 0) throw { message: 'Transfer amount is empty' };
      const keplr = await window.Keplr.getKeplr();
      if (!keplr) return;
      await window.Keplr.suggestChain(toToken.chainId as string);
      // enable from to send transaction
      await window.Keplr.suggestChain(fromToken.chainId as string);
      const fromAddress = await window.Keplr.getKeplrAddr(
        fromToken.chainId as string
      );
      const toAddress = await window.Keplr.getKeplrAddr(
        toToken.chainId as string
      );
      if (!fromAddress || !toAddress) {
        displayToast(TToastType.TX_FAILED, {
          message: 'Please login keplr!'
        });
        return;
      }

      const amount = coin(
        parseAmountToWithDecimal(transferAmount, fromToken.decimals).toString(),
        fromToken.denom == 'erc20_milky'
          ? process.env.REACT_APP_MILKY_SUB_NETWORK_DENOM
          : process.env.REACT_APP_KWT_SUB_NETWORK_DENOM
      );
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
        contractAddr:
          fromToken.denom == 'erc20_milky'
            ? fromToken.contractAddress
            : undefined
      });

      processTxResult(
        fromToken,
        result,
        `${KWT_SCAN}/tx/${result.transactionHash}`
      );
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
      let oneStepKeplrAddr = `${oraib2oraichain}/${keplrAddress}`;
      // we only support the old oraibridge ibc channel <--> Oraichain for MILKY & KWT
      if (
        from.contractAddress === KWT_BSC_CONTRACT ||
        from.contractAddress === MILKY_BSC_CONTRACT
      ) {
        oneStepKeplrAddr = keplrAddress;
      }
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
      await loadTokenAmounts();
      setLoadingRefresh(false);
    } catch (err) {
      console.log({ err });
      setLoadingRefresh(false);
    }
  };

  const onClickTransfer = async (
    fromAmount: number,
    from: TokenItemType,
    to: TokenItemType
  ) => {
    // disable send amount < 0
    if (!from || !to) {
      displayToast(TToastType.TX_FAILED, {
        message: 'Please choose both from and to tokens'
      });
      return;
    }
    const tokenAmountDetails = amounts[from.denom];
    const subAmount = getSubAmount(amounts, from, prices);
    const fromBalance =
      from && tokenAmountDetails
        ? tokenAmountDetails.amount + calSumAmounts(subAmount, 'amount')
        : 0;
    if (fromAmount <= 0 || fromAmount * from.decimals > fromBalance) {
      displayToast(TToastType.TX_FAILED, {
        message: 'Your balance is insufficient to make this transfer'
      });
      return;
    }
    displayToast(TToastType.TX_BROADCASTING);

    try {
      if (
        from.chainId === KWT_SUBNETWORK_CHAIN_ID &&
        to.chainId === ORAICHAIN_ID &&
        !!from.contractAddress
      ) {
        await convertTransferIBCErc20Kwt(from, to, fromAmount);
      } else if (
        from.chainId === KWT_SUBNETWORK_CHAIN_ID &&
        to.chainId === ORAICHAIN_ID
      ) {
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
      const _fromAmount = parseAmountToWithDecimal(
        amount,
        token.decimals
      ).toString();
      console.log('convertToken');

      let msgs;
      if (type === 'nativeToCw20') {
        msgs = await generateConvertMsgs({
          type: Type.CONVERT_TOKEN,
          sender: keplrAddress,
          inputAmount: _fromAmount,
          inputToken: token
        });
      } else if (type === 'cw20ToNative') {
        msgs = await generateConvertMsgs({
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
        processTxResult(
          token,
          result as any,
          `${network.explorer}/txs/${result.transactionHash}`
        );
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

  const findDefaultToToken = (
    toTokens: TokenItemType[],
    from: TokenItemType
  ) => {
    if (from?.chainId === KWT_SUBNETWORK_CHAIN_ID) {
      const name = parseBep20Erc20Name(from.name);
      return toTokens.find((t) => t.name.includes(name));
    }

    return toTokens.find(
      (t) =>
        !from || (from.chainId !== ORAI_BRIDGE_CHAIN_ID && t.name === from.name)
    );
  };

  const convertKwt = async (
    transferAmount: number,
    fromToken: TokenItemType
  ) => {
    try {
      if (transferAmount === 0) throw { message: 'Transfer amount is empty' };
      const keplr = await window.Keplr.getKeplr();
      if (!keplr) return;
      await window.Keplr.suggestChain(fromToken.chainId as string);
      const fromAddress = await window.Keplr.getKeplrAddr(
        fromToken.chainId as string
      );

      if (!fromAddress) {
        return;
      }

      const amount = coin(
        parseAmountToWithDecimal(transferAmount, fromToken.decimals).toString(),
        fromToken.denom
      );

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
          contractAddr:
            fromToken?.denom == 'erc20_milky'
              ? fromToken?.contractAddress
              : undefined
        });
      }
      processTxResult(
        fromToken,
        result,
        `${KWT_SCAN}/tx/${result.transactionHash}`
      );
    } catch (ex: any) {
      console.log(ex);
      displayToast(TToastType.TX_FAILED, {
        message: ex.message
      });
    }
  };

  const getFilterTokens = (org: string): TokenItemType[] => {
    return [...fromTokens, ...toTokens]
      .filter((token) => {
        if (hideOtherSmallAmount && !Number(amounts[token.denom]?.amount)) {
          return false;
        }
        return token?.org === org;
      })
      .sort((a, b) => {
        return amounts[b.denom]?.usd ?? 0 - amounts[a.denom]?.usd ?? 0;
      });
  };

  const totalUsd = sumBy(Object.values(amounts), (c) => {
    return c.usd;
  });

  const navigate = useNavigate();

  return (
    <Content nonBackground>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <span className={styles.totalAssets}>Total Assets</span>
          <TokenBalance
            balance={totalUsd}
            className={styles.balance}
            decimalScale={2}
          />
        </div>
        <div className={styles.divider} />
        <div className={styles.action}>
          <div className={styles.search}>
            <div
              className={styles.search_filter}
              onClick={() => setIsSelectNetwork(true)}
            >
              <div className={styles.search_box}>
                <div className={styles.search_flex}>
                  <div className={styles.search_logo}>
                    {renderLogoNetwork(filterNetwork)}
                  </div>
                  <span className={styles.search_text}>{filterNetwork}</span>
                </div>
                <div>
                  <ArrowDownIcon />
                </div>
              </div>
            </div>
            <Input
              placeholder="Search Token of Network"
              onSearch={(text: string) => {
                if (!text) return navigate('');
                navigate(`?token=${text}`);
              }}
              className={styles.search_form}
            />
          </div>
        </div>
        <div className={styles.balances}>
          <div className={styles.box}>
            <div>
              <CheckBox
                label="Hide small balances"
                checked={hideOtherSmallAmount}
                onCheck={setHideOtherSmallAmount}
              />
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
                    (token) =>
                      token.cosmosBased &&
                      token.name.includes(name) &&
                      token.chainId !== ORAI_BRIDGE_CHAIN_ID
                  );

                // check balance cw20
                let amount = amounts[t.denom];
                let subAmounts;
                if (t.contractAddress && t.erc20Cw20Map) {
                  subAmounts = getSubAmount(amounts, t, prices);
                  amount = {
                    amount: calSumAmounts(subAmounts, 'amount') + amount.amount,
                    usd: calSumAmounts(subAmounts, 'usd') + amount.usd
                  };
                }
                return (
                  <TokenItem
                    className={styles.tokens_element}
                    key={t.denom}
                    amountDetail={amount}
                    subAmounts={subAmounts}
                    active={
                      tokenOraichain
                        ? to?.denom === t.denom
                        : from?.denom === t.denom
                    }
                    token={t}
                    onClick={tokenOraichain ? onClickTokenTo : onClickTokenFrom}
                    convertToken={convertToken}
                    transferIBC={transferIbcCustom}
                    onClickTransfer={
                      tokenOraichain
                        ? !!transferToToken
                          ? (fromAmount: number) =>
                              onClickTransfer(fromAmount, to, transferToToken)
                          : undefined
                        : !!to
                        ? (fromAmount: number) => {
                            onClickTransfer(fromAmount, from, to);
                          }
                        : undefined
                    }
                    convertKwt={
                      t.chainId === KWT_SUBNETWORK_CHAIN_ID
                        ? convertKwt
                        : undefined
                    }
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
          listToken={networks}
          setToken={(chainId) => {
            setFilterNetwork(chainId);
          }}
          icon={true}
        />
      </div>
    </Content>
  );
};

export default Balance;
