import { toBinary } from '@cosmjs/cosmwasm-stargate';
import { CWSimulateApp, GenericError, IbcOrder, IbcPacket } from '@oraichain/cw-simulate';
import { OraiswapTokenClient } from '@oraichain/oraidex-contracts-sdk';
import bech32 from 'bech32';
import { TokenItemType, cosmosTokens } from 'config/bridgeTokens';
import { CoinGeckoId, NetworkChainId } from 'config/chainInfos';
import { ORAI } from 'config/constants';
import { network } from 'config/networks';
import { SwapDirection, checkEvmAddress, filterNonPoolEvmTokens } from 'pages/UniversalSwap/helpers';
import { Type, generateContractMessages } from 'rest/api';
import { client, deployIcs20Token, deployToken } from './common';
import { CwIcs20LatestClient } from '@oraichain/common-contracts-sdk';
import { toAmount } from '@oraichain/oraidex-common';

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
