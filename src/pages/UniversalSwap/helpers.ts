import { CosmosChainId, NetworkChainId } from 'config/chainInfos';
import { toDisplay } from '../../libs/utils';
import { TokenItemType, UniversalSwapType } from 'config/bridgeTokens';
import { Uint128 } from 'libs/contracts';
import { buildMultipleMessages, toAmount } from 'libs/utils';
import { generateContractMessages, generateConvertErc20Cw20Message, SwapQuery, Type } from 'rest/api';

export class UniversalSwapHandler {

  private sender: string;
  private _fromToken: TokenItemType;
  private _toToken: TokenItemType;

  constructor(sender?: string, fromToken?: TokenItemType, toToken?: TokenItemType) {
    this.sender = sender;
    this.fromToken = fromToken;
    this.toToken = toToken;
  }

  get fromToken() {
    return this._fromToken;
  }

  get toToken() {
    return this._toToken;
  }

  set fromToken(from: TokenItemType) {
    this._fromToken = from;
  }

  set toToken(to: TokenItemType) {
    this._toToken = to;
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

  async swap(): Promise<any> {
    return;
  }

  async swapAndTransfer(): Promise<any> {
    return;
  }

  async transferAndSwap(): Promise<any> {
    return;
  }

  async processUniversalSwap(sourceReceiver: string, combinedReceiver: string, universalSwapType: UniversalSwapType) {
    if (universalSwapType === 'oraichain-to-oraichain')
      return this.swap();
    if (universalSwapType === 'oraichain-to-other-networks')
      return this.swapAndTransfer();
    return this.transferAndSwap();
  }

  generateMsgsSwap(
    fromAmountToken: number,
    amounts: AmountDetails,
    simulateData: any,
    userSlippage: number,
    oraiAddress: string
  ) {
    try {
      const _fromAmount = toAmount(fromAmountToken, this.fromToken.decimals).toString();

      // hard copy of from & to token info data to prevent data from changing when calling the function
      const msgConvertsFrom = generateConvertErc20Cw20Message(amounts, this.fromToken, oraiAddress);
      const msgConvertTo = generateConvertErc20Cw20Message(amounts, this.toToken, oraiAddress);

      const minimumReceive = this.calculateMinReceive(simulateData.amount, userSlippage, this.fromToken.decimals);
      const msgs = generateContractMessages({
        type: Type.SWAP,
        sender: oraiAddress,
        amount: _fromAmount,
        fromInfo: this.fromToken!,
        toInfo: this.toToken!,
        minimumReceive
      } as SwapQuery);

      const msg = msgs[0];

      const messages = buildMultipleMessages(msg, msgConvertsFrom, msgConvertTo);
      return messages;
    } catch (error) {
      console.log('error generateMsgsSwap: ', error);
    }
  }
}
