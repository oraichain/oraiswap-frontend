import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
import { AminoTypes, DeliverTxResponse, GasPrice, SigningStargateClient, coin } from '@cosmjs/stargate';
import { TokenItemType, UniversalSwapType, oraichainTokens } from 'config/bridgeTokens';
import { NetworkChainId, oraichainNetwork } from 'config/chainInfos';
import { ORAI, ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX } from 'config/constants';
import { Contract } from 'config/contracts';
import { ibcInfos, oraichain2oraib } from 'config/ibcInfos';
import { network } from 'config/networks';
import { getNetworkGasPrice, tronToEthAddress } from 'helper';
import { TransferBackMsg, Uint128 } from 'libs/contracts';
import CosmJs, { getExecuteContractMsgs } from 'libs/cosmjs';
import { MsgTransfer } from 'libs/proto/ibc/applications/transfer/v1/tx';
import customRegistry, { customAminoTypes } from 'libs/registry';
import { buildMultipleMessages, generateError, toAmount, toDisplay } from 'libs/utils';
import Long from 'long';
import { findToToken, transferEvmToIBC } from 'pages/BalanceNew/helpers';
import { SwapQuery, Type, generateContractMessages, parseTokenInfo } from 'rest/api';
import { IBCInfo } from 'types/ibc';

export interface SwapData {
  fromAmountToken: number;
  simulateAmount: string;
  amounts: AmountDetails;
  userSlippage?: number;
  metamaskAddress?: string;
  tronAddress?: string;
}

export class UniversalSwapHandler {
  private _sender: string;
  private _fromToken: TokenItemType;
  private _toToken: TokenItemType;
  private _toTokenInOrai: TokenItemType;

  constructor(sender?: string, fromToken?: TokenItemType, toToken?: TokenItemType) {
    this._sender = sender;
    this._fromToken = fromToken;
    this._toToken = toToken;
  }

  get fromToken() {
    return this._fromToken;
  }

  get toToken() {
    return this._toToken;
  }

  get sender() {
    return this._sender;
  }

  set fromToken(from: TokenItemType) {
    this._fromToken = from;
  }

  set toToken(to: TokenItemType) {
    this._toToken = to;
  }

  set sender(sender: string) {
    this._sender = sender;
  }

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

  async handleTransferIBC(
    fromAmountToken: number,
    transferAmount: number,
    metamaskAddress: string,
    tronAddress: string,
    simulateAmount: string
  ) {
    let transferAddress = metamaskAddress;
    // check tron network and convert address
    if (this._toToken.prefix === ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX) {
      transferAddress = tronToEthAddress(tronAddress);
    }

    const ibcMemo = this._toToken.chainId === 'oraibridge-subnet-2' ? this._toToken.prefix + transferAddress : '';
    let ibcInfo: IBCInfo = ibcInfos[this._toTokenInOrai.chainId][this._toToken.chainId];
    // only allow transferring back to ethereum / bsc only if there's metamask address and when the metamask address is used, which is in the ibcMemo variable
    if (!transferAddress && (this._toTokenInOrai.evmDenoms || ibcInfo.channel === oraichain2oraib)) {
      throw generateError('Please login metamask!');
    }

    const result = await this.executeMultipleMsgs({
      transferAmount: transferAmount,
      ibcInfo,
      ibcMemo,
      fromAmountToken,
      simulateAmount,
      transferAddress
    });
    return result;
  }

  async swap(fromAmountToken: number, simulateAmount: string, userSlippage?: number): Promise<any> {
    const messages = this.generateMsgsSwap(fromAmountToken, simulateAmount, userSlippage);
    const result = await CosmJs.executeMultiple({
      prefix: ORAI,
      walletAddr: this.sender,
      msgs: messages,
      gasAmount: { denom: ORAI, amount: '0' }
    });
    return result;
  }

  executeMultipleMsgs = async ({
    transferAmount,
    ibcInfo,
    ibcMemo,
    fromAmountToken,
    simulateAmount,
    userSlippage,
    transferAddress
  }: {
    transferAmount: number;
    ibcInfo: IBCInfo;
    transferAddress: string;
    ibcMemo?: string;
    fromAmountToken: number;
    simulateAmount: string;
    userSlippage?: number;
  }): Promise<DeliverTxResponse> => {
    try {
      const amount = coin(toAmount(transferAmount, this._toTokenInOrai.decimals).toString(), this._toTokenInOrai.denom);

      const msgSwap = this.generateMsgsSwap(fromAmountToken, simulateAmount, userSlippage);
      const msgExecuteSwap = getExecuteContractMsgs(this._sender, msgSwap);

      const msgTransfer = {
        typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
        value: MsgTransfer.fromPartial({
          sourcePort: ibcInfo.source,
          sourceChannel: ibcInfo.channel,
          token: amount,
          sender: this._sender,
          receiver: transferAddress,
          // receiver: 'oraib14n3tx8s5ftzhlxvq0w5962v60vd82h305kec0j',
          memo: ibcMemo,
          timeoutTimestamp: Long.fromNumber(Math.floor(Date.now() / 1000) + ibcInfo.timeout)
            .multiply(1000000000)
            .toString()
        })
      };

      console.log([...msgExecuteSwap, msgTransfer]);

      const offlineSigner = await window.Keplr.getOfflineSigner(oraichainNetwork.chainId);
      const aminoTypes = new AminoTypes({
        ...customAminoTypes
      });

      // Initialize the gaia api with the offline signer that is injected by Keplr extension.
      const client = await SigningStargateClient.connectWithSigner(oraichainNetwork.rpc, offlineSigner, {
        registry: customRegistry,
        aminoTypes,
        gasPrice: GasPrice.fromString(`${await getNetworkGasPrice()}${network.denom}`)
      });
      // const result = await client.signAndBroadcast(this._sender, [...msgExecuteSwap, msgTransfer], 'auto');
      const result = await client.signAndBroadcast(this._sender, [msgTransfer], 'auto');
      return result;
    } catch (error) {
      console.log('error in executeMultipleMsgs:', error);
    }
  };

  /** Universal swap from Oraichain to cosmos-hub | osmosis | EVM networks.
   * B1: find toToken in Oraichain (this._toTokenInOrai) to swap first
   * B2: find toToken in in Osmosis | CosmosHub | Oraibridge for EVM network to bridge from Oraichain
   */
  async swapAndTransfer({ fromAmountToken, simulateAmount, metamaskAddress, tronAddress }: SwapData): Promise<any> {
    this._toTokenInOrai = oraichainTokens.find((t) => t.name === this._toToken.name);
    const transferAmount = toDisplay(simulateAmount);
    this._toToken = findToToken(this._toTokenInOrai, this._toToken.chainId);
    const result = await this.handleTransferIBC(
      fromAmountToken,
      transferAmount,
      metamaskAddress,
      tronAddress,
      simulateAmount
    );
    return result;
  }

  async transferAndSwap(
    fromAmount: number,
    combinedReceiver: string,
    metamaskAddress?: string,
    tronAddress?: string
  ): Promise<any> {
    return transferEvmToIBC(this.fromToken, fromAmount, { metamaskAddress, tronAddress }, combinedReceiver);
  }

  async processUniversalSwap(combinedReceiver: string, universalSwapType: UniversalSwapType, swapData: SwapData) {
    if (universalSwapType === 'oraichain-to-oraichain')
      return this.swap(swapData.fromAmountToken, swapData.simulateAmount, swapData.userSlippage);
    if (universalSwapType === 'oraichain-to-other-networks') return this.swapAndTransfer(swapData);
    return this.transferAndSwap(
      swapData.fromAmountToken,
      combinedReceiver,
      swapData.metamaskAddress,
      swapData.tronAddress
    );
  }

  generateMsgsSwap(fromAmountToken: number, simulateAmount: string, userSlippage: number) {
    try {
      const _fromAmount = toAmount(fromAmountToken, this.fromToken.decimals).toString();

      const minimumReceive = this.calculateMinReceive(simulateAmount, userSlippage, this.fromToken.decimals);
      const msgs = generateContractMessages({
        type: Type.SWAP,
        sender: this._sender,
        amount: _fromAmount,
        fromInfo: this.fromToken!,
        toInfo: this._toTokenInOrai ?? this._toToken,
        minimumReceive
      } as SwapQuery);

      const msg = msgs[0];

      const messages = buildMultipleMessages(msg);
      return messages;
    } catch (error) {
      throw new Error(`Error generateMsgsSwap: ${error}`);
    }
  }
}
