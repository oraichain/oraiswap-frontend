import { cosmosTokens, evmTokens, flattenTokens, TokenItemType, tokens } from 'config/bridgeTokens';
import { CoinGeckoId, CosmosChainId, EvmChainId } from 'config/chainInfos';
import { GAS_ESTIMATION_SWAP_DEFAULT, ORAI } from 'config/constants';
import { oraichain2atom, oraichain2oraib } from 'config/ibcInfos';
import { network } from 'config/networks';
import { feeEstimate } from 'helper';
import { toAmount, toDisplay } from 'libs/utils';
import { getDestination } from 'pages/BalanceNew/helpers';
import { calculateMinReceive, generateMsgsSwap } from 'pages/SwapV2/helpers';
import { generateContractMessages, Type } from 'rest/api';

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
  });

  it.each<[CoinGeckoId, EvmChainId | CosmosChainId, CoinGeckoId, EvmChainId | CosmosChainId, string, string]>([
    ['airight', '0x01', 'airight', 'Oraichain', 'orai1234', ``],
    ['airight', '0x38', 'airight', '0x01', 'orai1234', ``],
    ['airight', '0x38', 'airight', 'Oraichain', '', ``],
    ['airight', '0x38', 'airight', 'Oraichain', 'orai1234', `orai1234`],
    ['airight', 'Oraichain', 'tether', 'Oraichain', 'orai1234', `orai1234:${[process.env.REACT_APP_USDT_CONTRACT]}`],
    ['airight', '0x38', 'cosmos', 'Oraichain', 'orai1234', `orai1234:${process.env.REACT_APP_ATOM_ORAICHAIN_DENOM}`],
    ['airight', 'Oraichain', 'cosmos', 'cosmoshub-4', 'orai1234', ''],
    ['airight', '0x38', 'cosmos', 'cosmoshub-4', 'orai1234', `${oraichain2atom}/orai1234:${process.env.REACT_APP_ATOM_ORAICHAIN_DENOM}`],
    ['tether', '0x38', 'oraichain-token', '0x01', 'orai1234', `${oraichain2oraib}/orai1234:orai`],
    ['usd-coin', '0x01', 'tether', '0x38', 'orai1234', `${oraichain2oraib}/orai1234:${process.env.REACT_APP_USDT_CONTRACT}`],
    ['usd-coin', '0x01', 'tether', '0x2b6653dc', 'orai1234', `${oraichain2oraib}/orai1234:${process.env.REACT_APP_USDT_CONTRACT}`],
  ])("test-getDestination-given %s coingecko id, chain id %s, send-to %s, chain id %s with receiver %s should have destination %s", (fromCoingeckoId, fromChainId, toCoingeckoId, toChainId, receiver, destination) => {
    const fromToken = flattenTokens.find((item) => item.coinGeckoId === fromCoingeckoId && item.chainId === fromChainId);
    const toToken = flattenTokens.find((item) => item.coinGeckoId === toCoingeckoId && item.chainId === toChainId);
    const receiverAddress = getDestination(fromToken, toToken, receiver);
    expect(receiverAddress).toEqual(destination);
  })
});
