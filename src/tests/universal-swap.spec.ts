import { toBinary } from '@cosmjs/cosmwasm-stargate';
import { toUtf8 } from '@cosmjs/encoding';
import { CWSimulateApp, GenericError, IbcOrder, IbcPacket } from '@oraichain/cw-simulate';
import { OraiswapTokenClient, OraiswapTokenQueryClient } from '@oraichain/oraidex-contracts-sdk';
import bech32 from 'bech32';
import { TokenItemType, UniversalSwapType, cosmosTokens, flattenTokens, oraichainTokens } from 'config/bridgeTokens';
import { CoinGeckoId, CosmosChainId, EvmChainId, NetworkChainId } from 'config/chainInfos';
import {
  AIRI_BSC_CONTRACT,
  GAS_ESTIMATION_SWAP_DEFAULT,
  IBC_TRANSFER_TIMEOUT,
  ORAI,
  ORAI_BRIDGE_EVM_DENOM_PREFIX,
  ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX,
  USDT_BSC_CONTRACT,
  USDT_TRON_CONTRACT,
  WRAP_BNB_CONTRACT
} from 'config/constants';
import { ibcInfos, oraib2oraichain, oraichain2atom, oraichain2oraib, oraichain2osmosis } from 'config/ibcInfos';
import { network } from 'config/networks';
import { feeEstimate } from 'helper';
import { toAmount, toDisplay, toTokenInfo } from 'libs/utils';
import Long from 'long';
import {
  combineReceiver,
  findToTokenOnOraiBridge,
  getBalanceIBCOraichain,
  getDestination
} from 'pages/Balance/helpers';
import {
  SwapDirection,
  UniversalSwapHandler,
  checkEvmAddress,
  filterNonPoolEvmTokens,
  getRelayerInfoFromToken,
  handleSimulateSwap
} from 'pages/UniversalSwap/helpers';
import * as restApi from 'rest/api';
import { Type, generateContractMessages, simulateSwap } from 'rest/api';
import { IBCInfo } from 'types/ibc';
import { client, deployIcs20Token, deployToken, senderAddress } from './common';
import { CwIcs20LatestClient } from '@oraichain/common-contracts-sdk';
import * as helper from 'pages/SwapV2/helpers';

describe('universal-swap', () => {
  let windowSpy: jest.SpyInstance;

  let bobAddress = 'orai1ur2vsjrjarygawpdwtqteaazfchvw4fg6uql76';
  let oraiAddress = 'orai12zyu8w93h0q2lcnt50g3fn0w3yqnhy4fvawaqz';
  let routerContractAddress = 'placeholder';
  let ibcTransferAmount = '100000000';
  let initialBalanceAmount = '10000000000000';
  let channel = 'channel-29';
  let airiIbcDenom: string = 'oraib0x7e2A35C746F2f7C240B664F1Da4DD100141AE71F';
  let cosmosSenderAddress = bech32.encode('cosmos', bech32.decode(oraiAddress).words);
  let ics20Contract: CwIcs20LatestClient;
  let oraiPort: string;
  let airiToken: OraiswapTokenClient;

  beforeAll(async () => {
    windowSpy = jest.spyOn(window, 'window', 'get');

    ics20Contract = await deployIcs20Token(client, { swap_router_contract: routerContractAddress });
    oraiPort = 'wasm.' + ics20Contract.contractAddress;
    let cosmosPort: string = 'transfer';
    airiToken = await deployToken(client, {
      decimals: 6,
      symbol: 'AIRI',
      name: 'Airight token',
      initial_balances: [
        { address: ics20Contract.contractAddress, amount: initialBalanceAmount },
        { address: process.env.REACT_APP_IBC_WASM_CONTRACT, amount: initialBalanceAmount }
      ]
    });
    const cosmosChain = new CWSimulateApp({
      chainId: 'cosmoshub-4',
      bech32Prefix: 'cosmos'
    });

    let newPacketData = {
      src: {
        port_id: cosmosPort,
        channel_id: channel
      },
      dest: {
        port_id: oraiPort,
        channel_id: channel
      },
      sequence: 27,
      timeout: {
        block: {
          revision: 1,
          height: 12345678
        }
      }
    };
    newPacketData.dest.port_id = oraiPort;

    // init ibc channel between two chains
    client.app.ibc.relay(channel, oraiPort, channel, cosmosPort, cosmosChain);
    await cosmosChain.ibc.sendChannelOpen({
      open_init: {
        channel: {
          counterparty_endpoint: {
            port_id: oraiPort,
            channel_id: channel
          },
          endpoint: {
            port_id: cosmosPort,
            channel_id: channel
          },
          order: IbcOrder.Unordered,
          version: 'ics20-1',
          connection_id: 'connection-38'
        }
      }
    });
    await cosmosChain.ibc.sendChannelConnect({
      open_ack: {
        channel: {
          counterparty_endpoint: {
            port_id: oraiPort,
            channel_id: channel
          },
          endpoint: {
            port_id: cosmosPort,
            channel_id: channel
          },
          order: IbcOrder.Unordered,
          version: 'ics20-1',
          connection_id: 'connection-38'
        },
        counterparty_version: 'ics20-1'
      }
    });

    cosmosChain.ibc.addMiddleWare((msg, app) => {
      const data = msg.data.packet as IbcPacket;
      if (Number(data.timeout.timestamp) < cosmosChain.time) {
        throw new GenericError('timeout at ' + data.timeout.timestamp);
      }
    });

    await ics20Contract.updateMappingPair({
      localAssetInfo: {
        token: {
          contract_addr: airiToken.contractAddress
        }
      },
      localAssetInfoDecimals: 6,
      denom: airiIbcDenom,
      remoteDecimals: 6,
      localChannelId: channel
    });

    const icsPackage = {
      amount: ibcTransferAmount,
      denom: airiIbcDenom,
      receiver: bobAddress,
      sender: cosmosSenderAddress,
      memo: ''
    };
    await cosmosChain.ibc.sendPacketReceive({
      packet: {
        data: toBinary(icsPackage),
        ...newPacketData
      },
      relayer: cosmosSenderAddress
    });
  });

  afterAll(() => {
    windowSpy.mockRestore();
  });

  it.each<[string, CoinGeckoId, string, string, SwapDirection, number]>([
    ['0x38', 'wbnb', 'bep20_bnb', '', SwapDirection.From, 5],
    ['Oraichain', 'tether', 'usdt', '', SwapDirection.From, 18],
    ['Oraichain', 'oraichain-token', 'orai', '', SwapDirection.To, 18],
    ['0x38', 'oraichain-token', 'bep20_orai', '', SwapDirection.To, 20],
    ['0x38', 'wbnb', 'bep20_bnb', '', SwapDirection.To, 8],
    ['0x38', 'oraichain-token', 'oraichain-token', 'AIRI', SwapDirection.From, 2]
  ])('test-filterNonPoolEvmTokens', (chainId, coinGeckoId, denom, searchTokenName, direction, expectedLength) => {
    const tokens = filterNonPoolEvmTokens(chainId, coinGeckoId, denom, searchTokenName, direction);
    expect(tokens.length).toEqual(expectedLength);
  });

  it.each<[object, bigint, TokenItemType, number, number, number]>([
    [
      {
        relayerAmount: '1000',
        relayerDecimals: 6
      },
      10000000n,
      flattenTokens.find((item) => item.coinGeckoId === 'airight' && item.chainId === 'Oraichain'),
      1,
      10,
      1.001
    ],
    [
      {
        relayerAmount: '1000',
        relayerDecimals: 6
      },
      1000000000000000000000n,
      flattenTokens.find((item) => item.coinGeckoId === 'airight' && item.chainId === '0x38'),
      10,
      1000,
      10.001
    ]
  ])(
    'test-getRelayerInfoFromToken',
    (
      relayerFee,
      fromTokenTotalBalance,
      originalFromToken,
      fromAmount,
      expectedTotalBalance,
      expectedTotalBalanceFromTokenAndFeeRelayer
    ) => {
      const { caculateTotalBalanceFromToken, calulateFromTokenAndFeeRelayer } = getRelayerInfoFromToken(
        relayerFee,
        fromTokenTotalBalance,
        originalFromToken,
        fromAmount
      );
      expect(caculateTotalBalanceFromToken).toEqual(expectedTotalBalance);
      expect(calulateFromTokenAndFeeRelayer).toEqual(expectedTotalBalanceFromTokenAndFeeRelayer);
    }
  );

  // it('test-evmSwap', () => {
  //   throw 'evmSwap error';
  // });

  it.each([
    ['wbnb', true],
    ['weth', true],
    ['binancecoin', true],
    ['ethereum', true],
    ['bnb', false]
  ])('test-isSupportedNoPoolSwapEvm', (coingeckoId: CoinGeckoId, expectedResult: boolean) => {
    expect(restApi.isSupportedNoPoolSwapEvm(coingeckoId)).toEqual(expectedResult);
  });

  it.each<[string, string, string, string, boolean]>([
    ['a', 'b', 'b', 'c', false],
    ['a', 'a', 'b', 'c', false],
    ['0x38', '0x38', USDT_TRON_CONTRACT, USDT_BSC_CONTRACT, false],
    ['0x38', '0x38', undefined, USDT_BSC_CONTRACT, true],
    ['0x38', '0x38', USDT_TRON_CONTRACT, undefined, true],
    ['0x38', '0x38', undefined, undefined, false],
    ['0x38', '0x38', WRAP_BNB_CONTRACT, USDT_BSC_CONTRACT, true]
  ])('test-isEvmSwappable', (fromChainId, toChainId, fromContractAddr, toContractAddr, expectedResult) => {
    const result = restApi.isEvmSwappable({ fromChainId, toChainId, fromContractAddr, toContractAddr });
    expect(result).toEqual(expectedResult);
  });

  it.each<[boolean, boolean, string]>([
    [false, false, '1'],
    [false, true, '2'],
    [true, false, '2'],
    [true, true, '2']
  ])('test handleSimulateSwap', async (isSupportedNoPoolSwapEvmRes, isEvmSwappableRes, expectedSimulateAmount) => {
    const simulateSwapSpy = jest.spyOn(restApi, 'simulateSwap');
    const simulateSwapEvmSpy = jest.spyOn(restApi, 'simulateSwapEvm');
    simulateSwapSpy.mockResolvedValue({ amount: '1' });
    simulateSwapEvmSpy.mockResolvedValue({ amount: '2', displayAmount: 2 });
    const isSupportedNoPoolSwapEvmSpy = jest.spyOn(restApi, 'isSupportedNoPoolSwapEvm');
    const isEvmSwappableSpy = jest.spyOn(restApi, 'isEvmSwappable');
    isSupportedNoPoolSwapEvmSpy.mockReturnValue(isSupportedNoPoolSwapEvmRes);
    isEvmSwappableSpy.mockReturnValue(isEvmSwappableRes);
    console.log(restApi.isSupportedNoPoolSwapEvm('wbnb'), restApi.isEvmSwappable({ fromChainId: '', toChainId: '' }));
    const fakeTokenInfo = toTokenInfo(flattenTokens[0]);
    const simulateData = await handleSimulateSwap({
      fromInfo: fakeTokenInfo,
      toInfo: fakeTokenInfo,
      originalFromInfo: flattenTokens[0],
      originalToInfo: flattenTokens[0],
      amount: ''
    });
    expect(simulateData.amount).toEqual(expectedSimulateAmount);
    simulateSwapSpy.mockRestore();
    simulateSwapEvmSpy.mockRestore();
    isSupportedNoPoolSwapEvmSpy.mockRestore();
    isEvmSwappableSpy.mockRestore();
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
    const minimumReceive = '1000';

    it('return msgs generate contract', () => {
      testMsgs(fromTokenHaveContract, toTokenInfoData);
      testMsgs(fromTokenNoContract, toTokenInfoData);
    });

    function testMsgs(fromTokenInfoData: TokenItemType, toTokenInfoData: TokenItemType) {
      const msg = generateContractMessages({
        type: Type.SWAP,
        sender: senderAddress,
        amount: _fromAmount,
        fromInfo: fromTokenInfoData,
        toInfo: toTokenInfoData,
        minimumReceive
      } as any);
      console.log('message: ', msg);

      // check if the contract address, msg and sender are correct
      if (fromTokenInfoData.contractAddress) {
        expect(msg.contractAddress).toEqual(fromTokenInfoData.contractAddress);
        expect(msg.msg.send.contract).toEqual(network.router);
        expect(msg.msg.send.amount).toEqual(_fromAmount);
      } else {
        expect(msg.contractAddress).toEqual(network.router);
        // check swap operation msg when pair is false
        expect(msg.msg).toEqual({
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
            minimum_receive: minimumReceive
          }
        });
      }
      expect(msg.funds).toBeDefined();
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
    ],
    [
      'usd-coin',
      '0x01',
      'wbnb',
      '0x38',
      '0x1234',
      {
        destination: '',
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

  it.each<[TokenItemType, TokenItemType, bigint, number]>([
    [
      oraichainTokens[0],
      flattenTokens.find((item) => item.coinGeckoId === 'oraichain-token' && item.chainId === '0x38'),
      1000000n,
      1
    ],
    [
      flattenTokens.find((item) => item.coinGeckoId === 'oraichain-token' && item.chainId === '0x38'),
      oraichainTokens[0],
      1000000000000000000000n,
      1
    ]
  ])('test checkRelayerFee', async (originalFromToken, originalToToken, fromTokenBalance, fromAmount) => {
    const universalSwap = new UniversalSwapHandler(
      '',
      originalFromToken,
      originalToToken,
      fromAmount,
      '',
      1,
      '2',
      undefined,
      fromTokenBalance,
      {
        relayerAmount: '1000',
        relayerDecimals: 6
      }
    );

    try {
      const result = await universalSwap.checkFeeRelayer();
      expect(result).toEqual(true);
    } catch (error) {
      expect(error?.ex?.message).toEqual('Fee relayer is not enough!');
    }
  });

  it.each<[TokenItemType, TokenItemType, number, string, number]>([
    [
      oraichainTokens[1],
      flattenTokens.find((item) => item.coinGeckoId === 'airight' && item.chainId === '0x38'),
      1000,
      '1092640043',
      1
    ],
    [
      flattenTokens.find((item) => item.coinGeckoId === 'airight' && item.chainId === '0x38'),
      oraichainTokens[1],
      100000,
      '1092640043',
      1
    ]
  ])(
    'test checkFeeRelayerNotOrai',
    async (originalFromToken, originalToToken, totalBalance, simulateAmount, fromAmount) => {
      const universalSwap = new UniversalSwapHandler(
        '',
        originalFromToken,
        originalToToken,
        fromAmount,
        '',
        1,
        '2',
        undefined,
        0n,
        {
          relayerAmount: '1000',
          relayerDecimals: 6
        }
      );

      try {
        const result = await universalSwap.checkFeeRelayerNotOrai(totalBalance, simulateAmount, fromAmount);
        expect(result).toEqual(true);
      } catch (error) {
        expect(error?.ex?.message).toEqual('Fee relayer is not enough!');
      }
    }
  );

  it('test-getUniversalSwapToAddress', async () => {
    const universalSwap = new UniversalSwapHandler('', oraichainTokens[0], oraichainTokens[0], 1, '', 1, '2');
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
    let result = await universalSwap.getUniversalSwapToAddress('0x01', {
      metamaskAddress: undefined,
      tronAddress: undefined
    });
    expect(result).toEqual('0x1234');
    result = await universalSwap.getUniversalSwapToAddress('cosmoshub-4', {
      metamaskAddress: undefined,
      tronAddress: undefined
    });
    expect(result).toEqual('orai1234');
    result = await universalSwap.getUniversalSwapToAddress('0x2b6653dc', {
      tronAddress: 'TPwTVfDDvmWSawsP7Ki1t3ecSBmaFeMMXc'
    });
    expect(result).toEqual('0x993d06fc97f45f16e4805883b98a6c20bab54964');
    result = await universalSwap.getUniversalSwapToAddress('0x01', {
      metamaskAddress: '0x993d06fc97f45f16e4805883b98a6c20bab54964'
    });
    expect(result).toEqual('0x993d06fc97f45f16e4805883b98a6c20bab54964');
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
      },
      tronWeb: {
        defaultAddress: {
          base58: 'TNJksEkvvdmae8uXYkNE9XKHbTDiSQrpbf'
        }
      },
      tronLink: {}
    }));
    result = await universalSwap.getUniversalSwapToAddress('0x2b6653dc', {
      metamaskAddress: undefined,
      tronAddress: undefined
    });
    expect(result).toEqual('0x8754032ac7966a909e2e753308df56bb08dabd69');
  });

  describe('test-processUniversalSwap-with-mock', () => {
    const universalSwap = new UniversalSwapHandler('', oraichainTokens[0], oraichainTokens[0], 1, '', 1, '2');
    const fromAmount = '100000';
    const simulateAmount = '100';
    const userSlippage = 1;
    const minimumReceive = '10000';
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

    afterAll(() => {
      swapSpy.mockRestore();
      swapAndTransferSpy.mockRestore();
      transferAndSwapSpy.mockRestore();
    });

    it.each([
      ['cosmos-hub-network', 'cosmos', 'cosmoshub-4', 'cosmos', 'cosmoshub-4'],
      ['osmosis-network', 'osmosis', 'osmosis-1', 'osmosis', 'osmosis-1'],
      ['evm-network-is-bsc', 'airight', '0x38', 'airight', 'oraibridge-subnet-2'],
      ['evm-network-is-eth', 'usd-coin', '0x01', 'usd-coin', 'oraibridge-subnet-2'],
      ['evm-network-is-tron', 'tron', '0x2b6653dc', 'tron', 'oraibridge-subnet-2']
    ])(
      'test-findToTokenOnOraiBridge-when-universalSwap-from-Oraichain-to%s',
      (
        _name,
        fromCoingeckoId: CoinGeckoId,
        toChainId: NetworkChainId,
        expectedToCoinGeckoId: CoinGeckoId,
        expectedToChainId: NetworkChainId
      ) => {
        const fromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoingeckoId);
        const toTokenTransfer = findToTokenOnOraiBridge(fromToken, toChainId);
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
      universalSwap.originalFromToken = fromToken;
      universalSwap.originalFromToken = toToken;
      const result = await universalSwap.processUniversalSwap('', universalSwapType, {});
      expect(result).toEqual(expectedFunction);
    });

    it.each<[NetworkChainId, string]>([
      ['cosmoshub-4', 'cosmos'],
      ['osmosis-1', 'cosmos'],
      ['Oraichain', 'evm'],
      ['0x01', 'evm']
    ])('test-combine-msgs-logic', async (chainId, expectedMsgType) => {
      const universalSwap = new UniversalSwapHandler('', oraichainTokens[0], oraichainTokens[0], 1, '', 1, '2');
      const toToken = flattenTokens.find((item) => item.coinGeckoId === 'tether');
      universalSwap.originalToToken = toToken;
      universalSwap.originalToToken.chainId = chainId;
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
            minimum_receive: minimumReceive
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
                minimum_receive: minimumReceive
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
        // setup
        universalSwap.originalFromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoinGeckoId);
        universalSwap.originalToToken = flattenTokens.find(
          (t) => t.coinGeckoId === toCoinGeckoId && t.chainId === toChainId
        );
        jest.spyOn(helper, 'calculateMinReceive').mockReturnValue(minimumReceive);

        // act
        const swapMsg = universalSwap.generateMsgsSwap();

        // assertion
        expect(swapMsg[0].contractAddress).toEqual(expectedSwapContractAddr);
        expect(swapMsg[0].msg).toEqual(expectedSwapMsg);
        expect(swapMsg[0].funds).toEqual(expectedFunds.funds);
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
        universalSwap.originalFromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoingeckoId);
        universalSwap.originalToToken = flattenTokens.find(
          (t) => t.coinGeckoId === toCoingeckoId && t.chainId === toChainId
        );
        universalSwap.toTokenInOrai = oraichainTokens.find((t) => t.coinGeckoId === toCoingeckoId);
        const ibcInfo: IBCInfo =
          ibcInfos[universalSwap.originalFromToken.chainId][universalSwap.originalToToken.chainId];
        const toAddress = 'foobar';
        const ibcMemo = '';
        const msg = universalSwap.generateMsgsTransferOraiToEvm(ibcInfo, toAddress, ibcMemo);
        expect(msg[0].contractAddress.toString()).toEqual(expectedContractAddr);
        expect(msg[0].msg).toEqual(expectedTransferMsg);
        expect(msg[0].funds).toEqual(expectedFunds.funds);
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
              timeoutHeight: undefined,
              timeoutTimestamp: new Long(0),
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
                        minimum_receive: minimumReceive
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
              timeoutHeight: undefined,
              timeoutTimestamp: new Long(0),
              memo: ''
            }
          }
        ]
      ]
    ])(
      'test-combineMsgCosmos-with-%s',
      async (_name: string, fromCoingeckoId, toCoingeckoId, toChainId, expectedTransferMsg) => {
        //  setup mock
        windowSpy.mockImplementation(() => ({
          Keplr: {
            getKeplrAddr: async (_chainId: string) => {
              return 'orai1234';
            }
          }
        }));
        jest.spyOn(helper, 'calculateMinReceive').mockReturnValue(minimumReceive);
        universalSwap.originalFromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoingeckoId);
        universalSwap.originalToToken = flattenTokens.find(
          (t) => t.coinGeckoId === toCoingeckoId && t.chainId === toChainId
        );
        universalSwap.toTokenInOrai = oraichainTokens.find((t) => t.coinGeckoId === toCoingeckoId);
        const msg = await universalSwap.combineMsgCosmos('0');
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
                    minimum_receive: minimumReceive
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
        //  setup mock
        windowSpy.mockImplementation(() => ({
          Keplr: {
            getKeplrAddr: async (_chainId: string) => {
              return 'orai1234';
            }
          }
        }));

        jest.spyOn(helper, 'calculateMinReceive').mockReturnValue(minimumReceive);

        universalSwap.originalFromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoingeckoId);
        universalSwap.originalToToken = flattenTokens.find(
          (t) => t.coinGeckoId === toCoingeckoId && t.chainId === toChainId
        );
        universalSwap.toTokenInOrai = oraichainTokens.find((t) => t.coinGeckoId === toCoingeckoId);

        const msg = await universalSwap.combineMsgEvm('0x1234', 'T1234');
        expect(msg).toEqual(expectedTransferMsg);
      }
    );

    it('test-combineMsgEvm-should-throw-error', async () => {
      windowSpy.mockImplementation(() => ({
        Keplr: {
          getKeplrAddr: async (_chainId: string) => {
            return undefined;
          }
        }
      }));
      try {
        await universalSwap.combineMsgEvm('0x1234', 'T1234');
      } catch (error) {
        expect(error?.ex?.message).toEqual('Please login keplr!');
      }
    });

    it.each([
      [
        'get-ibc-info-ibc-memo',
        'airight',
        'oraibridge-subnet-2',
        {
          ibcInfo: {
            source: `wasm.${process.env.REACT_APP_IBC_WASM_CONTRACT}`,
            channel: 'channel-29',
            timeout: 3600
          },
          ibcMemo: 'oraib0x1234'
        }
      ]
    ])('test-get-ibc-info-ibc-memo', (_name: string, toCoingeckoId, toChainId, expectedTransferMsg) => {
      universalSwap.originalToToken = flattenTokens.find(
        (t) => t.coinGeckoId === toCoingeckoId && t.chainId === toChainId
      );
      universalSwap.toTokenInOrai = oraichainTokens.find((t) => t.coinGeckoId === toCoingeckoId);
      const msg = universalSwap.getIbcInfoIbcMemo('0x1234', 'T1234');
      expect(msg).toEqual(expectedTransferMsg);
    });
  });

  it.each([
    ['oraichain-token', 'oraichain-token', '1000000', '1000000'],
    ['airight', 'airight', '1000000', '1000000'],
    ['tether', 'tether', '1000000', '1000000'],
    ['airight', 'tether', '1000000', '200000'],
    ['oraichain-token', 'airight', '1000000', '200000']
  ])(
    'test simulate swap data for universal-swap',
    async (fromCoingeckoId: CoinGeckoId, toCoingeckoId: CoinGeckoId, amount: string, expectedSimulateData) => {
      const fromToken = oraichainTokens.find((t) => t.coinGeckoId === fromCoingeckoId);
      const toToken = oraichainTokens.find((t) => t.coinGeckoId === toCoingeckoId);
      const [fromInfo, toInfo] = [toTokenInfo(fromToken), toTokenInfo(toToken)];
      const query = { fromInfo, toInfo, amount };
      let isMock = false;
      let simulateSwapSpy: jest.SpyInstance;
      if (fromInfo.coinGeckoId !== toInfo.coinGeckoId) {
        simulateSwapSpy = jest.spyOn(restApi, 'simulateSwap');
        simulateSwapSpy.mockResolvedValue({ amount: expectedSimulateData });
        isMock = true;
      }
      const simulateData = await simulateSwap(query);
      expect(simulateData.amount).toEqual(expectedSimulateData);
      if (isMock) simulateSwapSpy.mockRestore();
    }
  );

  it.each([
    ['0x1234', 'T123456789', flattenTokens.find((t) => t.prefix === ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX), '0xae1ae6'],
    ['0x1234', 'T123456789', flattenTokens.find((t) => t.prefix !== ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX), '0x1234'],
    ['', '', flattenTokens.find((t) => t.prefix !== ORAI_BRIDGE_EVM_TRON_DENOM_PREFIX), 'this-case-throw-error']
  ])(
    'test get transfer address should return transferAddress correctly & throw error correctly',
    (metamaskAddress: string, tronAddress: string, toToken: TokenItemType, expectedTransferAddr: string) => {
      const universalSwap = new UniversalSwapHandler('', oraichainTokens[0], oraichainTokens[0], 1, '', 1, '2');
      const ibcInfo = ibcInfos['Oraichain']['oraibridge-subnet-2'];
      universalSwap.toTokenInOrai = oraichainTokens.find((t) => t.coinGeckoId === 'airight');
      universalSwap.originalToToken = toToken;
      try {
        const transferAddress = universalSwap.getTranferAddress(metamaskAddress, tronAddress, ibcInfo);
        expect(transferAddress).toEqual(expectedTransferAddr);
      } catch (error) {
        expect(error?.ex?.message).toEqual('Please login metamask / tronlink!');
      }
    }
  );

  it.each([
    ['0x1234', flattenTokens.find((t) => t.chainId === 'oraibridge-subnet-2'), 'oraib0x1234'],
    ['0x1234', flattenTokens.find((t) => t.chainId !== 'oraibridge-subnet-2'), '']
  ])(
    'test getIbcMemo should return ibc memo correctly',
    (transferAddress: string, toToken: TokenItemType, expectedIbcMemo: string) => {
      const universalSwap = new UniversalSwapHandler('', oraichainTokens[0], oraichainTokens[0], 1, '', 1, '2');
      universalSwap.originalToToken = toToken;
      const ibcMemo = universalSwap.getIbcMemo(transferAddress);
      expect(ibcMemo).toEqual(expectedIbcMemo);
    }
  );

  it.each([
    [
      '1000000000000000000000000000000000000000',
      flattenTokens.find((t) => t.chainId === '0x38' && t.coinGeckoId === 'airight'),
      channel,
      true
    ],
    ['10', flattenTokens.find((t) => t.chainId === '0x38' && t.coinGeckoId === 'airight'), channel, false]
  ])(
    'test-universal-swap-checkBalanceChannelIbc-%',
    async (amount: string, toToken: TokenItemType, channel: string, willThrow: boolean) => {
      const universalSwap = new UniversalSwapHandler('', oraichainTokens[0], toToken, 1, amount, 1, '2', ics20Contract);
      try {
        await universalSwap.checkBalanceChannelIbc(
          {
            source: oraiPort,
            channel: channel,
            timeout: 3600
          },
          toToken
        );
        expect(willThrow).toEqual(false);
      } catch (error) {
        expect(willThrow).toEqual(true);
      }
    }
  );

  it.each([
    [oraichainTokens.find((t) => t.coinGeckoId === 'airight'), 10000000],
    [oraichainTokens.find((t) => t.coinGeckoId === 'oraichain-token'), 0]
  ])('test-universal-swap-getBalanceIBCOraichain-ibc-%', async (token: TokenItemType, expectedBalance: number) => {
    windowSpy.mockImplementation(() => ({
      client
    }));
    const { balance } = await getBalanceIBCOraichain(
      token,
      new OraiswapTokenQueryClient(client, airiToken.contractAddress)
    );
    expect(balance).toEqual(expectedBalance);
  });

  it.each([
    [
      oraichainTokens.find((t) => t.coinGeckoId === 'oraichain-token'), // ORAI (ORAICHAIN)
      oraichainTokens.find((t) => t.coinGeckoId === 'airight'), // AIRIGHT (ORAICHAIN)
      0,
      '0',
      false
    ],
    [
      flattenTokens.find((t) => t.coinGeckoId === 'oraichain-token' && t.chainId === '0x01'), // ORAI (ETH)
      flattenTokens.find((t) => t.coinGeckoId === 'oraichain-token' && t.chainId === '0x38'), // ORAI (BSC)
      10000000,
      '10000000',
      true
    ],
    [
      flattenTokens.find((t) => t.coinGeckoId === 'oraichain-token' && t.chainId === '0x01'), // ORAI (ETH)
      flattenTokens.find((t) => t.coinGeckoId === 'airight' && t.chainId === '0x38'), // AIRIGHT (BSC)
      10000000,
      '10000000',
      false
    ]
  ])(
    'test-universal-swap-checkBalanceIBCOraichain-ibc-%',
    async (from: TokenItemType, to: TokenItemType, fromAmount: number, toAmount: string, willThrow: boolean) => {
      windowSpy.mockImplementation(() => ({
        client
      }));
      const universalSwap = new UniversalSwapHandler('', from, to, fromAmount, toAmount, 1, '1', ics20Contract);
      try {
        await universalSwap.checkBalanceIBCOraichain(
          from,
          to,
          {
            toAmount: toAmount,
            fromAmount: fromAmount
          },
          new OraiswapTokenQueryClient(client, airiToken.contractAddress)
        );
        expect(willThrow).toEqual(false);
      } catch (error) {
        expect(willThrow).toEqual(true);
      }
    }
  );

  describe('checkEvmAddress', () => {
    const testCases = [
      ['0x01', '', undefined],
      ['0x38', '', undefined],
      ['0x2b6653dc', undefined, '']
    ];
    it.each(testCases)(
      'throws an error when not logged in to wallet (%s)',
      (chainId: NetworkChainId, metamaskAddress?: string, tronAddress?: string | boolean) => {
        expect(() => {
          checkEvmAddress(chainId, metamaskAddress, tronAddress);
        }).toThrow();
      }
    );
    it('does not throw an error when logged in to Metamask on Ethereum', () => {
      expect(() => {
        checkEvmAddress('0x01', '0x1234abcd');
      }).not.toThrow();
    });
    it('does not throw an error when logged in to Metamask on BSC', () => {
      expect(() => {
        checkEvmAddress('0x38', '0x5678efgh');
      }).not.toThrow();
    });
    it('does not throw an error when logged in to Tron wallet', () => {
      expect(() => {
        checkEvmAddress('0x2b6653dc', '', 'TRON_ADDRESS');
      }).not.toThrow();
    });
  });
});
