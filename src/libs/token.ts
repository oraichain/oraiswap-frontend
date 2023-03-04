import { StargateClient } from '@cosmjs/stargate';
import { arrayLoadToken, handleCheckWallet } from 'helper';
import { getEvmAddress, getFunctionExecution, toDisplay } from './utils';
import { evmTokens, filteredTokens, kawaiiTokens, TokenItemType, tokenMap } from 'config/bridgeTokens';
import { updateAmounts } from 'reducer/token';
import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { BalanceResponse } from './contracts/OraiswapToken.types';
import { Contract } from 'config/contracts';
import {
  BSC_CHAIN_ID,
  BSC_RPC,
  ETHEREUM_CHAIN_ID,
  ETHEREUM_RPC,
  KAWAII_SUBNET_RPC,
  KWT_SUBNETWORK_CHAIN_ID,
  KWT_SUBNETWORK_EVM_CHAIN_ID,
  NOTI_INSTALL_OWALLET
} from 'config/constants';
import flatten from 'lodash/flatten';
import tokenABI from 'config/abi/erc20.json';
import { ContractCallResults, Multicall } from './ethereum-multicall';
import { displayToast, TToastType } from 'components/Toasts/Toast';
export class CacheTokens {
  private readonly dispatch;
  private readonly address: string;
  public constructor({ dispatch, address }) {
    this.dispatch = dispatch;
    this.address = address;
  }

  public async loadAllToken(metamaskAddress: string) {
    this.loadTokensCosmosKwt();
    this.loadTokensEvm(metamaskAddress);
  }

  public async loadTokensCosmosKwt() {
    this.loadTokensCosmos();
    this.loadCw20Balance();
    this.loadKawaiiSubnetAmount();
  }

  private async loadTokensEvm(metamaskAddress: string) {
    this.loadEvmOraiAmounts(metamaskAddress);
  }

  public async loadTokensCosmos() {
    await handleCheckWallet();
    for (const token of arrayLoadToken) {
      window.Keplr.getKeplrAddr(token.chainId).then((address) => this.loadNativeBalance(address, token));
    }
  }

  private async forceUpdate(amountDetails: AmountDetails) {
    this.dispatch(updateAmounts(amountDetails));
  }

  private async loadNativeBalance(address: string, tokenInfo: { chainId: string; rpc: string }) {
    const client = await StargateClient.connect(tokenInfo.rpc);
    const amountAll = await client.getAllBalances(address);

    let amountDetails: AmountDetails = {};

    // reset native balances
    filteredTokens
      .filter((t) => t.chainId === tokenInfo.chainId && !t.contractAddress)
      .forEach((t) => {
        amountDetails[t.denom] = '0';
      });

    Object.assign(
      amountDetails,
      Object.fromEntries(amountAll.filter((coin) => tokenMap[coin.denom]).map((coin) => [coin.denom, coin.amount]))
    );
    this.forceUpdate(amountDetails);
  }

  public async loadTokenAmounts(metamaskAddress: string) {
    const keplr = await window.Keplr.getKeplr();
    if (!keplr) {
      return displayToast(TToastType.TX_INFO, NOTI_INSTALL_OWALLET, {
        toastId: 'install_keplr'
      });
    }

    const kwtSubnetAddress = getEvmAddress(await window.Keplr.getKeplrAddr(KWT_SUBNETWORK_CHAIN_ID));

    await Promise.all(
      [
        getFunctionExecution(this.loadTokensCosmos.bind(this)),
        metamaskAddress && getFunctionExecution(this.loadEvmOraiAmounts.bind(this), [metamaskAddress]),
        kwtSubnetAddress && getFunctionExecution(this.loadKawaiiSubnetAmount.bind(this)),
        this.address && getFunctionExecution(this.loadCw20Balance.bind(this))
      ].filter(Boolean)
    );
  }

  private async loadCw20Balance() {
    if (!this.address) return;
    // get all cw20 token contract
    const cw20Tokens = filteredTokens.filter((t) => t.contractAddress);
    const data = toBinary({
      balance: { address: this.address }
    });

    const res = await Contract.multicall.aggregate({
      queries: cw20Tokens.map((t) => ({
        address: t.contractAddress,
        data
      }))
    });

    const amountDetails = Object.fromEntries(
      cw20Tokens.map((t, ind) => {
        if (!res.return_data[ind].success) {
          return [t.denom, 0];
        }
        const balanceRes = fromBinary(res.return_data[ind].data) as BalanceResponse;
        const amount = balanceRes.balance;
        return [t.denom, amount];
      })
    );
    this.forceUpdate(amountDetails);
  }

  private async loadEvmEntries(
    address: string,
    tokens: TokenItemType[],
    rpc: string,
    chainId: number,
    multicallCustomContractAddress?: string
  ): Promise<[string, string][]> {
    const multicall = new Multicall({
      nodeUrl: rpc,
      multicallCustomContractAddress,
      chainId
    });
    const input = tokens.map((token) => ({
      reference: token.denom,
      contractAddress: token.contractAddress,
      abi: tokenABI,
      calls: [
        {
          reference: token.denom,
          methodName: 'balanceOf(address)',
          methodParameters: [address]
        }
      ]
    }));

    const results: ContractCallResults = await multicall.call(input);
    return tokens.map((token) => {
      const amount = results.results[token.denom].callsReturnContext[0].returnValues[0].hex;
      return [token.denom, amount];
    });
  }

  private async loadEvmOraiAmounts(evmAddress: string) {
    const amountDetails = Object.fromEntries(
      flatten(
        await Promise.all([
          this.loadEvmEntries(
            evmAddress,
            evmTokens.filter((t) => t.chainId === BSC_CHAIN_ID),
            BSC_RPC,
            BSC_CHAIN_ID
          ),

          this.loadEvmEntries(
            evmAddress,
            evmTokens.filter((t) => t.chainId === ETHEREUM_CHAIN_ID),
            ETHEREUM_RPC,
            ETHEREUM_CHAIN_ID
          )
        ])
      )
    );
    this.forceUpdate(amountDetails);
  }

  private async loadKawaiiSubnetAmount() {
    const kwtSubnetAddress = getEvmAddress(await window.Keplr.getKeplrAddr(KWT_SUBNETWORK_CHAIN_ID));
    let amountDetails = Object.fromEntries(
      await this.loadEvmEntries(
        kwtSubnetAddress,
        kawaiiTokens.filter((t) => !!t.contractAddress),
        KAWAII_SUBNET_RPC,
        KWT_SUBNETWORK_EVM_CHAIN_ID,
        '0x74876644692e02459899760B8b9747965a6D3f90'
      )
    );
    // update amounts
    this.forceUpdate(amountDetails);
  }

  static factory({ dispatch, address }) {
    return new CacheTokens({ dispatch, address });
  }
}
