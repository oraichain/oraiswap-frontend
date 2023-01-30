import Web3 from 'web3';
import tokenABI from 'config/abi/erc20.json';
import {
  evmTokens,
  gravityContracts,
  TokenItemType
} from 'config/bridgeTokens';
import GravityABI from 'config/abi/gravity.json';
import erc20ABI from 'config/abi/erc20.json';
import { AbiItem } from 'web3-utils';
import { BSC_CHAIN_ID, ETHEREUM_CHAIN_ID } from 'config/constants';
import { getDenomEvm } from 'helper';

export default class Metamask {
  constructor() {}

  // compare in number type
  public isBsc() {
    return Number(window.ethereum?.chainId) === Number(BSC_CHAIN_ID);
  }

  public isEth() {
    return Number(window.ethereum?.chainId) === Number(ETHEREUM_CHAIN_ID);
  }

  public async switchNetwork(chainId: string | number) {
    await window.ethereum.request!({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x' + Number(chainId).toString(16) }]
    });
  }

  public async transferToGravity(
    chainId: string,
    amountVal: string,
    tokenContract: string,
    from: string | null,
    to: string
  ) {
    const balance = Web3.utils.toWei(amountVal);

    await this.switchNetwork(chainId);

    const web3 = new Web3(window.ethereum);
    const gravityContractAddr = gravityContracts[chainId] as string;
    if (!gravityContractAddr || !from || !to) return;
    const gravityContract = new web3.eth.Contract(
      GravityABI as AbiItem[],
      gravityContractAddr
    );
    const result = await gravityContract.methods
      .sendToCosmos(tokenContract, to, balance)
      .send({
        from
      });
    return result;
  }

  public async checkOrIncreaseAllowance(
    chainId: string,
    tokenAddr: string,
    owner: string,
    spender: string,
    amount: string
  ) {
    await this.switchNetwork(chainId);
    const weiAmount = Web3.utils.toWei(amount);
    const web3 = new Web3(window.ethereum);
    const tokenContract = new web3.eth.Contract(
      erc20ABI as AbiItem[],
      tokenAddr
    );
    const currentAllowance = await tokenContract.methods
      .allowance(owner, spender)
      .call();

    if (+currentAllowance >= +weiAmount) return;

    const allowance = Web3.utils.toWei('99999999999999999');

    const result = await tokenContract.methods
      .approve(spender, allowance)
      .send({
        from: owner
      });
    return result;
  }

  public getOraiToken(denom?: string): TokenItemType | undefined {
    return evmTokens.find(
      (token) => token.denom === (denom ? denom : getDenomEvm())
    );
  }

  public async getOraiBalance(
    address: string | null,
    inputToken?: TokenItemType,
    rpc?: string,
    denom?: string
  ) {
    // must has chainId and contractAddress
    const token = inputToken || this.getOraiToken(denom);
    if (!token || !token.contractAddress) return '0';

    try {
      const provider =
        token.chainId !== window.ethereum.chainId ? token.rpc : window.ethereum;

      const web3 = new Web3(rpc || provider);
      const tokenInst = new web3.eth.Contract(
        tokenABI as AbiItem[],
        token.contractAddress
      );
      const balance = await tokenInst.methods.balanceOf(address).call();
      return balance;
    } catch (ex) {
      return '0';
    }
  }
}
