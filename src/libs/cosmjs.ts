import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { toUtf8 } from '@cosmjs/encoding';
import { EncodeObject } from '@cosmjs/proto-signing';
import { Coin, GasPrice } from '@cosmjs/stargate';
import { network } from 'config/networks';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';

/**
 * The options of an .instantiate() call.
 * All properties are optional.
 */
export interface HandleOptions {
  readonly memo?: string;
  readonly funds?: readonly Coin[];
}

export interface ExecuteMultipleMsg {
  contractAddress: string;
  handleMsg: string;
  handleOptions?: HandleOptions;
}

const collectWallet = async (chainId?: string) => {
  const keplr = await window.Keplr.getKeplr();
  if (!keplr) {
    throw new Error('You have to install Keplr first if you do not use a mnemonic to sign transactions');
  }
  // use keplr instead
  return await keplr.getOfflineSignerAuto(chainId ?? network.chainId);
};

const getCosmWasmClient = async () => {
  const wallet = await collectWallet();
  const defaultAddress = (await wallet.getAccounts())[0];
  const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(network.rpc as string, wallet, {
    gasPrice: GasPrice.fromString(network.fee.gasPrice + network.denom)
  });
  return { wallet, client, defaultAddress };
};

const getEncodedExecuteContractMsgs = (senderAddress: string, msgs: cosmwasm.ExecuteInstruction[]): EncodeObject[] => {
  return msgs.map(({ msg, funds, contractAddress }) => {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: senderAddress,
        contract: contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: funds ? (funds as Coin[]) : []
      })
    };
  });
};

const buildMultipleExecuteMessages = (
  mainMsg?: cosmwasm.ExecuteInstruction,
  ...preMessages: cosmwasm.ExecuteInstruction[]
): cosmwasm.ExecuteInstruction[] => {
  try {
    var messages: cosmwasm.ExecuteInstruction[] = mainMsg ? [mainMsg] : [];
    messages.unshift(...preMessages.flat(1));
    return messages;
  } catch (error) {
    console.log('error in buildMultipleExecuteMessages', error);
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
  }) {
    try {
      if (await window.Keplr.getKeplr()) {
        await window.Keplr.suggestChain(network.chainId);
        const result = await window.client.execute(
          data.walletAddr,
          data.address,
          data.handleMsg,
          'auto',
          '',
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
  }) {
    try {
      if (await window.Keplr.getKeplr()) {
        await window.Keplr.suggestChain(network.chainId);
        const result = await window.client.executeMultiple(data.walletAddr, data.msgs, 'auto');
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

export { getCosmWasmClient, collectWallet, getEncodedExecuteContractMsgs, buildMultipleExecuteMessages };

export default CosmJs;
