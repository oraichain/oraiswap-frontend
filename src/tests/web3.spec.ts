import { USDT_TRON_CONTRACT } from 'config/constants';
import { ethToTronAddress } from 'helper';
import { chainInfos } from 'config/chainInfos';
import Metamask from 'libs/metamask';
import { IERC20Upgradeable__factory } from 'types/typechain-types';
import { ethers } from 'ethers';

describe('bigint', () => {
  it('web3-tron-happy-path', async () => {
    const tronRpc = chainInfos.find((c) => c.chainId === '0x2b6653dc').rpc;
    const tokenContract = IERC20Upgradeable__factory.connect(
      USDT_TRON_CONTRACT,
      new ethers.providers.JsonRpcProvider(tronRpc)
    );
    const owner = '0x993d06fc97f45f16e4805883b98a6c20bab54964';
    const spender = '0x2f1e13A482af1cc89553cDFB8BdF999155D13C35';
    console.log(ethToTronAddress(owner), ethToTronAddress(spender));
    const currentAllowance = await tokenContract.allowance(owner, spender);
    console.log('current allowance: ', currentAllowance);
    expect(
      currentAllowance.eq(BigInt(115792089237316195423570985008687907853269984665640564039457584007913129639935n))
    );
  });

  it.each<[string, boolean]>([
    ['0x', false],
    ['orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g', false],
    ['0x3C5C6b570C1DA469E8B24A2E8Ed33c278bDA3222', true]
  ])('test-is-eth-address-metamask', (address, expectedIsEthAddress) => {
    const metamask = new Metamask();
    const isEthAddress = metamask.isEthAddress(address);
    expect(isEthAddress).toEqual(expectedIsEthAddress);
  });
});
