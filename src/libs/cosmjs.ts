import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { network } from 'config/networks';
import { Decimal } from '@cosmjs/math';
import { isDeliverTxFailure, logs, GasPrice, Coin } from '@cosmjs/stargate';
import { toUtf8 } from '@cosmjs/encoding';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { EncodeObject } from '@cosmjs/proto-signing';

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

interface Msg {
  contractAddress: string;
  handleMsg: any;
  transferAmount?: readonly Coin[];
}

const collectWallet = async (chainId?: string) => {
  const keplr = await window.Keplr.getKeplr();
  if (!keplr) {
    throw new Error('You have to install Keplr first if you do not use a mnemonic to sign transactions');
  }
  // use keplr instead
  return await keplr.getOfflineSignerAuto(chainId ?? network.chainId);
};

const parseExecuteContractMultiple = (msgs: ExecuteMultipleMsg[]) => {
  console.log('messages in parse execute contract: ', msgs);
  return msgs.map(({ handleMsg, handleOptions, contractAddress }) => {
    return {
      handleMsg: JSON.parse(handleMsg),
      transferAmount: handleOptions?.funds,
      contractAddress
    };
  });
};

const getExecuteContractMsgs = (senderAddress: string, msgs: Msg[]): EncodeObject[] => {
  return msgs.map(({ handleMsg, transferAmount, contractAddress }) => {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: senderAddress,
        contract: contractAddress,
        msg: toUtf8(JSON.stringify(handleMsg)),
        funds: [...(transferAmount || [])]
      })
    };
  });
};

const getAminoExecuteContractMsgs = (senderAddress: string, msgs: Msg[]) => {
  return msgs.map(({ handleMsg, transferAmount, contractAddress }) => {
    return {
      type: 'wasm/MsgExecuteContract',
      value: {
        sender: senderAddress,
        contract: contractAddress,
        msg: handleMsg,
        sent_funds: [...(transferAmount || [])]
      }
    };
  });
};

const executeMultipleDirectClient = async (
  senderAddress: string,
  msgs: Msg[],
  memo = '',
  client: cosmwasm.SigningCosmWasmClient
) => {
  const executeContractMsgs = getExecuteContractMsgs(senderAddress, msgs);
  console.log({ senderAddress, executeContractMsgs });
  const result = await client.signAndBroadcast(senderAddress, executeContractMsgs, 'auto', memo);
  if (isDeliverTxFailure(result)) {
    throw new Error(
      `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Raw log: ${result.rawLog}`
    );
  }
  return {
    logs: logs.parseRawLog(result.rawLog),
    transactionHash: result.transactionHash
  };
};

const executeMultipleAminoClient = async (
  msgs: Msg[],
  memo = '',
  client: cosmwasm.SigningCosmWasmClient,
  walletAddr: string
) => {
  const executeMsgs = getExecuteContractMsgs(walletAddr, msgs);

  const result = await client.signAndBroadcast(walletAddr, executeMsgs, 'auto', memo);
  if (isDeliverTxFailure(result)) {
    throw new Error(
      `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
    );
  }
  return {
    logs: result?.rawLog,
    transactionHash: result.transactionHash
  };
};
class CosmJs {
  static async execute(data: {
    prefix?: string;
    walletAddr: string;
    address: string;
    handleMsg: string;
    handleOptions?: HandleOptions;
    gasAmount: Coin;
    gasLimits?: { exec: number };
  }) {
    try {
      if (await window.Keplr.getKeplr()) {
        await window.Keplr.suggestChain(network.chainId);
        const key = await window.Keplr.getKeplrKey(network.chainId);
        if (key.isNanoLedger) return this.executeAmino(data);
        return this.executeDirect(data);
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
    msgs: ExecuteMultipleMsg[];
    gasAmount: Coin;
    gasLimits?: { exec: number };
  }) {
    try {
      if (await window.Keplr.getKeplr()) {
        await window.Keplr.suggestChain(network.chainId);
        const key = await window.Keplr.getKeplrKey(network.chainId);
        if (key.isNanoLedger) return this.executeMultipleAmino(data);
        return this.executeMultipleDirect(data);
      } else {
        throw new Error('You need to install Keplr to execute the contract');
      }
    } catch (error) {
      console.log('error in executing contract: ' + error);
      throw error;
    }
  }

  static async sendMultipleAmino({
    msgs,
    gasAmount,
    walletAddr,
    lcd = network.rpc,
    chainId = network.chainId
  }: {
    walletAddr: string;
    msgs: any[];
    gasAmount: Coin;
    lcd?: string;
    chainId?: string;
  }) {
    await window.Keplr.suggestChain(chainId);
    const wallet = await collectWallet(chainId);

    const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(lcd, wallet, {
      gasPrice: GasPrice.fromString(gasAmount.amount + gasAmount.denom),
      prefix: 'orai'
    });

    const result = await client.signAndBroadcast(walletAddr, msgs, 'auto');
    if (isDeliverTxFailure(result)) {
      throw new Error(
        `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
      );
    }
    return {
      logs: result.rawLog,
      transactionHash: result.transactionHash
    };
  }

  static async executeAmino({
    address,
    handleMsg,
    handleOptions,
    gasAmount,
    prefix,
    walletAddr
  }: {
    prefix?: string;
    walletAddr: string;
    address: string;
    handleMsg: string;
    handleOptions?: HandleOptions;
    gasAmount: Coin;
  }) {
    try {
      await window.Keplr.suggestChain(network.chainId);
      const wallet = await collectWallet();

      const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(network.rpc, wallet, {
        gasPrice: GasPrice.fromString(gasAmount.amount + gasAmount.denom),
        prefix
      });

      const input = JSON.parse(handleMsg);

      const result = await client.execute(walletAddr, address, input, 'auto', undefined, handleOptions?.funds);

      return result;
    } catch (error) {
      console.log('error in executing contract: ' + error);
      throw error;
    }
  }

  static async executeMultipleAmino({
    msgs,
    gasAmount,
    prefix,
    walletAddr
  }: {
    prefix?: string;
    walletAddr: string;
    msgs: ExecuteMultipleMsg[];
    gasAmount: Coin;
  }) {
    try {
      await window.Keplr.suggestChain(network.chainId);
      const wallet = await collectWallet();

      const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(network.rpc, wallet, {
        gasPrice: GasPrice.fromString(gasAmount.amount + gasAmount.denom),
        prefix
      });

      const input: Msg[] = msgs.map(({ handleMsg, handleOptions, contractAddress }) => {
        return {
          handleMsg: JSON.parse(handleMsg),
          transferAmount: handleOptions?.funds,
          contractAddress
        };
      });

      const result = await executeMultipleAminoClient(input, '', client, walletAddr);

      return result;
    } catch (error) {
      console.log('error in executing contract: ' + error);
      throw error;
    }
  }

  /**
   * A wrapper method to execute a smart contract
   * @param args - an object containing essential parameters to execute contract
   * @returns - transaction hash after executing the contract
   */
  static async executeDirect({
    address,
    handleMsg,
    handleOptions,
    gasAmount,
    prefix,
    walletAddr
  }: {
    prefix?: string;
    walletAddr: string;
    address: string;
    handleMsg: string;
    handleOptions?: HandleOptions;
    gasAmount: Coin;
  }) {
    try {
      const wallet = await collectWallet();
      const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(network.rpc, wallet, {
        gasPrice: new GasPrice(Decimal.fromUserInput(gasAmount.amount, 6), gasAmount.denom),
        prefix
      });
      const input = JSON.parse(handleMsg);
      const result = await client.execute(walletAddr, address, input, 'auto', '', handleOptions?.funds);
      return result;
    } catch (error) {
      console.log('error in executing contract: ', error);
      throw error;
    }
  }

  static async executeMultipleDirect({
    msgs,
    gasAmount,
    prefix,
    walletAddr
  }: {
    prefix?: string;
    walletAddr: string;
    msgs: ExecuteMultipleMsg[];
    gasAmount: Coin;
  }) {
    try {
      const wallet = await collectWallet();
      const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(network.rpc, wallet, {
        gasPrice: new GasPrice(Decimal.fromUserInput(gasAmount.amount, 6), gasAmount.denom),
        prefix
      });

      const input: Msg[] = msgs.map(({ handleMsg, handleOptions, contractAddress }) => {
        return {
          handleMsg: JSON.parse(handleMsg),
          transferAmount: handleOptions?.funds,
          contractAddress
        };
      });
      const result = await executeMultipleDirectClient(walletAddr, input, undefined, client);
      return result;
    } catch (error) {
      console.log('error in executing contract: ', error);
      throw error;
    }
  }
}

export { collectWallet, getExecuteContractMsgs, parseExecuteContractMultiple, getAminoExecuteContractMsgs };

export default CosmJs;
