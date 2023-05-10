import { USDT_TRON_CONTRACT } from 'config/constants';
import Web3 from 'web3';
import erc20ABI from 'config/abi/erc20.json';
import { AbiItem } from 'libs/ethereum-multicall/models';
import { ethToTronAddress } from 'helper';
import { chainInfos } from 'config/chainInfos';
import Metamask from 'libs/metamask';

describe('bigint', () => {
  it('web3-tron-happy-path', async () => {
    const tronRpc = chainInfos.find((c) => c.chainId === '0x2b6653dc').rpc;
    const web3 = new Web3(tronRpc);
    const tokenContract = new web3.eth.Contract(erc20ABI as AbiItem[], USDT_TRON_CONTRACT);
    const owner = '0x993d06fc97f45f16e4805883b98a6c20bab54964';
    const spender = '0x2f1e13A482af1cc89553cDFB8BdF999155D13C35';
    console.log(ethToTronAddress(owner), ethToTronAddress(spender));
    const currentAllowance = BigInt(await tokenContract.methods.allowance(owner, spender).call());
    console.log('current allowance: ', currentAllowance);
  });

  it.each<[string, boolean]>([
    ["0x", false],
    ["orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g", false],
    ["0x3C5C6b570C1DA469E8B24A2E8Ed33c278bDA3222", true],
  ])("test-is-eth-address-metamask", (address, expectedIsEthAddress) => {
    const metamask = new Metamask();
    const isEthAddress = metamask.isEthAddress(address);
    expect(isEthAddress).toEqual(expectedIsEthAddress);
  })
});
