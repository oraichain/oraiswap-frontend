import { coin } from '@cosmjs/stargate';
import { filteredTokens } from 'config/bridgeTokens';
import { KWT_BSC_CONTRACT, MILKY_BSC_CONTRACT, ORAI_BSC_CONTRACT } from 'config/constants';
import { getExecuteContractMsgs, parseExecuteContractMultiple } from 'libs/cosmjs';
import { buildMultipleMessages, toAmount } from 'libs/utils';
import { getOneStepKeplrAddr } from 'pages/BalanceNew/helpers';
import { generateConvertCw20Erc20Message } from 'rest/api';

const keplrAddress = 'orai1329tg05k3snr66e2r9ytkv6hcjx6fkxcarydx6';
describe('bridge', () => {
  it('bridge-evm-bsc-to-orai-normal-token-should-return-channel-1-plus-address', async () => {
    const tokenAddress = ORAI_BSC_CONTRACT;
    const res = getOneStepKeplrAddr(keplrAddress, tokenAddress);
    expect(res).toBe(`channel-1/${keplrAddress}`);
  });

  it('bridge-evm-bsc-to-orai-special-tokens-should-return-only-address', async () => {
    let tokenAddress = KWT_BSC_CONTRACT;
    let res = getOneStepKeplrAddr(keplrAddress, tokenAddress);
    expect(res).toBe(keplrAddress);

    tokenAddress = MILKY_BSC_CONTRACT;
    res = getOneStepKeplrAddr(keplrAddress, tokenAddress);
    expect(res).toBe(keplrAddress);
  });

  it('bridge-transfer-token-erc20-cw20-should-return-only-evm-amount', async () => {
    const denom = process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM;
    const decimal = 18;
    const transferAmount = 10;
    const evmAmount = coin(toAmount(transferAmount, decimal).toString(), denom);
    expect(evmAmount).toMatchObject({
      amount: '10000000000000000000',
      denom: process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM
    });
  });

  it('bridge-transfer-token-erc20-cw20-should-return-only-msg-convert-reverses', async () => {
    const denom = process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM;
    const decimal = 18;
    const transferAmount = 10;
    const fromToken = filteredTokens.find((item) => item.name == 'KWT');
    const evmAmount = coin(toAmount(transferAmount, decimal).toString(), denom);
    const msgConvertReverses = await generateConvertCw20Erc20Message(
      {
        [process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM]: '1000000000000000000'
      },
      fromToken,
      keplrAddress,
      evmAmount
    );
    expect(Array.isArray(msgConvertReverses)).toBe(true);
  });

  it('bridge-transfer-token-erc20-cw20-should-return-only-execute-convert-reverses', async () => {
    const denom = process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM;
    const decimal = 18;
    const transferAmount = 10;
    const fromToken = filteredTokens.find((item) => item.name == 'KWT');
    const evmAmount = coin(toAmount(transferAmount, decimal).toString(), denom);
    const msgConvertReverses = await generateConvertCw20Erc20Message(
      {
        [process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM]: '1000000000000000000'
      },
      fromToken,
      keplrAddress,
      evmAmount
    );
    const executeContractMsgs = getExecuteContractMsgs(
      keplrAddress,
      parseExecuteContractMultiple(buildMultipleMessages(undefined, msgConvertReverses))
    );
    expect(Array.isArray(executeContractMsgs)).toBe(true);
  });
});
