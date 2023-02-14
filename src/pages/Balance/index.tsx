import React, { FC, useCallback, useEffect, useState } from 'react';
import { coin } from '@cosmjs/proto-signing';
import { IBCInfo } from 'types/ibc';
import styles from './Balance.module.scss';
import tokenABI from 'config/abi/erc20.json';
import Big from 'big.js';
import {
  Multicall,
  ContractCallResults,
  ContractCallContext
} from 'ethereum-multicall';
import {
  AminoTypes,
  // BroadcastTxResponse,
  // isBroadcastTxFailure,
  DeliverTxResponse,
  isDeliverTxFailure,
  SigningStargateClient
} from '@cosmjs/stargate';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import _ from 'lodash';
import TokenBalance from 'components/TokenBalance';
import { ibcInfos, ibcInfosOld } from 'config/ibcInfos';
import {
  evmTokens,
  filteredTokens,
  gravityContracts,
  kawaiiTokens,
  TokenItemType,
  tokens
} from 'config/bridgeTokens';
import { network } from 'config/networks';
import {
  fetchBalance,
  fetchBalanceWithMapping,
  fetchTokenBalanceAll,
  // fetchNativeTokenBalance,
  generateConvertCw20Erc20Message,
  generateConvertMsgs,
  simulateSwap,
  Type
} from 'rest/api';
import Content from 'layouts/Content';
import {
  buildMultipleMessages,
  getEvmAddress,
  getFunctionExecution,
  getUsd,
  parseAmount,
  parseAmountFromWithDecimal as parseAmountFrom,
  parseAmountToWithDecimal as parseAmountTo,
  parseAmountToWithDecimal,
  parseBep20Erc20Name
} from 'libs/utils';
// import { Bech32Address, ibc } from '@keplr-wallet/cosmos';
import useGlobalState from 'hooks/useGlobalState';
import {
  BSC_CHAIN_ID,
  BSC_RPC,
  BSC_SCAN,
  COSMOS_CHAIN_ID,
  COSMOS_NETWORK_LCD,
  ERC20_ORAI,
  ETHEREUM_CHAIN_ID,
  ETHEREUM_RPC,
  ETHEREUM_SCAN,
  KAWAII_API_DEV,
  KAWAII_SUBNET_RPC,
  KWT,
  KWT_SCAN,
  KWT_SUBNETWORK_CHAIN_ID,
  NOTI_INSTALL_OWALLET,
  ORAI,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_FEE,
  ORAI_BRIDGE_CHAIN_ID,
  ORAI_BRIDGE_EVM_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_FEE,
  ORAI_BRIDGE_LCD,
  OSMOSIS_CHAIN_ID,
  OSMOSIS_NETWORK_LCD
} from 'config/constants';
import CosmJs, {
  getAminoExecuteContractMsgs,
  getExecuteContractMsgs,
  HandleOptions,
  parseExecuteContractMultiple
} from 'libs/cosmjs';
// import gravityRegistry, { sendToEthAminoTypes } from 'libs/gravity-registry';
import { MsgSendToEth } from '../../libs/proto/gravity/v1/msgs';
import { initEthereum } from 'polyfill';
import { useNavigate, useSearchParams } from 'react-router-dom';
import KawaiiverseJs from 'libs/kawaiiversejs';
import axios from 'axios';
import { useInactiveListener } from 'hooks/useMetamask';
import TokenItem from './TokenItem';
import KwtModal from './KwtModal';
import { MsgTransfer } from '../../libs/proto/ibc/applications/transfer/v1/tx';
import Long from 'long';
// import cosmwasmRegistry from 'libs/cosmwasm-registry';
import { Input } from 'antd';
import { createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate/build/modules/wasm/aminomessages';
// import { createIbcAminoConverters } from '@cosmjs/stargate/build/modules/ibc/aminomessages';
import { Fraction } from '@saberhq/token-utils';
import customRegistry, { customAminoTypes } from 'libs/registry';
import { getRpcEvm } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import CheckBox from 'components/CheckBox';
import useLocalStorage from 'hooks/useLocalStorage';
import { Contract } from 'config/contracts';
import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import {
  BalanceResponse,
  QueryMsg as TokenQueryMsg
} from 'libs/contracts/OraiswapToken.types';

interface BalanceProps {}

const { Search } = Input;

const arrayLoadToken = [
  { chainId: ORAI_BRIDGE_CHAIN_ID, lcd: ORAI_BRIDGE_LCD },
  { chainId: OSMOSIS_CHAIN_ID, lcd: OSMOSIS_NETWORK_LCD },
  { chainId: COSMOS_CHAIN_ID, lcd: COSMOS_NETWORK_LCD }
];
const Balance: React.FC<BalanceProps> = () => {
  const [searchParams] = useSearchParams();
  let tokenUrl = searchParams.get('token');
  const [keplrAddress] = useGlobalState('address');
  const [statusChangeAccount] = useGlobalState('statusChangeAccount');
  const [kwtSubnetAddress, setKwtSubnetAddress] = useState<string>();
  const [from, setFrom] = useState<TokenItemType>();
  const [to, setTo] = useState<TokenItemType>();
  const [chainInfo] = useGlobalState('chainInfo');
  const [hideOtherSmallAmount, setHideOtherSmallAmount] =
    useLocalStorage<boolean>('hideOtherSmallAmount', false);
  const [hideOraichainSmallAmount, setHideOraichainSmallAmount] =
    useLocalStorage<boolean>('hideOraichainSmallAmount', false);
  const [amounts, setAmounts] = useGlobalState('amounts');
  const [[fromTokens, toTokens], setTokens] = useState<TokenItemType[][]>([
    [],
    []
  ]);
  const [txHash, setTxHash] = useState('');

  const { data: prices } = useCoinGeckoPrices(
    filteredTokens.map((t) => t.coingeckoId)
  );

  const [metamaskAddress] = useGlobalState('metamaskAddress');

  // useEffect(() => {
  //   displayToast(TToastType.TX_INFO, {
  //     message:
  //       'Due to the suspension of BNB Chain following its cross-chain bridge exploit, DO NOT use any bridges between BNB Chain and Oraichain or any other networks until our next announcement.',
  //   }, {
  //     position: 'top-center',
  //     autoClose: false,
  //   });
  // }, []);

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
    if (!keplrAddress) return;
    getKwtSubnetAddress();
  }, [keplrAddress]);

  useEffect(() => {
    loadTokenAmounts();
  }, [prices, txHash, keplrAddress, chainInfo]);

  useEffect(() => {
    loadTokens();
  }, [prices, txHash, keplrAddress, chainInfo]);

  useEffect(() => {
    if (!!metamaskAddress) {
      loadEvmOraiAmounts();
    }
  }, [prices, metamaskAddress, txHash]);

  useEffect(() => {
    if (!!kwtSubnetAddress) {
      loadKawaiiSubnetAmount();
    }
  }, [prices, kwtSubnetAddress, txHash]);

  const handleCheckWallet = async () => {
    const keplr = await window.Keplr.getKeplr();
    if (!keplr) {
      return displayToast(TToastType.TX_INFO, NOTI_INSTALL_OWALLET, {
        toastId: 'install_keplr'
      });
    }
  };

  const loadTokens = async () => {
    await handleCheckWallet();
    for (const tokenBridgeOsmosisCosmos of arrayLoadToken) {
      const address = await window.Keplr.getKeplrAddr(
        tokenBridgeOsmosisCosmos.chainId
      );
      setNativeBalance(address, tokenBridgeOsmosisCosmos.lcd);
    }
  };

  const getKwtSubnetAddress = async () => {
    try {
      const key = await window.Keplr.getKeplrKey();
      // TODO: need to support nano ledger for kwt with cointype 60
      if (key.isNanoLedger) {
        setKwtSubnetAddress('');
        return;
      }
      const evmAddress = getEvmAddress(
        await window.Keplr.getKeplrAddr(KWT_SUBNETWORK_CHAIN_ID)
      );
      setKwtSubnetAddress(evmAddress);
    } catch (error) {
      displayToast(TToastType.TX_FAILED, {
        message: error.message
      });
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
    multicallContractAddress: string
  ): Promise<[string, AmountDetail][]> => {
    const multicall = new Multicall({
      nodeUrl: rpc,
      multicallCustomContractAddress: multicallContractAddress
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
          usd: getUsd(amount, prices[token.coingeckoId], token.decimals)
        } as AmountDetail
      ];
    });
  };

  // update concurrency
  const loadEvmOraiAmounts = () => {
    getFunctionExecution(
      loadEvmEntries,
      [
        metamaskAddress,
        evmTokens.filter((t) => t.chainId === BSC_CHAIN_ID),
        BSC_RPC,
        '0xcA11bde05977b3631167028862bE2a173976CA11'
      ],
      'loadEthEntries'
    ).then((data) => {
      setAmounts((old) => ({ ...old, ...Object.fromEntries(data) }));
    });

    getFunctionExecution(
      loadEvmEntries,
      [
        metamaskAddress,
        evmTokens.filter((t) => t.chainId === ETHEREUM_CHAIN_ID),
        ETHEREUM_RPC,
        '0xcA11bde05977b3631167028862bE2a173976CA11'
      ],
      'loadBscEntries'
    ).then((data) => {
      setAmounts((old) => ({ ...old, ...Object.fromEntries(data) }));
    });
  };

  const loadKawaiiSubnetAmount = async () => {
    let amountDetails = Object.fromEntries(
      await getFunctionExecution(
        loadEvmEntries,
        [
          kwtSubnetAddress,
          kawaiiTokens.filter((t) => !!t.contractAddress),
          KAWAII_SUBNET_RPC,
          '0x74876644692e02459899760B8b9747965a6D3f90'
        ],
        'loadKawaiiEntries'
      )
    );
    // update amounts
    setAmounts((old) => ({ ...old, ...amountDetails }));
  };

  const setNativeBalance = async (address: string, lcd?: string) => {
    const amountAll = (await fetchTokenBalanceAll(address, lcd))?.balances;
    const amountDetails = amountAll?.reduce(
      (acc, cur) => {
        const token = filteredTokens?.find(
          (token) => token.denom === cur.denom
        );
        return {
          ...acc,
          [cur.denom]: {
            amount: parseInt(cur.amount),
            usd: !token
              ? 0
              : getUsd(
                  parseInt(cur.amount),
                  prices[token.coingeckoId] ?? 0,
                  token.decimals
                )
          }
        };
      },
      { ...amounts }
    );
    setAmounts((old) => ({ ...old, ...amountDetails }));
  };

  const setCw20Balance = async (address: string) => {
    // get all cw20 token contract
    const cw20Tokens = filteredTokens.filter((t) => t.contractAddress);
    const data = toBinary({
      balance: { address }
    } as TokenQueryMsg);
    console.log(address, Contract.multicall);
    const res = await getFunctionExecution(
      Contract.multicall.aggregate,
      [
        {
          queries: cw20Tokens.map((t) => ({
            address: t.contractAddress,
            data
          }))
        }
      ],
      'loadCw20Entries'
    );

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

    setAmounts((old) => ({ ...old, ...amountDetails }));
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
      const address = await window.Keplr.getKeplrAddr();

      await Promise.all([setCw20Balance(address), setNativeBalance(address)]);
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
        customLink: customLink
          ? customLink
          : `${token.lcd}/cosmos/tx/v1beta1/txs/${result.transactionHash}`
      });
    }
    setTxHash(result.transactionHash);
  };

  const onClickToken = useCallback(
    (type: string, token: TokenItemType) => {
      // if (token.denom === ERC20_ORAI) {
      //   displayToast(TToastType.TX_INFO, {
      //     message: `Token ${token.name} on ${token.org} is currently not supported`
      //   });
      //   return;
      // }

      if (type === 'to') {
        if (_.isEqual(to, token)) {
          setTo(undefined);
        } else setTo(token);
      } else {
        if (_.isEqual(from, token)) {
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

  const transferFromGravity = async (
    fromToken: TokenItemType,
    amount: number
  ) => {
    try {
      console.log('transferFromGravity');
      const keplr = await window.Keplr.getKeplr();
      if (!keplr) return;
      // disable Oraibridge -> BNB Chain Ledger
      const key = await keplr.getKey(network.chainId);
      if (key.isNanoLedger) {
        displayToast(TToastType.TX_FAILED, {
          message: 'Ethereum signing with Ledger is not yet supported!'
        });
        return;
      }

      await window.Keplr.suggestChain(fromToken.chainId as string);
      const fromAddress = await window.Keplr.getKeplrAddr(
        fromToken.chainId as string
      );

      if (!metamaskAddress || !fromAddress) {
        displayToast(TToastType.TX_FAILED, {
          message: 'Please login both metamask and keplr!'
        });
        return;
      }

      const rawAmount = parseAmountToWithDecimal(amount, fromToken.decimals)
        .minus(ORAI_BRIDGE_EVM_FEE)
        .minus(ORAI_BRIDGE_CHAIN_FEE)
        .toFixed(0);

      const offlineSigner = await window.Keplr.getOfflineSigner(
        fromToken.chainId as string
      );
      let aminoTypes = new AminoTypes({ ...customAminoTypes });
      // sendToEthAminoTypes['/gravity.v1.MsgSendToEth']
      // Initialize the gaia api with the offline signer that is injected by Keplr extension.
      const client = await SigningStargateClient.connectWithSigner(
        fromToken.rpc,
        offlineSigner,
        { registry: customRegistry, aminoTypes }
      );

      const message = {
        typeUrl: '/gravity.v1.MsgSendToEth',
        value: MsgSendToEth.fromPartial({
          sender: fromAddress,
          ethDest: metamaskAddress,
          amount: {
            denom: fromToken.denom,
            amount: rawAmount
          },
          bridgeFee: {
            denom: fromToken.denom,
            // just a number to make sure there is a friction
            amount: ORAI_BRIDGE_EVM_FEE
          },
          chainFee: {
            denom: fromToken.denom,
            // just a number to make sure there is a friction
            amount: ORAI_BRIDGE_CHAIN_FEE
          },
          evmChainPrefix: fromToken.prefix
        })
      };
      const fee = {
        amount: [],
        gas: '200000'
      };
      const result = await client.signAndBroadcast(fromAddress, [message], fee);

      processTxResult(fromToken, result);
    } catch (ex: any) {
      displayToast(TToastType.TX_FAILED, {
        message: `${ex}`
      });
    }
  };

  const transferIbcCustom = async (
    fromToken: TokenItemType,
    toToken: TokenItemType,
    transferAmount: number
  ) => {
    try {
      console.log('from token: ', fromToken);
      console.log('to token: ', toToken);
      if (transferAmount === 0) throw { message: 'Transfer amount is empty' };
      const keplr = await window.Keplr.getKeplr();
      if (!keplr) return;
      // disable Oraichain -> Oraibridge Ledger
      const key = await keplr.getKey(network.chainId);
      if (key.isNanoLedger && toToken.org == 'OraiBridge') {
        displayToast(TToastType.TX_FAILED, {
          message: 'Ethereum signing with Ledger is not yet supported!'
        });
        return;
      }

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

      let amount = coin(
        parseAmountToWithDecimal(transferAmount, fromToken.decimals).toFixed(0),
        fromToken.denom
      );

      let ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];

      // check if from token has erc20 map then we need to convert back to bep20 / erc20 first. TODO: need to filter if convert to ERC20 or BEP20
      if (!fromToken.erc20Cw20Map) {
        if (toToken.chainId === ORAI_BRIDGE_CHAIN_ID) {
          ibcInfo = ibcInfosOld[fromToken.chainId][toToken.chainId];
          await transferIBCOrai({
            fromToken,
            toTokenPrefix: toToken.prefix,
            fromAddress,
            toAddress,
            amount,
            ibcInfo
          });
          return;
        }
        await transferIBC({
          fromToken,
          fromAddress,
          toAddress,
          amount,
          ibcInfo
        });
        return;
      }

      // if it includes wasm in source => ibc wasm case
      if (ibcInfo.source.includes('wasm')) {
        // switch ibc info to erc20cw20 map case, where we need to convert between ibc & cw20 for backward compatibility
        ibcInfo = ibcInfosOld[fromToken.chainId][toToken.chainId];
      }

      console.log('ibc info: ', ibcInfo);

      amount = coin(
        parseAmountToWithDecimal(
          transferAmount,
          fromToken.erc20Cw20Map[0].decimals.erc20Decimals
        ).toFixed(0),
        fromToken.erc20Cw20Map[0].erc20Denom
      );

      const msgConvertReverses = await generateConvertCw20Erc20Message(
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
      const memo =
        toToken.org === 'OraiBridge' ? toToken.prefix + metamaskAddress : '';
      // get raw ibc tx
      const msgTransfer = {
        typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
        value: MsgTransfer.fromPartial({
          sourcePort: ibcInfo.source,
          sourceChannel: ibcInfo.channel,
          token: amount,
          sender: fromAddress,
          receiver: toAddress,
          memo,
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
        { registry: customRegistry, aminoTypes }
      );
      const result = await client.signAndBroadcast(
        fromAddress,
        [...executeContractMsgs, msgTransfer],
        {
          gas: '300000',
          amount: []
        }
      );
      processTxResult(
        fromToken,
        result,
        `${network.explorer}/txs/${result.transactionHash}`
      );
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

  // note: duplicate func need scale (transferIBCOrai,transferIBC, transferIBCKwt,...)
  const transferIBCOrai = async (data: {
    fromToken: TokenItemType;
    toTokenPrefix: string;
    fromAddress: string;
    toAddress: string;
    amount: Coin;
    ibcInfo: IBCInfo;
  }) => {
    const {
      fromToken,
      fromAddress,
      toAddress,
      amount,
      ibcInfo,
      toTokenPrefix
    } = data;

    try {
      const offlineSigner = await window.Keplr.getOfflineSigner(
        fromToken.chainId as string
      );
      const msgTransfer = {
        typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
        value: MsgTransfer.fromPartial({
          sourcePort: ibcInfo.source,
          sourceChannel: ibcInfo.channel,
          token: amount,
          sender: fromAddress,
          receiver: toAddress,
          memo: toTokenPrefix + metamaskAddress,
          timeoutTimestamp: Long.fromNumber(
            Math.floor(Date.now() / 1000) + ibcInfo.timeout
          )
            .multiply(1000000000)
            .toString()
        })
      };

      let aminoTypes = new AminoTypes({ ...customAminoTypes });
      // Initialize the gaia api with the offline signer that is injected by Keplr extension.
      const client = await SigningStargateClient.connectWithSigner(
        fromToken.rpc,
        offlineSigner,
        { registry: customRegistry, aminoTypes }
      );
      const result = await client.signAndBroadcast(fromAddress, [msgTransfer], {
        gas: '300000',
        amount: []
      });
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
        parseAmountToWithDecimal(transferAmount, fromToken.decimals).toFixed(0),
        fromToken.denom
      );

      const ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];
      var customMessages: any[];

      // check if from token has erc20 map then we need to convert back to bep20 / erc20 first. TODO: need to filter if convert to ERC20 or BEP20
      if (fromToken.erc20Cw20Map) {
        const msgConvertReverses = await generateConvertCw20Erc20Message(
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
        parseAmountToWithDecimal(transferAmount, fromToken.decimals).toFixed(0),
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
    // if (isMobile()) {
    //   displayToast(TToastType.TX_FAILED, {
    //     message: 'Metamask mobile app is not supported yet!',
    //   });
    //   return;
    // }

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
      const result = await window.Metamask.transferToGravity(
        from!.chainId as string,
        fromAmount.toString(),
        from!.contractAddress!,
        metamaskAddress,
        keplrAddress
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
    const fromBalance =
      from && amounts[from.denom] ? amounts[from.denom].amount : 0;
    if (fromAmount <= 0 || fromAmount * from.decimals > fromBalance) {
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
        await transferIbcCustom(from, to, fromAmount);
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
      const _fromAmount = parseAmountTo(amount, token.decimals).toFixed(0);
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
        parseAmountToWithDecimal(transferAmount, fromToken.decimals).toFixed(0),
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

  const totalUsd = _.sumBy(Object.values(amounts), (c) => c.usd);

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
        <div className={styles.search}>
          <Search
            placeholder="Search token"
            onSearch={(text: string) => {
              if (!text) return navigate('');
              navigate(`?token=${text}`);
            }}
            style={{
              width: 420,
              background: '#1E1E21',
              borderRadius: '8px',
              padding: '10px'
            }}
          />
        </div>
        <div className={styles.transferTab}>
          {/* From Tab */}

          <div className={styles.border_gradient}>
            <div className={styles.balance_block}>
              <div className={styles.tableHeader}>
                <span className={styles.label}>Other chains</span>
                <CheckBox
                  label="Hide small balances"
                  checked={hideOtherSmallAmount}
                  onCheck={setHideOtherSmallAmount}
                />
              </div>
              <div className={styles.table}>
                <div className={styles.tableDes}>
                  <span className={styles.subLabel}>Available assets</span>
                  <span className={styles.subLabel}>Balance</span>
                </div>
                <div className={styles.tableContent}>
                  {fromTokens.map((t: TokenItemType) => {
                    if (
                      hideOtherSmallAmount &&
                      !Number(amounts[t.denom]?.amount)
                    ) {
                      return false;
                    }

                    return (
                      <TokenItem
                        key={t.denom}
                        amountDetail={amounts[t.denom]}
                        className={styles.token_from}
                        active={from?.denom === t.denom}
                        token={t}
                        transferFromGravity={transferFromGravity}
                        convertToken={convertToken}
                        onClick={onClickTokenFrom}
                        onClickTransfer={
                          !!to
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
                        toToken={to}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.transferBtn} />
          <div className={styles.border_gradient}>
            <div className={styles.balance_block}>
              <div className={styles.tableHeader}>
                <span className={styles.label}>Oraichain</span>
                <CheckBox
                  label="Hide small balances"
                  checked={hideOraichainSmallAmount}
                  onCheck={setHideOraichainSmallAmount}
                />
              </div>
              <div className={styles.table}>
                <div className={styles.tableDes}>
                  <span className={styles.subLabel}>Available assets</span>
                  <span className={styles.subLabel}>Balance</span>
                </div>
                <div className={styles.tableContent}>
                  {toTokens
                    .filter((t) => {
                      if (
                        hideOraichainSmallAmount &&
                        !Number(amounts[t.denom]?.amount)
                      ) {
                        return false;
                      }

                      if (from?.chainId === KWT_SUBNETWORK_CHAIN_ID) {
                        const name = parseBep20Erc20Name(from.name);
                        return t.name.includes(name);
                      }
                      return (
                        !from ||
                        (from.chainId !== ORAI_BRIDGE_CHAIN_ID &&
                          t.name === from.name)
                      );
                    })
                    .map((t: TokenItemType) => {
                      const name = parseBep20Erc20Name(t.name);
                      const transferToToken = fromTokens.find(
                        (t) =>
                          t.cosmosBased &&
                          t.name.includes(name) &&
                          t.chainId !== ORAI_BRIDGE_CHAIN_ID
                      );

                      return (
                        <TokenItem
                          key={t.denom}
                          amountDetail={amounts[t.denom]}
                          active={to?.denom === t.denom}
                          token={t}
                          onClick={onClickTokenTo}
                          convertToken={convertToken}
                          transferIBC={transferIbcCustom}
                          onClickTransfer={
                            !!transferToToken
                              ? (fromAmount: number) =>
                                  onClickTransfer(
                                    fromAmount,
                                    to,
                                    transferToToken
                                  )
                              : undefined
                          }
                          toToken={transferToToken}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          {/* End To Tab  */}
        </div>
        {tokenUrl === 'kwt' && <KwtModal />}
      </div>
    </Content>
  );
};

export default Balance;
