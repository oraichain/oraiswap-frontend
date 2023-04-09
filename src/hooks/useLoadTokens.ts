import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { StargateClient } from '@cosmjs/stargate';
import bech32 from 'bech32';
import tokenABI from 'config/abi/erc20.json';
import {
  evmChainsWithoutTron,
  evmTokens,
  filteredTokens,
  kawaiiTokens,
  TokenItemType,
  tokenMap,
  tronChain
} from 'config/bridgeTokens';
import { KAWAII_SUBNET_RPC, KWT_SUBNETWORK_CHAIN_ID, KWT_SUBNETWORK_EVM_CHAIN_ID, KAWAII_RPC } from 'config/constants';
import { Contract } from 'config/contracts';
import { handleCheckWallet, tronToEthAddress } from 'helper';
import flatten from 'lodash/flatten';
import { updateAmounts } from 'reducer/token';
import { BalanceResponse } from '../libs/contracts/OraiswapToken.types';
import { ContractCallResults, Multicall } from '../libs/ethereum-multicall';
import { getEvmAddress } from '../libs/utils';

import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { cosmosNetworks } from 'config/bridgeTokens';

export type LoadTokenParams = {
  refresh?: boolean;
  metamaskAddress?: string;
  oraiAddress?: string;
  tronAddress?: string;
};

async function loadNativeBalance(dispatch: Dispatch, address: string, tokenInfo: { chainId: string; rpc: string }) {
  if (!address) return;
  const client = await StargateClient.connect(tokenInfo.rpc);
  const amountAll = await client.getAllBalances(address);
  let amountDetails: AmountDetails = {};

  // reset native balances
  filteredTokens
    .filter((t) => t.chainId === tokenInfo.chainId && !t.contractAddress)
    .forEach((t) => {
      amountDetails[t.coinDenom] = '0';
    });

  Object.assign(
    amountDetails,
    Object.fromEntries(amountAll.filter((coin) => tokenMap[coin.denom]).map((coin) => [coin.denom, coin.amount]))
  );
  dispatch(updateAmounts(amountDetails));
}

async function loadTokens(dispatch: Dispatch, { oraiAddress, metamaskAddress, tronAddress }: LoadTokenParams) {
  await Promise.all(
    [
      oraiAddress && loadTokensCosmos(dispatch, oraiAddress),
      oraiAddress && loadCw20Balance(dispatch, oraiAddress),
      // different cointype but also require keplr connected by checking oraiAddress
      oraiAddress && loadKawaiiSubnetAmount(dispatch),
      metamaskAddress &&
        loadEvmAmounts(dispatch, metamaskAddress, flatten(evmChainsWithoutTron.map((chain) => chain.chainCurrencies))),
      tronAddress && loadEvmAmounts(dispatch, tronToEthAddress(tronAddress), tronChain.chainCurrencies)
    ].filter(Boolean)
  );
}

async function loadTokensCosmos(dispatch: Dispatch, address: string) {
  await handleCheckWallet();
  const { words, prefix } = bech32.decode(address);
  for (const network of cosmosNetworks) {
    const cosmosAddress =
      network.bech32Config.bech32PrefixAccAddr === prefix
        ? address
        : bech32.encode(network.bech32Config.bech32PrefixAccAddr, words);
    loadNativeBalance(dispatch, cosmosAddress, network);
  }
}

async function loadCw20Balance(dispatch: Dispatch, address: string) {
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
        return [t.coinDenom, 0];
      }
      const balanceRes = fromBinary(res.return_data[ind].data) as BalanceResponse;
      const amount = balanceRes.balance;
      return [t.coinDenom, amount];
    })
  );
  dispatch(updateAmounts(amountDetails));
}

async function loadEvmEntries(
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
    reference: token.coinDenom,
    contractAddress: token.contractAddress,
    abi: tokenABI,
    calls: [
      {
        reference: token.coinDenom,
        methodName: 'balanceOf(address)',
        methodParameters: [address]
      }
    ]
  }));

  const results: ContractCallResults = await multicall.call(input);
  return tokens.map((token) => {
    const amount = results.results[token.coinDenom].callsReturnContext[0].returnValues[0].hex;
    return [token.coinDenom, amount];
  });
}

async function loadEvmAmounts(dispatch: Dispatch, evmAddress: string, chains: TokenItemType[]) {
  const amountDetails = Object.fromEntries(
    flatten(
      await Promise.all(
        chains.map((chain) =>
          loadEvmEntries(
            evmAddress,
            evmTokens.filter((t) => t.chainId === chain.chainId),
            chain.rpc,
            chain.chainId as number
          )
        )
      )
    )
  );

  dispatch(updateAmounts(amountDetails));
}

async function loadKawaiiSubnetAmount(dispatch: Dispatch) {
  const kwtAddress = await window.Keplr.getKeplrAddr(KWT_SUBNETWORK_CHAIN_ID);
  if (!kwtAddress) return;

  loadNativeBalance(dispatch, kwtAddress, { chainId: KWT_SUBNETWORK_CHAIN_ID, rpc: KAWAII_RPC });

  const kwtSubnetAddress = getEvmAddress(kwtAddress);

  let amountDetails = Object.fromEntries(
    await loadEvmEntries(
      kwtSubnetAddress,
      kawaiiTokens.filter((t) => !!t.contractAddress),
      KAWAII_SUBNET_RPC,
      KWT_SUBNETWORK_EVM_CHAIN_ID
    )
  );
  // update amounts
  dispatch(updateAmounts(amountDetails));
}

export default function useLoadTokens(): (params: LoadTokenParams) => Promise<void> {
  const dispatch = useDispatch();
  return loadTokens.bind(null, dispatch);
}
