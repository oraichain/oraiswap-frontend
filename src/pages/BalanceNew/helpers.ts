import { createWasmAminoConverters, ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { coin, Coin } from '@cosmjs/proto-signing';
import { AminoTypes, DeliverTxResponse, GasPrice, SigningStargateClient } from '@cosmjs/stargate';
import { gravityContracts, kawaiiTokens, TokenItemType, tokenMap, tokens } from 'config/bridgeTokens';
import {
  KWT,
  KWT_BSC_CONTRACT,
  KWT_SUBNETWORK_CHAIN_ID,
  MILKY_BSC_CONTRACT,
  ORAI,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID,
  ORAI_BRIDGE_DENOM,
  ORAI_BRIDGE_RPC,
  ORAI_BRIDGE_UDENOM
} from 'config/constants';
import { Contract } from 'config/contracts';
import { ibcInfos, ibcInfosOld, oraib2oraichain, oraichain2oraib } from 'config/ibcInfos';
import { network } from 'config/networks';
import { getNetworkGasPrice } from 'helper';
import { TransferBackMsg } from 'libs/contracts';
import CosmJs, { getExecuteContractMsgs, HandleOptions, parseExecuteContractMultiple } from 'libs/cosmjs';
import KawaiiverseJs from 'libs/kawaiiversejs';
import { MsgTransfer } from 'libs/proto/ibc/applications/transfer/v1/tx';
import customRegistry, { customAminoTypes } from 'libs/registry';
import { buildMultipleMessages, generateError, parseBep20Erc20Name, toAmount } from 'libs/utils';
import Long from 'long';
import {
  generateConvertCw20Erc20Message,
  generateConvertMsgs,
  generateMoveOraib2OraiMessages,
  parseTokenInfo,
  Type
} from 'rest/api';
import { IBCInfo } from 'types/ibc';
import { RemainingOraibTokenItem } from './StuckOraib/useGetOraiBridgeBalances';

/**
 * This function converts the destination address (from BSC / ETH -> Oraichain) to an appropriate format based on the BSC / ETH token contract address
 * @param keplrAddress - receiver address on Oraichain
 * @param contractAddress - BSC / ETH token contract address
 * @returns converted receiver address
 */
export const getOneStepKeplrAddr = (keplrAddress: string, contractAddress: string): string => {
  let oneStepKeplrAddr = `${oraib2oraichain}/${keplrAddress}`;
  // we only support the old oraibridge ibc channel <--> Oraichain for MILKY & KWT
  if (contractAddress === KWT_BSC_CONTRACT || contractAddress === MILKY_BSC_CONTRACT) {
    oneStepKeplrAddr = keplrAddress;
  }
  return oneStepKeplrAddr;
};

export const transferIBC = async (data: {
  fromToken: TokenItemType;
  fromAddress: string;
  toAddress: string;
  amount: Coin;
  ibcInfo: IBCInfo;
}): Promise<DeliverTxResponse> => {
  const { fromToken, fromAddress, toAddress, amount, ibcInfo } = data;

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
  await window.Keplr.suggestChain(toToken.chainId as string);
  // enable from to send transaction
  await window.Keplr.suggestChain(fromToken.chainId as string);
  const fromAddress = await window.Keplr.getKeplrAddr(fromToken.chainId as string);
  const toAddress = await window.Keplr.getKeplrAddr(toToken.chainId as string);
  if (!fromAddress || !toAddress) throw generateError('Please login keplr!');

  var amount = coin(toAmount(transferAmount, fromToken.decimals).toString(), fromToken.denom);

  const ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];
  var customMessages: any[];

  // check if from token has erc20 map then we need to convert back to bep20 / erc20 first. TODO: need to filter if convert to ERC20 or BEP20
  if (fromToken.evmDenoms) {
    const msgConvertReverses = generateConvertCw20Erc20Message(amounts, fromToken, fromAddress, amount);
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
  await window.Keplr.suggestChain(toToken.chainId as string);
  // enable from to send transaction
  await window.Keplr.suggestChain(fromToken.chainId as string);
  const fromAddress = await window.Keplr.getKeplrAddr(fromToken.chainId as string);
  const toAddress = await window.Keplr.getKeplrAddr(toToken.chainId as string);
  if (!fromAddress || !toAddress) throw generateError('Please login keplr!');
  const nativeToken = kawaiiTokens.find((token) => token.cosmosBased && token.coingeckoId === fromToken.coingeckoId); // collect kawaiiverse cosmos based token for conversion

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
  return result;
};

export const transferEvmToIBC = async (
  from: TokenItemType,
  metamaskAddress: string,
  fromAmount: number
): Promise<any> => {
  await window.Metamask.switchNetwork(from!.chainId);
  const oraiAddress = await window.Keplr.getKeplrAddr();
  if (!metamaskAddress || !oraiAddress) throw generateError('Please login both metamask and keplr!');
  const gravityContractAddr = gravityContracts[from!.chainId!] as string;
  if (!gravityContractAddr || !from) {
    return;
  }

  await window.Metamask.checkOrIncreaseAllowance(from, metamaskAddress, gravityContractAddr, fromAmount);
  let oneStepKeplrAddr = getOneStepKeplrAddr(oraiAddress, from.contractAddress);
  const result = await window.Metamask.transferToGravity(from, fromAmount, metamaskAddress, oneStepKeplrAddr);
  return result;
};

export const transferIBCMultiple = async (
  fromAddress: string,
  chainId: string,
  rpc: string,
  feeDenom: string,
  messages: MsgTransfer[]
) => {
  const encodedMessages = messages.map((message) => ({
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: MsgTransfer.fromPartial(message)
  }));
  const offlineSigner = await window.Keplr.getOfflineSigner(chainId);
  const aminoTypes = new AminoTypes({
    ...customAminoTypes
  });
  // Initialize the gaia api with the offline signer that is injected by Keplr extension.
  const client = await SigningStargateClient.connectWithSigner(rpc, offlineSigner, {
    registry: customRegistry,
    aminoTypes,
    gasPrice: GasPrice.fromString(`${(await getNetworkGasPrice()).average}${feeDenom}`)
  });
  const result = await client.signAndBroadcast(fromAddress, encodedMessages, 'auto');
  return result;
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
  return result;
};

export const transferToRemoteChainIbcWasm = async (
  ibcInfo: IBCInfo,
  fromToken: TokenItemType,
  toToken: TokenItemType,
  toAddress: string,
  amount: string,
  ibcMemo: string
): Promise<ExecuteResult> => {
  const ibcWasmContractAddress = ibcInfo.source.split('.')[1];
  if (!ibcWasmContractAddress)
    throw generateError('IBC Wasm source port is invalid. Cannot transfer to the destination chain');

  const { info: assetInfo } = parseTokenInfo(fromToken);
  const ibcWasmContract = Contract.ibcwasm(ibcWasmContractAddress);
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
  }
  return result;
};

// Oraichain (Orai)
export const transferIbcCustom = async (
  fromToken: TokenItemType,
  toToken: TokenItemType,
  transferAmount: number,
  amounts: AmountDetails,
  metamaskAddress?: string
): Promise<DeliverTxResponse> => {
  if (transferAmount === 0) throw generateError('Transfer amount is empty');

  await window.Keplr.suggestChain(toToken.chainId as string);
  // enable from to send transaction
  await window.Keplr.suggestChain(fromToken.chainId as string);
  // check address
  const fromAddress = await window.Keplr.getKeplrAddr(fromToken.chainId as string);
  const toAddress = await window.Keplr.getKeplrAddr(toToken.chainId as string);
  if (!fromAddress || !toAddress) throw generateError('Please login keplr!');

  if (toToken.chainId === ORAI_BRIDGE_CHAIN_ID && !toToken.prefix) throw generateError('Prefix Token not found!');

  let amount = coin(toAmount(transferAmount, fromToken.decimals).toString(), fromToken.denom);
  const ibcMemo = toToken.chainId === ORAI_BRIDGE_CHAIN_ID ? toToken.prefix + metamaskAddress : '';
  let ibcInfo: IBCInfo = ibcInfos[fromToken.chainId][toToken.chainId];
  // only allow transferring back to ethereum / bsc only if there's metamask address and when the metamask address is used, which is in the ibcMemo variable
  if (!metamaskAddress && (fromToken.evmDenoms || ibcInfo.channel === oraichain2oraib)) {
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
  }
  // if it includes wasm in source => ibc wasm case
  if (ibcInfo.channel === oraichain2oraib) {
    try {
      // special case. We try-catch because cosmwasm stargate already check tx code for us & throw an error if code != 0 => we can safely cast to DeliverTxResponse if there's no error
      const result = await transferToRemoteChainIbcWasm(ibcInfo, fromToken, toToken, toAddress, amount.amount, ibcMemo);
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

export const findDefaultToToken = (toTokens: TokenItemType[], from: TokenItemType) => {
  if (from?.chainId === KWT_SUBNETWORK_CHAIN_ID) {
    const name = parseBep20Erc20Name(from.name);
    return toTokens.find((t) => t.name.includes(name));
  }

  return toTokens.find((t) => !from || (from.chainId !== ORAI_BRIDGE_CHAIN_ID && t.name === from.name));
};

export const convertKwt = async (transferAmount: number, fromToken: TokenItemType): Promise<DeliverTxResponse> => {
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
  let msgs: any;
  if (type === 'nativeToCw20') {
    msgs = generateConvertMsgs({
      type: Type.CONVERT_TOKEN,
      sender: oraiAddress,
      inputAmount: _fromAmount,
      inputToken: token
    });
  } else if (type === 'cw20ToNative') {
    msgs = generateConvertMsgs({
      type: Type.CONVERT_TOKEN_REVERSE,
      sender: oraiAddress,
      inputAmount: _fromAmount,
      inputToken: token,
      outputToken
    });
  }
  const msg = msgs[0];
  const result = await CosmJs.execute({
    prefix: ORAI,
    address: msg.contract,
    walletAddr: oraiAddress,
    handleMsg: msg.msg.toString(),
    gasAmount: { denom: ORAI, amount: '0' },
    handleOptions: { funds: msg.sent_funds } as HandleOptions
  });
  return result;
};

export const moveOraibToOraichain = async (remainingOraib: RemainingOraibTokenItem[]) => {
  // TODO: Transfer multiple IBC messages in a single transaction only
  // we can hardcode OraiBridge because we are transferring from the bridge to Oraichain
  const fromAddress = await window.Keplr.getKeplrAddr(ORAI_BRIDGE_CHAIN_ID);
  const toAddress = await window.Keplr.getKeplrAddr(ORAICHAIN_ID);
  const transferMsgs = generateMoveOraib2OraiMessages(remainingOraib, fromAddress, toAddress);

  // we can hardcode OraiBridge because we are transferring from the bridge to Oraichain
  const result = await transferIBCMultiple(
    fromAddress,
    ORAI_BRIDGE_CHAIN_ID,
    ORAI_BRIDGE_RPC,
    ORAI_BRIDGE_UDENOM,
    transferMsgs
  );
  return result;
};
