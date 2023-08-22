import { CosmWasmClient, fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { StargateClient } from '@cosmjs/stargate';
import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import { OraiswapTokenTypes } from '@oraichain/oraidex-contracts-sdk';
import bech32 from 'bech32';
import tokenABI from 'config/abi/erc20.json';
import { cosmosTokens, evmTokens, oraichainTokens, tokenMap } from 'config/bridgeTokens';
import { handleCheckWallet, tronToEthAddress } from 'helper';
import flatten from 'lodash/flatten';
import { updateAmounts } from 'reducer/token';
import { ContractCallResults, Multicall } from '../libs/ethereum-multicall';
import { generateError, getEvmAddress } from '../libs/utils';

import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { chainInfos, CustomChainInfo, evmChains } from 'config/chainInfos';
import { network } from 'config/networks';
import { ethers } from 'ethers';
import { EVM_BALANCE_RETRY_COUNT } from 'config/constants';

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
  cosmosTokens
    .filter((t) => t.chainId === tokenInfo.chainId && !t.contractAddress)
    .forEach((t) => {
      amountDetails[t.denom] = '0';
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
      metamaskAddress && loadEvmAmounts(dispatch, metamaskAddress, evmChains),
      tronAddress &&
        loadEvmAmounts(
          dispatch,
          tronToEthAddress(tronAddress),
          chainInfos.filter((c) => c.chainId == '0x2b6653dc')
        )
    ].filter(Boolean)
  );
}

async function loadTokensCosmos(dispatch: Dispatch, address: string) {
  await handleCheckWallet();
  const { words, prefix } = bech32.decode(address);
  const cosmosInfos = chainInfos.filter((chainInfo) => chainInfo.bip44.coinType === 118);
  for (const chainInfo of cosmosInfos) {
    const networkPrefix = chainInfo.bech32Config.bech32PrefixAccAddr;
    const cosmosAddress = networkPrefix === prefix ? address : bech32.encode(networkPrefix, words);
    loadNativeBalance(dispatch, cosmosAddress, chainInfo);
  }
}

async function loadCw20Balance(dispatch: Dispatch, address: string) {
  if (!address) return;
  // get all cw20 token contract
  const cw20Tokens = oraichainTokens.filter((t) => t.contractAddress);
  const data = toBinary({
    balance: { address }
  });

  const multicall = new MulticallQueryClient(window.client, network.multicall);

  const res = await multicall.aggregate({
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
      const balanceRes = fromBinary(res.return_data[ind].data) as OraiswapTokenTypes.BalanceResponse;
      const amount = balanceRes.balance;
      return [t.denom, amount];
    })
  );
  dispatch(updateAmounts(amountDetails));
}

async function loadNativeEvmBalance(address: string) {
  const client = new ethers.providers.Web3Provider(window.ethereum);
  return client.getBalance(address);
}

async function loadEvmEntries(
  address: string,
  chain: CustomChainInfo,
  multicallCustomContractAddress?: string,
  retryCount?: number
): Promise<[string, string][]> {
  try {
    const tokens = evmTokens.filter((t) => t.chainId === chain.chainId && t.contractAddress);
    const nativeEvmToken = evmTokens.find((t) => !t.contractAddress);
    if (!tokens.length) return [];
    const multicall = new Multicall({
      nodeUrl: chain.rpc,
      multicallCustomContractAddress,
      chainId: Number(chain.chainId)
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
    const nativeBalance = nativeEvmToken ? await loadNativeEvmBalance(address) : 0;
    let entries: [string, string][] = tokens.map((token) => {
      const amount = results.results[token.denom].callsReturnContext[0].returnValues[0].hex;
      return [token.denom, amount];
    });
    entries.push([nativeEvmToken.denom, nativeBalance.toString()]);
    return entries;
  } catch (error) {
    if (!retryCount || retryCount >= EVM_BALANCE_RETRY_COUNT) throw generateError('Cannot query EVM balance');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return loadEvmEntries(address, chain, multicallCustomContractAddress, retryCount + 1);
  }
}

async function loadEvmAmounts(dispatch: Dispatch, evmAddress: string, chains: CustomChainInfo[]) {
  const amountDetails = Object.fromEntries(
    flatten(await Promise.all(chains.map((chain) => loadEvmEntries(evmAddress, chain))))
  );

  dispatch(updateAmounts(amountDetails));
}

async function loadKawaiiSubnetAmount(dispatch: Dispatch) {
  const kwtAddress = await window.Keplr.getKeplrAddr('kawaii_6886-1');
  if (!kwtAddress) return;
  const kawaiiInfo = chainInfos.find((c) => c.chainId === 'kawaii_6886-1');
  loadNativeBalance(dispatch, kwtAddress, kawaiiInfo);

  const kwtSubnetAddress = getEvmAddress(kwtAddress);
  const kawaiiEvmInfo = chainInfos.find((c) => c.chainId === '0x1ae6');
  let amountDetails = Object.fromEntries(await loadEvmEntries(kwtSubnetAddress, kawaiiEvmInfo));
  // update amounts
  dispatch(updateAmounts(amountDetails));
}

export default function useLoadTokens(): (params: LoadTokenParams) => Promise<void> {
  const dispatch = useDispatch();
  return loadTokens.bind(null, dispatch);
}
