import { StargateClient } from '@cosmjs/stargate';
import { arrayLoadToken, handleCheckWallet } from 'helper';
import { clearFunctionExecution, getEvmAddress, getFunctionExecution, toDisplay } from './utils';
import { evmChains, evmTokens, filteredTokens, kawaiiTokens, TokenItemType, tokenMap } from 'config/bridgeTokens';
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
  KWT_SUBNETWORK_EVM_CHAIN_ID
} from 'config/constants';
import flatten from 'lodash/flatten';
import tokenABI from 'config/abi/erc20.json';
import { ContractCallResults, Multicall } from './ethereum-multicall';
import { Dispatch } from 'react';

export class CacheTokens {
  private readonly dispatch: Dispatch<any>;
  private readonly address: string;
  public constructor({ dispatch, address }) {
    this.dispatch = dispatch;
    this.address = address;

    this.loadTokensCosmos = this.loadTokensCosmos.bind(this);
    this.loadTokensEvm = this.loadTokensEvm.bind(this);
    this.loadKawaiiSubnetAmount = this.loadKawaiiSubnetAmount.bind(this);
    this.loadCw20Balance = this.loadCw20Balance.bind(this);
  }

  private async forceUpdate(amountDetails: AmountDetails) {
    this.dispatch(updateAmounts(amountDetails));
  }

  private async loadNativeBalance(address: string, tokenInfo: { chainId: string; rpc: string }) {
    if (!address) return;
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

  public async loadTokenAmounts(refresh = false, metamaskAddress?: string, loadCosmos = true) {
    if (refresh) {
      clearFunctionExecution(
        loadCosmos && this.loadTokensCosmos,
        loadCosmos && this.loadKawaiiSubnetAmount,
        loadCosmos && this.loadCw20Balance,
        metamaskAddress && this.loadTokensEvm
      );
    }

    const kwtSubnetAddress = getEvmAddress(await window.Keplr.getKeplrAddr(KWT_SUBNETWORK_CHAIN_ID));

    await Promise.all(
      [
        loadCosmos && getFunctionExecution(this.loadTokensCosmos),
        metamaskAddress && getFunctionExecution(this.loadTokensEvm, [metamaskAddress]),
        loadCosmos && kwtSubnetAddress && getFunctionExecution(this.loadKawaiiSubnetAmount, [kwtSubnetAddress]),
        loadCosmos && this.address && getFunctionExecution(this.loadCw20Balance, [this.address])
      ].filter(Boolean)
    );
  }

  private async loadTokensCosmos() {
    await handleCheckWallet();
    for (const token of arrayLoadToken) {
      window.Keplr.getKeplrAddr(token.chainId).then((address) => this.loadNativeBalance(address, token));
    }
  }

  private async loadCw20Balance(address: string) {
    if (!address) return;
    // get all cw20 token contract
    const cw20Tokens = filteredTokens.filter((t) => t.contractAddress);
    const data = toBinary({
      balance: { address }
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

  private async loadTokensEvm(evmAddress: string) {
    console.log('foobar');
    const result = await Promise.all(
      evmChains.map((chain) =>
        this.loadEvmEntries(
          evmAddress,
          evmTokens.filter((t) => t.chainId === chain.chainId),
          chain.rpc,
          chain.chainId as number
        )
      )
    );
    console.log('result: ', result);
    const amountDetails = Object.fromEntries(
      flatten(
        await Promise.all(
          evmChains.map((chain) =>
            this.loadEvmEntries(
              evmAddress,
              evmTokens.filter((t) => t.chainId === chain.chainId),
              chain.rpc,
              chain.chainId as number
            )
          )
        )
      )
    );
    console.log('amount details: ', amountDetails);
    this.forceUpdate(amountDetails);
  }

  private async loadKawaiiSubnetAmount(kwtSubnetAddress: string) {
    let amountDetails = Object.fromEntries(
      await this.loadEvmEntries(
        kwtSubnetAddress,
        kawaiiTokens.filter((t) => !!t.contractAddress),
        KAWAII_SUBNET_RPC,
        KWT_SUBNETWORK_EVM_CHAIN_ID
      )
    );
    // update amounts
    this.forceUpdate(amountDetails);
  }

  static factory({ dispatch, address }) {
    return new CacheTokens({ dispatch, address });
  }
}
