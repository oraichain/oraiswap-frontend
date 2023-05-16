import {
  CosmWasmClient,
  createWasmAminoConverters,
  ExecuteResult,
  SigningCosmWasmClient
} from '@cosmjs/cosmwasm-stargate';
import { coin, Coin } from '@cosmjs/proto-signing';
import { AminoTypes, DeliverTxResponse, GasPrice, SigningStargateClient } from '@cosmjs/stargate';
import {
  cosmosTokens,
  flattenTokens,
  gravityContracts,
  kawaiiTokens,
  TokenItemType,
  tokenMap,
  UniversalSwapType
} from 'config/bridgeTokens';
import { CosmosChainId, chainInfos, NetworkChainId } from 'config/chainInfos';
import { KWT, KWT_BSC_CONTRACT, MILKY_BSC_CONTRACT, ORAI } from 'config/constants';
import { ibcInfos, ibcInfosOld, oraib2oraichain, oraichain2oraib } from 'config/ibcInfos';
import { network } from 'config/networks';
import { calculateTimeoutTimestamp, getNetworkGasPrice } from 'helper';

import CosmJs, {
  collectWallet,
  getExecuteContractMsgs,
  HandleOptions,
  parseExecuteContractMultiple
} from 'libs/cosmjs';
import KawaiiverseJs from 'libs/kawaiiversejs';
import { MsgTransfer } from 'libs/proto/ibc/applications/transfer/v1/tx';
import customRegistry, { customAminoTypes } from 'libs/registry';
import { buildMultipleMessages, generateError, toAmount } from 'libs/utils';
import { OraiswapTokenClient } from '@oraichain/orderbook-contracts-sdk';
import { CwIcs20LatestClient, TransferBackMsg } from '@oraichain/common-contracts-sdk';
import {
  generateConvertCw20Erc20Message,
  generateConvertMsgs,
  generateMoveOraib2OraiMessages,
  getTokenOnOraichain,
  parseTokenInfo,
  parseTokenInfoRawDenom,
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
export const getSourceReceiver = (keplrAddress: string, contractAddress?: string): string => {
  let oneStepKeplrAddr = `${oraib2oraichain}/${keplrAddress}`;
  // we only support the old oraibridge ibc channel <--> Oraichain for MILKY & KWT
  if (contractAddress === KWT_BSC_CONTRACT || contractAddress === MILKY_BSC_CONTRACT) {
    oneStepKeplrAddr = keplrAddress;
  }
  return oneStepKeplrAddr;
};

/**
 * This function receives fromToken and toToken as parameters to generate the destination memo for the receiver address
 * @param from - from token
 * @param to - to token
 * @param destReceiver - destination destReceiver
 * @returns destination in the format <dest-channel>/<dest-destReceiver>:<dest-denom>
 */
export const getDestination = (
  fromToken?: TokenItemType,
  toToken?: TokenItemType,
  destReceiver?: string
): { destination: string; universalSwapType: UniversalSwapType } => {
  if (!fromToken || !toToken || !destReceiver)
    return { destination: '', universalSwapType: 'other-networks-to-oraichain' };
  // this is the simplest case. Both tokens on the same Oraichain network => simple swap with to token denom
  if (fromToken.chainId === 'Oraichain' && toToken.chainId === 'Oraichain') {
    return { destination: '', universalSwapType: 'oraichain-to-oraichain' };
  }
  // we dont need to have any destination for this case
  if (fromToken.chainId === 'Oraichain') {
    return { destination: '', universalSwapType: 'oraichain-to-other-networks' };
  }
  if (
    fromToken.chainId === 'cosmoshub-4' ||
    fromToken.chainId === 'osmosis-1' ||
    fromToken.chainId === 'kawaii_6886-1' ||
    fromToken.chainId === '0x1ae6'
  ) {
    throw new Error(`chain id ${fromToken.chainId} is currently not supported in universal swap`);
  }
  // if to token chain id is Oraichain, then we dont need to care about ibc msg case
  if (toToken.chainId === 'Oraichain') {
    // first case, two tokens are the same, only different in network => simple swap
    if (fromToken.coinGeckoId === toToken.coinGeckoId)
      return { destination: destReceiver, universalSwapType: 'other-networks-to-oraichain' };
    // if they are not the same then we set dest denom
    return {
      destination: `${destReceiver}:${parseTokenInfoRawDenom(toToken)}`,
      universalSwapType: 'other-networks-to-oraichain'
    };
  }
  // the remaining cases where we have to process ibc msg
  const ibcInfo: IBCInfo = ibcInfos['Oraichain'][toToken.chainId]; // we get ibc channel that transfers toToken from Oraichain to the toToken chain
  // getTokenOnOraichain is called to get the ibc denom / cw20 denom on Oraichain so that we can create an ibc msg using it
  let receiverPrefix = '';
  if (window.Metamask.isEthAddress(destReceiver)) receiverPrefix = toToken.prefix;
  return {
    destination: `${ibcInfo.channel}/${receiverPrefix}${destReceiver}:${parseTokenInfoRawDenom(
      getTokenOnOraichain(toToken.coinGeckoId)
    )}`,
    universalSwapType: 'other-networks-to-oraichain'
  };
};

export const combineReceiver = (
  sourceReceiver: string,
  fromToken?: TokenItemType,
  toToken?: TokenItemType,
  destReceiver?: string
): { combinedReceiver: string; universalSwapType: UniversalSwapType } => {
  const source = getSourceReceiver(sourceReceiver, fromToken?.contractAddress);
  const { destination, universalSwapType } = getDestination(fromToken, toToken, destReceiver);
  if (destination.length > 0) return { combinedReceiver: `${source}:${destination}`, universalSwapType };
  return { combinedReceiver: source, universalSwapType };
};

export const transferIBC = async (data: {
  fromToken: TokenItemType;
  fromAddress: string;
  toAddress: string;
  amount: Coin;
  ibcInfo: IBCInfo;
}): Promise<DeliverTxResponse> => {
  const { fromToken, fromAddress, toAddress, amount, ibcInfo } = data;
  const offlineSigner = await window.Keplr.getOfflineSigner(fromToken.chainId);
  const client = await SigningStargateClient.connectWithSigner(fromToken.rpc, offlineSigner);
  const result = await client.sendIbcTokens(
    fromAddress,
    toAddress,
    amount,
    ibcInfo.source,
    ibcInfo.channel,
    undefined,
    parseInt(calculateTimeoutTimestamp(ibcInfo.timeout)),
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
      timeoutTimestamp: parseInt(calculateTimeoutTimestamp(ibcInfo.timeout))
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
      timeoutTimestamp: parseInt(calculateTimeoutTimestamp(ibcInfo.timeout))
    },
    amount: amount.amount,
    contractAddr: fromToken?.contractAddress
  });
  return result;
};

export const transferEvmToIBC = async (
  from: TokenItemType,
  fromAmount: number,
  address: {
    metamaskAddress?: string;
    tronAddress?: string;
  },
  combinedReceiver?: string
): Promise<any> => {
  const { metamaskAddress, tronAddress } = address;
  const finalTransferAddress = window.Metamask.isTron(from.chainId) ? tronAddress : metamaskAddress;
  const oraiAddress = await window.Keplr.getKeplrAddr();
  if (!finalTransferAddress || !oraiAddress) throw generateError('Please login both metamask or tronlink and keplr!');
  const gravityContractAddr = gravityContracts[from!.chainId!];
  if (!gravityContractAddr || !from) {
    throw generateError('No gravity contract addr or no from token');
  }

  await window.Metamask.checkOrIncreaseAllowance(from, finalTransferAddress, gravityContractAddr, fromAmount);
  const result = await window.Metamask.transferToGravity(
    from,
    fromAmount,
    finalTransferAddress,
    combinedReceiver ?? combineReceiver(oraiAddress, from).combinedReceiver
  );
  return result;
};

export const transferIBCMultiple = async (
  fromAddress: string,
  chainId: CosmosChainId,
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
    gasPrice: GasPrice.fromString(`${await getNetworkGasPrice()}${feeDenom}`)
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
  console.log({ executeContractMsgs });
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
  console.log({ msgTransfer });

  const offlineSigner = await window.Keplr.getOfflineSigner(fromToken.chainId);
  const aminoTypes = new AminoTypes({
    ...createWasmAminoConverters(),
    ...customAminoTypes
  });
  // Initialize the gaia api with the offline signer that is injected by Keplr extension.
  const client = await SigningStargateClient.connectWithSigner(fromToken.rpc, offlineSigner, {
    registry: customRegistry,
    aminoTypes,
    gasPrice: GasPrice.fromString(`${await getNetworkGasPrice()}${network.denom}`)
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
  const wallet = await collectWallet(network.chainId);
  const accounts = await wallet.getAccounts();
  const sender = accounts[0].address;
  const client = await SigningCosmWasmClient.connectWithSigner(network.rpc, wallet, {
    prefix: network.prefix,
    gasPrice: GasPrice.fromString(`0${network.denom}`)
  });

  const { info: assetInfo } = parseTokenInfo(fromToken);
  const ibcWasmContract = new CwIcs20LatestClient(client, sender, ibcWasmContractAddress);
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
  console.log({ amount });
  if (assetInfo.native_token) {
    console.log({ msg, amount: { amount, denom: fromToken.denom } });
    result = await ibcWasmContract.transferToRemote(msg, 'auto', undefined, [{ amount, denom: fromToken.denom }]);
  } else {
    const transferBackMsgCw20Msg: TransferBackMsg = {
      local_channel_id: msg.localChannelId,
      remote_address: msg.remoteAddress,
      remote_denom: msg.remoteDenom,
      timeout: msg.timeout,
      memo: msg.memo
    };
    console.log({ transferBackMsgCw20Msg });
    const cw20Token = new OraiswapTokenClient(client, sender, fromToken.contractAddress);
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
      console.log({ ibcInfo, fromToken, toToken, toAddress, amount: amount.amount, ibcMemo });
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

export const findToToken = (fromToken: TokenItemType, toNetwork: NetworkChainId) => {
  const toToken = cosmosTokens.find((t) =>
    t.chainId === 'oraibridge-subnet-2' && t.coinGeckoId === fromToken.coinGeckoId && t?.bridgeNetworkIdentifier
      ? t.bridgeNetworkIdentifier === toNetwork
      : t.chainId === toNetwork
  );
  return toToken;
};
