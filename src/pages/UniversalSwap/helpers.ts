import { CosmosChainId, NetworkChainId } from 'config/chainInfos';
import { toDisplay } from '../../libs/utils';
import { TokenItemType, UniversalSwapType } from 'config/bridgeTokens';
import { Uint128 } from 'libs/contracts';
import { buildMultipleMessages, toAmount } from 'libs/utils';
import { generateContractMessages, generateConvertErc20Cw20Message, SwapQuery, Type } from 'rest/api';
import CosmJs from 'libs/cosmjs';
import { ORAI } from 'config/constants';
import { combineReceiver, transferEvmToIBC } from 'pages/BalanceNew/helpers';

export class UniversalSwapHandler {

  private _sender: string;
  private _fromToken: TokenItemType;
  private _toToken: TokenItemType;

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

  async swap(fromAmountToken: number, simulateAmount: string, oraiAddress: string, userSlippage?: number): Promise<any> {
    const messages = this.generateMsgsSwap(
      fromAmountToken,
      simulateAmount,
      userSlippage,
      oraiAddress
    );
    const result = await CosmJs.executeMultiple({
      prefix: ORAI,
      walletAddr: oraiAddress,
      msgs: messages,
      gasAmount: { denom: ORAI, amount: '0' }
    });
    return result;
  }

  async swapAndTransfer(): Promise<any> {
    return;
  }

  async transferAndSwap(fromAmount: number, combinedReceiver: string, metamaskAddress?: string, tronAddress?: string): Promise<any> {
    return transferEvmToIBC(this.fromToken, fromAmount, { metamaskAddress, tronAddress }, combinedReceiver);
  }

  async processUniversalSwap(combinedReceiver: string, universalSwapType: UniversalSwapType, swapData: { fromAmountToken: number, simulateAmount: string, userSlippage?: number, metamaskAddress?: string, tronAddress?: string }) {
    if (universalSwapType === 'oraichain-to-oraichain')
      return this.swap(swapData.fromAmountToken, swapData.simulateAmount, this.sender, swapData.userSlippage);
    if (universalSwapType === 'oraichain-to-other-networks')
      return this.swapAndTransfer();
    return this.transferAndSwap(swapData.fromAmountToken, combinedReceiver, swapData.metamaskAddress, swapData.tronAddress);
  }

  generateMsgsSwap(
    fromAmountToken: number,
    simulateAmount: string,
    userSlippage: number,
    oraiAddress: string
  ) {
    try {
      const _fromAmount = toAmount(fromAmountToken, this.fromToken.decimals).toString();

      const minimumReceive = this.calculateMinReceive(simulateAmount, userSlippage, this.fromToken.decimals);
      const msgs = generateContractMessages({
        type: Type.SWAP,
        sender: oraiAddress,
        amount: _fromAmount,
        fromInfo: this.fromToken!,
        toInfo: this.toToken!,
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
