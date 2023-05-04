import { toBinary } from '@cosmjs/cosmwasm-stargate';
import { toUtf8 } from '@cosmjs/encoding';
import { TokenItemType, UniversalSwapType, cosmosTokens, flattenTokens, oraichainTokens } from 'config/bridgeTokens';
import { CoinGeckoId, CosmosChainId, EvmChainId, NetworkChainId } from 'config/chainInfos';
import {
  AIRI_BSC_CONTRACT,
  GAS_ESTIMATION_SWAP_DEFAULT,
  IBC_TRANSFER_TIMEOUT,
  ORAI,
  ORAI_BRIDGE_EVM_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX
} from 'config/constants';
import { ibcInfos, oraib2oraichain, oraichain2atom, oraichain2oraib, oraichain2osmosis } from 'config/ibcInfos';
import { network } from 'config/networks';
import { feeEstimate } from 'helper';
import { toAmount, toDisplay, toTokenInfo } from 'libs/utils';
import Long from 'long';
import { combineReceiver, findToToken, getDestination } from 'pages/BalanceNew/helpers';
import { calculateMinReceive } from 'pages/SwapV2/helpers';
import { UniversalSwapHandler } from 'pages/UniversalSwap/helpers';
import { Type, generateContractMessages, simulateSwap } from 'rest/api';
import * as restApi from 'rest/api';
import { IBCInfo } from 'types/ibc';
import { senderAddress } from './common';

describe('universal-swap', () => {
  let windowSpy: jest.SpyInstance;
  beforeAll(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
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
    const userSlippage = 1;

    const universalSwap = new UniversalSwapHandler();
    const minimumReceive = universalSwap.calculateMinReceive(simulateData.amount, userSlippage, 6);

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
    }
  });

  it.each<
    [
      CoinGeckoId,
      EvmChainId | CosmosChainId,
      CoinGeckoId,
      EvmChainId | CosmosChainId,
      string,
      { destination: string; universalSwapType: UniversalSwapType }
    ]
  >([
    [
      'airight',
      '0x01',
      'airight',
      'Oraichain',
      'orai1234',
      { destination: '', universalSwapType: 'other-networks-to-oraichain' }
    ],
    [
      'airight',
      '0x38',
      'airight',
      '0x01',
      'orai1234',
      { destination: '', universalSwapType: 'other-networks-to-oraichain' }
    ],
    [
      'airight',
      '0x38',
      'airight',
      'Oraichain',
      '',
      { destination: '', universalSwapType: 'other-networks-to-oraichain' }
    ],
    [
      'cosmos',
      'cosmoshub-4',
      'airight',
      'Oraichain',
      '',
      { destination: '', universalSwapType: 'other-networks-to-oraichain' }
    ],
    [
      'osmosis',
      'osmosis-1',
      'airight',
      'Oraichain',
      '',
      { destination: '', universalSwapType: 'other-networks-to-oraichain' }
    ],
    [
      'kawaii-islands',
      'kawaii_6886-1',
      'airight',
      'Oraichain',
      '',
      { destination: '', universalSwapType: 'other-networks-to-oraichain' }
    ],
    [
      'kawaii-islands',
      '0x1ae6',
      'airight',
      'Oraichain',
      '',
      { destination: '', universalSwapType: 'other-networks-to-oraichain' }
    ],
    [
      'airight',
      '0x38',
      'airight',
      'Oraichain',
      'orai1234',
      { destination: 'orai1234', universalSwapType: 'other-networks-to-oraichain' }
    ],
    [
      'airight',
      'Oraichain',
      'tether',
      'Oraichain',
      'orai1234',
      { destination: '', universalSwapType: 'oraichain-to-oraichain' }
    ],
    [
      'airight',
      '0x38',
      'cosmos',
      'Oraichain',
      'orai1234',
      {
        destination: `orai1234:${process.env.REACT_APP_ATOM_ORAICHAIN_DENOM}`,
        universalSwapType: 'other-networks-to-oraichain'
      }
    ],
    [
      'airight',
      'Oraichain',
      'cosmos',
      'cosmoshub-4',
      'orai1234',
      { destination: '', universalSwapType: 'oraichain-to-other-networks' }
    ],
    [
      'airight',
      '0x38',
      'cosmos',
      'cosmoshub-4',
      'orai1234',
      {
        destination: `${oraichain2atom}/orai1234:${process.env.REACT_APP_ATOM_ORAICHAIN_DENOM}`,
        universalSwapType: 'other-networks-to-oraichain'
      }
    ],
    [
      'tether',
      '0x38',
      'oraichain-token',
      '0x01',
      'orai1234',
      { destination: `${oraichain2oraib}/orai1234:orai`, universalSwapType: 'other-networks-to-oraichain' }
    ],
    [
      'usd-coin',
      '0x01',
      'tether',
      '0x38',
      'orai1234',
      {
        destination: `${oraichain2oraib}/orai1234:${process.env.REACT_APP_USDT_CONTRACT}`,
        universalSwapType: 'other-networks-to-oraichain'
      }
    ],
    [
      'usd-coin',
      '0x01',
      'tether',
      '0x2b6653dc',
      'orai1234',
      {
        destination: `${oraichain2oraib}/orai1234:${process.env.REACT_APP_USDT_CONTRACT}`,
        universalSwapType: 'other-networks-to-oraichain'
      }
    ],
    [
      'usd-coin',
      '0x01',
      'tether',
      '0x2b6653dc',
      '0x1234',
      {
        destination: `${oraichain2oraib}/${ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX}0x1234:${process.env.REACT_APP_USDT_CONTRACT}`,
        universalSwapType: 'other-networks-to-oraichain'
      }
    ]
  ])(
    'test-getDestination-given %s coingecko id, chain id %s, send-to %s, chain id %s with receiver %s should have destination %s',
    (fromCoingeckoId, fromChainId, toCoingeckoId, toChainId, receiver, destination) => {
      windowSpy.mockImplementation(() => ({
        Metamask: {
          isEthAddress: (address: string) => {
            return address.includes('0x') ? true : false;
          }
        }
      }));
      const fromToken = flattenTokens.find(
        (item) => item.coinGeckoId === fromCoingeckoId && item.chainId === fromChainId
      );
      const toToken = flattenTokens.find((item) => item.coinGeckoId === toCoingeckoId && item.chainId === toChainId);
      try {
        const receiverAddress = getDestination(fromToken, toToken, receiver);
        expect(receiverAddress).toEqual(destination);
      } catch (error) {
        expect(error).toEqual(new Error(`chain id ${fromToken.chainId} is currently not supported in universal swap`));
      }
    }
  );

  it('test-combineReceiver-empty-destination', () => {
    const result = combineReceiver('receiver');
    expect(result.combinedReceiver).toEqual(`${oraib2oraichain}/receiver`);
  });
  it('test-combineReceiver-non-empty-destination', () => {
    const result = combineReceiver(
      'receiver',
      flattenTokens.find((item) => item.coinGeckoId === 'airight' && item.chainId === '0x38'),
      flattenTokens.find((item) => item.coinGeckoId === 'oraichain-token' && item.chainId === 'Oraichain'),
      'foobar'
    );
    expect(result.combinedReceiver).toEqual(`${oraib2oraichain}/receiver:foobar:orai`);
  });
  it('test-getUniversalSwapToAddress', async () => {
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
  });

  describe('test-processUniversalSwap-with-mock', () => {
    const universalSwap = new UniversalSwapHandler();
    const fromAmount = '100000';
    const simulateAmount = '100';
    const userSlippage = 0.01;
    universalSwap.fromAmount = toDisplay(fromAmount);
    universalSwap.simulateAmount = simulateAmount;
    universalSwap.userSlippage = userSlippage;

    universalSwap.sender = senderAddress;
    let swapSpy: jest.SpyInstance;
    let swapAndTransferSpy: jest.SpyInstance;
    let transferAndSwapSpy: jest.SpyInstance;

    beforeAll(() => {
      swapSpy = jest.spyOn(universalSwap, 'swap');
      swapAndTransferSpy = jest.spyOn(universalSwap, 'swapAndTransfer');
      transferAndSwapSpy = jest.spyOn(universalSwap, 'transferAndSwap');
    });

    it.each([
      ['cosmos-hub-network', 'cosmos', 'cosmoshub-4', 'cosmos', 'cosmoshub-4'],
      ['osmosis-network', 'osmosis', 'osmosis-1', 'osmosis', 'osmosis-1'],
      ['evm-network-is-bsc', 'airight', '0x38', 'airight', 'oraibridge-subnet-2'],
      ['evm-network-is-eth', 'usd-coin', '0x01', 'usd-coin', 'oraibridge-subnet-2'],
      ['evm-network-is-tron', 'tron', '0x2b6653dc', 'tron', 'oraibridge-subnet-2']
    ])(
      'test-findToToken-when-universalSwap-from-Oraichain-to%s',
      (
        _name,
        fromCoingeckoId: CoinGeckoId,
        toChainId: NetworkChainId,
        expectedToCoinGeckoId: CoinGeckoId,
        expectedToChainId: NetworkChainId
      ) => {
        const fromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoingeckoId);
        const toTokenTransfer = findToToken(fromToken, toChainId);
        expect(toTokenTransfer.coinGeckoId).toEqual(expectedToCoinGeckoId);
        expect(toTokenTransfer.chainId).toEqual(expectedToChainId);
      }
    );

    it.each<[UniversalSwapType, string]>([
      ['oraichain-to-oraichain', 'swap'],
      ['oraichain-to-other-networks', 'swapAndTransfer'],
      ['other-networks-to-oraichain', 'transferAndSwap']
    ])('test-processUniversalSwap', async (universalSwapType, expectedFunction) => {
      swapSpy.mockResolvedValue('swap');
      swapAndTransferSpy.mockResolvedValue('swapAndTransfer');
      transferAndSwapSpy.mockResolvedValue('transferAndSwap');
      const fromToken = flattenTokens.find((item) => item.coinGeckoId === 'airight' && item.chainId === '0x38');
      const toToken = flattenTokens.find((item) => item.coinGeckoId === 'tether' && item.chainId === '0x2b6653dc');
      universalSwap.fromToken = fromToken;
      universalSwap.toToken = toToken;
      const result = await universalSwap.processUniversalSwap('', universalSwapType, {});
      expect(result).toEqual(expectedFunction);
    });

    it.each<[NetworkChainId, string]>([
      ['cosmoshub-4', 'cosmos'],
      ['osmosis-1', 'cosmos'],
      ['Oraichain', 'evm'],
      ['0x01', 'evm']
    ])('test-combine-msgs-logic', async (chainId, expectedMsgType) => {
      const universalSwap = new UniversalSwapHandler();
      const toToken = flattenTokens.find((item) => item.coinGeckoId === 'tether');
      universalSwap.toToken = toToken;
      universalSwap.toToken.chainId = chainId;
      universalSwap.combineMsgCosmos = async () => {
        return new Promise((resolve) => resolve([{ value: 'any', typeUrl: 'cosmos' }]));
      };
      universalSwap.combineMsgEvm = async () => {
        return new Promise((resolve) => resolve([{ value: 'any', typeUrl: 'evm' }]));
      };
      const messages = await universalSwap.combineMsgs('Ox1234', 'T1234');
      expect(messages[0].typeUrl).toEqual(expectedMsgType);
    });

    it.each([
      [
        'swap-tokens-that-both-belong-to-Oraichain-from-is-native-token',
        'oraichain-token',
        'airight',
        'Oraichain',
        {
          execute_swap_operations: {
            operations: [
              {
                orai_swap: {
                  offer_asset_info: { native_token: { denom: 'orai' } },
                  ask_asset_info: { token: { contract_addr: process.env.REACT_APP_AIRI_CONTRACT } }
                }
              }
            ],
            minimum_receive: '99'
          }
        },
        process.env.REACT_APP_ROUTER_V2_CONTRACT,
        { funds: [{ amount: fromAmount, denom: 'orai' }] }
      ],
      [
        'swap-tokens-that-both-belong-to-Oraichain-from-is-cw20-token',
        'tether',
        'airight',
        'Oraichain',
        {
          send: {
            contract: 'orai1j0r67r9k8t34pnhy00x3ftuxuwg0r6r4p8p6rrc8az0ednzr8y9s3sj2sf',
            amount: fromAmount,
            msg: toBinary({
              execute_swap_operations: {
                operations: [
                  {
                    orai_swap: {
                      offer_asset_info: { token: { contract_addr: process.env.REACT_APP_USDT_CONTRACT } },
                      ask_asset_info: { native_token: { denom: 'orai' } }
                    }
                  },
                  {
                    orai_swap: {
                      offer_asset_info: { native_token: { denom: 'orai' } },
                      ask_asset_info: { token: { contract_addr: process.env.REACT_APP_AIRI_CONTRACT } }
                    }
                  }
                ],
                minimum_receive: '99'
              }
            })
          }
        },
        process.env.REACT_APP_USDT_CONTRACT,
        { funds: null }
      ]
    ])(
      'test-generateMsgsSwap-for-%s',
      (
        _name: string,
        fromCoinGeckoId: CoinGeckoId,
        toCoinGeckoId: CoinGeckoId,
        toChainId: NetworkChainId,
        expectedSwapMsg: any,
        expectedSwapContractAddr: string,
        expectedFunds: any
      ) => {
        universalSwap.fromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoinGeckoId);
        universalSwap.toToken = flattenTokens.find((t) => t.coinGeckoId === toCoinGeckoId && t.chainId === toChainId);
        const swapMsg = universalSwap.generateMsgsSwap();
        expect(swapMsg[0].contractAddress).toEqual(expectedSwapContractAddr);
        expect(swapMsg[0].handleMsg.toString()).toEqual(JSON.stringify(expectedSwapMsg));
        expect(swapMsg[0].handleOptions).toEqual(expectedFunds);
      }
    );

    it.each([
      [
        'from-&-to-both-oraichain-token',
        'oraichain-token',
        'oraichain-token',
        '0x38',
        {
          transfer_to_remote: {
            local_channel_id: oraichain2oraib,
            remote_address: 'foobar',
            remote_denom: 'bep20_orai',
            timeout: 3600,
            memo: ''
          }
        },
        process.env.REACT_APP_IBC_WASM_CONTRACT,
        { funds: [{ amount: simulateAmount, denom: 'orai' }] }
      ],
      [
        'from-and-to-is-cw20-token-and-have-same-coingecko-id',
        'airight',
        'airight',
        '0x38',
        {
          send: {
            contract: process.env.REACT_APP_IBC_WASM_CONTRACT,
            amount: simulateAmount,
            msg: toBinary({
              local_channel_id: oraichain2oraib,
              remote_address: 'foobar',
              remote_denom: 'bep20_airi',
              timeout: 3600,
              memo: ''
            })
          }
        },
        process.env.REACT_APP_AIRI_CONTRACT, // contract of cw20 token to invoke send method.
        { funds: [] }
      ],
      [
        'from-token-in-orai-is-native-token',
        'airight',
        'oraichain-token',
        '0x38',
        {
          transfer_to_remote: {
            local_channel_id: oraichain2oraib,
            remote_address: 'foobar',
            remote_denom: 'bep20_orai',
            timeout: 3600,
            memo: ''
          }
        },
        process.env.REACT_APP_IBC_WASM_CONTRACT,
        { funds: [{ amount: simulateAmount, denom: 'orai' }] }
      ],
      [
        'from-is-cw20-token',
        'airight',
        'tether',
        '0x38',
        {
          send: {
            contract: process.env.REACT_APP_IBC_WASM_CONTRACT,
            amount: simulateAmount,
            msg: toBinary({
              local_channel_id: oraichain2oraib,
              remote_address: 'foobar',
              remote_denom: 'bep20_usdt',
              timeout: 3600,
              memo: ''
            })
          }
        },
        process.env.REACT_APP_USDT_CONTRACT,
        { funds: [] }
      ]
    ])(
      'test-generateMsgsTransferOraiToEvm-with-%s',
      (
        _name: string,
        fromCoingeckoId,
        toCoingeckoId,
        toChainId,
        expectedTransferMsg,
        expectedContractAddr,
        expectedFunds
      ) => {
        universalSwap.fromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoingeckoId);
        universalSwap.toToken = flattenTokens.find((t) => t.coinGeckoId === toCoingeckoId && t.chainId === toChainId);
        universalSwap.toTokenInOrai = oraichainTokens.find((t) => t.coinGeckoId === toCoingeckoId);
        const ibcInfo: IBCInfo = ibcInfos[universalSwap.fromToken.chainId][universalSwap.toToken.chainId];
        const toAddress = 'foobar';
        const ibcMemo = '';
        const msg = universalSwap.generateMsgsTransferOraiToEvm(ibcInfo, toAddress, ibcMemo);
        expect(msg[0].contractAddress.toString()).toEqual(expectedContractAddr);
        expect(msg[0].handleMsg.toString()).toEqual(JSON.stringify(expectedTransferMsg));
        expect(msg[0].handleOptions).toEqual(expectedFunds);
      }
    );

    it.each([
      [
        'from-and-to-is-have-same-coingecko-id',
        'osmosis',
        'osmosis',
        'osmosis-1',
        [
          {
            typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
            value: {
              sourcePort: 'transfer',
              sourceChannel: 'channel-13', // osmosis channel
              token: { denom: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM, amount: simulateAmount }, //osmosis denom
              sender: senderAddress,
              receiver: 'orai1234',
              timeoutTimestamp: Long.fromNumber(Math.floor(Date.now() / 1000) + IBC_TRANSFER_TIMEOUT)
                .multiply(1000000000)
                .toString(),
              memo: ''
            }
          }
        ]
      ],
      [
        'from-and-to-is-have-dont-have-same-coingecko-id',
        'tether',
        'osmosis',
        'osmosis-1',
        [
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: {
              sender: senderAddress,
              contract: process.env.REACT_APP_USDT_CONTRACT,
              msg: toUtf8(
                JSON.stringify({
                  send: {
                    contract: process.env.REACT_APP_ROUTER_V2_CONTRACT,
                    amount: fromAmount,
                    msg: toBinary({
                      execute_swap_operations: {
                        operations: [
                          {
                            orai_swap: {
                              offer_asset_info: {
                                token: { contract_addr: process.env.REACT_APP_USDT_CONTRACT }
                              },
                              ask_asset_info: { native_token: { denom: 'orai' } }
                            }
                          },
                          {
                            orai_swap: {
                              offer_asset_info: { native_token: { denom: 'orai' } },
                              ask_asset_info: {
                                native_token: {
                                  denom: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM
                                }
                              }
                            }
                          }
                        ],
                        minimum_receive: '99'
                      }
                    })
                  }
                })
              ),
              funds: []
            }
          },
          {
            typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
            value: {
              sourcePort: 'transfer',
              sourceChannel: oraichain2osmosis,
              token: { denom: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM, amount: simulateAmount },
              sender: senderAddress,
              receiver: 'orai1234',
              timeoutTimestamp: Long.fromNumber(Math.floor(Date.now() / 1000) + IBC_TRANSFER_TIMEOUT)
                .multiply(1000000000)
                .toString(),
              timeoutHeight: undefined,
              memo: ''
            }
          }
        ]
      ]
    ])(
      'test-combineMsgCosmos-with-%s',
      async (_name: string, fromCoingeckoId, toCoingeckoId, toChainId, expectedTransferMsg) => {
        windowSpy.mockImplementation(() => ({
          Keplr: {
            getKeplrAddr: async (_chainId: string) => {
              return 'orai1234';
            }
          }
        }));
        universalSwap.fromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoingeckoId);
        universalSwap.toToken = flattenTokens.find((t) => t.coinGeckoId === toCoingeckoId && t.chainId === toChainId);
        universalSwap.toTokenInOrai = oraichainTokens.find((t) => t.coinGeckoId === toCoingeckoId);
        const msg = await universalSwap.combineMsgCosmos();
        expect(msg).toEqual(expectedTransferMsg);
      }
    );

    it.each([
      [
        'from-and-to-is-have-same-coingecko-id-should-return-one-msg-to-ibc',
        'airight',
        'airight',
        '0x38',
        [
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: {
              sender: senderAddress,
              contract: process.env.REACT_APP_AIRI_CONTRACT,
              msg: toUtf8(
                JSON.stringify({
                  send: {
                    contract: process.env.REACT_APP_IBC_WASM_CONTRACT,
                    amount: simulateAmount,
                    msg: toBinary({
                      local_channel_id: oraichain2oraib,
                      remote_address: 'orai1234',
                      remote_denom: ORAI_BRIDGE_EVM_DENOM_PREFIX + AIRI_BSC_CONTRACT,
                      timeout: IBC_TRANSFER_TIMEOUT,
                      memo: 'oraib0x1234'
                    })
                  }
                })
              ),
              funds: []
            }
          }
        ]
      ],
      [
        'from-and-to-dont-have-same-coingecko-id-should-return-msg-swap-combined-with-msg-transfer-to-remote',
        'oraichain-token',
        'airight',
        '0x38',
        [
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: {
              sender: senderAddress,
              contract: process.env.REACT_APP_ROUTER_V2_CONTRACT,
              msg: toUtf8(
                JSON.stringify({
                  execute_swap_operations: {
                    operations: [
                      {
                        orai_swap: {
                          offer_asset_info: { native_token: { denom: 'orai' } },
                          ask_asset_info: {
                            token: { contract_addr: process.env.REACT_APP_AIRI_CONTRACT }
                          }
                        }
                      }
                    ],
                    minimum_receive: calculateMinReceive(simulateAmount, userSlippage, 6)
                  }
                })
              ),
              funds: [
                {
                  amount: fromAmount,
                  denom: 'orai'
                }
              ]
            }
          },
          {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: {
              sender: senderAddress,
              contract: process.env.REACT_APP_AIRI_CONTRACT,
              msg: toUtf8(
                JSON.stringify({
                  send: {
                    contract: process.env.REACT_APP_IBC_WASM_CONTRACT,
                    amount: simulateAmount,
                    msg: toBinary({
                      local_channel_id: oraichain2oraib,
                      remote_address: 'orai1234',
                      remote_denom: ORAI_BRIDGE_EVM_DENOM_PREFIX + AIRI_BSC_CONTRACT,
                      timeout: IBC_TRANSFER_TIMEOUT,
                      memo: 'oraib0x1234'
                    })
                  }
                })
              ),
              funds: []
            }
          }
        ]
      ]
    ])(
      'test-combineMsgEvm-with-%s',
      async (_name: string, fromCoingeckoId, toCoingeckoId, toChainId, expectedTransferMsg) => {
        windowSpy.mockImplementation(() => ({
          Keplr: {
            getKeplrAddr: async (_chainId: string) => {
              return 'orai1234';
            }
          }
        }));
        universalSwap.fromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoingeckoId);
        universalSwap.toToken = flattenTokens.find((t) => t.coinGeckoId === toCoingeckoId && t.chainId === toChainId);
        universalSwap.toTokenInOrai = oraichainTokens.find((t) => t.coinGeckoId === toCoingeckoId);

        const msg = await universalSwap.combineMsgEvm('0x1234', 'T1234');
        expect(msg).toEqual(expectedTransferMsg);
      }
    );
  });

  it.each([
    ['oraichain-token', 'oraichain-token', '1000000', '1000000'],
    ['airight', 'airight', '1000000', '1000000'],
    ['tether', 'tether', '1000000', '1000000'],
    ['airight', 'tether', '1000000', '200000'],
    ['oraichain-token', 'airight', '1000000', '200000']
  ])(
    'test simulate swap data for universal-swap',
    async (fromCoingeckoId: CoinGeckoId, toCoingeckoId: CoinGeckoId, amount: number | string, expectedSimulateData) => {
      const fromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoingeckoId);
      const toToken = oraichainTokens.find((t) => t.coinGeckoId === toCoingeckoId);
      const [fromInfo, toInfo] = [toTokenInfo(fromToken), toTokenInfo(toToken)];
      const query = { fromInfo, toInfo, amount };
      if (fromInfo.coinGeckoId !== toInfo.coinGeckoId) {
        const simulateSwapSpy = jest.spyOn(restApi, 'simulateSwap');
        simulateSwapSpy.mockResolvedValue({ amount: expectedSimulateData });
      }
      const simulateData = await simulateSwap(query);
      expect(simulateData.amount).toEqual(expectedSimulateData);
    }
  );
});
