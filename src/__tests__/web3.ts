import { USDT_TRON_CONTRACT } from 'config/constants';
import Web3 from 'web3';
import erc20ABI from 'config/abi/erc20.json';
import { AbiItem } from 'libs/ethereum-multicall/models';
import { ethToTronAddress } from 'helper';
import { embedChainInfos } from 'config/chainInfos';

describe('bigint', () => {
  it('web3-tron-happy-path', async () => {
    const tronRpc = embedChainInfos.find((c) => c.chainId === '0x2b6653dc').rpc;
    const web3 = new Web3(tronRpc);
    const tokenContract = new web3.eth.Contract(erc20ABI as AbiItem[], USDT_TRON_CONTRACT);
    const owner = '0x993d06fc97f45f16e4805883b98a6c20bab54964';
    const spender = '0x2f1e13A482af1cc89553cDFB8BdF999155D13C35';
    console.log(ethToTronAddress(owner), ethToTronAddress(spender));
    const currentAllowance = BigInt(await tokenContract.methods.allowance(owner, spender).call());
    console.log('current allowance: ', currentAllowance);
  });
});
