import { coin } from '@cosmjs/stargate';
import { TokenItemType, filteredTokens, flattenTokens } from 'config/bridgeTokens';
import {
  BSC_CHAIN_ID,
  BSC_SCAN,
  COSMOS_CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  ETHEREUM_SCAN,
  KWT_BSC_CONTRACT,
  KWT_DENOM,
  KWT_SCAN,
  KWT_SUBNETWORK_CHAIN_ID,
  MILKY_BSC_CONTRACT,
  MILKY_DENOM,
  ORAICHAIN_ID,
  ORAI_BRIDGE_CHAIN_ID,
  ORAI_BSC_CONTRACT,
  ORAI_INFO,
  TRON_CHAIN_ID,
  TRON_SCAN
} from 'config/constants';
import { ibcInfos, ibcInfosOld } from 'config/ibcInfos';
import { getTransactionUrl } from 'helper';
import { getExecuteContractMsgs, parseExecuteContractMultiple } from 'libs/cosmjs';
import { buildMultipleMessages, toAmount } from 'libs/utils';
import Long from 'long';
import { findDefaultToToken, getOneStepKeplrAddr } from 'pages/BalanceNew/helpers';
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

  it('bridge-convert-kwt-should-return-only-evm-amount', async () => {
    const transferAmount = 10;
    const fromToken = filteredTokens.find((item) => item.name === 'KWT' && item.chainId === KWT_SUBNETWORK_CHAIN_ID);
    const evmAmount = coin(toAmount(transferAmount, fromToken.decimals).toString(), fromToken.denom);
    expect(evmAmount).toMatchObject({
      amount: '10000000000000000000', // 10 * 10**18
      denom: fromToken.denom
    });
  });

  describe('bridge-transfer-token-erc20-cw20', () => {
    const denom = process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM;
    const decimal = 18;
    const transferAmount = 10;
    const fromToken = filteredTokens.find((item) => item.name === 'KWT' && item.chainId === ORAICHAIN_ID);
    const evmAmount = coin(toAmount(transferAmount, decimal).toString(), denom);
    const amounts: AmountDetails = {
      kwt: '1000000000',
      [denom]: '9000000000000000000' // 9 * 10*18
    };
    const msgConvertReverses = generateConvertCw20Erc20Message(amounts, fromToken, keplrAddress, evmAmount);

    it('bridge-transfer-token-erc20-cw20-should-return-only-evm-amount', async () => {
      expect(evmAmount).toMatchObject({
        amount: '10000000000000000000', // 10 * 10**18
        denom: process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM
      });
    });

    it('bridge-transfer-token-erc20-cw20-should-return-only-msg-convert-reverses', async () => {
      // check if the sender and contract address are correct
      for (const msg of msgConvertReverses) {
        expect(msg.contract).toBe(fromToken.contractAddress);
        expect(msg.sender).toBe(keplrAddress);
      }

      expect(Array.isArray(msgConvertReverses)).toBe(true);
    });

    it('bridge-transfer-token-erc20-cw20-should-return-only-execute-convert-reverses', async () => {
      const executeContractMsgs = getExecuteContractMsgs(
        keplrAddress,
        parseExecuteContractMultiple(buildMultipleMessages(undefined, msgConvertReverses))
      );
      expect(Array.isArray(executeContractMsgs)).toBe(true);
    });
  });

  it('bridge-transfer-to-remote-chain-ibc-wasm-should-return-only-ibc-wasm-contract-address', async () => {
    const fromToken = filteredTokens.find((item) => item.name === 'ORAI' && item.chainId === ORAICHAIN_ID);
    const toToken = filteredTokens.find((item) => item.name === 'ORAI' && item.chainId === ORAI_BRIDGE_CHAIN_ID);
    let ibcInfo = ibcInfos[fromToken.chainId][toToken.chainId];
    const ibcWasmContractAddress = ibcInfo.source.split('.')[1];
    expect(ibcWasmContractAddress).toBe(process.env.REACT_APP_IBC_WASM_CONTRACT);
  });

  it('bridge-transfer-to-remote-chain-ibc-wasm-should-return-only-asset-info-token', async () => {
    const fromToken = filteredTokens.find((item) => item.name === 'ORAI' && item.chainId === ORAICHAIN_ID);
    const { info: assetInfo } = parseTokenInfo(fromToken);
    expect(assetInfo).toMatchObject(ORAI_INFO);
  });

  it.each([
    [
      flattenTokens.find((item) => item.name === 'ERC20 MILKY' && item.chainId === KWT_SUBNETWORK_CHAIN_ID),
      ORAICHAIN_ID,
      'MILKY',
      'milky-token'
    ],
    [
      flattenTokens.find((item) => item.name === 'MILKY' && item.chainId === KWT_SUBNETWORK_CHAIN_ID),
      ORAICHAIN_ID,
      'MILKY',
      'milky-token'
    ],
    [
      flattenTokens.find((item) => item.name === 'MILKY' && item.chainId === ORAICHAIN_ID),
      BSC_CHAIN_ID,
      'MILKY',
      'milky-token'
    ],
    [
      flattenTokens.find((item) => item.coinGeckoId === 'cosmos' && item.chainId === COSMOS_CHAIN_ID),
      ORAICHAIN_ID,
      'ATOM',
      'cosmos'
    ],
    [
      flattenTokens.find((item) => item.coinGeckoId === 'cosmos' && item.chainId === ORAICHAIN_ID),
      COSMOS_CHAIN_ID,
      'ATOM',
      'cosmos'
    ],
    [
      flattenTokens.find((item) => item.coinGeckoId === 'oraichain-token' && item.chainId === '0x38'),
      ORAICHAIN_ID,
      'ORAI',
      'oraichain-token'
    ],
    [
      flattenTokens.find((item) => item.coinGeckoId === 'tether' && item.chainId === '0x2b6653dc'),
      ORAICHAIN_ID,
      'USDT',
      'tether'
    ],
    [
      flattenTokens.find((item) => item.coinGeckoId === 'tether' && item.chainId === ORAICHAIN_ID),
      BSC_CHAIN_ID,
      'USDT',
      'tether'
    ]
  ])(
    'bridge-test-find-default-to-token',
    (from: TokenItemType, expectedChainId: string, expectedName: string, expectedCoingeckoId: string) => {
      const toToken = findDefaultToToken(from);
      expect(toToken.chainId).toBe(expectedChainId);
      expect(toToken.name).toContain(expectedName);
      expect(toToken.coinGeckoId).toBe(expectedCoingeckoId);
    }
  );

  it.each([
    [BSC_CHAIN_ID, '0x', `${BSC_SCAN}/tx/0x`],
    [ETHEREUM_CHAIN_ID, '0x', `${ETHEREUM_SCAN}/tx/0x`],
    [KWT_SUBNETWORK_CHAIN_ID, '0x', `${KWT_SCAN}/tx/0x`],
    [TRON_CHAIN_ID, { txid: '0x1234' }, `${TRON_SCAN}/#/transaction/1234`],
    [ORAICHAIN_ID, '0x', null]
  ])('bridge-test-get-transaciton-url', (chainId: string | number, transactionHash: any, expectedUrl: string) => {
    const url = getTransactionUrl(chainId, transactionHash);
    expect(url).toBe(expectedUrl);
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
