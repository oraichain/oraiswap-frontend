import erc20ABI from 'config/abi/erc20.json';
import GravityABI from 'config/abi/gravity.json';
import { gravityContracts, TokenItemType } from 'config/bridgeTokens';
import { TRON_CHAIN_ID } from 'config/constants';

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
    await this.switchNetwork(token.chainId);
    const balance = toAmount(amountVal, token.decimals);

    if (this.isTron()) {
      // TODO: using window.tronWeb and tronWeb instance to create transaction
    } else {
      const web3 = new Web3(window.ethereum);
      const gravityContractAddr = gravityContracts[token.chainId] as string;
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
