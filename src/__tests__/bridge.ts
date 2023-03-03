import { coin } from '@cosmjs/stargate';
import { KWT_BSC_CONTRACT, MILKY_BSC_CONTRACT, ORAI_BSC_CONTRACT } from 'config/constants';
import { toAmount } from 'libs/utils';
import { getOneStepKeplrAddr } from 'pages/BalanceNew/helpers';

describe('bridge', () => {
  it('bridge-evm-bsc-to-orai-normal-token-should-return-channel-1-plus-address', async () => {
    const keplrAddress = 'orai1329tg05k3snr66e2r9ytkv6hcjx6fkxcarydx6';
    const tokenAddress = ORAI_BSC_CONTRACT;
    const res = getOneStepKeplrAddr(keplrAddress, tokenAddress);
    expect(res).toBe(`channel-1/${keplrAddress}`);
  });

  it('bridge-evm-bsc-to-orai-special-tokens-should-return-only-address', async () => {
    const keplrAddress = 'orai1329tg05k3snr66e2r9ytkv6hcjx6fkxcarydx6';
    let tokenAddress = KWT_BSC_CONTRACT;
    let res = getOneStepKeplrAddr(keplrAddress, tokenAddress);
    expect(res).toBe(keplrAddress);

    tokenAddress = MILKY_BSC_CONTRACT;
    res = getOneStepKeplrAddr(keplrAddress, tokenAddress);
    expect(res).toBe(keplrAddress);
  });

  // it('bridge-transfer-token-erc20-cw20-should-return-only-evm-amount', async () => {
  //   const denom = 'ibc/4F7464EEE736CCFB6B444EB72DE60B3B43C0DD509FFA2B87E05D584467AAE8C8';
  //   const decimal = 18;
  //   const transferAmount = 1000000;
  //   const evmAmount = coin(toAmount(transferAmount, decimal).toString(), denom);
  //   expect(evmAmount).toBe({});
  // });

  // it('bridge-remote-chain-ibc-wasm', async () => {});
});
