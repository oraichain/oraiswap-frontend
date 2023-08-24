import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import { AminoTypes, GasPrice, SigningStargateClient, coin } from '@cosmjs/stargate';
import { TokenItemType, UniversalSwapType, oraichainTokens } from 'config/bridgeTokens';
import { NetworkChainId } from 'config/chainInfos';
import { ORAI, ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX } from 'config/constants';
import { ibcInfos, oraichain2oraib } from 'config/ibcInfos';
import { network } from 'config/networks';
import { calculateTimeoutTimestamp, getNetworkGasPrice, tronToEthAddress } from 'helper';
import {
  CwIcs20LatestInterface,
  CwIcs20LatestQueryClient,
  CwIcs20LatestReadOnlyInterface,
  Ratio,
  TransferBackMsg,
  Uint128
} from '@oraichain/common-contracts-sdk';
import CosmJs, { getExecuteContractMsgs, parseExecuteContractMultiple } from 'libs/cosmjs';
import { MsgTransfer } from 'libs/proto/ibc/applications/transfer/v1/tx';
import customRegistry, { customAminoTypes } from 'libs/registry';
import { atomic, buildMultipleMessages, generateError, toAmount, toDisplay } from 'libs/utils';
import { findToToken, transferEvmToIBC } from 'pages/Balance/helpers';
import { SwapQuery, Type, generateContractMessages, parseTokenInfo } from 'rest/api';
import { IBCInfo } from 'types/ibc';

/**
 * Get transfer token fee when universal swap
 * @param param0
 * @returns
 */
export const getTransferTokenFee = async ({ remoteTokenDenom }): Promise<Ratio | undefined> => {
  try {
    const ibcWasmContractAddress = process.env.REACT_APP_IBC_WASM_CONTRACT;
    const ibcWasmContract = new CwIcs20LatestQueryClient(window.client, ibcWasmContractAddress);
    const ratio = await ibcWasmContract.getTransferTokenFee({ remoteTokenDenom });
    return ratio;
  } catch (error) {
    console.log({ error });
  }
};

export const calculateMinimum = (simulateAmount: number | string, userSlippage: number): bigint | string => {
  if (!simulateAmount) return '0';
  try {
    return BigInt(simulateAmount) - (BigInt(simulateAmount) * BigInt(userSlippage * atomic)) / (100n * BigInt(atomic));
  } catch (error) {
    console.log({ error });
    return '0';
  }
};

export interface SwapData {
  metamaskAddress?: string;
  tronAddress?: string;
}

export const checkEvmAddress = (chainId: NetworkChainId, metamaskAddress?: string, tronAddress?: string | boolean) => {
  switch (chainId) {
    case '0x01':
    case '0x38':
      if (!metamaskAddress) {
        throw generateError('Please login Metamask wallet!');
      }
      break;
    case '0x2b6653dc':
      if (!tronAddress) {
        throw generateError('Please login Tron wallet!');
      }
  }
};

export class UniversalSwapHandler {
  public toTokenInOrai: TokenItemType;
  constructor(
    public sender: string,
    public originalFromToken: TokenItemType,
    public originalToToken: TokenItemType,
    public fromAmount: number,
    public simulateAmount: string,
    public userSlippage: number,
    public cwIcs20LatestClient?: CwIcs20LatestInterface | CwIcs20LatestReadOnlyInterface
  ) {}

  calculateMinReceive(simulateAmount: string, userSlippage: number, decimals: number): Uint128 {
    const amount = toDisplay(simulateAmount, decimals);
    const result = amount * (1 - userSlippage / 100);
    return toAmount(result, decimals).toString();
  }

  async getUniversalSwapToAddress(toChainId: NetworkChainId): Promise<string> {
    if (toChainId === '0x01' || toChainId === '0x1ae6' || toChainId === '0x2b6653dc' || toChainId === '0x38') {
      return await window.Metamask.getEthAddress();
    }
    return await window.Keplr.getKeplrAddr(toChainId);
  }

  /**
   * Combine messages for universal swap token from Oraichain to Cosmos networks(Osmosis | Cosmos-hub).
   * @returns combined messages
   */
  async combineMsgCosmos(): Promise<EncodeObject[]> {
    const ibcInfo: IBCInfo = ibcInfos[this.originalFromToken.chainId][this.originalToToken.chainId];
    const toAddress = await window.Keplr.getKeplrAddr(this.originalToToken.chainId);
    if (!toAddress) throw generateError('Please login keplr!');

    const amount = coin(this.simulateAmount, this.toTokenInOrai.denom);
    const msgTransfer = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: MsgTransfer.fromPartial({
        sourcePort: ibcInfo.source,
        sourceChannel: ibcInfo.channel,
        token: amount,
        sender: this.sender,
        receiver: toAddress,
        memo: '',
        timeoutTimestamp: calculateTimeoutTimestamp(ibcInfo.timeout)
      })
    };

    // if not same coingeckoId, swap first then transfer token that have same coingeckoid.
    if (this.originalFromToken.coinGeckoId !== this.originalToToken.coinGeckoId) {
      const msgSwap = this.generateMsgsSwap();
      const msgExecuteSwap = getExecuteContractMsgs(this.sender, parseExecuteContractMultiple(msgSwap));
      return [...msgExecuteSwap, msgTransfer];
    }
    return [msgTransfer];
  }

  getTranferAddress(metamaskAddress: string, tronAddress: string, ibcInfo: IBCInfo) {
    let transferAddress = metamaskAddress;
    // check tron network and convert address
    if (this.originalToToken.prefix === ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX) {
      transferAddress = tronToEthAddress(tronAddress);
    }
    // only allow transferring back to ethereum / bsc only if there's metamask address and when the metamask address is used, which is in the ibcMemo variable
    if (!transferAddress && (this.toTokenInOrai.evmDenoms || ibcInfo.channel === oraichain2oraib)) {
      throw generateError('Please login metamask / tronlink!');
    }
    return transferAddress;
  }

  getIbcMemo(transferAddress: string) {
    return this.originalToToken.chainId === 'oraibridge-subnet-2' ? this.originalToToken.prefix + transferAddress : '';
  }

  /**
   * Combine messages for universal swap token from Oraichain to EVM networks(BSC | Ethereum | Tron).
   * @returns combined messages
   */
  async combineMsgEvm(metamaskAddress: string, tronAddress: string) {
    let msgExecuteSwap: EncodeObject[] = [];
    // if from and to dont't have same coingeckoId, create swap msg to combine with bridge msg
    if (this.originalFromToken.coinGeckoId !== this.originalToToken.coinGeckoId) {
      const msgSwap = this.generateMsgsSwap();
      msgExecuteSwap = getExecuteContractMsgs(this.sender, parseExecuteContractMultiple(msgSwap));
    }

    // then find new _toToken in Oraibridge that have same coingeckoId with originalToToken.
    this.originalToToken = findToToken(this.toTokenInOrai, this.originalToToken.chainId);

    const toAddress = await window.Keplr.getKeplrAddr(this.originalToToken.chainId);
    if (!toAddress) throw generateError('Please login keplr!');

    const { ibcInfo, ibcMemo } = this.getIbcInfoIbcMemo(metamaskAddress, tronAddress);

    // create bridge msg
    const msgTransfer = this.generateMsgsTransferOraiToEvm(ibcInfo, toAddress, ibcMemo);
    const msgExecuteTransfer = getExecuteContractMsgs(this.sender, parseExecuteContractMultiple(msgTransfer));
    return [...msgExecuteSwap, ...msgExecuteTransfer];
  }

  getIbcInfoIbcMemo(metamaskAddress: string, tronAddress: string) {
    if (!ibcInfos[this.originalFromToken.chainId]) throw generateError('Cannot find ibc info');
    const ibcInfo: IBCInfo = ibcInfos[this.originalFromToken.chainId][this.originalToToken.chainId];
    const transferAddress = this.getTranferAddress(metamaskAddress, tronAddress, ibcInfo);
    const ibcMemo = this.getIbcMemo(transferAddress);
    return {
      ibcInfo,
      ibcMemo
    };
  }

  async checkBalanceChannelIbc(ibcInfo: IBCInfo) {
    const ics20Contract =
      this.cwIcs20LatestClient ?? new CwIcs20LatestQueryClient(window.client, process.env.REACT_APP_IBC_WASM_CONTRACT);
    const { balances } = await ics20Contract.channel({
      forward: false,
      id: ibcInfo.channel
    });

    for (let balance of balances) {
      if (
        'native' in balance &&
        balance.native.denom === `${ibcInfo.source}/${ibcInfo.channel}/${this.originalToToken.denom}`
      ) {
        const pairMapping = await ics20Contract.pairMapping({ key: balance.native.denom });
        const trueBalance = toDisplay(balance.native.amount, pairMapping.pair_mapping.remote_decimals);
        const _toAmount = toDisplay(this.simulateAmount);
        if (trueBalance < _toAmount) {
          throw generateError(`${ibcInfo.channel}/${this.originalToToken.denom} is not enough balance!`);
        }
      } else {
        // do nothing because currently we dont have any cw20 balance in the channel
      }
    }
    return false;
  }

  async swap(): Promise<any> {
    const messages = this.generateMsgsSwap();
    const result = await CosmJs.executeMultiple({
      prefix: ORAI,
      walletAddr: this.sender,
      msgs: messages,
      gasAmount: { denom: ORAI, amount: '0' }
    });
    return result;
  }

  async combineMsgs(metamaskAddress: string, tronAddress: string): Promise<EncodeObject[]> {
    if (this.originalToToken.chainId === 'cosmoshub-4' || this.originalToToken.chainId === 'osmosis-1')
      return this.combineMsgCosmos();
    return this.combineMsgEvm(metamaskAddress, tronAddress);
  }

  // Universal swap from Oraichain to cosmos-hub | osmosis | EVM networks.
  async swapAndTransfer({ metamaskAddress, tronAddress }: SwapData): Promise<any> {
    // find to token in Oraichain to swap first and use this.toTokenInOrai as originalFromToken in bridge message.
    this.toTokenInOrai = oraichainTokens.find((t) => t.coinGeckoId === this.originalToToken.coinGeckoId);

    const combinedMsgs = await this.combineMsgs(metamaskAddress, tronAddress);
    const { ibcInfo } = this.getIbcInfoIbcMemo(metamaskAddress, tronAddress);
    await this.checkBalanceChannelIbc(ibcInfo);

    // handle sign and broadcast transactions
    const offlineSigner = await window.Keplr.getOfflineSigner(this.originalFromToken.chainId);
    const aminoTypes = new AminoTypes({
      ...createWasmAminoConverters(),
      ...customAminoTypes
    });
    const client = await SigningStargateClient.connectWithSigner(this.originalFromToken.rpc, offlineSigner, {
      registry: customRegistry,
      aminoTypes,
      gasPrice: GasPrice.fromString(`${await getNetworkGasPrice()}${network.denom}`)
    });
    const result = await client.signAndBroadcast(this.sender, combinedMsgs, 'auto');
    return result;
  }

  async transferAndSwap(combinedReceiver: string, metamaskAddress?: string, tronAddress?: string): Promise<any> {
    return transferEvmToIBC(
      { from: this.originalFromToken, to: this.originalToToken },
      this.fromAmount,
      { metamaskAddress, tronAddress },
      combinedReceiver,
      this.simulateAmount
    );
  }

  async processUniversalSwap(combinedReceiver: string, universalSwapType: UniversalSwapType, swapData: SwapData) {
    if (universalSwapType === 'oraichain-to-oraichain') return this.swap();
    if (universalSwapType === 'oraichain-to-other-networks') return this.swapAndTransfer(swapData);
    return this.transferAndSwap(combinedReceiver, swapData.metamaskAddress, swapData.tronAddress);
  }

  generateMsgsSwap() {
    try {
      const _fromAmount = toAmount(this.fromAmount, this.originalFromToken.decimals).toString();

      const minimumReceive = this.calculateMinReceive(
        this.simulateAmount,
        this.userSlippage,
        this.originalFromToken.decimals
      );
      const msgs = generateContractMessages({
        type: Type.SWAP,
        sender: this.sender,
        amount: _fromAmount,
        fromInfo: this.originalFromToken!,
        toInfo: this.toTokenInOrai ?? this.originalToToken,
        minimumReceive
      } as SwapQuery);
      const msg = msgs[0];

      const messages = buildMultipleMessages(msg);
      return messages;
    } catch (error) {
      throw new Error(`Error generateMsgsSwap: ${error}`);
    }
  }

  /**
   * Generate message to transfer token from Oraichain to EVM networks.
   * Example: AIRI/Oraichain -> AIRI/BSC
   * @param ibcInfo
   * @param toAddress
   * @param ibcMemo
   * @returns
   */
  generateMsgsTransferOraiToEvm(ibcInfo: IBCInfo, toAddress: string, ibcMemo: string) {
    try {
      const { info: assetInfo } = parseTokenInfo(this.toTokenInOrai);

      const ibcWasmContractAddress = ibcInfo.source.split('.')[1];
      if (!ibcWasmContractAddress)
        throw generateError('IBC Wasm source port is invalid. Cannot transfer to the destination chain');

      const msg: TransferBackMsg = {
        local_channel_id: ibcInfo.channel,
        remote_address: toAddress,
        remote_denom: this.originalToToken.denom,
        timeout: ibcInfo.timeout,
        memo: ibcMemo
      };

      // if asset info is native => send native way, else send cw20 way
      if (assetInfo.native_token) {
        const executeMsgSend = {
          transfer_to_remote: msg
        };

        const msgs = {
          contract: ibcWasmContractAddress,
          msg: Buffer.from(JSON.stringify(executeMsgSend)),
          sender: this.sender,
          sent_funds: [{ amount: this.simulateAmount, denom: ORAI }]
        };
        return buildMultipleMessages(msgs);
      }

      const executeMsgSend = {
        send: {
          contract: ibcWasmContractAddress,
          amount: this.simulateAmount,
          msg: cosmwasm.toBinary(msg)
        }
      };

      // generate contract message for CW20 token in Oraichain.
      // Example: tranfer USDT/Oraichain -> AIRI/BSC. _toTokenInOrai is AIRI in Oraichain.
      const msgs = {
        contract: this.toTokenInOrai.contractAddress,
        msg: Buffer.from(JSON.stringify(executeMsgSend)),
        sender: this.sender,
        sent_funds: []
      };
      return buildMultipleMessages(msgs);
    } catch (error) {
      console.log({ error });
    }
  }
}
