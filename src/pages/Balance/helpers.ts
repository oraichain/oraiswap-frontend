import { ExecuteInstruction, ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { Coin, coin } from '@cosmjs/proto-signing';
import { DeliverTxResponse, GasPrice } from '@cosmjs/stargate';
import {
  CosmosChainId,
  IBCInfo,
  KWT,
  ORAI,
  TokenItemType,
  ibcInfos,
  ibcInfosOld,
  oraichain2oraib,
  flattenTokens,
  tokenMap
} from '@oraichain/oraidex-common';
import { kawaiiTokens } from 'config/bridgeTokens';
import { chainInfos } from 'config/chainInfos';
import { network } from 'config/networks';
import { getNetworkGasPrice } from 'helper';

import { CwIcs20LatestClient } from '@oraichain/common-contracts-sdk';
import { TransferBackMsg } from '@oraichain/common-contracts-sdk/build/CwIcs20Latest.types';
import {
  buildMultipleExecuteMessages,
  calculateTimeoutTimestamp,
  getEncodedExecuteContractMsgs,
  parseTokenInfo,
  toAmount
} from '@oraichain/oraidex-common';
import { OraiswapTokenClient } from '@oraichain/oraidex-contracts-sdk';
import { Long } from 'cosmjs-types/helpers';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
import CosmJs, { collectWallet, connectWithSigner, getCosmWasmClient } from 'libs/cosmjs';
import KawaiiverseJs from 'libs/kawaiiversejs';
import { generateError } from 'libs/utils';
import { Type, generateConvertCw20Erc20Message, generateConvertMsgs, generateMoveOraib2OraiMessages } from 'rest/api';
import { RemainingOraibTokenItem } from './StuckOraib/useGetOraiBridgeBalances';

export const transferIBC = async (data: {
  fromToken: TokenItemType;
  fromAddress: string;
  toAddress: string;
  amount: Coin;
  ibcInfo: IBCInfo;
  memo?: string;
}): Promise<DeliverTxResponse> => {
  const { fromToken, fromAddress, toAddress, amount, ibcInfo, memo } = data;
  const transferMsg: MsgTransfer = {
    sourcePort: ibcInfo.source,
    sourceChannel: ibcInfo.channel,
    token: amount,
    sender: fromAddress,
    receiver: toAddress,
    memo,
    timeoutTimestamp: Long.fromString(calculateTimeoutTimestamp(ibcInfo.timeout)),
    timeoutHeight: undefined
  };
  const result = await transferIBCMultiple(
    fromAddress,
    fromToken.chainId as CosmosChainId,
    fromToken.rpc,
    fromToken.denom,
    [transferMsg],
    fromToken.prefix
  );
  return result;
};

export const transferIBCKwt = async (
  fromToken: TokenItemType,
  toToken: TokenItemType,
  transferAmount: number,
  amounts: AmountDetails
): Promise<DeliverTxResponse> => {
  if (transferAmount === 0) throw generateError('Transfer amount is empty');
  const keplr = await window.Keplr.getKeplr();
  if (!keplr) return;
  await window.Keplr.suggestChain(toToken.chainId);
  // enable from to send transaction
  await window.Keplr.suggestChain(fromToken.chainId);
  const fromAddress = await window.Keplr.getKeplrAddr(fromToken.chainId);
  const toAddress = await window.Keplr.getKeplrAddr(toToken.chainId);
  if (!fromAddress || !toAddress) throw generateError('Please login keplr!');

  var amount = coin(toAmount(transferAmount, fromToken.decimals).toString(), fromToken.denom);

  const ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];
  var customMessages: any[];

  // check if from token has erc20 map then we need to convert back to bep20 / erc20 first. TODO: need to filter if convert to ERC20 or BEP20
  if (fromToken.evmDenoms) {
    const msgConvertReverses = generateConvertCw20Erc20Message(amounts, fromToken, fromAddress, amount);
    const executeContractMsgs = getEncodedExecuteContractMsgs(
      fromAddress,
      buildMultipleExecuteMessages(undefined, ...msgConvertReverses)
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
      timeoutTimestamp: ibcInfo.timeout
    },
    customMessages
  });
  return result;
};

export const convertTransferIBCErc20Kwt = async (
  fromToken: TokenItemType,
  toToken: TokenItemType,
  transferAmount: number
): Promise<DeliverTxResponse> => {
  if (transferAmount === 0) throw generateError('Transfer amount is empty!');
  const keplr = await window.Keplr.getKeplr();
  if (!keplr) return;
  await window.Keplr.suggestChain(toToken.chainId);
  // enable from to send transaction
  await window.Keplr.suggestChain(fromToken.chainId);
  const fromAddress = await window.Keplr.getKeplrAddr(fromToken.chainId);
  const toAddress = await window.Keplr.getKeplrAddr(toToken.chainId);
  if (!fromAddress || !toAddress) throw generateError('Please login keplr!');
  const nativeToken = kawaiiTokens.find(
    (token) =>
      token.bridgeTo &&
      token.cosmosBased &&
      token.coinGeckoId === fromToken.coinGeckoId &&
      token.denom !== fromToken.denom
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
      timeoutTimestamp: ibcInfo.timeout
    },
    amount: amount.amount,
    contractAddr: fromToken?.contractAddress
  });
  return result;
};

export const transferIBCMultiple = async (
  fromAddress: string,
  fromChainId: CosmosChainId,
  rpc: string,
  feeDenom: string,
  messages: MsgTransfer[],
  prefix?: string
): Promise<DeliverTxResponse> => {
  const encodedMessages = messages.map((message) => ({
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: MsgTransfer.fromPartial(message)
  }));
  const offlineSigner = await collectWallet(fromChainId);
  // Initialize the gaia api with the offline signer that is injected by Keplr extension.
  const client = await connectWithSigner(rpc, offlineSigner, fromChainId === 'injective-1' ? 'injective' : 'cosmwasm', {
    gasPrice: GasPrice.fromString(`${await getNetworkGasPrice()}${prefix || feeDenom}`)
  });
  const result = await client.signAndBroadcast(fromAddress, encodedMessages, 'auto');
  return result as DeliverTxResponse;
};

export const transferTokenErc20Cw20Map = async ({
  amounts,
  transferAmount,
  fromToken,
  fromAddress,
  toAddress,
  ibcInfo,
  ibcMemo
}: {
  amounts: AmountDetails;
  transferAmount: number;
  fromToken: TokenItemType;
  fromAddress: string;
  toAddress: string;
  ibcInfo: IBCInfo;
  ibcMemo?: string;
}): Promise<DeliverTxResponse> => {
  const evmToken = tokenMap[fromToken.evmDenoms[0]];
  const evmAmount = coin(toAmount(transferAmount, evmToken.decimals).toString(), evmToken.denom);

  const msgConvertReverses = generateConvertCw20Erc20Message(amounts, fromToken, fromAddress, evmAmount);

  const executeContractMsgs = buildMultipleExecuteMessages(undefined, ...msgConvertReverses);
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
      timeoutTimestamp: calculateTimeoutTimestamp(ibcInfo.timeout)
    })
  };

  // Initialize the gaia api with the offline signer that is injected by Keplr extension.
  const { client } = await getCosmWasmClient(
    { rpc: fromToken.rpc, chainId: fromToken.chainId },
    {
      gasPrice: GasPrice.fromString(`${await getNetworkGasPrice()}${network.denom}`)
    }
  );
  const result = await client.signAndBroadcast(
    fromAddress,
    [...getEncodedExecuteContractMsgs(fromAddress, executeContractMsgs), msgTransfer],
    'auto'
  );
  return result;
};

export const transferToRemoteChainIbcWasm = async (
  ibcInfo: IBCInfo,
  fromToken: TokenItemType,
  toToken: TokenItemType,
  fromAddress: string,
  toAddress: string,
  amount: string,
  ibcMemo: string
): Promise<ExecuteResult> => {
  const ibcWasmContractAddress = ibcInfo.source.split('.')[1];
  if (!ibcWasmContractAddress)
    throw generateError('IBC Wasm source port is invalid. Cannot transfer to the destination chain');

  const { info: assetInfo } = parseTokenInfo(fromToken);
  const ibcWasmContract = new CwIcs20LatestClient(window.client, fromAddress, ibcWasmContractAddress);
  try {
    // query if the cw20 mapping has been registered for this pair or not. If not => we switch to erc20cw20 map case
    await ibcWasmContract.pairMappingsFromAssetInfo({ assetInfo });
  } catch (error) {
    // switch ibc info to erc20cw20 map case, where we need to convert between ibc & cw20 for backward compatibility
    throw generateError('Cannot transfer to remote chain because cannot find mapping pair');
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
  if ('native_token' in assetInfo) {
    result = await ibcWasmContract.transferToRemote(msg, 'auto', undefined, [{ amount, denom: fromToken.denom }]);
  } else {
    const transferBackMsgCw20Msg: TransferBackMsg = {
      local_channel_id: msg.localChannelId,
      remote_address: msg.remoteAddress,
      remote_denom: msg.remoteDenom,
      timeout: msg.timeout,
      memo: msg.memo
    };
    const cw20Token = new OraiswapTokenClient(window.client, fromAddress, fromToken.contractAddress);
    result = await cw20Token.send(
      {
        amount,
        contract: ibcWasmContractAddress,
        msg: Buffer.from(JSON.stringify(transferBackMsgCw20Msg)).toString('base64')
      },
      'auto'
    );
  }
  return result;
};

// Oraichain (Orai)
export const transferIbcCustom = async (
  fromToken: TokenItemType,
  toToken: TokenItemType,
  transferAmount: number,
  amounts: AmountDetails,
  transferAddress?: string
): Promise<DeliverTxResponse> => {
  if (transferAmount === 0) throw generateError('Transfer amount is empty');
  await window.Keplr.suggestChain(toToken.chainId);
  // enable from to send transaction
  await window.Keplr.suggestChain(fromToken.chainId);
  // check address
  const fromAddress = await window.Keplr.getKeplrAddr(fromToken.chainId);
  const toAddress = await window.Keplr.getKeplrAddr(toToken.chainId);
  if (!fromAddress || !toAddress) throw generateError('Please login keplr!');
  if (toToken.chainId === 'oraibridge-subnet-2' && !toToken.prefix) throw generateError('Prefix Token not found!');

  let amount = coin(toAmount(transferAmount, fromToken.decimals).toString(), fromToken.denom);
  const ibcMemo = toToken.chainId === 'oraibridge-subnet-2' ? toToken.prefix + transferAddress : '';
  let ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];
  // only allow transferring back to ethereum / bsc only if there's metamask address and when the metamask address is used, which is in the ibcMemo variable
  if (!transferAddress && (fromToken.evmDenoms || ibcInfo.channel === oraichain2oraib)) {
    throw generateError('Please login metamask!');
  }
  // for KWT & MILKY tokens, we use the old ibc info channel
  if (fromToken.evmDenoms || kawaiiTokens.find((i) => i.name === fromToken.name))
    ibcInfo = ibcInfosOld[fromToken.chainId][toToken.chainId];
  let result: DeliverTxResponse;
  if (fromToken.evmDenoms) {
    result = await transferTokenErc20Cw20Map({
      amounts,
      transferAmount,
      fromToken,
      fromAddress,
      toAddress,
      ibcInfo,
      ibcMemo
    });
    return result;
  }
  // if it includes wasm in source => ibc wasm case
  if (ibcInfo.channel === oraichain2oraib) {
    try {
      // special case. We try-catch because cosmwasm stargate already check tx code for us & throw an error if code != 0 => we can safely cast to DeliverTxResponse if there's no error
      const result = await transferToRemoteChainIbcWasm(
        ibcInfo,
        fromToken,
        toToken,
        fromAddress,
        toAddress,
        amount.amount,
        ibcMemo
      );
      // @ts-ignore
      return { ...result, code: 0 };
    } catch (error) {
      throw generateError(error.toString());
    }
  }
  result = await transferIBC({
    fromToken,
    fromAddress,
    toAddress,
    amount,
    ibcInfo
  });
  return result;
};

export const findDefaultToToken = (from: TokenItemType) => {
  if (!from.bridgeTo) return;
  return flattenTokens.find(
    (t) => from.bridgeTo.includes(t.chainId) && from.name.includes(t.name) && from.chainId !== t.chainId
  );
};

export const convertKwt = async (transferAmount: number, fromToken: TokenItemType): Promise<DeliverTxResponse> => {
  if (transferAmount === 0) throw new Error('Transfer amount is empty');
  const keplr = await window.Keplr.getKeplr();
  if (!keplr) return;
  await window.Keplr.suggestChain(fromToken.chainId);
  const fromAddress = await window.Keplr.getKeplrAddr(fromToken.chainId);

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
  return result;
};

export const broadcastConvertTokenTx = async (
  amount: number,
  token: TokenItemType,
  type: 'cw20ToNative' | 'nativeToCw20',
  outputToken?: TokenItemType
): Promise<ExecuteResult> => {
  const _fromAmount = toAmount(amount, token.decimals).toString();
  const oraiAddress = await window.Keplr.getKeplrAddr();
  if (!oraiAddress) throw generateError('Please login both metamask and Keplr!');
  let msg: ExecuteInstruction;
  if (type === 'nativeToCw20') {
    msg = generateConvertMsgs({
      type: Type.CONVERT_TOKEN,
      sender: oraiAddress,
      inputAmount: _fromAmount,
      inputToken: token
    });
  } else if (type === 'cw20ToNative') {
    msg = generateConvertMsgs({
      type: Type.CONVERT_TOKEN_REVERSE,
      sender: oraiAddress,
      inputAmount: _fromAmount,
      inputToken: token,
      outputToken
    });
  }
  const result = await CosmJs.execute({
    prefix: ORAI,
    address: msg.contractAddress,
    walletAddr: oraiAddress,
    handleMsg: msg.msg,
    gasAmount: { denom: ORAI, amount: '0' },
    funds: msg.funds
  });
  return result;
};

export const moveOraibToOraichain = async (remainingOraib: RemainingOraibTokenItem[]) => {
  // we can hardcode OraiBridge because we are transferring from the bridge to Oraichain
  const fromAddress = await window.Keplr.getKeplrAddr('oraibridge-subnet-2');
  const toAddress = await window.Keplr.getKeplrAddr('Oraichain');
  const transferMsgs = generateMoveOraib2OraiMessages(remainingOraib, fromAddress, toAddress);

  // we can hardcode OraiBridge because we are transferring from the bridge to Oraichain
  const result = await transferIBCMultiple(
    fromAddress,
    'oraibridge-subnet-2',
    chainInfos.find((c) => c.chainId === 'oraibridge-subnet-2').rpc,
    'uoraib',
    transferMsgs
  );
  return result;
};
