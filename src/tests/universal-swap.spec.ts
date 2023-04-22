import { cosmosTokens, evmTokens, flattenTokens, TokenItemType, tokens, UniversalSwapType } from 'config/bridgeTokens';
import { CoinGeckoId, CosmosChainId, EvmChainId } from 'config/chainInfos';
import { GAS_ESTIMATION_SWAP_DEFAULT, ORAI, ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX } from 'config/constants';
import { oraichain2atom, oraichain2oraib } from 'config/ibcInfos';
import { network } from 'config/networks';
import { feeEstimate } from 'helper';
import { toAmount, toDisplay } from 'libs/utils';
import { combineReceiver, getDestination } from 'pages/BalanceNew/helpers';
import { calculateMinReceive, generateMsgsSwap } from 'pages/SwapV2/helpers';
import { UniversalSwapHandler } from 'pages/UniversalSwap/helpers';
import { generateContractMessages, Type } from 'rest/api';

describe('universal-swap', () => {
  let windowSpy: jest.SpyInstance;
  beforeAll(() => {
    windowSpy = jest.spyOn(window, "window", "get");
  });
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

  it.each<[CoinGeckoId, EvmChainId | CosmosChainId, CoinGeckoId, EvmChainId | CosmosChainId, string, { destination: string, universalSwapType: UniversalSwapType }]>([
    ['airight', '0x01', 'airight', 'Oraichain', 'orai1234', { destination: '', universalSwapType: 'other-networks-to-oraichain' }],
    ['airight', '0x38', 'airight', '0x01', 'orai1234', { destination: '', universalSwapType: 'other-networks-to-oraichain' }],
    ['airight', '0x38', 'airight', 'Oraichain', '', { destination: '', universalSwapType: 'other-networks-to-oraichain' }],
    ['cosmos', 'cosmoshub-4', 'airight', 'Oraichain', '', { destination: '', universalSwapType: 'other-networks-to-oraichain' }],
    ['osmosis', 'osmosis-1', 'airight', 'Oraichain', '', { destination: '', universalSwapType: 'other-networks-to-oraichain' }],
    ['kawaii-islands', 'kawaii_6886-1', 'airight', 'Oraichain', '', { destination: '', universalSwapType: 'other-networks-to-oraichain' }],
    ['kawaii-islands', '0x1ae6', 'airight', 'Oraichain', '', { destination: '', universalSwapType: 'other-networks-to-oraichain' }],
    ['airight', '0x38', 'airight', 'Oraichain', 'orai1234', { destination: 'orai1234', universalSwapType: 'other-networks-to-oraichain' }],
    ['airight', 'Oraichain', 'tether', 'Oraichain', 'orai1234', { destination: '', universalSwapType: 'oraichain-to-oraichain' }],
    ['airight', '0x38', 'cosmos', 'Oraichain', 'orai1234', { destination: `orai1234:${process.env.REACT_APP_ATOM_ORAICHAIN_DENOM}`, universalSwapType: 'other-networks-to-oraichain' }],
    ['airight', 'Oraichain', 'cosmos', 'cosmoshub-4', 'orai1234', { destination: '', universalSwapType: 'oraichain-to-other-networks' }],
    ['airight', '0x38', 'cosmos', 'cosmoshub-4', 'orai1234', { destination: `${oraichain2atom}/orai1234:${process.env.REACT_APP_ATOM_ORAICHAIN_DENOM}`, universalSwapType: 'other-networks-to-oraichain' }],
    ['tether', '0x38', 'oraichain-token', '0x01', 'orai1234', { destination: `${oraichain2oraib}/orai1234:orai`, universalSwapType: 'other-networks-to-oraichain' }],
    ['usd-coin', '0x01', 'tether', '0x38', 'orai1234', { destination: `${oraichain2oraib}/orai1234:${process.env.REACT_APP_USDT_CONTRACT}`, universalSwapType: 'other-networks-to-oraichain' }],
    ['usd-coin', '0x01', 'tether', '0x2b6653dc', 'orai1234', { destination: `${oraichain2oraib}/orai1234:${process.env.REACT_APP_USDT_CONTRACT}`, universalSwapType: 'other-networks-to-oraichain' }],
    ['usd-coin', '0x01', 'tether', '0x2b6653dc', '0x1234', { destination: `${oraichain2oraib}/${ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX}0x1234:${process.env.REACT_APP_USDT_CONTRACT}`, universalSwapType: 'other-networks-to-oraichain' }],
  ])("test-getDestination-given %s coingecko id, chain id %s, send-to %s, chain id %s with receiver %s should have destination %s", (fromCoingeckoId, fromChainId, toCoingeckoId, toChainId, receiver, destination) => {
    windowSpy.mockImplementation(() => ({
      Metamask: {
        isEthAddress: (address: string) => {
          return address.includes('0x') ? true : false;
        }
      },
    }));
    const fromToken = flattenTokens.find((item) => item.coinGeckoId === fromCoingeckoId && item.chainId === fromChainId);
    const toToken = flattenTokens.find((item) => item.coinGeckoId === toCoingeckoId && item.chainId === toChainId);
    try {
      const receiverAddress = getDestination(fromToken, toToken, receiver);
      expect(receiverAddress).toEqual(destination);
    } catch (error) {
      expect(error).toEqual(new Error(`chain id ${fromToken.chainId} is currently not supported in universal swap`));
    }
  })

  it("test-combineReceiver-empty-destination", () => {
    const result = combineReceiver('receiver');
    expect(result.combinedReceiver).toEqual("channel-1/receiver");
  })
  it("test-combineReceiver-non-empty-destination", () => {
    const result = combineReceiver('receiver', flattenTokens.find((item) => item.coinGeckoId === 'airight' && item.chainId === '0x38'), flattenTokens.find((item) => item.coinGeckoId === 'oraichain-token' && item.chainId === 'Oraichain'), 'foobar');
    expect(result.combinedReceiver).toEqual("channel-1/receiver:foobar:orai");
  })
  it("test-getUniversalSwapToAddress", async () => {
    const universalSwap = new UniversalSwapHandler();
    windowSpy.mockImplementation(() => ({
      Metamask: {
        getEthAddress: () => {
          return '0x1234';
        }
      },
      Keplr: {
        getKeplrAddr: async (_chainId: string) => {
          return 'orai1234';
        }
      }
    }));
    let result = await universalSwap.getUniversalSwapToAddress('0x01');
    expect(result).toEqual('0x1234');
    result = await universalSwap.getUniversalSwapToAddress('cosmoshub-4');
    expect(result).toEqual('orai1234');
  })

  describe("test-processUniversalSwap-with-mock", () => {
    const universalSwap = new UniversalSwapHandler();
    let swapSpy: jest.SpyInstance;
    let swapAndTransferSpy: jest.SpyInstance;
    let transferAndSwapSpy: jest.SpyInstance;

    beforeAll(() => {
      swapSpy = jest.spyOn(universalSwap, 'swap');
      swapAndTransferSpy = jest.spyOn(universalSwap, 'swapAndTransfer');
      transferAndSwapSpy = jest.spyOn(universalSwap, 'transferAndSwap');
    })

    it.each<[UniversalSwapType, string]>([
      ['oraichain-to-oraichain', 'swap'],
      ['oraichain-to-other-networks', 'swapAndTransfer'],
      ['other-networks-to-oraichain', 'transferAndSwap'],
    ])("test-processUniversalSwap", async (universalSwapType, expectedFunction) => {
      swapSpy.mockResolvedValue("swap");
      swapAndTransferSpy.mockResolvedValue("swapAndTransfer");
      transferAndSwapSpy.mockResolvedValue("transferAndSwap");
      const fromToken = flattenTokens.find((item) => item.coinGeckoId === 'airight' && item.chainId === '0x38');
      const toToken = flattenTokens.find((item) => item.coinGeckoId === 'tether' && item.chainId === '0x2b6653dc');
      universalSwap.fromToken = fromToken;
      universalSwap.toToken = toToken;
      const result = await universalSwap.processUniversalSwap('', universalSwapType, { fromAmountToken: 1, simulateAmount: "1" });
      // expect(swapSpy).toHaveBeenCalledTimes(1);
      // expect(swapAndTransferSpy).toHaveBeenCalledTimes(1);
      // expect(transferAndSwapSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedFunction);
    });
  })
});
