import { AppResponse, CWSimulateApp, IbcOrder, SimulateCosmWasmClient } from '@terran-one/cw-simulate';
import * as CwIcs20LatestTypes from 'libs/contracts/CwIcs20Latest.types';
import bech32 from 'bech32';
import path from 'path';
import { toBinary } from '@cosmjs/cosmwasm-stargate';
import { FungibleTokenPacketData } from 'libs/proto/ibc/applications/transfer/v2/packet';
import { CwIcs20LatestClient } from 'libs/contracts/CwIcs20Latest.client';
import { Asset, TransferBackMsg } from 'libs/contracts/types';
import { Coin, coin, coins } from '@cosmjs/proto-signing';
import { OraiswapTokenClient } from 'libs/contracts/OraiswapToken.client';
import { InstantiateMsg as OraiswapInstantiateMsg } from 'libs/contracts/OraiswapToken.types';
import { AssetInfo } from 'libs/contracts';
import { OraiswapRouterClient } from 'libs/contracts/OraiswapRouter.client';
import { InstantiateMsg as OraiswapRouterInstantiateMsg } from 'libs/contracts/OraiswapRouter.types';
import { InstantiateMsg as OraiswapOracleIsntantiateMsg } from 'libs/contracts/OraiswapOracle.types';
import { InstantiateMsg as OraiswapFactoryInstantiateMsg } from 'libs/contracts/OraiswapFactory.types';
import { readFileSync } from 'fs';
import { OraiswapFactoryClient } from 'libs/contracts/OraiswapFactory.client';

var cosmosChain: CWSimulateApp = new CWSimulateApp({
  chainId: 'cosmoshub-4',
  bech32Prefix: 'cosmos'
});
// oraichain support cosmwasm
var oraiClient: SimulateCosmWasmClient;

const oraiSenderAddress = 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g';
const bobAddress = 'orai1ur2vsjrjarygawpdwtqteaazfchvw4fg6uql76';
const bridgeReceiver = 'tron-testnet0x3C5C6b570C1DA469E8B24A2E8Ed33c278bDA3222';
const routerContractAddress = 'placeholder'; // we will update the contract config later when we need to deploy the actual router contract
const cosmosSenderAddress = bech32.encode(cosmosChain.bech32Prefix, bech32.decode(oraiSenderAddress).words);
const ibcTransferAmount = '100000000';
const initialBalanceAmount = '10000000000000';

describe.only('IBCModule', () => {
  let oraiPort: string;
  let oraiIbcDenom: string = 'tron-testnet0xA325Ad6D9c92B55A3Fc5aD7e412B1518F96441C0';
  let airiIbcDenom: string = 'tron-testnet0x7e2A35C746F2f7C240B664F1Da4DD100141AE71F';
  let cosmosPort: string = 'transfer';
  let channel = 'channel-0';
  let ics20Contract: CwIcs20LatestClient;
  let airiToken: OraiswapTokenClient;
  let packetData = {
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
  beforeEach(async () => {
    // reset state for every test
    cosmosChain = new CWSimulateApp({
      chainId: 'cosmoshub-4',
      bech32Prefix: 'cosmos'
    });
    oraiClient = new SimulateCosmWasmClient({
      chainId: 'Oraichain',
      bech32Prefix: 'orai'
    });
    const { contractAddress } = await oraiClient.deploy<CwIcs20LatestTypes.InstantiateMsg>(
      oraiSenderAddress,
      path.join(__dirname, 'testdata', 'cw_ics20.wasm'),
      {
        allowlist: [],
        default_timeout: 3600,
        gov_contract: oraiSenderAddress, // mulitsig contract
        swap_router_contract: routerContractAddress
      },
      'cw-ics20'
    );

    oraiPort = 'wasm.' + contractAddress;
    packetData.dest.port_id = oraiPort;
    ics20Contract = new CwIcs20LatestClient(oraiClient, oraiSenderAddress, contractAddress);

    // init cw20 AIRI token
    const { contractAddress: airiAddress } = await oraiClient.deploy<OraiswapInstantiateMsg>(
      oraiSenderAddress,
      path.join(__dirname, 'testdata', 'oraiswap_token.wasm'),
      {
        decimals: 6,
        symbol: 'AIRI',
        name: 'Airight token',
        initial_balances: [{ address: ics20Contract.contractAddress, amount: initialBalanceAmount }],
        mint: {
          minter: oraiSenderAddress
        }
      },
      'cw20-airi'
    );
    airiToken = new OraiswapTokenClient(oraiClient, oraiSenderAddress, airiAddress);

    // init ibc channel between two chains
    oraiClient.app.ibc.relay(channel, oraiPort, channel, cosmosPort, cosmosChain);
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
          connection_id: 'connection-0'
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
          connection_id: 'connection-0'
        },
        counterparty_version: 'ics20-1'
      }
    });
    cosmosChain.ibc.addMiddleWare((msg, app) => { });
    // topup
    oraiClient.app.bank.setBalance(ics20Contract.contractAddress, coins(initialBalanceAmount, 'orai'));
  });

  it.each([
    [
      {
        native_token: {
          denom: 'orai'
        }
      },
      ibcTransferAmount,
      oraiIbcDenom,
      coins(ibcTransferAmount, 'orai'),
      'cw-ics20-success-should-increase-native-balance-remote-to-local'
    ],
    [
      null,
      ibcTransferAmount,
      oraiIbcDenom,
      [],
      'cw-ics20-fail-no-pair-mapping-should-not-send-balance-remote-to-local'
    ],
    [
      {
        native_token: {
          denom: 'orai'
        }
      },
      '10000000000001',
      oraiIbcDenom,
      [],
      'cw-ics20-fail-transfer-native-fail-insufficient-funds-should-not-send-balance-remote-to-local'
    ],
    [
      {
        token: {
          contract_addr: 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu' // has to hard-code address airi due to jest issue: https://github.com/facebook/jest/issues/6888
        }
      },
      ibcTransferAmount,
      airiIbcDenom,
      [{ amount: ibcTransferAmount, denom: '' }],
      'cw-ics20-success-transfer-cw20-should-increase-cw20-balance-remote-to-local'
    ],
    [
      {
        token: {
          contract_addr: 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu' // has to hard-code address airi due to jest issue: https://github.com/facebook/jest/issues/6888
        }
      },
      '10000000000001',
      airiIbcDenom,
      [{ amount: '0', denom: '' }],
      'cw-ics20-fail-transfer-cw20-fail-insufficient-funds-should-not-send-balance-remote-to-local'
    ]
  ])(
    'bridge-test-cw-ics20-transfer-remote-to-local-given %j %s %s should return expected amount %j', //reference: https://jestjs.io/docs/api#1-testeachtablename-fn-timeout
    async (
      assetInfo: AssetInfo,
      transferAmount: string,
      transferDenom: string,
      expectedBalance: Coin[],
      _name: string
    ) => {
      // create mapping
      if (assetInfo) {
        const pair = {
          assetInfo,
          assetInfoDecimals: 6,
          denom: transferDenom,
          remoteDecimals: 6,
          localChannelId: channel
        };
        await ics20Contract.updateMappingPair(pair);
      }
      const icsPackage: FungibleTokenPacketData = {
        amount: transferAmount,
        denom: transferDenom,
        receiver: bobAddress,
        sender: cosmosSenderAddress,
        memo: ''
      };
      await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: cosmosSenderAddress
      });

      if (assetInfo && (assetInfo as any).token) {
        const bobBalance = await airiToken.balance({ address: bobAddress });
        console.log('bob balance contract address: ', bobBalance);
        expect(bobBalance.balance).toEqual(expectedBalance[0].amount);
        return;
      }
      const bobBalance = oraiClient.app.bank.getBalance(icsPackage.receiver);
      expect(bobBalance).toEqual(expectedBalance);
    }
  );

  it('cw-ics20-fail-outcoming-channel-larger-than-incoming-should-not-transfer-balance-local-to-remote', async () => {
    // create mapping
    await ics20Contract.updateMappingPair({
      assetInfo: {
        token: {
          contract_addr: airiToken.contractAddress
        }
      },
      assetInfoDecimals: 6,
      denom: airiIbcDenom,
      remoteDecimals: 6,
      localChannelId: channel
    });
    // now send ibc package
    const icsPackage: FungibleTokenPacketData = {
      amount: ibcTransferAmount,
      denom: airiIbcDenom,
      receiver: bobAddress,
      sender: cosmosSenderAddress,
      memo: ''
    };
    // transfer from cosmos to oraichain, should pass
    await cosmosChain.ibc.sendPacketReceive({
      packet: {
        data: toBinary(icsPackage),
        ...packetData,
      },
      relayer: cosmosSenderAddress
    });

    // mint new cw20 token to bob
    await airiToken.mint({ amount: '1', recipient: bobAddress });
    // try to send back to cosmos from oraichain, which will fail because outcoming channel balance is greater
    const transferBackMsg: TransferBackMsg = {
      local_channel_id: channel,
      remote_address: cosmosSenderAddress,
      remote_denom: airiIbcDenom
    };
    airiToken.sender = bobAddress;
    try {
      const packetReceiveRes = await airiToken.send({
        amount: (parseInt(ibcTransferAmount) + 1).toString(),
        contract: ics20Contract.contractAddress,
        msg: Buffer.from(JSON.stringify(transferBackMsg)).toString('base64')
      });
    } catch (error) {
      expect(error).not.toBeNull();
    }
  });

  it('cw-ics20-success-cw20-should-transfer-balance-to-ibc-wasm-contract-local-to-remote', async () => {
    // create mapping
    await ics20Contract.updateMappingPair({
      assetInfo: {
        token: {
          contract_addr: airiToken.contractAddress
        }
      },
      assetInfoDecimals: 6,
      denom: airiIbcDenom,
      remoteDecimals: 6,
      localChannelId: channel
    });
    // now send ibc package
    const icsPackage: FungibleTokenPacketData = {
      amount: ibcTransferAmount,
      denom: airiIbcDenom,
      receiver: bobAddress,
      sender: cosmosSenderAddress,
      memo: ''
    };
    // transfer from cosmos to oraichain, should pass
    await cosmosChain.ibc.sendPacketReceive({
      packet: {
        data: toBinary(icsPackage),
        ...packetData,
      },
      relayer: cosmosSenderAddress
    });

    const transferBackMsg: TransferBackMsg = {
      local_channel_id: channel,
      remote_address: cosmosSenderAddress,
      remote_denom: airiIbcDenom
    };
    airiToken.sender = bobAddress;
    await airiToken.send({
      amount: ibcTransferAmount,
      contract: ics20Contract.contractAddress,
      msg: Buffer.from(JSON.stringify(transferBackMsg)).toString('base64')
    });
    const ibcWasmAiriBalance = await airiToken.balance({ address: ics20Contract.contractAddress });
    expect(ibcWasmAiriBalance.balance).toEqual(initialBalanceAmount);
  });

  it.each([
    ['', ibcTransferAmount, 'empty-memo-should-fallback-to-transfer-to-receiver'],
    [bobAddress, ibcTransferAmount, 'only-receiver-memo-should-fallback-to-transfer-to-receiver'],
    [`${bobAddress}:`, ibcTransferAmount, 'receiver-with-a-dot-memo-should-fallback-to-transfer-to-receiver'],
    [
      `channel-1/${bobAddress}:`,
      ibcTransferAmount,
      'receiver-with-a-dot-and-channel-memo-should-fallback-to-transfer-to-receiver'
    ],
    [`channel-1/${bobAddress}`, ibcTransferAmount, 'receiver-and-channel-memo-should-fallback-to-transfer-to-receiver']
  ])(
    'cw-ics20-test-single-step-invalid-dest-denom-memo-remote-to-local-given %s should-get-expected-amount %s',
    async (memo: string, expectedAmount: string, _name: string) => {
      // create mapping
      await ics20Contract.updateMappingPair({
        assetInfo: {
          token: {
            contract_addr: airiToken.contractAddress
          }
        },
        assetInfoDecimals: 6,
        denom: airiIbcDenom,
        remoteDecimals: 6,
        localChannelId: channel
      });
      // now send ibc package
      const icsPackage: FungibleTokenPacketData = {
        amount: ibcTransferAmount,
        denom: airiIbcDenom,
        receiver: bobAddress,
        sender: cosmosSenderAddress,
        memo
      };
      // transfer from cosmos to oraichain, should pass
      await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: cosmosSenderAddress
      });
      const ibcWasmAiriBalance = await airiToken.balance({ address: bobAddress });
      expect(ibcWasmAiriBalance.balance).toEqual(expectedAmount);
    }
  );

  describe('cw-ics20-test-single-step-swap-to-tokens', () => {
    let factoryContract: OraiswapFactoryClient;
    let routerContract: OraiswapRouterClient;
    let usdtToken: OraiswapTokenClient;
    let assetInfos: AssetInfo[];
    let icsPackage: FungibleTokenPacketData = {
      amount: ibcTransferAmount,
      denom: airiIbcDenom,
      receiver: bobAddress,
      sender: cosmosSenderAddress,
      memo: ''
    };
    beforeEach(async () => {
      assetInfos = [{ native_token: { denom: 'orai' } }, { token: { contract_addr: airiToken.contractAddress } }];
      // upload pair & lp token code id
      const { codeId: pairCodeId } = await oraiClient.upload(
        oraiSenderAddress,
        readFileSync(path.join(__dirname, 'testdata/oraiswap_pair.wasm')),
        'auto'
      );
      const { codeId: lpCodeId } = await oraiClient.upload(
        oraiSenderAddress,
        readFileSync(path.join(__dirname, 'testdata/oraiswap_token.wasm')),
        'auto'
      );
      // deploy another cw20 for oraiswap testing
      const { contractAddress: usdtAddress } = await oraiClient.instantiate(
        oraiSenderAddress,
        lpCodeId,
        {
          decimals: 6,
          symbol: 'USDT',
          name: 'USDT token',
          initial_balances: [{ address: ics20Contract.contractAddress, amount: initialBalanceAmount }],
          mint: {
            minter: oraiSenderAddress
          }
        },
        'cw20-usdt'
      );
      usdtToken = new OraiswapTokenClient(oraiClient, oraiSenderAddress, usdtAddress);
      // deploy oracle addr
      const { contractAddress: oracleAddress } = await oraiClient.deploy<OraiswapOracleIsntantiateMsg>(
        oraiSenderAddress,
        path.join(__dirname, 'testdata/oraiswap_oracle.wasm'),
        {},
        'oraiswap-oracle'
      );
      // deploy factory contract
      const { contractAddress: factoryAddress } = await oraiClient.deploy<OraiswapFactoryInstantiateMsg>(
        oraiSenderAddress,
        path.join(__dirname, 'testdata/oraiswap_factory.wasm'),
        {
          commission_rate: '0',
          oracle_addr: oracleAddress,
          pair_code_id: pairCodeId,
          token_code_id: lpCodeId
        },
        'oraiswap-factory'
      );

      const { contractAddress: routerAddress } = await oraiClient.deploy<OraiswapRouterInstantiateMsg>(
        oraiSenderAddress,
        path.join(__dirname, 'testdata', 'oraiswap_router.wasm'),
        {
          factory_addr: factoryAddress,
          factory_addr_v2: factoryAddress
        },
        'oraiswap-router'
      );
      factoryContract = new OraiswapFactoryClient(oraiClient, oraiSenderAddress, factoryAddress);
      routerContract = new OraiswapRouterClient(oraiClient, oraiSenderAddress, routerAddress);

      // set correct router contract to prepare for the tests
      await ics20Contract.updateConfig({ swapRouterContract: routerAddress });
      // create mapping
      await ics20Contract.updateMappingPair({
        assetInfo: {
          token: {
            contract_addr: airiToken.contractAddress
          }
        },
        assetInfoDecimals: 6,
        denom: airiIbcDenom,
        remoteDecimals: 6,
        localChannelId: channel
      });
      await factoryContract.createPair({
        assetInfos
      });
      await factoryContract.createPair({
        assetInfos: [assetInfos[0], { token: { contract_addr: usdtToken.contractAddress } }]
      });
      const firstPairInfo = await factoryContract.pair({
        assetInfos
      });
      const secondPairInfo = await factoryContract.pair({
        assetInfos: [assetInfos[0], { token: { contract_addr: usdtToken.contractAddress } }]
      });
      // mint lots of orai, airi for the pair contracts to mock provide lp
      oraiClient.app.bank.setBalance(firstPairInfo.contract_addr, coins(initialBalanceAmount, 'orai'));
      airiToken.mint({ amount: initialBalanceAmount, recipient: firstPairInfo.contract_addr });
      oraiClient.app.bank.setBalance(secondPairInfo.contract_addr, coins(initialBalanceAmount, 'orai'));
      usdtToken.mint({ amount: initialBalanceAmount, recipient: secondPairInfo.contract_addr });
    });

    it('cw-ics20-test-simulate-swap-ops-mock-pair-contract', async () => {
      const simulateResult = await routerContract.simulateSwapOperations({
        offerAmount: '1',
        operations: [
          {
            orai_swap: {
              offer_asset_info: assetInfos[1],
              ask_asset_info: assetInfos[0]
            }
          },
          {
            orai_swap: {
              offer_asset_info: assetInfos[0],
              ask_asset_info: { token: { contract_addr: usdtToken.contractAddress } }
            }
          }
        ]
      });
      expect(simulateResult.amount).toEqual('1');
    });

    it.each([
      [`${bobAddress}:orai`, bobAddress],
      [`channel-0/${bobAddress}:orai`, 'orai1kpjz6jsyxg0wd5r5hhyquawgt3zva34m96qdl2'] // hard-coded ics20 address
    ])(
      'cw-ics20-test-single-step-native-token-swap-operations-to-dest-denom memo %s expected recipient %s',
      async (memo: string, expectedRecipient: string) => {
        // now send ibc package
        icsPackage.memo = memo;
        // transfer from cosmos to oraichain, should pass
        const result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: cosmosSenderAddress
        });
        console.log('result: ', result);
        const bobBalance = oraiClient.app.bank.getBalance(expectedRecipient);
        expect(bobBalance.length).toBeGreaterThan(0);
        expect(bobBalance[0].denom).toEqual('orai');
        expect(parseInt(bobBalance[0].amount)).toBeGreaterThan(0);
      }
    );

    it.each([
      [`${bobAddress}`, 'orai1n6fwuamldz6mv5f3qwe9296pudjjemhmkfcgc3', bobAddress], // hard-coded usdt address
      [`${bobAddress}`, 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu', bobAddress], // edge case, dest denom is also airi
      [`foobar`, 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu', bobAddress], // we ignore receiver in memo since its not reliable. Get receiver from ics package
      [
        `channel-0/${bobAddress}`,
        'orai1n6fwuamldz6mv5f3qwe9296pudjjemhmkfcgc3',
        'orai1kpjz6jsyxg0wd5r5hhyquawgt3zva34m96qdl2'
      ] // hard-coded usdt & ics20 address. When has dest channel => probably has ibc msg
    ])(
      'cw-ics20-test-single-step-cw20-token-swap-operations-to-dest-denom memo %s dest denom %s expected recipient %s',
      async (memo: string, destDenom: string, expectedRecipient: string) => {
        // now send ibc package
        icsPackage.memo = memo + `:${destDenom}`;
        // transfer from cosmos to oraichain, should pass
        const result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: cosmosSenderAddress
        });
        const token = new OraiswapTokenClient(oraiClient, oraiSenderAddress, destDenom);
        const cw20Balance = await token.balance({ address: expectedRecipient });
        expect(parseInt(cw20Balance.balance)).toBeGreaterThan(1000);
      }
    );

    it.each([
      [channel, 'abcd', 'orai1n6fwuamldz6mv5f3qwe9296pudjjemhmkfcgc3'], // hard-coded usdt address
      [channel, 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g', 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu'], // edge case, dest denom is also airi
      [channel, 'cosmos1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejl67nlm', 'orai1n6fwuamldz6mv5f3qwe9296pudjjemhmkfcgc3'], // hard-coded usdt
      [channel, 'cosmos1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejl67nlm', 'orai'],
      [channel, '0x', 'orai1n6fwuamldz6mv5f3qwe9296pudjjemhmkfcgc3'],
      [channel, '0xabcd', 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu'],
      [channel, 'tron-testnet0xabcd', 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu'] // bad evm address case
    ])(
      'cw-ics20-test-single-step-has-ibc-msg-dest-receiver-cosmos-based memo %s dest denom %s expected recipient %s',
      async (destChannel: string, destReceiver: string, destDenom: string) => {
        // now send ibc package
        icsPackage.memo = `${destChannel}/${destReceiver}:${destDenom}`;
        // transfer from cosmos to oraichain, should pass
        const result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: cosmosSenderAddress
        });
        const ibcEvent = result.events.find(
          (event) => event.type === 'transfer' && event.attributes.find((attr) => attr.key === 'channel')
        );
        // get swap operation event
        expect(ibcEvent).not.toBeUndefined();
        expect(ibcEvent.attributes.find((attr) => attr.key === 'channel').value).toEqual(destChannel);
        expect(ibcEvent.attributes.find((attr) => attr.key === 'recipient').value).toEqual(destReceiver);
        expect(ibcEvent.attributes.find((attr) => attr.key === 'sender').value).toEqual(ics20Contract.contractAddress);
        expect(ibcEvent.attributes.find((attr) => attr.key === 'amount').value).toContain(destDenom);
      }
    );

    it.each([
      [channel, bridgeReceiver, 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu'] // hard-coded airi
    ])(
      'cw-ics20-test-single-step-has-ibc-msg-dest-receiver-evm-based memo %s dest denom %s expected recipient %s',
      async (destChannel: string, destReceiver: string, destDenom: string) => {
        // now send ibc package
        icsPackage.memo = `${destChannel}/${destReceiver}:${destDenom}`;
        // transfer from cosmos to oraichain, should pass
        const result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: cosmosSenderAddress
        });
        console.log('result: ', JSON.stringify(result.events));
        const sendPacketEvent = result.events.find((event) => event.type === 'send_packet');
        expect(sendPacketEvent).not.toBeUndefined();
        const packetHex = sendPacketEvent.attributes.find((attr) => attr.key === 'packet_data_hex').value;
        expect(packetHex).not.toBeUndefined();
        const packet = JSON.parse(Buffer.from(packetHex, 'hex').toString('ascii'));
        console.log('packet: ', packet);
        expect(packet.receiver).toEqual(icsPackage.sender);
        expect(packet.sender).toEqual(ics20Contract.contractAddress);
        // expect(packet.memo).toEqual(ics20Contract.contractAddress);
      }
    );
  });
});
