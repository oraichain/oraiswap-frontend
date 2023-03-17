import erc20ABI from 'config/abi/erc20.json';
import GravityABI from 'config/abi/gravity.json';
import { gravityContracts, TokenItemType } from 'config/bridgeTokens';
import { TRON_CHAIN_ID, TRON_RPC } from 'config/constants';
import { ethToTronAddress } from 'helper';

import Web3 from 'web3';

import { AbiItem } from 'web3-utils';
import { toAmount } from './utils';

export default class Metamask {
  constructor() {}

  public isWindowEthereum() {
    return !!window.ethereum;
  }

  public isTron() {
    return Number(window.ethereum?.chainId) == TRON_CHAIN_ID;
  }

  private async triggerTronSmartContract(
    tronWeb: TronWeb,
    address: string,
    functionSelector: string,
    options = {},
    parameters = []
  ): Promise<any> {
    try {
      const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
        address,
        functionSelector,
        options,
        parameters
      );

      if (!transaction.result || !transaction.result.result) {
        throw new Error('Unknown trigger error: ' + JSON.stringify(transaction.transaction));
      }
      return transaction;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async switchNetwork(chainId: string | number) {
    await window.ethereum.request!({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x' + Number(chainId).toString(16) }]
    });
  }

  public async getEthAddress() {
    const [address] = await window.ethereum!.request({
      method: 'eth_requestAccounts',
      params: []
    });
    return address;
  }

  public async transferToGravity(token: TokenItemType, amountVal: number, from: string | null, to: string) {
    const gravityContractAddr = gravityContracts[token.chainId] as string;
    const balance = toAmount(amountVal, token.decimals);

    if (this.isTron()) {
      if (!window.tronWeb) {
        throw new Error('Tron Wallet is not found');
      }
      const tronUrl = TRON_RPC.replace('/jsonrpc', '');
      const tronWeb = new TronWeb(tronUrl, tronUrl);
      const transaction = await this.triggerTronSmartContract(
        tronWeb,
        ethToTronAddress(gravityContractAddr),
        'sendToCosmos(address,string,uint256)',
        {},
        [
          { type: 'address', value: token.contractAddress },
          { type: 'string', to },
          { type: 'uint256', value: balance.toString() }
        ]
      );
      // sign from inject tronWeb
      const singedTransaction = window.tronWeb.trx.sign(transaction);
      const txHash = await tronWeb.trx.sendRawTransaction(singedTransaction);
      return { transactionHash: txHash };
    } else {
      await this.switchNetwork(token.chainId);
      const web3 = new Web3(window.ethereum);
      if (!gravityContractAddr || !from || !to) return;
      const gravityContract = new web3.eth.Contract(GravityABI as AbiItem[], gravityContractAddr);
      const result = await gravityContract.methods.sendToCosmos(token.contractAddress, to, balance).send({
        from
      });
      return result;
    }
  }

  public async checkOrIncreaseAllowance(token: TokenItemType, owner: string, spender: string, amount: number) {
    await this.switchNetwork(token.chainId);
    const weiAmount = toAmount(amount, token.decimals);
    const web3 = new Web3(window.ethereum);
    const tokenContract = new web3.eth.Contract(erc20ABI as AbiItem[], token.contractAddress);
    const currentAllowance = BigInt(await tokenContract.methods.allowance(owner, spender).call());

    if (currentAllowance >= weiAmount) return;

    const allowance = toAmount(999999999999999, token.decimals);

    if (this.isTron()) {
      // TODO: using window.tronWeb and tronWeb instance to create transaction
    } else {
      const result = await tokenContract.methods.approve(spender, allowance).send({
        from: owner
      });
      return result;
    }
  }
}
