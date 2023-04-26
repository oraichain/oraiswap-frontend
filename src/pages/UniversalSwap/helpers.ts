import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate';
import { AminoTypes, GasPrice, SigningStargateClient, coin } from '@cosmjs/stargate';
import { TokenItemType, UniversalSwapType, oraichainTokens } from 'config/bridgeTokens';
import { NetworkChainId } from 'config/chainInfos';
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

  async handleTransferOraiToEvm(
    fromAmountToken: number,
    transferAmount: number,
    metamaskAddress: string,
    tronAddress: string,
    simulateAmount: string,
    userSlippage?: number
  ) {
    try {
      this._toToken = findToToken(this._toTokenInOrai, this._toToken.chainId); // find to token to bridge
      const toAddress = await window.Keplr.getKeplrAddr(this._toToken.chainId);
      let transferAddress = metamaskAddress;
      // check tron network and convert address
      if (this._toToken.prefix === ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX) {
        transferAddress = tronToEthAddress(tronAddress);
      }
      const ibcMemo = this._toToken.chainId === 'oraibridge-subnet-2' ? this._toToken.prefix + transferAddress : '';
      let ibcInfo: IBCInfo = ibcInfos[this._fromToken.chainId][this._toToken.chainId];
      // only allow transferring back to ethereum / bsc only if there's metamask address and when the metamask address is used, which is in the ibcMemo variable
      if (!transferAddress && (this._toTokenInOrai.evmDenoms || ibcInfo.channel === oraichain2oraib)) {
        throw generateError('Please login metamask!');
      }

      const ibcWasmContractAddress = ibcInfo.source.split('.')[1];
      if (!ibcWasmContractAddress)
        throw generateError('IBC Wasm source port is invalid. Cannot transfer to the destination chain');

      const { info: assetInfo } = parseTokenInfo(this._fromToken);
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
        remoteDenom: this._toToken.denom,
        timeout: ibcInfo.timeout,
        memo: ibcMemo
      };
      let res: cosmwasm.ExecuteResult;
      if (assetInfo.native_token) {
        res = await ibcWasmContract.transferToRemote(msg, 'auto', undefined, [
          { amount: simulateAmount, denom: this._toToken.denom }
        ]);
      } else {
        const transferBackMsgCw20Msg: TransferBackMsg = {
          local_channel_id: msg.localChannelId,
          remote_address: msg.remoteAddress,
          remote_denom: msg.remoteDenom,
          timeout: msg.timeout,
          memo: msg.memo
        };
        console.log({ transferBackMsgCw20Msg });
        const cw20Token = Contract.token(this._fromToken.contractAddress);
        const _fromAmount = toAmount(fromAmountToken, this._fromToken.decimals).toString();

        res = await cw20Token.send(
          {
            // amount: simulateAmount,
            amount: _fromAmount,
            contract: ibcWasmContractAddress,
            msg: Buffer.from(JSON.stringify(transferBackMsgCw20Msg)).toString('base64')
          },
          'auto'
        );
      }
      return res;
    } catch (error) {
      console.log('error in executeMultipleMsgs:', error);
    }
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

  /** Universal swap from Oraichain to cosmos-hub | osmosis | EVM networks.
   * B1: find toToken in Oraichain (this._toTokenInOrai) to swap first
   * B2: find toToken in in Osmosis | CosmosHub | Oraibridge for EVM network to bridge from Oraichain
   */
  async swapAndTransfer({
    fromAmountToken,
    simulateAmount,
    metamaskAddress,
    tronAddress,
    userSlippage
  }: SwapData): Promise<any> {
    const transferAmount = toDisplay(simulateAmount); // amount to transfer
    const ibcInfo: IBCInfo = ibcInfos[this._fromToken.chainId][this._toToken.chainId];
    this._toTokenInOrai = oraichainTokens.find((t) => t.coinGeckoId === this._toToken.coinGeckoId); // find to token in Oraichain to swap

    // if swap from Oraichain to cosmoshub | osmosis, we can transfer via IBC.
    if (this._toToken.chainId === 'cosmoshub-4' || this._toToken.chainId === 'osmosis-1') {
      const toAddress = await window.Keplr.getKeplrAddr(this._toToken.chainId);
      if (!toAddress) throw generateError('Please login keplr!');

      const ibcMemo = '';
      const amount = coin(toAmount(transferAmount, this._fromToken.decimals).toString(), this._toTokenInOrai.denom);
      const offlineSigner = await window.Keplr.getOfflineSigner(this._fromToken.chainId);
      const aminoTypes = new AminoTypes({
        ...createWasmAminoConverters(),
        ...customAminoTypes
      });

      const client = await SigningStargateClient.connectWithSigner(this._fromToken.rpc, offlineSigner, {
        registry: customRegistry,
        aminoTypes,
        gasPrice: GasPrice.fromString(`${await getNetworkGasPrice()}${network.denom}`)
      });
      const msgSwap = this.generateMsgsSwap(fromAmountToken, simulateAmount, userSlippage);
      const input = msgSwap.map(({ handleMsg, handleOptions, contractAddress }) => {
        return {
          handleMsg: JSON.parse(handleMsg),
          transferAmount: handleOptions?.funds,
          contractAddress
        };
      });
      const msgExecuteSwap = getExecuteContractMsgs(this._sender, input);
      const msgTransfer = {
        typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
        value: MsgTransfer.fromPartial({
          sourcePort: ibcInfo.source,
          sourceChannel: ibcInfo.channel,
          token: amount,
          sender: this._sender,
          receiver: toAddress,
          memo: ibcMemo,
          timeoutTimestamp: Long.fromNumber(Math.floor(Date.now() / 1000) + ibcInfo.timeout)
            .multiply(1000000000)
            .toString()
        })
      };
      const result = await client.signAndBroadcast(this._sender, [...msgExecuteSwap, msgTransfer], 'auto');
      return result;
    }

    // from Oraichain to EVM networks
    const result = await this.handleTransferOraiToEvm(
      fromAmountToken,
      transferAmount,
      metamaskAddress,
      tronAddress,
      simulateAmount,
      userSlippage
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
      const _fromAmount = toAmount(fromAmountToken, this._fromToken.decimals).toString();

      const minimumReceive = this.calculateMinReceive(simulateAmount, userSlippage, this._fromToken.decimals);
      const msgs = generateContractMessages({
        type: Type.SWAP,
        sender: this._sender,
        amount: _fromAmount,
        fromInfo: this._fromToken!,
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
