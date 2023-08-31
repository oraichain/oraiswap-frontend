import { gravityContracts, TokenItemType } from 'config/bridgeTokens';
import { chainInfos, NetworkChainId } from 'config/chainInfos';
import { displayInstallWallet, ethToTronAddress, tronToEthAddress } from 'helper';
import { toAmount, toDisplay } from './utils';
import { Bridge__factory, IERC20Upgradeable__factory, IUniswapV2Router02__factory } from 'types/typechain-types';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { getEvmSwapRoute } from 'rest/api';
import { UNISWAP_ROUTER_DEADLINE } from 'config/constants';

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
    // used 'any' to fix the following bug: https://github.com/ethers-io/ethers.js/issues/1107 -> https://github.com/Geo-Web-Project/cadastre/pull/220/files
    if (!this.provider) this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    return this.provider.getSigner();
  }

  public isWindowEthereum() {
    return !!window.ethereum;
  }

  public isTron(chainId: string | number) {
    return Number(chainId) == Networks.tron;
  }

  public getFinalEvmAddress(
    chainId: NetworkChainId,
    address: { metamaskAddress?: string; tronAddress?: string }
  ): string | undefined {
    if (this.isTron(chainId)) return address.tronAddress;
    return address.metamaskAddress;
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

  public calculateEvmSwapSlippage(amount: string, slippage: number): bigint {
    return (BigInt(amount) * (slippage ? 100n - BigInt(slippage) : 97n)) / 100n;
  }

  // TODO: add test cased & add case where from token is native evm
  public async evmSwap(data: {
    fromToken: TokenItemType;
    toTokenContractAddr: string;
    fromAmount: number;
    address: {
      metamaskAddress?: string;
      tronAddress?: string;
    };
    simulateAmount: string;
    slippage?: number; // from 1 to 100
    destination?: string;
  }) {
    const { fromToken, toTokenContractAddr, address, fromAmount, simulateAmount, slippage, destination } = data;
    const { metamaskAddress, tronAddress } = address;
    const finalTransferAddress = window.Metamask.getFinalEvmAddress(fromToken.chainId, {
      metamaskAddress,
      tronAddress
    });
    const finalFromAmount = toAmount(fromAmount, fromToken.decimals).toString();
    const gravityContractAddr = ethers.utils.getAddress(gravityContracts[fromToken.chainId]);
    const checkSumAddress = ethers.utils.getAddress(finalTransferAddress);
    const gravityContract = Bridge__factory.connect(gravityContractAddr, this.getSigner());
    const routerV2Addr = await gravityContract.swapRouter();
    let result: ethers.ContractTransaction;

    let fromTokenSpender = gravityContractAddr;
    // in this case, we wont use proxy contract but uniswap router instead because our proxy does not support swap tokens to native ETH.
    // approve uniswap router first before swapping because it will use transfer from to swap fromToken
    if (!toTokenContractAddr) fromTokenSpender = routerV2Addr;
    await window.Metamask.checkOrIncreaseAllowance(
      fromToken,
      checkSumAddress,
      fromTokenSpender,
      finalFromAmount // increase allowance only take display form as input
    );

    // native bnb / eth case when from token contract addr is empty, then we bridge from native
    if (!fromToken.contractAddress) {
      result = await gravityContract.bridgeFromETH(
        ethers.utils.getAddress(toTokenContractAddr),
        this.calculateEvmSwapSlippage(simulateAmount, slippage), // use
        destination,
        { value: finalFromAmount }
      );
    } else if (!toTokenContractAddr) {
      const routerV2 = IUniswapV2Router02__factory.connect(routerV2Addr, this.getSigner());
      // the route is with weth or wbnb, then the uniswap router will automatically convert and transfer native eth / bnb back
      const evmRoute = getEvmSwapRoute(fromToken.chainId, fromToken.contractAddress, toTokenContractAddr);

      result = await routerV2.swapExactTokensForETH(
        finalFromAmount,
        this.calculateEvmSwapSlippage(simulateAmount, slippage),
        evmRoute,
        checkSumAddress,
        new Date().getTime() + UNISWAP_ROUTER_DEADLINE
      );
    } else {
      result = await gravityContract.bridgeFromERC20(
        ethers.utils.getAddress(fromToken.contractAddress),
        ethers.utils.getAddress(toTokenContractAddr),
        finalFromAmount,
        this.calculateEvmSwapSlippage(simulateAmount, slippage), // use
        destination
      );
    }
    await result.wait();
    return { transactionHash: result.hash };
  }

  public async transferToGravity(
    token: TokenItemType,
    amountVal: string,
    from: string | null,
    to: string
  ): Promise<TransferToGravityResult> {
    const gravityContractAddr = gravityContracts[token.chainId] as string;
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
            { type: 'uint256', value: amountVal }
          ],
          tronToEthAddress(from) // we store the tron address in base58 form, so we need to convert to hex if its tron because the contracts are using the hex form as parameters
        );
    } else if (Metamask.checkEthereum()) {
      // if you call this function on evm, you have to switch network before calling. Otherwise, unexpected errors may happen
      if (!gravityContractAddr || !from || !to) return;
      const gravityContract = Bridge__factory.connect(gravityContractAddr, this.getSigner());
      const result = await gravityContract.sendToCosmos(token.contractAddress, to, amountVal, { from });
      await result.wait();
      return { transactionHash: result.hash };
    }
  }

  public async checkOrIncreaseAllowance(
    token: TokenItemType,
    owner: string,
    spender: string,
    amount: string
  ): Promise<TransferToGravityResult> {
    // we store the tron address in base58 form, so we need to convert to hex if its tron because the contracts are using the hex form as parameters
    if (!token.contractAddress) return;
    const ownerHex = this.isTron(token.chainId) ? tronToEthAddress(owner) : owner;
    // using static rpc for querying both tron and evm
    const tokenContract = IERC20Upgradeable__factory.connect(
      token.contractAddress,
      new ethers.providers.JsonRpcProvider(token.rpc)
    );
    const currentAllowance = await tokenContract.allowance(ownerHex, spender);

    if (currentAllowance.toString() >= amount) return;

    if (this.isTron(token.chainId)) {
      if (Metamask.checkTron())
        return this.submitTronSmartContract(
          ethToTronAddress(token.contractAddress),
          'approve(address,uint256)',
          {},
          [
            { type: 'address', value: spender },
            { type: 'uint256', value: amount }
          ],
          ownerHex
        );
    } else if (Metamask.checkEthereum()) {
      // using window.ethereum for signing
      // if you call this function on evm, you have to switch network before calling. Otherwise, unexpected errors may happen
      const tokenContract = IERC20Upgradeable__factory.connect(token.contractAddress, this.getSigner());
      const result = await tokenContract.approve(spender, amount, { from: ownerHex });
      await result.wait();
      return { transactionHash: result.hash };
    }
  }
}
