import { coin } from '@cosmjs/stargate';
import { filteredTokens } from 'config/bridgeTokens';
import {
  KWT_BSC_CONTRACT,
  KWT_DENOM,
  MILKY_BSC_CONTRACT,
  MILKY_DENOM,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID,
  ORAI_BSC_CONTRACT,
  ORAI_INFO
} from 'config/constants';
import { ibcInfos, ibcInfosOld } from 'config/ibcInfos';
import { getExecuteContractMsgs, parseExecuteContractMultiple } from 'libs/cosmjs';
import { buildMultipleMessages, toAmount } from 'libs/utils';
import Long from 'long';
import { getOneStepKeplrAddr } from 'pages/BalanceNew/helpers';
import { generateConvertCw20Erc20Message, generateMoveOraib2OraiMessages, parseTokenInfo } from 'rest/api';

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
    const fromToken = filteredTokens.find((item) => item.name == 'KWT' && item.chainId == ORAICHAIN_ID);
    const evmAmount = coin(toAmount(transferAmount, decimal).toString(), denom);
    const msgConvertReverses = generateConvertCw20Erc20Message(
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
    const fromToken = filteredTokens.find((item) => item.name == 'KWT' && item.chainId == ORAICHAIN_ID);
    const evmAmount = coin(toAmount(transferAmount, decimal).toString(), denom);
    const msgConvertReverses = generateConvertCw20Erc20Message(
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

  it('bridge-transfer-to-remote-chain-ibc-wasm-should-return-only-ibc-wasm-contract-address', async () => {
    const fromToken = filteredTokens.find((item) => item.name == 'ORAI' && item.chainId == ORAICHAIN_ID);
    const toToken = filteredTokens.find((item) => item.name == 'ORAI' && item.chainId == ORAI_BRIDGE_CHAIN_ID);
    let ibcInfo = ibcInfos[fromToken.chainId][toToken.chainId];
    const ibcWasmContractAddress = ibcInfo.source.split('.')[1];
    expect(ibcWasmContractAddress).toBe(process.env.REACT_APP_IBC_WASM_CONTRACT);
  });

  it('bridge-transfer-to-remote-chain-ibc-wasm-should-return-only-ibc-wasm-contract-address', async () => {
    const fromToken = filteredTokens.find((item) => item.name == 'ORAI' && item.chainId == ORAICHAIN_ID);
    const toToken = filteredTokens.find((item) => item.name == 'ORAI' && item.chainId == ORAI_BRIDGE_CHAIN_ID);
    let ibcInfo = ibcInfos[fromToken.chainId][toToken.chainId];
    const ibcWasmContractAddress = ibcInfo.source.split('.')[1];
    expect(ibcWasmContractAddress).toBe(process.env.REACT_APP_IBC_WASM_CONTRACT);
  });

  it('bridge-transfer-to-remote-chain-ibc-wasm-should-return-only-asset-info-token', async () => {
    const fromToken = filteredTokens.find((item) => item.name == 'ORAI' && item.chainId == ORAICHAIN_ID);
    const { info: assetInfo } = parseTokenInfo(fromToken);
    expect(assetInfo).toMatchObject(ORAI_INFO);
  });

  it('bridge-move-oraibridge-to-oraichain-should-return-only-transfer-IBC-msgs', async () => {
    const bridgeTokenNames = ['AIRI', 'USDT'];
    const amount = '100000000000000000';
    const oraibTokens = filteredTokens
      .filter((t) => bridgeTokenNames.includes(t.name) && t.chainId === ORAI_BRIDGE_CHAIN_ID)
      .map((t) => {
        return {
          ...t,
          amount
        };
      });

    const toTokens = oraibTokens.map((oraibToken) => {
      return filteredTokens.find((t) => t.chainId === ORAICHAIN_ID && t.name === oraibToken.name);
    });

    const fromAddress = 'oraib14n3tx8s5ftzhlxvq0w5962v60vd82h305kec0j';
    const toAddress = 'orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573';
    const transferMsgs = generateMoveOraib2OraiMessages(oraibTokens, fromAddress, toAddress);

    // check if transferMsgs is an array
    expect(Array.isArray(transferMsgs)).toBe(true);

    // check if each object in the transferMsgs array has the required properties
    for (const msg of transferMsgs) {
      expect(msg).toHaveProperty('sourcePort');
      expect(msg).toHaveProperty('sourceChannel');
      expect(msg).toHaveProperty('token');
      expect(msg).toHaveProperty('sender');
      expect(msg).toHaveProperty('receiver');
      expect(msg).toHaveProperty('memo');
      expect(msg).toHaveProperty('timeoutTimestamp');
      expect(msg).toHaveProperty('timeoutHeight');
    }

    // check if the sourcePort and sourceChannel values are correct
    let ibcInfo = ibcInfos[oraibTokens[0].chainId][toTokens[0].chainId];

    // hardcode for MILKY & KWT because they use the old IBC channel
    if (oraibTokens[0].denom === MILKY_DENOM || oraibTokens[0].denom === KWT_DENOM)
      ibcInfo = ibcInfosOld[oraibTokens[0].chainId][toTokens[0].chainId];

    expect(transferMsgs[0].sourcePort).toEqual(ibcInfo.source);
    expect(transferMsgs[0].sourceChannel).toEqual(ibcInfo.channel);

    // check if the sender and receiver addresses are correct
    expect(transferMsgs[0].sender).toEqual(fromAddress);
    expect(transferMsgs[0].receiver).toEqual(toAddress);

    // check if the token amount is correct
    expect(transferMsgs[0].token.amount).toEqual(amount);

    // check if the timeout timestamp is correct
    const currentTime = Math.floor(Date.now() / 1000);
    const expectedTimeoutTimestamp = Long.fromNumber(currentTime + ibcInfo.timeout)
      .multiply(1000000000)
      .toString();
    expect(transferMsgs[0].timeoutTimestamp).toEqual(expectedTimeoutTimestamp);
  });
});
