import { StargateClient } from '@cosmjs/stargate';
import { arrayLoadToken, handleCheckWallet } from 'helper';
import { getEvmAddress, toDisplay } from './utils';
import {
  evmTokens,
  filteredTokens,
  kawaiiTokens,
  TokenItemType,
  tokenMap
} from 'config/bridgeTokens';
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
import { flatten } from 'lodash';
import tokenABI from 'config/abi/erc20.json';
import { ContractCallResults, Multicall } from './ethereum-multicall';
import { CoinGeckoPrices } from 'hooks/useCoingecko';

export class CacheTokens {
  private readonly dispatch;
  private readonly address: string;
  public constructor({ dispatch, address }) {
    this.dispatch = dispatch;
    this.address = address;
  }

  public async loadTokensCosmos() {
    this.loadTokens();
    this.loadCw20Balance(this.address);
    this.loadKawaiiSubnetAmount();
  }

  public async loadTokensEvmKwt(metamaskAddress: string) {
    this.loadEvmOraiAmounts(metamaskAddress);
  }

  private async loadTokens() {
    await handleCheckWallet();
    for (const token of arrayLoadToken) {
      window.Keplr.getKeplrAddr(token.chainId).then((address) =>
        this.loadNativeBalance(address, token.rpc)
      );
    }
  }

  private async forceUpdate(amountDetails: AmountDetails) {
    this.dispatch(updateAmounts(amountDetails));
  }

  private async loadNativeBalance(address: string, rpc: string) {
    const client = await StargateClient.connect(rpc);
    const amountAll = await client.getAllBalances(address);
    let amountDetails: AmountDetails = Object.fromEntries(
      amountAll
        .filter((coin) => tokenMap[coin.denom])
        .map((coin) => [coin.denom, coin.amount])
    );
    console.log('loadNativeBalance', address);
    this.forceUpdate(amountDetails);
  }

  private async loadCw20Balance(address: string) {
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
        const balanceRes = fromBinary(
          res.return_data[ind].data
        ) as BalanceResponse;
        const amount = balanceRes.balance;
        const displayAmount = toDisplay(amount, t.decimals);
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
      const amount =
        results.results[token.denom].callsReturnContext[0].returnValues[0].hex;
      const displayAmount = toDisplay(amount, token.decimals);
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
    const kwtSubnetAddress = getEvmAddress(
      await window.Keplr.getKeplrAddr(KWT_SUBNETWORK_CHAIN_ID)
    );
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
