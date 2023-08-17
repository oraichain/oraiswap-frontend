import { gravityContracts, TokenItemType } from 'config/bridgeTokens';
import { chainInfos } from 'config/chainInfos';
import { displayInstallWallet, ethToTronAddress, tronToEthAddress } from 'helper';
import { toAmount } from './utils';
import { Bridge__factory, IERC20Upgradeable__factory } from 'types/typechain-types';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

type TransferToGravityResult = {
  transactionHash: string;
};

export default class Metamask {
  private provider: Web3Provider;

  public static checkEthereum() {
    if (window.ethereum) {
      return true;
    }

    displayInstallWallet('Metamask');
    return false;
  }

  public getSigner() {
    if (!this.provider) this.provider = new ethers.providers.Web3Provider(window.ethereum);
    return this.provider.getSigner();
  }

  public isWindowEthereum() {
    return !!window.ethereum;
  }

  public isTron(chainId: string | number) {
    return Number(chainId) == Networks.tron;
  }

  public static checkTron() {
    if (window.tronWeb && window.tronLink) {
      return true;
    }

    displayInstallWallet('TronLink');
    return false;
  }

  public isEthAddress(address: string): boolean {
    try {
      const checkSumAddress = ethers.utils.getAddress(address);
      return ethers.utils.isAddress(checkSumAddress);
    } catch (error) {
      return false;
    }
  }

  public toCheckSumEthAddress(address: string): string {
    return ethers.utils.getAddress(address);
  }

  private async submitTronSmartContract(
    address: string,
    functionSelector: string,
    options: { feeLimit?: number } = { feeLimit: 40 * 1e6 }, // submitToCosmos costs about 40 TRX
    parameters = [],
    issuerAddress: string
  ): Promise<TransferToGravityResult> {
    const tronRpc = chainInfos.find((c) => c.chainId == '0x2b6653dc').rpc;
    const tronUrl = tronRpc.replace('/jsonrpc', '');
    const tronWeb = new TronWeb(tronUrl, tronUrl);

    try {
      console.log('before building tx: ', issuerAddress);
      const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
        address,
        functionSelector,
        options,
        parameters,
        ethToTronAddress(issuerAddress)
      );
      console.log('transaction builder: ', transaction);

      if (!transaction.result || !transaction.result.result) {
        throw new Error('Unknown trigger error: ' + JSON.stringify(transaction.transaction));
      }
      console.log('before signing');

      // sign from inject tronWeb
      const singedTransaction = await window.tronWeb.trx.sign(transaction.transaction);
      console.log('signed tx: ', singedTransaction);
      const result = await tronWeb.trx.sendRawTransaction(singedTransaction);
      return { transactionHash: result.txid };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async switchNetwork(chainId: string | number) {
    if (Metamask.checkEthereum()) {
      await window.ethereum.request!({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + Number(chainId).toString(16) }]
      });
    }
  }

  public async getEthAddress() {
    if (Metamask.checkEthereum()) {
      const [address] = await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: []
      });
      return address;
    }
  }

  // TODO: add test cased & add case where from token is native evm
  public async evmSwap(fromToken: TokenItemType, toTokenContractAddr: string, address: string, fromAmount: number) {
    const gravityContractAddr = ethers.utils.getAddress(gravityContracts[fromToken.chainId]);
    const amount = toAmount(fromAmount, fromToken.decimals);
    const checkSumAddress = ethers.utils.getAddress(address);
    await window.Metamask.checkOrIncreaseAllowance(fromToken, checkSumAddress, gravityContractAddr, fromAmount);
    const gravityContract = Bridge__factory.connect(gravityContractAddr, this.getSigner());
    console.log(fromToken.contractAddress, toTokenContractAddr);
    const result = await gravityContract.bridgeFromERC20(
      ethers.utils.getAddress(fromToken.contractAddress),
      ethers.utils.getAddress(toTokenContractAddr),
      amount,
      amount,
      ''
    );
    await result.wait();
    return { transactionHash: result.hash };
  }

  public async transferToGravity(
    token: TokenItemType,
    amountVal: number,
    from: string | null,
    to: string
  ): Promise<TransferToGravityResult> {
    const gravityContractAddr = gravityContracts[token.chainId] as string;
    const balance = toAmount(amountVal, token.decimals);
    console.log('gravity tron address: ', gravityContractAddr);

    if (this.isTron(token.chainId)) {
      if (Metamask.checkTron())
        return await this.submitTronSmartContract(
          ethToTronAddress(gravityContractAddr),
          'sendToCosmos(address,string,uint256)',
          {},
          [
            { type: 'address', value: token.contractAddress },
            { type: 'string', value: to },
            { type: 'uint256', value: balance.toString() }
          ],
          tronToEthAddress(from) // we store the tron address in base58 form, so we need to convert to hex if its tron because the contracts are using the hex form as parameters
        );
    } else if (Metamask.checkEthereum()) {
      await this.switchNetwork(token.chainId);
      if (!gravityContractAddr || !from || !to) return;
      const gravityContract = Bridge__factory.connect(gravityContractAddr, this.getSigner());
      const result = await gravityContract.sendToCosmos(token.contractAddress, to, balance, { from });
      await result.wait();
      return { transactionHash: result.hash };
    }
  }

  public async checkOrIncreaseAllowance(
    token: TokenItemType,
    owner: string,
    spender: string,
    amount: number
  ): Promise<TransferToGravityResult> {
    // we store the tron address in base58 form, so we need to convert to hex if its tron because the contracts are using the hex form as parameters
    const ownerHex = this.isTron(token.chainId) ? tronToEthAddress(owner) : owner;
    const allowance = toAmount(amount, token.decimals);
    // using static rpc for querying both tron and evm
    const tokenContract = IERC20Upgradeable__factory.connect(
      token.contractAddress,
      new ethers.providers.JsonRpcProvider(token.rpc)
    );
    const currentAllowance = await tokenContract.allowance(ownerHex, spender);

    if (currentAllowance.toBigInt() >= allowance) return;

    if (this.isTron(token.chainId)) {
      if (Metamask.checkTron())
        return this.submitTronSmartContract(
          ethToTronAddress(token.contractAddress),
          'approve(address,uint256)',
          {},
          [
            { type: 'address', value: spender },
            { type: 'uint256', value: allowance.toString() }
          ],
          ownerHex
        );
    } else if (Metamask.checkEthereum()) {
      // using window.ethereum for signing
      await this.switchNetwork(token.chainId);
      const tokenContract = IERC20Upgradeable__factory.connect(token.contractAddress, this.getSigner());
      const result = await tokenContract.approve(spender, allowance, { from: ownerHex });
      await result.wait();
      return { transactionHash: result.hash };
    }
  }
}
