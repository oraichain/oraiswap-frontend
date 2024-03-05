// @ts-nocheck
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { Coin, GasPrice } from '@cosmjs/stargate';
import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { Stargate } from '@injectivelabs/sdk-ts';
import { network } from 'config/networks';
import { CosmjsOfflineSigner } from '@leapwallet/cosmos-snap-provider';
import { checkSnapExist } from 'helper';
import { MetamaskOfflineSigner } from './eip191';
export type clientType = 'cosmwasm' | 'injective';

const collectWallet = async (chainId: string) => {
  const keplr = await window.Keplr.getKeplr();
  const snapInstalled = await checkSnapExist();
  if (keplr) return await keplr.getOfflineSignerAuto(chainId);
  if (snapInstalled) return new CosmjsOfflineSigner(chainId);
  return await MetamaskOfflineSigner.connect(window.ethereum, network.denom);
};

const getCosmWasmClient = async (
  config: { signer?: OfflineSigner; chainId?: string; rpc?: string },
  options?: cosmwasm.SigningCosmWasmClientOptions
) => {
  try {
    const { chainId, rpc, signer } = config;
    const wallet = signer ?? (await collectWallet(chainId));
    const defaultAddress = (await wallet.getAccounts())[0];
    const tmClient = await Tendermint37Client.connect(rpc ?? (network.rpc as string));
    const client = await cosmwasm.SigningCosmWasmClient.createWithSigner(
      tmClient,
      wallet,
      options ?? {
        gasPrice: GasPrice.fromString(network.fee.gasPrice + network.denom)
      }
    );
    return { wallet, client, defaultAddress };
  } catch (error) {
    console.error('error getCosmwasmClient: ', error);
  }
};

export const connectWithSigner = async (rpc: string, signer: OfflineSigner, clientType: clientType, options?: any) => {
  switch (clientType) {
    case 'cosmwasm':
      const { client } = await getCosmWasmClient({ signer, rpc }, options);
      return client;
    case 'injective':
      const tmClient = await Tendermint37Client.connect(rpc);
      return Stargate.InjectiveSigningStargateClient.createWithSigner(tmClient as any, signer, options);
  }
};

class CosmJs {
  static async execute(data: {
    prefix?: string;
    walletAddr: string;
    address: string;
    handleMsg: cosmwasm.ExecuteInstruction;
    funds?: readonly Coin[] | undefined;
    gasAmount: Coin;
    gasLimits?: { exec: number };
    memo?: string;
  }) {
    try {
      const keplr = await window.Keplr.getKeplr();
      const isEnableLeapSnap = await checkSnapExist();
      if (keplr || isEnableLeapSnap) {
        await window.Keplr.suggestChain(network.chainId);
        const result = await window.client.execute(
          data.walletAddr,
          data.address,
          data.handleMsg,
          'auto',
          data.memo,
          data.funds
        );
        return result;
      } else {
        throw new Error('You need to install Keplr to execute the contract');
      }
    } catch (error) {
      console.log('error in executing contract: ' + error);
      throw error;
    }
  }

  static async executeMultiple(data: {
    prefix?: string;
    walletAddr: string;
    msgs: cosmwasm.ExecuteInstruction[];
    gasAmount: Coin;
    gasLimits?: { exec: number };
    memo?: string;
  }) {
    try {
      const keplr = await window.Keplr.getKeplr();
      const isEnableLeapSnap = await checkSnapExist();
      if (keplr || isEnableLeapSnap) {
        await window.Keplr.suggestChain(network.chainId);
        const result = await window.client.executeMultiple(data.walletAddr, data.msgs, 'auto', data.memo);
        return {
          logs: result?.logs,
          transactionHash: result.transactionHash
        };
      } else {
        throw new Error('You need to install Keplr to execute the contract');
      }
    } catch (error) {
      console.log('error in executing contract: ' + error);
      throw error;
    }
  }
}

export { collectWallet, getCosmWasmClient };

export default CosmJs;
