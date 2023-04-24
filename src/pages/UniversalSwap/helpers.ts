import { TokenItemType, UniversalSwapType } from 'config/bridgeTokens';
import { NetworkChainId } from 'config/chainInfos';
import { ORAI, ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX } from 'config/constants';
import { tronToEthAddress } from 'helper';
import { Uint128 } from 'libs/contracts';
import CosmJs from 'libs/cosmjs';
import { buildMultipleMessages, toAmount } from 'libs/utils';
import { getToToken, transferEvmToIBC, transferIbcCustom } from 'pages/BalanceNew/helpers';
import { SwapQuery, Type, generateContractMessages } from 'rest/api';
import { toDisplay } from '../../libs/utils';

export class UniversalSwapHandler {
  private _sender: string;
  private _fromToken: TokenItemType;
  private _toToken: TokenItemType;
  private _toTokenSwap: TokenItemType;
  private _toTokenBridge: TokenItemType;

  constructor(
    sender?: string,
    fromToken?: TokenItemType,
    toToken?: TokenItemType,
    toTokenSwap?: TokenItemType,
    toTokenBridge?: TokenItemType
  ) {
    this._sender = sender;
    this._fromToken = fromToken;
    this._toToken = toToken;
    this._toTokenSwap = toTokenSwap;
    this._toTokenBridge = toTokenBridge;
  }

  get fromToken() {
    return this._fromToken;
  }

  get toToken() {
    return this._toToken;
  }

  get toTokenSwap() {
    return this._toTokenSwap;
  }

  get toTokenBridge() {
    return this._toTokenBridge;
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

  set toTokenSwap(to: TokenItemType) {
    this._toTokenSwap = to;
  }

  set setToTokenBridge(to: TokenItemType) {
    this._toTokenBridge = to;
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
  //  Query failed with (6): rpc error: code = Unknown desc = failed to execute message;
  // message index: 0: dispatch: submessages: Could not find the mapping pair: execute wasm contract failed
  // [CosmWasm/wasmd@v1.0.0/x/wasm/keeper/keeper.go:371]
  // With gas wanted: '0' and gas used: '186127' : unknown request
  async handleTransferIBC(simulateAmount: number, metamaskAddress: string, tronAddress: string, amounts) {
    let transferAddress = metamaskAddress;
    // check tron network and convert address
    if (this._toToken.prefix === ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX) {
      transferAddress = tronToEthAddress(tronAddress);
    }

    const result = await transferIbcCustom(
      this._toTokenSwap,
      this._toTokenBridge ?? this._toToken,
      simulateAmount,
      amounts,
      transferAddress
    );
    return result;
  }

  async swap(
    fromAmountToken: number,
    simulateAmount: string,
    oraiAddress: string,
    userSlippage?: number
  ): Promise<any> {
    const messages = this.generateMsgsSwap(fromAmountToken, simulateAmount, userSlippage, oraiAddress);
    const result = await CosmJs.executeMultiple({
      prefix: ORAI,
      walletAddr: oraiAddress,
      msgs: messages,
      gasAmount: { denom: ORAI, amount: '0' }
    });
    return result;
  }

  // TODO
  // swap orai from oraichain vs atom from cosmos
  // => swap orai vs atom trên oraichain trước, sau đó bridge atom từ oraichain sang cosmos.
  async swapAndTransfer(
    fromAmountToken: number,
    simulateAmount: string,
    oraiAddress: string,
    userSlippage?: number,
    metamaskAddress?: string,
    tronAddress?: string,
    amounts?: AmountDetails
  ): Promise<any> {
    const swapResult = await this.swap(fromAmountToken, simulateAmount, oraiAddress, userSlippage);
    if (swapResult) {
      // bridge
      const transferAmount = toDisplay(simulateAmount);
      const toTokenInBridge = getToToken(this._toTokenSwap, this._toToken.chainId);
      this._toTokenBridge = toTokenInBridge;
      const result = await this.handleTransferIBC(transferAmount, metamaskAddress, tronAddress, amounts);
      return result;
    }
  }

  async transferAndSwap(
    fromAmount: number,
    combinedReceiver: string,
    metamaskAddress?: string,
    tronAddress?: string
  ): Promise<any> {
    return transferEvmToIBC(this.fromToken, fromAmount, { metamaskAddress, tronAddress }, combinedReceiver);
  }

  async processUniversalSwap(
    combinedReceiver: string,
    universalSwapType: UniversalSwapType,
    swapData: {
      fromAmountToken: number;
      simulateAmount: string;
      amounts: AmountDetails;
      userSlippage?: number;
      metamaskAddress?: string;
      tronAddress?: string;
    }
  ) {
    if (universalSwapType === 'oraichain-to-oraichain')
      return this.swap(swapData.fromAmountToken, swapData.simulateAmount, this.sender, swapData.userSlippage);
    if (universalSwapType === 'oraichain-to-other-networks')
      return this.swapAndTransfer(
        swapData.fromAmountToken,
        swapData.simulateAmount,
        this.sender,
        swapData.userSlippage,
        swapData.metamaskAddress,
        swapData.tronAddress,
        swapData.amounts
      );
    return this.transferAndSwap(
      swapData.fromAmountToken,
      combinedReceiver,
      swapData.metamaskAddress,
      swapData.tronAddress
    );
  }

  generateMsgsSwap(fromAmountToken: number, simulateAmount: string, userSlippage: number, oraiAddress: string) {
    try {
      const _fromAmount = toAmount(fromAmountToken, this.fromToken.decimals).toString();

      const minimumReceive = this.calculateMinReceive(simulateAmount, userSlippage, this.fromToken.decimals);
      const msgs = generateContractMessages({
        type: Type.SWAP,
        sender: oraiAddress,
        amount: _fromAmount,
        fromInfo: this.fromToken!,
        toInfo: this._toTokenSwap,
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
