import { KWT_BSC_CONTRACT, MILKY_BSC_CONTRACT, ORAI_BSC_CONTRACT } from "config/constants";
import { getOneStepKeplrAddr } from "pages/BalanceNew/helpers";

describe('bridge', () => {
  it('bridge-evm-bsc-to-orai-normal-token-should-return-channel-1-plus-address', async () => {
    const keplrAddress = "orai1329tg05k3snr66e2r9ytkv6hcjx6fkxcarydx6";
    const tokenAddress = ORAI_BSC_CONTRACT;
    const res = getOneStepKeplrAddr(keplrAddress, tokenAddress);
    expect(res).toBe(`channel-1/${keplrAddress}`);
  });

  it('bridge-evm-bsc-to-orai-special-tokens-should-return-only-address', async () => {
    const keplrAddress = "orai1329tg05k3snr66e2r9ytkv6hcjx6fkxcarydx6";
    let tokenAddress = KWT_BSC_CONTRACT;
    let res = getOneStepKeplrAddr(keplrAddress, tokenAddress);
    expect(res).toBe(keplrAddress);

    tokenAddress = MILKY_BSC_CONTRACT;
    res = getOneStepKeplrAddr(keplrAddress, tokenAddress);
    expect(res).toBe(keplrAddress);
  });
});
