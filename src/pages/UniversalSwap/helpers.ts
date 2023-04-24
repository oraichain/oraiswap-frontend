import { TokenItemType, UniversalSwapType, oraichainTokens } from 'config/bridgeTokens';
import { NetworkChainId } from 'config/chainInfos';
import { ORAI, ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX } from 'config/constants';
import { tronToEthAddress } from 'helper';
import { Uint128 } from 'libs/contracts';
import CosmJs from 'libs/cosmjs';
import { buildMultipleMessages, toAmount } from 'libs/utils';
import { findToToken, transferEvmToIBC, transferIbcCustom } from 'pages/BalanceNew/helpers';
import { SwapQuery, Type, generateContractMessages } from 'rest/api';
import { toDisplay } from 'libs/utils';

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

  async handleTransferIBC(simulateAmount: number, metamaskAddress: string, tronAddress: string, amounts) {
    let transferAddress = metamaskAddress;
    // check tron network and convert address
    if (this._toToken.prefix === ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX) {
      transferAddress = tronToEthAddress(tronAddress);
    }

    const result = await transferIbcCustom(
      this._toTokenInOrai,
      this._toToken,
      simulateAmount,
      amounts,
      transferAddress
    );
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

  /** Universal swap from Oraichain to cosmos-hub | osmosis | EVM networks.
   * B1: find toToken in Oraichain (this._toTokenInOrai) to swap first
   * B2: find toToken in in Osmosis | CosmosHub | Oraibridge for EVM network to bridge from Oraichain
   */
  async swapAndTransfer({
    fromAmountToken,
    simulateAmount,
    userSlippage,
    metamaskAddress,
    tronAddress,
    amounts
  }: SwapData): Promise<any> {
    // swap first
    this._toTokenInOrai = oraichainTokens.find((t) => t.name === this._toToken.name);
    const swapResult = await this.swap(fromAmountToken, simulateAmount, userSlippage);
    if (swapResult) {
      // bridge
      const transferAmount = toDisplay(simulateAmount);
      this._toToken = findToToken(this._toTokenInOrai, this._toToken.chainId);
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
