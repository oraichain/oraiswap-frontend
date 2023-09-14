import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject } from '@cosmjs/proto-signing';
import { AminoTypes, GasPrice, SigningStargateClient, coin } from '@cosmjs/stargate';
import { TokenItemType, UniversalSwapType, gravityContracts, oraichainTokens, swapToTokens } from 'config/bridgeTokens';
import { CoinGeckoId, NetworkChainId } from 'config/chainInfos';
import { ORAI, ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX, swapEvmRoutes } from 'config/constants';
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
import { getBalanceIBCOraichain, transferEvmToIBC } from 'pages/Balance/helpers';
import { OraiswapTokenReadOnlyInterface } from '@oraichain/oraidex-contracts-sdk';
import { findToTokenOnOraiBridge } from 'pages/Balance/helpers';
import {
  SwapQuery,
  Type,
  generateContractMessages,
  getTokenOnOraichain,
  getTokenOnSpecificChainId,
  isEvmNetworkNativeSwapSupported,
  isEvmSwappable,
  isSupportedNoPoolSwapEvm,
  parseTokenInfo,
  simulateSwap,
  simulateSwapEvm
} from 'rest/api';
import { IBCInfo } from 'types/ibc';
import { TokenInfo } from 'types/token';
import { SimulateSwapOperationsResponse } from '@oraichain/oraidex-contracts-sdk/build/OraiswapRouter.types';

export enum SwapDirection {
  From,
  To
}

export interface SwapData {
  metamaskAddress?: string;
  tronAddress?: string;
}

export const TYPE = {
  ASSETS: 'assets',
  HISTORY: 'history'
};

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
    const result =
      BigInt(simulateAmount) - (BigInt(simulateAmount) * BigInt(userSlippage * atomic)) / (100n * BigInt(atomic));
    return result;
  } catch (error) {
    console.log({ error });
    return '0';
  }
};

export async function handleSimulateSwap(query: {
  fromInfo: TokenInfo;
  toInfo: TokenInfo;
  originalFromInfo: TokenItemType;
  originalToInfo: TokenItemType;
  amount: string;
}): Promise<SimulateSwapOperationsResponse> {
  // if the from token info is on bsc or eth, then we simulate using uniswap / pancake router
  // otherwise, simulate like normal
  if (
    isSupportedNoPoolSwapEvm(query.originalFromInfo.coinGeckoId) ||
    isEvmSwappable({
      fromChainId: query.originalFromInfo.chainId,
      toChainId: query.originalToInfo.chainId,
      fromContractAddr: query.originalFromInfo.contractAddress,
      toContractAddr: query.originalToInfo.contractAddress
    })
  ) {
    // reset previous amount calculation since now we need to deal with original from & to info, not oraichain token info
    const originalAmount = toDisplay(query.amount, query.fromInfo.decimals);
    return simulateSwapEvm({
      fromInfo: query.originalFromInfo,
      toInfo: query.originalToInfo,
      amount: toAmount(originalAmount, query.originalFromInfo.decimals).toString()
    });
  }
  return simulateSwap(query);
}

export function filterNonPoolEvmTokens(
  chainId: string,
  coingeckoId: CoinGeckoId,
  denom: string,
  searchTokenName: string,
  direction: SwapDirection // direction = to means we are filtering to tokens
) {
  // basic filter. Dont include itself & only collect tokens with searched letters
  let filteredToTokens = swapToTokens.filter((token) => token.denom !== denom && token.name.includes(searchTokenName));
  // special case for tokens not having a pool on Oraichain
  if (isSupportedNoPoolSwapEvm(coingeckoId)) {
    const swappableTokens = Object.keys(swapEvmRoutes[chainId]).map((key) => key.split('-')[1]);
    const filteredTokens = filteredToTokens.filter((token) => swappableTokens.includes(token.contractAddress));

    // tokens that dont have a pool on Oraichain like WETH or WBNB cannot be swapped from a token on Oraichain
    if (direction === SwapDirection.To)
      return [...new Set(filteredTokens.concat(filteredTokens.map((token) => getTokenOnOraichain(token.coinGeckoId))))];
    filteredToTokens = filteredTokens;
  }
  // special case filter. Tokens on networks other than supported evm cannot swap to tokens, so we need to remove them
  if (!isEvmNetworkNativeSwapSupported(chainId as NetworkChainId))
    return filteredToTokens.filter((t) => {
      // one-directional swap. non-pool tokens of evm network can swap be swapped with tokens on Oraichain, but not vice versa
      if (direction === SwapDirection.To) return !isSupportedNoPoolSwapEvm(t.coinGeckoId);
      if (isSupportedNoPoolSwapEvm(t.coinGeckoId)) {
        // if we cannot find any matched token then we dont include it in the list since it cannot be swapped
        const sameChainId = getTokenOnSpecificChainId(coingeckoId, t.chainId as NetworkChainId);
        if (!sameChainId) return false;
        return true;
      }
      return true;
    });
  return filteredToTokens.filter((t) => {
    // filter out to tokens that are on a different network & with no pool because we are not ready to support them yet. TODO: support
    if (isSupportedNoPoolSwapEvm(t.coinGeckoId)) return t.chainId === chainId;
    return true;
  });
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

  async getUniversalSwapToAddress(
    toChainId: NetworkChainId,
    address: { metamaskAddress?: string; tronAddress?: string; oraiAddress?: string }
  ): Promise<string> {
    // evm based
    if (toChainId === '0x01' || toChainId === '0x1ae6' || toChainId === '0x38') {
      return address.metamaskAddress ?? (await window.Metamask.getEthAddress());
    }
    // tron
    if (toChainId === '0x2b6653dc') {
      if (address.tronAddress) return tronToEthAddress(address.tronAddress);
      if (window.tronLink && window.tronWeb && window.tronWeb.defaultAddress?.base58)
        return tronToEthAddress(window.tronWeb.defaultAddress.base58);
      throw 'Cannot find tron web to nor tron address to send to Tron network';
    }
    return address.oraiAddress ?? (await window.Keplr.getKeplrAddr(toChainId));
  }

  /**
   * Combine messages for universal swap token from Oraichain to Cosmos networks(Osmosis | Cosmos-hub).
   * @returns combined messages
   */
  async combineMsgCosmos(timeoutTimestamp?: string): Promise<EncodeObject[]> {
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
        timeoutTimestamp: timeoutTimestamp ?? calculateTimeoutTimestamp(ibcInfo.timeout)
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
    this.originalToToken = findToTokenOnOraiBridge(this.toTokenInOrai, this.originalToToken.chainId);

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

  buildIbcWasmPairKey(ibcPort: string, ibcChannel: string, denom: string) {
    return `${ibcPort}/${ibcChannel}/${denom}`;
  }

  async checkBalanceChannelIbc(ibcInfo: IBCInfo, toToken: TokenItemType) {
    const ics20Contract =
      this.cwIcs20LatestClient ?? new CwIcs20LatestQueryClient(window.client, process.env.REACT_APP_IBC_WASM_CONTRACT);

    try {
      const { balances } = await ics20Contract.channel({
        forward: false,
        id: ibcInfo.channel
      });

      for (let balance of balances) {
        if ('native' in balance) {
          let pairKey = this.buildIbcWasmPairKey(ibcInfo.source, ibcInfo.channel, toToken.denom);
          if (toToken.prefix && toToken.contractAddress) {
            pairKey = this.buildIbcWasmPairKey(
              ibcInfo.source,
              ibcInfo.channel,
              `${toToken.prefix}${toToken.contractAddress}`
            );
          }
          if (pairKey !== balance.native.denom) continue;
          const pairMapping = await ics20Contract.pairMapping({ key: pairKey });
          const trueBalance = toDisplay(balance.native.amount, pairMapping.pair_mapping.remote_decimals);
          const _toAmount = toDisplay(this.simulateAmount, toToken.decimals);
          if (trueBalance < _toAmount) {
            throw generateError(`pair key is not enough balance!`);
          }
        } else {
          // do nothing because currently we dont have any cw20 balance in the channel
        }
      }
    } catch (error) {
      console.log({ CheckBalanceChannelIbcErrors: error });
      return;
    }
  }

  // ORAI ( ETH ) -> check ORAI (ORAICHAIN - compare from amount with cw20 / native amount) (fromAmount) -> check AIRI - compare to amount with channel balance (ORAICHAIN) (toAmount) -> AIRI (BSC)
  // ORAI ( ETH ) -> check ORAI (ORAICHAIN) - compare from amount with cw20 / native amount) (fromAmount) -> check wTRX - compare to amount with channel balance (ORAICHAIN) (toAmount) -> wTRX (TRON)
  async checkBalanceIBCOraichain(
    to: TokenItemType,
    from: TokenItemType,
    amount: {
      toAmount: string;
      fromAmount: number;
    },
    tokenQueryClient?: OraiswapTokenReadOnlyInterface
  ) {
    // ORAI ( ETH ) -> check ORAI (ORAICHAIN) -> ORAI (BSC)
    // no need to check this case because users will swap directly. This case should be impossible because it is only called when transferring from evm to other networks
    if (from.chainId === 'Oraichain' && to.chainId === from.chainId) return;
    // always check from token in ibc wasm should have enough tokens to swap / send to destination
    const token = getTokenOnOraichain(from.coinGeckoId);
    if (!token) return;
    const { balance } = await getBalanceIBCOraichain(token, tokenQueryClient);
    if (balance < amount.fromAmount) {
      throw generateError(
        `The bridge contract does not have enough balance to process this bridge transaction. Wanted ${amount.fromAmount}, have ${balance}`
      );
    }
    // if to token is evm, then we need to evaluate channel state balance of ibc wasm
    if (to.chainId === '0x01' || to.chainId === '0x38' || to.chainId === '0x2b6653dc') {
      const ibcInfo: IBCInfo | undefined = ibcInfos['Oraichain'][to.chainId];
      if (!ibcInfo) throw generateError('IBC Info error when checking ibc balance');
      await this.checkBalanceChannelIbc(ibcInfo, this.originalToToken);
    }
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
    await this.checkBalanceChannelIbc(ibcInfo, this.originalToToken);

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

  // transfer evm to ibc
  async transferAndSwap(combinedReceiver: string, metamaskAddress?: string, tronAddress?: string): Promise<any> {
    if (!metamaskAddress && !tronAddress) throw Error('Cannot call evm swap if the evm address is empty');

    await this.checkBalanceIBCOraichain(this.originalToToken, this.originalFromToken, {
      fromAmount: this.fromAmount,
      toAmount: this.simulateAmount
    });

    // normal case, we will transfer evm to ibc like normal when two tokens can not be swapped on evm
    // first case: BNB (bsc) <-> USDT (bsc), then swappable
    // 2nd case: BNB (bsc) -> USDT (oraichain), then find USDT on bsc. We have that and also have route => swappable
    // 3rd case: USDT (bsc) -> ORAI (bsc / Oraichain), both have pools on Oraichain, but we currently dont have the pool route on evm => not swappable => transfer to cosmos like normal
    let swappableData = {
      fromChainId: this.originalFromToken.chainId,
      toChainId: this.originalToToken.chainId,
      fromContractAddr: this.originalFromToken.contractAddress,
      toContractAddr: this.originalToToken.contractAddress
    };
    let evmSwapData = {
      fromToken: this.originalFromToken,
      toTokenContractAddr: this.originalToToken.contractAddress,
      address: { metamaskAddress, tronAddress },
      fromAmount: this.fromAmount,
      simulateAmount: this.simulateAmount,
      slippage: this.userSlippage,
      destination: '' // if to token already on same net with from token then no destination is needed
    };
    // has to switch network to the correct chain id on evm since users can swap between network tokens
    await window.Metamask.switchNetwork(this.originalFromToken.chainId);
    if (isEvmSwappable(swappableData)) return window.Metamask.evmSwap(evmSwapData);

    const toTokenSameFromChainId = getTokenOnSpecificChainId(
      this.originalToToken.coinGeckoId,
      this.originalFromToken.chainId
    );
    if (toTokenSameFromChainId) {
      swappableData.toChainId = toTokenSameFromChainId.chainId;
      swappableData.toContractAddr = toTokenSameFromChainId.contractAddress;
      evmSwapData.toTokenContractAddr = toTokenSameFromChainId.contractAddress;
      // if to token already on same net with from token then no destination is needed
      evmSwapData.destination = toTokenSameFromChainId.chainId === this.originalToToken.chainId ? '' : combinedReceiver;
    }

    // special case for tokens not having a pool on Oraichain. We need to swap on evm instead then transfer to Oraichain
    if (isEvmSwappable(swappableData) && isSupportedNoPoolSwapEvm(this.originalFromToken.coinGeckoId)) {
      return window.Metamask.evmSwap(evmSwapData);
    }
    return transferEvmToIBC(
      this.originalFromToken,
      this.fromAmount,
      { metamaskAddress, tronAddress },
      combinedReceiver
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
