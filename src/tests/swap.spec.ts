import { cosmosTokens, flattenTokens, oraichainTokens, TokenItemType, tokenMap } from 'config/bridgeTokens';
import { GAS_ESTIMATION_SWAP_DEFAULT, ORAI } from 'config/constants';
import { network } from 'config/networks';
import { feeEstimate } from 'helper';
import { toAmount, toDisplay } from 'libs/utils';
import { calculateMinReceive, generateMsgsSwap } from 'pages/SwapV2/helpers';
import {
  generateContractMessages,
  generateConvertErc20Cw20Message,
  generateSwapOperationMsgs,
  parseTokenInfo,
  Type
} from 'rest/api';
import { handleSentFunds } from './../rest/api';

describe('swap', () => {
  it('max amount', () => {
    const amount = 123456789n;
    const decimals = 6;

    const displayAmount = toDisplay(amount, decimals);
    expect(displayAmount).toBe(123.456789);
  });

  it('max amount with denom orai', () => {
    const amount = 999999n;
    const decimals = 6;
    const oraiDecimals = { decimals };

    const displayAmount = toDisplay(amount, decimals);
    //@ts-ignore: need only orai decimals to test
    const useFeeEstimate = feeEstimate(oraiDecimals, GAS_ESTIMATION_SWAP_DEFAULT);

    let finalAmount = useFeeEstimate > displayAmount ? 0 : displayAmount - useFeeEstimate;
    expect(finalAmount).toBe(0.993503);
  });

  it('half amount', () => {
    const amount = 123456789n;
    const decimals = 6;
    const displayAmount = toDisplay(amount / BigInt(2), decimals);
    expect(displayAmount).toBe(61.728394);
  });

  it('half amount with denom orai', () => {
    const amount = 999999n;
    const decimals = 6;
    const oraiDecimals = { decimals: 6 };

    const displayAmount = toDisplay(amount / BigInt(2), decimals);
    //@ts-ignore: need only orai decimals to test
    const useFeeEstimate = feeEstimate(oraiDecimals, GAS_ESTIMATION_SWAP_DEFAULT);
    const fromTokenBalanceDisplay = toDisplay(amount, oraiDecimals.decimals);

    let finalAmount = useFeeEstimate > fromTokenBalanceDisplay - displayAmount ? 0 : displayAmount;
    expect(finalAmount).toBe(0.499999);
  });

  describe('generate msgs contract for swap action', () => {
    const senderAddress = 'orai12zyu8w93h0q2lcnt50g3fn0w3yqnhy4fvawaqz';
    const fromAmountToken = 10;
    const fromTokenDecimals = 6;
    const fromTokenHaveContract = cosmosTokens.find((item) => item.name === 'AIRI' && item.chainId === 'Oraichain');
    const fromTokenNoContract = cosmosTokens.find((item) => item.name === 'ATOM' && item.chainId === 'Oraichain');
    const toTokenInfoData = cosmosTokens.find((item) => item.name === 'ORAIX' && item.chainId === 'Oraichain');
    const _fromAmount = toAmount(fromAmountToken, fromTokenDecimals).toString();
    const simulateData = { amount: '1000000' };
    const expectedMinimumReceive = '990000';
    const amounts = {
      airi: '2000000'
    };
    const userSlippage = 1;
    const minimumReceive = calculateMinReceive(simulateData.amount, userSlippage, 6);

    it('return expected minimum receive', () => {
      expect(minimumReceive).toBe(expectedMinimumReceive);
    });

    it('return msgs generate contract', () => {
      testMsgs(fromTokenHaveContract, toTokenInfoData);
      testMsgs(fromTokenNoContract, toTokenInfoData);
    });

    function testMsgs(fromTokenInfoData: TokenItemType, toTokenInfoData: TokenItemType) {
      const msgs = generateContractMessages({
        type: Type.SWAP,
        sender: senderAddress,
        amount: _fromAmount,
        fromInfo: fromTokenInfoData,
        toInfo: toTokenInfoData,
        minimumReceive
      } as any);
      const msg = msgs[0];

      // check if the contract address, msg and sender are correct
      if (fromTokenInfoData.contractAddress) {
        expect(msg.contract).toEqual(fromTokenInfoData.contractAddress);
        expect(JSON.parse(msg.msg.toString()).send.contract).toEqual(network.router);
        expect(JSON.parse(msg.msg.toString()).send.amount).toEqual(_fromAmount);
      } else {
        expect(msg.contract).toEqual(network.router);
        // check swap operation msg when pair is false
        expect(JSON.parse(msg.msg.toString())).toEqual({
          execute_swap_operations: {
            operations: [
              {
                orai_swap: {
                  offer_asset_info: {
                    native_token: {
                      denom: fromTokenInfoData.denom
                    }
                  },
                  ask_asset_info: {
                    native_token: {
                      denom: ORAI
                    }
                  }
                }
              },
              {
                orai_swap: {
                  offer_asset_info: {
                    native_token: {
                      denom: ORAI
                    }
                  },
                  ask_asset_info: {
                    token: {
                      contract_addr: toTokenInfoData.contractAddress
                    }
                  }
                }
              }
            ],
            minimum_receive: expectedMinimumReceive
          }
        });
      }
      expect(msg.sender).toEqual(senderAddress);
      expect(msg.sent_funds).toBeDefined();

      const multipleMsgs = generateMsgsSwap(
        fromTokenInfoData,
        fromAmountToken,
        toTokenInfoData,
        amounts,
        simulateData,
        userSlippage,
        senderAddress
      );
      expect(Array.isArray(multipleMsgs)).toBe(true);
    }

    it.each([
      ['have pairs', ['orai', 'airi'], 1],
      ['dont have pairs', ['uatom', 'airi'], 2]
    ])(
      'should generateSwapOperationMsgs that %s: %s return msg length: %s',
      (_name: string, denoms: [string, string], expectedOperationsLength: number) => {
        const fromToken = tokenMap[denoms[0]];
        const toToken = tokenMap[denoms[1]];
        const fromInfo = parseTokenInfo(fromToken);
        const toInfo = parseTokenInfo(toToken);
        const result = generateSwapOperationMsgs(denoms, fromInfo, toInfo);
        expect(result.length).toEqual(expectedOperationsLength);
      }
    );

    it.each([
      {
        description: 'should return an empty array when `evmDenoms` is not available in `tokenInfo`',
        input: {
          amounts: { denom1: '100' },
          tokenInfo: oraichainTokens.find((t) => t.coinGeckoId === 'airight'),
          sender: 'orai1234'
        },
        expectedMsgLength: 0
      },
      {
        description: 'should return an array of messages when `evmDenoms` is available in `tokenInfo`',
        input: {
          amounts: { [process.env.REACT_APP_KWTBSC_ORAICHAIN_DENOM]: '100' },
          tokenInfo: flattenTokens.find((t) => t.coinGeckoId === 'kawaii-islands' && t.evmDenoms),
          sender: 'orai1234'
        },
        expectedMsgLength: 1
      }
    ])('$description', ({ input, expectedMsgLength }) => {
      const result = generateConvertErc20Cw20Message(input.amounts, input.tokenInfo, input.sender);
      expect(result.length).toEqual(expectedMsgLength);
    });

    test.each([
      {
        funds: [
          { denom: 'usdt', amount: '10' },
          { denom: 'airi', amount: '30' },
          { denom: 'trx', amount: '40' }
        ],
        expectedOutput: [
          { denom: 'airi', amount: '30' },
          { denom: 'trx', amount: '40' },
          { denom: 'usdt', amount: '10' }
        ]
      },
      {
        funds: [],
        expectedOutput: null
      },
      {
        funds: [undefined, undefined],
        expectedOutput: null
      },
      {
        funds: [{ denom: 'trx', amount: '10' }, undefined],
        expectedOutput: [{ denom: 'trx', amount: '10' }]
      },
      {
        funds: [
          { denom: 'airi', amount: '10' },
          { denom: 'airi', amount: '20' }
        ],
        expectedOutput: [
          { denom: 'airi', amount: '10' },
          { denom: 'airi', amount: '20' }
        ]
      },
      {
        funds: [
          { denom: 'trx', amount: '10' },
          { denom: 'airi', amount: '20' },
          { denom: 'usdt', amount: '30' }
        ],
        expectedOutput: [
          { denom: 'airi', amount: '20' },
          { denom: 'trx', amount: '10' },
          { denom: 'usdt', amount: '30' }
        ]
      }
    ])('test handleSentFunds should returns expected output for input %p', ({ funds, expectedOutput }) => {
      const result = handleSentFunds(...funds);
      expect(result).toEqual(expectedOutput);
    });
  });
});
