import { Event, toBinary } from '@cosmjs/cosmwasm-stargate';
import { Coin, coins } from '@cosmjs/proto-signing';
import { CWSimulateApp, GenericError, IbcOrder, IbcPacket, SimulateCosmWasmClient } from '@oraichain/cw-simulate';
import { Ok } from 'ts-results';
import bech32 from 'bech32';
import { readFileSync } from 'fs';
import {
  OraiswapFactoryClient,
  OraiswapRouterClient,
  OraiswapTokenClient,
  OraiswapPairClient,
  OraiswapOracleClient
} from '@oraichain/oraidex-contracts-sdk';
import { CwIcs20LatestClient } from '@oraichain/common-contracts-sdk';
import * as oraidexArtifacts from '@oraichain/oraidex-contracts-build';
import { FungibleTokenPacketData } from 'cosmjs-types/ibc/applications/transfer/v2/packet';
import { deployIcs20Token, deployToken, senderAddress as oraiSenderAddress, senderAddress } from './common';
import { oraib2oraichain } from '@oraichain/oraidex-common';
import { ORAI } from '@oraichain/oraidex-common';
import { AssetInfo, TransferBackMsg } from '@oraichain/common-contracts-sdk/build/CwIcs20Latest.types';
import { toDisplay } from '@oraichain/oraidex-common';
import { expect, describe, it, beforeEach } from 'vitest';

let cosmosChain: CWSimulateApp;
// oraichain support cosmwasm
let oraiClient: SimulateCosmWasmClient;

const bobAddress = 'orai1ur2vsjrjarygawpdwtqteaazfchvw4fg6uql76';
const bobAddressEth = '0x8754032Ac7966A909e2E753308dF56bb08DabD69';
const bridgeReceiver = 'tron-testnet0x3C5C6b570C1DA469E8B24A2E8Ed33c278bDA3222';
const routerContractAddress = 'placeholder'; // we will update the contract config later when we need to deploy the actual router contract
const cosmosSenderAddress = bech32.encode('cosmos', bech32.decode(oraiSenderAddress).words);
const relayerAddress = 'orai1704r4dhuwdqvt7vs35m0360py6ep6cwwxeyfxn';
const oraibridgeSenderAddress = bech32.encode('oraib', bech32.decode(oraiSenderAddress).words);
const ibcTransferAmount = '100000000';
const initialBalanceAmount = '10000000000000';

const assertKeyValue = (event: Event, key: string, value: string) => {
  return event.attributes.find((attr) => attr.key === key && attr.value === value);
};

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
      bech32Prefix: ORAI,
      metering: import.meta.env.METERING === 'true'
    });

    ics20Contract = await deployIcs20Token(oraiClient, { swap_router_contract: routerContractAddress });
    oraiPort = 'wasm.' + ics20Contract.contractAddress;
    packetData.dest.port_id = oraiPort;

    // init cw20 AIRI token
    airiToken = await deployToken(oraiClient, {
      decimals: 6,
      symbol: 'AIRI',
      name: 'Airight token',
      initial_balances: [{ address: ics20Contract.contractAddress, amount: initialBalanceAmount }]
    });

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

    cosmosChain.ibc.addMiddleWare((msg, app) => {
      const data = msg.data.packet as IbcPacket;
      if (Number(data.timeout.timestamp) < cosmosChain.time) {
        throw new GenericError('timeout at ' + data.timeout.timestamp);
      }
    });
    // topup
    oraiClient.app.bank.setBalance(ics20Contract.contractAddress, coins(initialBalanceAmount, ORAI));

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
  });

  it('demo-getting-channel-state-ibc-wasm-should-increase-balances-and-total-sent', async () => {
    // fixture. Setup everything from the ics 20 contract to ibc relayer
    const oraiClient = new SimulateCosmWasmClient({
      chainId: 'Oraichain',
      bech32Prefix: ORAI,
      metering: import.meta.env.METERING === 'true'
    });

    const ics20Contract = await deployIcs20Token(oraiClient, { swap_router_contract: routerContractAddress });
    const oraiPort = 'wasm.' + ics20Contract.contractAddress;
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

    // init cw20 AIRI token
    const airiToken = await deployToken(oraiClient, {
      decimals: 6,
      symbol: 'AIRI',
      name: 'Airight token',
      initial_balances: [{ address: ics20Contract.contractAddress, amount: initialBalanceAmount }]
    });

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

    cosmosChain.ibc.addMiddleWare((msg, app) => {
      const data = msg.data.packet as IbcPacket;
      if (Number(data.timeout.timestamp) < cosmosChain.time) {
        throw new GenericError('timeout at ' + data.timeout.timestamp);
      }
    });
    // topup
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

    const icsPackage: FungibleTokenPacketData = {
      amount: ibcTransferAmount,
      denom: airiIbcDenom,
      receiver: bobAddress,
      sender: cosmosSenderAddress,
      memo: ''
    };
    // transfer from cosmos to oraichain, should pass. This should increase the balances & total sent
    await cosmosChain.ibc.sendPacketReceive({
      packet: {
        data: toBinary(icsPackage),
        ...newPacketData
      },
      relayer: relayerAddress
    });

    const { channels } = await ics20Contract.listChannels();
    for (let channel of channels) {
      const { balances } = await ics20Contract.channel({ id: channel.id });
      for (let balance of balances) {
        if ('native' in balance) {
          const pairMapping = await ics20Contract.pairMapping({ key: balance.native.denom });
          const { balance: channelBalance } = await ics20Contract.channelWithKey({
            channelId: channel.id,
            denom: balance.native.denom
          });
          if ('native' in channelBalance) {
            const trueBalance = toDisplay(channelBalance.native.amount, pairMapping.pair_mapping.remote_decimals);
            expect(trueBalance).toEqual(parseInt(ibcTransferAmount) / 10 ** pairMapping.pair_mapping.remote_decimals);
          }
        } else {
          // do nothing because currently we dont have any cw20 balance in the channel
        }
      }
    }
  });

  it.each([
    [
      {
        native_token: {
          denom: ORAI
        }
      },
      ibcTransferAmount,
      oraiIbcDenom,
      coins(ibcTransferAmount, ORAI),
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
          denom: ORAI
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
          localAssetInfo: assetInfo,
          localAssetInfoDecimals: 6,
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
        relayer: relayerAddress
      });

      if (assetInfo && (assetInfo as any).token) {
        const bobBalance = await airiToken.balance({ address: bobAddress });
        console.log('bob balance contract address: ', bobBalance);
        expect(bobBalance.balance).toEqual(expectedBalance[0].amount);
        return;
      }
      const bobBalance = oraiClient.app.bank.getBalance(icsPackage.receiver);
      expect(bobBalance).toMatchObject(expectedBalance);
    }
  );

  it('cw-ics20-fail-outcoming-channel-larger-than-incoming-should-not-transfer-balance-local-to-remote', async () => {
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
        ...packetData
      },
      relayer: relayerAddress
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
      expect(error.message).toContain('Insufficient funds to redeem voucher on channel');
    }
  });

  it('cw-ics20-success-cw20-should-transfer-balance-to-ibc-wasm-contract-local-to-remote', async () => {
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
        ...packetData
      },
      relayer: relayerAddress
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
      `${oraib2oraichain}/${bobAddress}:`,
      ibcTransferAmount,
      'receiver-with-a-dot-and-channel-memo-should-fallback-to-transfer-to-receiver'
    ],
    [
      `${oraib2oraichain}/${bobAddress}`,
      ibcTransferAmount,
      'receiver-and-channel-memo-should-fallback-to-transfer-to-receiver'
    ]
  ])(
    'cw-ics20-test-single-step-invalid-dest-denom-memo-remote-to-local-given %s should-get-expected-amount %s',
    async (memo: string, expectedAmount: string, _name: string) => {
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
        relayer: relayerAddress
      });
      const ibcWasmAiriBalance = await airiToken.balance({ address: bobAddress });
      expect(ibcWasmAiriBalance.balance).toEqual(expectedAmount);
    }
  );

  describe('cw-ics20-test-single-step-swap-to-tokens', () => {
    let factoryContract: OraiswapFactoryClient;
    let routerContract: OraiswapRouterClient;
    let usdtToken: OraiswapTokenClient;
    let oracleContract: OraiswapOracleClient;
    let assetInfos: AssetInfo[];
    let lpId: number;
    let icsPackage: FungibleTokenPacketData = {
      amount: ibcTransferAmount,
      denom: airiIbcDenom,
      receiver: bobAddress,
      sender: cosmosSenderAddress,
      memo: ''
    };
    const findWasmEvent = (events: Event[], key: string, value: string) =>
      events.find((event) => event.type === 'wasm' && assertKeyValue(event, key, value));
    beforeEach(async () => {
      assetInfos = [{ native_token: { denom: ORAI } }, { token: { contract_addr: airiToken.contractAddress } }];
      // upload pair & lp token code id
      const { codeId: pairCodeId } = await oraiClient.upload(
        oraiSenderAddress,
        readFileSync(oraidexArtifacts.getContractDir('oraiswap_pair')),
        'auto'
      );
      const { codeId: lpCodeId } = await oraiClient.upload(
        oraiSenderAddress,
        readFileSync(oraidexArtifacts.getContractDir('oraiswap_token')),
        'auto'
      );
      lpId = lpCodeId;
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
      const { contractAddress: oracleAddress } = await oraidexArtifacts.deployContract(
        oraiClient,
        oraiSenderAddress,
        {},
        'oraiswap-oracle',
        'oraiswap_oracle'
      );
      // deploy factory contract
      oracleContract = new OraiswapOracleClient(oraiClient, oraiSenderAddress, oracleAddress);
      const { contractAddress: factoryAddress } = await oraidexArtifacts.deployContract(
        oraiClient,
        oraiSenderAddress,
        {
          commission_rate: '0',
          oracle_addr: oracleAddress,
          pair_code_id: pairCodeId,
          token_code_id: lpCodeId
        },
        'oraiswap-factory',
        'oraiswap_factory'
      );

      const { contractAddress: routerAddress } = await oraidexArtifacts.deployContract(
        oraiClient,
        oraiSenderAddress,
        {
          factory_addr: factoryAddress,
          factory_addr_v2: factoryAddress
        },
        'oraiswap-router',
        'oraiswap_router'
      );
      factoryContract = new OraiswapFactoryClient(oraiClient, oraiSenderAddress, factoryAddress);
      routerContract = new OraiswapRouterClient(oraiClient, oraiSenderAddress, routerAddress);

      // set correct router contract to prepare for the tests
      await ics20Contract.updateConfig({ swapRouterContract: routerAddress });
      // create mapping
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
      // here, ratio is 1:1 => 1 AIRI = 1 ORAI
      oraiClient.app.bank.setBalance(firstPairInfo.contract_addr, coins(initialBalanceAmount, ORAI));
      await airiToken.mint({ amount: initialBalanceAmount, recipient: firstPairInfo.contract_addr });
      oraiClient.app.bank.setBalance(secondPairInfo.contract_addr, coins(initialBalanceAmount, ORAI));
      await usdtToken.mint({ amount: initialBalanceAmount, recipient: secondPairInfo.contract_addr });
    });

    it('test-simulate-withdraw-liquidity', async () => {
      // deploy another cw20 for oraiswap testing
      let scatomToken: OraiswapTokenClient;
      const atomIbc = 'ibc/A2E2EEC9057A4A1C2C0A6A4C78B0239118DF5F278830F50B4A6BDD7A66506B78';
      const { contractAddress: scatomAddress } = await oraiClient.instantiate(
        oraiSenderAddress,
        lpId,
        {
          decimals: 6,
          symbol: 'scATOM',
          name: 'scATOM token',
          initial_balances: [{ address: oraiSenderAddress, amount: initialBalanceAmount }],
          mint: {
            minter: oraiSenderAddress
          }
        },
        'cw20-scatom'
      );
      scatomToken = new OraiswapTokenClient(oraiClient, oraiSenderAddress, scatomAddress);
      const assetInfos = [{ native_token: { denom: atomIbc } }, { token: { contract_addr: scatomAddress } }];
      await factoryContract.createPair({
        assetInfos
      });
      const firstPairInfo = await factoryContract.pair({
        assetInfos
      });
      const pairAddress = firstPairInfo.contract_addr;
      await scatomToken.increaseAllowance({ amount: initialBalanceAmount, spender: pairAddress });
      oraiClient.app.bank.setBalance(pairAddress, coins(initialBalanceAmount, atomIbc));
      oraiClient.app.bank.setBalance(oraiSenderAddress, coins(initialBalanceAmount, atomIbc));

      const pairContract = new OraiswapPairClient(oraiClient, oraiSenderAddress, pairAddress);
      await pairContract.provideLiquidity(
        {
          assets: [
            { amount: '10000000', info: { token: { contract_addr: scatomAddress } } },
            { amount: '10000000', info: { native_token: { denom: atomIbc } } }
          ]
        },
        'auto',
        undefined,
        [{ denom: atomIbc, amount: '10000000' }]
      );
      // query liquidity balance
      const lpToken = new OraiswapTokenClient(oraiClient, oraiSenderAddress, firstPairInfo.liquidity_token);
      const result = await lpToken.balance({ address: oraiSenderAddress });

      // set tax rate
      await oracleContract.updateTaxRate({ rate: '0.003' });
      await oracleContract.updateTaxCap({ denom: atomIbc, cap: '1000000' });

      // now we withdraw lp
      await lpToken.send({
        amount: '1000',
        contract: pairAddress,
        msg: Buffer.from(JSON.stringify({ withdraw_liquidity: {} })).toString('base64')
      });
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

    it.each<[string, string, string]>([
      [`${bobAddress}:orai`, bobAddress, 'Generic error: Destination channel empty in build ibc msg'],
      [
        `channel-0/not-evm-based-nor-cosmos-based:orai`,
        bobAddress,
        'Generic error: The destination info is neither evm or cosmos based'
      ]
    ])(
      'cw-ics20-test-single-step-native-token-swap-operations-to-dest-denom memo %s expected recipient %s',
      async (memo: string, expectedRecipient: string, expectedIbcErrorMsg: string) => {
        // now send ibc package
        icsPackage.memo = memo;
        // transfer from cosmos to oraichain, should pass
        const result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: relayerAddress
        });

        const bobBalance = oraiClient.app.bank.getBalance(expectedRecipient);
        expect(bobBalance.length).toBeGreaterThan(0);
        expect(bobBalance[0].denom).toEqual(ORAI);
        expect(parseInt(bobBalance[0].amount)).toBeGreaterThan(0);
        const transferEvent = result.events.find(
          (event) => event.type === 'transfer' && assertKeyValue(event, 'recipient', expectedRecipient)
        );
        expect(transferEvent).not.toBeUndefined();
        const ibcErrorMsg = result.attributes.find((attr) => attr.key === 'ibc_error_msg');
        expect(ibcErrorMsg).not.toBeUndefined();
        expect(ibcErrorMsg.value).toEqual(expectedIbcErrorMsg);
      }
    );

    it.each([
      [
        `${bobAddress}`,
        'orai1n6fwuamldz6mv5f3qwe9296pudjjemhmkfcgc3',
        bobAddress,
        'Generic error: Destination channel empty in build ibc msg'
      ], // hard-coded usdt address
      [
        `${bobAddress}`,
        'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu',
        bobAddress,
        'Generic error: Destination channel empty in build ibc msg'
      ] // edge case, dest denom is also airi
    ])(
      'cw-ics20-test-single-step-cw20-token-swap-operations-to-dest-denom memo %s dest denom %s expected recipient %s',
      async (memo: string, destDenom: string, expectedRecipient: string, expectedIbcErrorMsg: string) => {
        // now send ibc package
        icsPackage.memo = memo + `:${destDenom}`;
        // transfer from cosmos to oraichain, should pass
        const result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: relayerAddress
        });

        const token = new OraiswapTokenClient(oraiClient, oraiSenderAddress, destDenom);
        const cw20Balance = await token.balance({ address: expectedRecipient });
        expect(parseInt(cw20Balance.balance)).toBeGreaterThan(1000);
        expect(result.attributes.find((attr) => attr.key === 'ibc_error_msg').value).toEqual(expectedIbcErrorMsg);
      }
    );

    it('cw-ics20-test-single-step-cw20-token-swap-operations-to-dest-denom-FAILED-cannot-simulate-swap', async () => {
      // now send ibc package
      icsPackage.memo = `channel-0/${bobAddressEth}:foo`;
      // transfer from cosmos to oraichain, should pass
      const result = await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: relayerAddress
      });
      expect(result.attributes.find((attr) => attr.key === 'ibc_error_msg').value).toEqual(
        'Cannot simulate swap with ops: [OraiSwap { offer_asset_info: Token { contract_addr: Addr("orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu") }, ask_asset_info: NativeToken { denom: "orai" } }, OraiSwap { offer_asset_info: NativeToken { denom: "orai" }, ask_asset_info: NativeToken { denom: "foo" } }] with error: "Error parsing into type oraiswap::router::SimulateSwapOperationsResponse: unknown field `ok`, expected `amount`"'
      );
    });

    it('cw-ics20-test-single-step-cw20-FAILED-NATIVE_RECEIVE_ID-ack-SUCCESS', async () => {
      // now send ibc package
      icsPackage.memo = '';
      icsPackage.amount = initialBalanceAmount + '0';
      // transfer from cosmos to oraichain, should pass
      const result = await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: relayerAddress
      });
      expect(findWasmEvent(result.events, 'action', 'native_receive_id')).not.toBeUndefined();
      // ack should be successful
      expect(result.acknowledgement).toEqual(Buffer.from('{"result":"MQ=="}').toString('base64'));

      // other types of reply id must not be called
      expect(findWasmEvent(result.events, 'action', 'swap_ops_failure_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'follow_up_failure_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'refund_failure_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'ibc_transfer_native_error_id')).toBeUndefined();
    });

    it('cw-ics20-test-single-step-cw20-FAILED-SWAP_OPS_FAILURE_ID-ack-SUCCESS', async () => {
      // fixture
      icsPackage.memo = `${bobAddress}:${usdtToken.contractAddress}`;
      icsPackage.amount = initialBalanceAmount + '0';
      // transfer from cosmos to oraichain, should pass
      const result = await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: relayerAddress
      });
      expect(findWasmEvent(result.events, 'action', 'swap_ops_failure_id')).not.toBeUndefined();
      // ack should be successful
      expect(result.acknowledgement).toEqual(Buffer.from('{"result":"MQ=="}').toString('base64'));
      // refunding also fails because of not enough balance to refund
      expect(findWasmEvent(result.events, 'action', 'refund_failure_id')).not.toBeUndefined();

      // other types of reply id must not be called
      expect(findWasmEvent(result.events, 'action', 'native_receive_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'follow_up_failure_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'ibc_transfer_native_error_id')).toBeUndefined();
    });

    it('cw-ics20-test-single-step-cw20-FAILED-IBC_TRANSFER_NATIVE_ERROR_ID-ack-SUCCESS', async () => {
      // fixture
      icsPackage.memo = `unknown-channel/${bobAddress}:${usdtToken.contractAddress}`;
      icsPackage.amount = initialBalanceAmount;
      // transfer from cosmos to oraichain, should pass
      const result = await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: relayerAddress
      });
      // refunding also fails because of not enough balance to refund
      expect(findWasmEvent(result.events, 'action', 'ibc_transfer_native_error_id')).not.toBeUndefined();
      // ack should be successful
      expect(result.acknowledgement).toEqual(Buffer.from('{"result":"MQ=="}').toString('base64'));
      expect(findWasmEvent(result.events, 'undo_increase_channel', channel)).toBeUndefined();

      // other types of reply id must not be called
      expect(findWasmEvent(result.events, 'action', 'swap_ops_failure_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'native_receive_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'follow_up_failure_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'refund_failure_id')).toBeUndefined();

      // for ibc native transfer case, we wont have refund either
      expect(
        result.events.find(
          (ev) => ev.type === 'wasm' && assertKeyValue(ev, 'action', 'transfer') && assertKeyValue(ev, 'to', bobAddress)
        )
      ).toBeUndefined();
    });

    it('cw-ics20-test-single-step-cw20-FAILED-REFUND_FAILURE_ID-ack-SUCCESS', async () => {
      // fixture
      icsPackage.memo = `${bobAddress}:${usdtToken.contractAddress}`;
      icsPackage.amount = initialBalanceAmount + '0';
      // transfer from cosmos to oraichain, should pass
      const result = await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: relayerAddress
      });
      expect(findWasmEvent(result.events, 'action', 'swap_ops_failure_id')).not.toBeUndefined();
      // ack should be successful
      expect(result.acknowledgement).toEqual(Buffer.from('{"result":"MQ=="}').toString('base64'));
      // refunding also fails because of not enough balance to refund
      expect(findWasmEvent(result.events, 'action', 'refund_failure_id')).not.toBeUndefined();

      // other types of reply id must not be called
      expect(findWasmEvent(result.events, 'action', 'native_receive_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'follow_up_failure_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'ibc_transfer_native_error_id')).toBeUndefined();
    });

    it('cw-ics20-test-single-step-cw20-success-FOLLOW_UP_IBC_SEND_FAILURE_ID-must-not-have-SWAP_OPS_FAILURE_ID-or-on_packet_failure-ack-SUCCESS', async () => {
      // fixture
      icsPackage.memo = `${channel}/${bobAddress}:${airiToken.contractAddress}`;
      icsPackage.amount = initialBalanceAmount;
      // transfer from cosmos to oraichain, should pass
      const result = await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: relayerAddress
      });
      // all id types of reply id must not be called, especially swap_ops_failure_id
      expect(findWasmEvent(result.events, 'action', 'swap_ops_failure_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'native_receive_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'follow_up_failure_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'refund_failure_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'ibc_transfer_native_error_id')).toBeUndefined();
      expect(findWasmEvent(result.events, 'action', 'acknowledge')).toBeUndefined();
      expect(findWasmEvent(result.events, 'undo_reduce_channel', channel)).toBeUndefined();
      // ack should be successful
      expect(result.acknowledgement).toEqual(Buffer.from('{"result":"MQ=="}').toString('base64'));

      // for ibc native transfer case, we wont have refund either
      expect(
        result.events.find(
          (ev) => ev.type === 'wasm' && assertKeyValue(ev, 'action', 'transfer') && assertKeyValue(ev, 'to', bobAddress)
        )
      ).toBeUndefined();
    });

    it.each([
      [channel, 'abcd', 'orai1n6fwuamldz6mv5f3qwe9296pudjjemhmkfcgc3'], // hard-coded usdt address
      [channel, '0x', 'orai1n6fwuamldz6mv5f3qwe9296pudjjemhmkfcgc3'],
      [channel, '0xabcd', 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu'],
      [channel, 'tron-testnet0xabcd', 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu'] // bad evm address case
    ])(
      'cw-ics20-test-single-step-has-ibc-msg-dest-fail memo %s dest denom %s expected error',
      async (destChannel: string, destReceiver: string, destDenom: string) => {
        // now send ibc package
        icsPackage.memo = `${destChannel}/${destReceiver}:${destDenom}`;
        // transfer from cosmos to oraichain, should pass
        const result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: relayerAddress
        });
        const ibcEvent = result.events.find(
          (event) => event.type === 'transfer' && event.attributes.find((attr) => attr.key === 'channel')
        );
        // get swap operation event
        expect(ibcEvent).toBeUndefined();
        const ibcErrorMsg = result.attributes.find(
          (attr) =>
            attr.key === 'ibc_error_msg' &&
            attr.value === 'Generic error: The destination info is neither evm or cosmos based'
        );
        expect(ibcErrorMsg).not.toBeUndefined();
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
        let result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: relayerAddress
        });
        const sendPacketEvent = result.events.find((event) => event.type === 'send_packet');
        expect(sendPacketEvent).not.toBeUndefined();
        const packetHex = sendPacketEvent.attributes.find((attr) => attr.key === 'packet_data_hex').value;
        expect(packetHex).not.toBeUndefined();
        const packet = JSON.parse(Buffer.from(packetHex, 'hex').toString('ascii'));
        expect(packet.receiver).toEqual(icsPackage.sender);
        expect(packet.sender).toEqual(ics20Contract.contractAddress);
        // expect(packet.memo).toEqual(ics20Contract.contractAddress);

        // pass 1 day with 86_400 seconds
        cosmosChain.store.tx((setter) => Ok(setter('time')(cosmosChain.time + 86_400 * 1e9)));

        // transfer from cosmos to oraichain, should pass
        result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: relayerAddress
        });
        // expect(
        //   flatten(result.events.map((e) => e.attributes)).find((a) => a.key === 'error_follow_up_msgs').value
        // ).toContain('Generic error: timeout at');
      }
    );

    it('cw-ics20-test-single-step-ibc-msg-map-with-fee-denom-orai-and-airi-destination-denom-should-swap-normally', async () => {
      await ics20Contract.updateMappingPair({
        localAssetInfo: {
          native_token: {
            denom: ORAI
          }
        },
        localAssetInfoDecimals: 6,
        denom: oraiIbcDenom,
        remoteDecimals: 6,
        localChannelId: channel
      });

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
      const icsPackage: FungibleTokenPacketData = {
        amount: ibcTransferAmount,
        denom: oraiIbcDenom,
        receiver: bobAddress,
        sender: cosmosSenderAddress,
        memo: `${bobAddress}:${airiToken.contractAddress}`
      };
      // transfer from cosmos to oraichain, should pass
      let result = await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: relayerAddress
      });

      const swapEvent = result.events.find(
        (event) => event.type === 'wasm' && event.attributes.find((attr) => attr.value === 'swap')
      );
      expect(
        swapEvent.attributes.filter((attr) => attr.key === 'offer_asset' && attr.value === ORAI).length
      ).toBeGreaterThan(0);
      expect(
        swapEvent.attributes.filter((attr) => attr.key === 'ask_asset' && attr.value === airiToken.contractAddress)
          .length
      ).toBeGreaterThan(0);
    });

    it('cw-ics20-test-single-step-ibc-msg-map-with-fee-denom-orai-and-orai-destination-denom-should-transfer-normally', async () => {
      await ics20Contract.updateMappingPair({
        localAssetInfo: {
          native_token: {
            denom: ORAI
          }
        },
        localAssetInfoDecimals: 6,
        denom: oraiIbcDenom,
        remoteDecimals: 6,
        localChannelId: channel
      });

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
      const icsPackage: FungibleTokenPacketData = {
        amount: ibcTransferAmount,
        denom: oraiIbcDenom,
        receiver: bobAddress,
        sender: cosmosSenderAddress,
        memo: `${bobAddress}:orai`
      };
      // transfer from cosmos to oraichain, should pass
      let result = await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: relayerAddress
      });
      const transferEvent = result.events.find((event) => event.type === 'transfer');
      expect(
        transferEvent.attributes.filter((attr) => attr.key === 'recipient' && attr.value === bobAddress).length
      ).toBeGreaterThan(0);
      expect(
        transferEvent.attributes.filter(
          (attr) => attr.key === 'amount' && attr.value === JSON.stringify([{ denom: ORAI, amount: ibcTransferAmount }])
        ).length
      ).toBeGreaterThan(0);
    });

    describe('test-single-step-cosmos-based-ibc-transfer-native', () => {
      const unknownChannel = 'unknown-channel';
      beforeEach(async () => {
        // fixture
        // needs to fake a new ibc channel so that we can successfully do ibc transfer
        oraiClient.app.ibc.relay(unknownChannel, oraiPort, unknownChannel, cosmosPort, cosmosChain);
        await cosmosChain.ibc.sendChannelOpen({
          open_init: {
            channel: {
              counterparty_endpoint: {
                port_id: oraiPort,
                channel_id: unknownChannel
              },
              endpoint: {
                port_id: cosmosPort,
                channel_id: unknownChannel
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
                channel_id: unknownChannel
              },
              endpoint: {
                port_id: cosmosPort,
                channel_id: unknownChannel
              },
              order: IbcOrder.Unordered,
              version: 'ics20-1',
              connection_id: 'connection-0'
            },
            counterparty_version: 'ics20-1'
          }
        });

        cosmosChain.ibc.addMiddleWare((msg, app) => {
          if ('packet' in msg.data) {
            const data = msg.data.packet as IbcPacket;
            if (Number(data.timeout.timestamp) < cosmosChain.time) {
              throw new GenericError('timeout at ' + data.timeout.timestamp);
            }
          }
        });
      });

      it.each([
        [
          'unknown-channel',
          'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g',
          'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu'
        ], // edge case, dest denom is also airi
        ['unknown-channel', 'cosmos1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejl67nlm', ORAI]
      ])(
        'cw-ics20-test-single-step-has-ibc-msg-dest-receiver-cosmos-based dest channel %s dest denom %s expected recipient %s',
        async (destChannel: string, destReceiver: string, destDenom: string) => {
          // now send ibc package
          icsPackage.memo = `${destChannel}/${destReceiver}:${destDenom}`;
          // transfer from cosmos to oraichain, should pass
          const result = await cosmosChain.ibc.sendPacketReceive({
            packet: {
              data: toBinary(icsPackage),
              ...packetData
            },
            relayer: relayerAddress
          });

          const ibcEvent = result.events.find(
            (event) => event.type === 'transfer' && event.attributes.find((attr) => attr.key === 'channel')
          );
          // get swap operation event
          expect(ibcEvent).not.toBeUndefined();
          expect(ibcEvent.attributes.find((attr) => attr.key === 'channel').value).toEqual(destChannel);
          expect(ibcEvent.attributes.find((attr) => attr.key === 'recipient').value).toEqual(destReceiver);
          expect(ibcEvent.attributes.find((attr) => attr.key === 'sender').value).toEqual(
            ics20Contract.contractAddress
          );
          expect(ibcEvent.attributes.find((attr) => attr.key === 'amount').value).toContain(destDenom);
        }
      );

      it('cw-ics20-test-single-step-ibc-msg-SUCCESS-map-with-fee-denom-orai-and-orai-destination-denom-with-dest-channel-not-matched-with-mapping-pair-should-do-ibctransfer', async () => {
        await ics20Contract.updateMappingPair({
          localAssetInfo: {
            native_token: {
              denom: ORAI
            }
          },
          localAssetInfoDecimals: 6,
          denom: oraiIbcDenom,
          remoteDecimals: 6,
          localChannelId: channel
        });

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
        const icsPackage: FungibleTokenPacketData = {
          amount: ibcTransferAmount,
          denom: oraiIbcDenom,
          receiver: bobAddress,
          sender: cosmosSenderAddress,
          memo: `${unknownChannel}/${bobAddress}:orai`
        };
        // transfer from cosmos to oraichain, should pass
        let result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: relayerAddress
        });
        const transferEvent = result.events.find((event) => event.type === 'transfer');
        expect(
          transferEvent.attributes.filter((attr) => attr.key === 'recipient' && attr.value === bobAddress).length
        ).toBeGreaterThan(0);
        expect(
          transferEvent.attributes.filter((attr) => attr.key === 'amount' && attr.value === `${ibcTransferAmount}orai`)
            .length
        ).toBeGreaterThan(0);
        expect(
          transferEvent.attributes.filter((attr) => attr.key === 'channel' && attr.value === unknownChannel).length
        ).toBeGreaterThan(0);
      });
    });

    it('cw-ics20-test-single-step-ibc-msg-FAILED-map-with-fee-denom-orai-and-orai-destination-denom-with-dest-channel-not-matched-with-mapping-pair-channel-no-relay-channel-should-fail', async () => {
      // fixture
      const unknownChannel = 'unknown-channel-2';
      await ics20Contract.updateMappingPair({
        localAssetInfo: {
          native_token: {
            denom: ORAI
          }
        },
        localAssetInfoDecimals: 6,
        denom: oraiIbcDenom,
        remoteDecimals: 6,
        localChannelId: channel
      });

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
      const icsPackage: FungibleTokenPacketData = {
        amount: ibcTransferAmount,
        denom: oraiIbcDenom,
        receiver: bobAddress,
        sender: cosmosSenderAddress,
        memo: `${unknownChannel}/${bobAddress}:orai`
      };
      // transfer from cosmos to oraichain, should pass
      let result = await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: relayerAddress
      });
      expect((result.messages[0].msg as any).wasm.execute.contract_addr).toEqual(ics20Contract.contractAddress);
      expect(
        JSON.parse(Buffer.from((result.messages[0].msg as any).wasm.execute.msg, 'base64').toString('utf8'))
      ).toEqual({
        increase_channel_balance_ibc_receive: {
          dest_channel_id: channel,
          ibc_denom: `wasm.${ics20Contract.contractAddress}/${channel}/${oraiIbcDenom}`,
          amount: ibcTransferAmount,
          local_receiver: bobAddress
        }
      });
      expect(result.messages.length).toEqual(2);
      expect((result.messages[1].msg as any).ibc.transfer.channel_id).toEqual(unknownChannel);
      expect((result.messages[1].msg as any).ibc.transfer.to_address).toEqual(bobAddress);
      expect((result.messages[1].msg as any).ibc.transfer.amount).toEqual({ denom: ORAI, amount: ibcTransferAmount });
    });

    it('cw-ics20-test-single-step-handle_ibc_packet_receive_native_remote_chain-has-relayer-fee-should-be-deducted', async () => {
      // setup relayer fee
      const relayerFee = '100000';
      await ics20Contract.updateConfig({ relayerFee: [{ prefix: 'tron-testnet', fee: relayerFee }] });

      const icsPackage: FungibleTokenPacketData = {
        amount: ibcTransferAmount,
        denom: airiIbcDenom,
        receiver: bobAddress,
        sender: oraibridgeSenderAddress,
        memo: `${channel}/${bobAddress}:orai`
      };
      // transfer from cosmos to oraichain, should pass
      let result = await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: relayerAddress
      });
      const hasRelayerFee = result.events.find(
        (event) =>
          event.type === 'wasm' &&
          event.attributes.find((attr) => attr.key === 'to' && attr.value === relayerAddress) &&
          event.attributes.find((attr) => attr.key === 'amount' && attr.value === relayerFee)
      );
      expect(hasRelayerFee).not.toBeUndefined();
      expect(
        result.attributes.find((attr) => attr.key === 'relayer_fee' && attr.value === relayerFee)
      ).not.toBeUndefined();
    });

    it.each<[string, string]>([
      [`${channel}/${bobAddress}:orai`, '20000000'],
      [`${bobAddress}:orai`, '10000000']
    ])(
      'cw-ics20-test-single-step-ibc-handle_ibc_packet_receive_native_remote_chain-has-token-fee-should-be-deducted',
      async (memo, expectedTokenFee) => {
        // setup relayer fee
        await ics20Contract.updateConfig({
          tokenFee: [{ token_denom: airiIbcDenom, ratio: { nominator: 1, denominator: 10 } }]
        });

        const icsPackage: FungibleTokenPacketData = {
          amount: ibcTransferAmount,
          denom: airiIbcDenom,
          receiver: bobAddress,
          sender: oraibridgeSenderAddress,
          memo
        };
        // transfer from cosmos to oraichain, should pass
        let result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: relayerAddress
        });
        const hasTokenFee = result.events.filter(
          (event) =>
            event.type === 'wasm' && event.attributes.find((attr) => attr.key === 'to' && attr.value === senderAddress)
        );
        expect(hasTokenFee).not.toBeUndefined();
        expect(result.attributes.find((attr) => attr.key === 'token_fee' && expectedTokenFee)).not.toBeUndefined();
      }
    );

    it.each<[string, string, string]>([
      [`${channel}/${bobAddress}:orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu`, '20000000', '100000'],
      [`${channel}/${bridgeReceiver}:orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu`, '20000000', '200000'], // double deducted when there's an outgoing ibc msg after receiving the packet
      [`${bobAddress}:orai`, '10000000', '100000']
    ])(
      'test-handle_ibc_packet_receive_native_remote_chain-has-both-token-fee-and-relayer-fee-should-be-both-deducted-given memo %s should give expected token fee %s and expected relayer fee %s',
      async (memo, expectedTokenFee, expectedRelayerFee) => {
        // setup relayer fee
        const relayerFee = '100000';
        await ics20Contract.updateConfig({
          tokenFee: [
            { token_denom: airiIbcDenom, ratio: { nominator: 1, denominator: 10 } },
            { token_denom: 'orai', ratio: { nominator: 1, denominator: 10 } }
          ],
          relayerFee: [{ prefix: 'tron-testnet', fee: relayerFee }]
        });

        const icsPackage: FungibleTokenPacketData = {
          amount: ibcTransferAmount,
          denom: airiIbcDenom,
          receiver: bobAddress,
          sender: oraibridgeSenderAddress,
          memo
        };
        // transfer from cosmos to oraichain, should pass
        let result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: relayerAddress
        });
        console.dir(result, { depth: null });
        const hasRelayerFee = result.events.find(
          (event) =>
            event.type === 'wasm' &&
            event.attributes.find((attr) => attr.key === 'to' && attr.value === relayerAddress) &&
            event.attributes.find((attr) => attr.key === 'amount' && attr.value === expectedRelayerFee)
        );
        expect(hasRelayerFee).not.toBeUndefined();
        expect(
          result.attributes.find((attr) => attr.key === 'relayer_fee' && attr.value === expectedRelayerFee)
        ).not.toBeUndefined();

        const hasTokenFee = result.events.find(
          (event) =>
            event.type === 'wasm' &&
            event.attributes.find((attr) => attr.key === 'to' && attr.value === senderAddress) &&
            event.attributes.find((attr) => attr.key === 'amount' && attr.value === expectedTokenFee)
        );
        expect(hasTokenFee).not.toBeUndefined();
        expect(
          result.attributes.find((attr) => attr.key === 'token_fee' && attr.value === expectedTokenFee)
        ).not.toBeUndefined();
      }
    );

    it.each<[string, string, string, string, string]>([
      [ibcTransferAmount, ibcTransferAmount, '10000000', '90000000', ibcTransferAmount]
    ])(
      'cw-ics20-test-single-step-handle_ibc_packet_receive_native_remote_chain-deducted-amount-is-zero-should-still-charge-fees',
      async (transferAmount, relayerFee, expectedTokenFee, expectedRelayerFee, expectedTotalFee) => {
        await ics20Contract.updateConfig({
          tokenFee: [{ token_denom: airiIbcDenom, ratio: { nominator: 1, denominator: 10 } }],
          relayerFee: [{ prefix: 'tron-testnet', fee: relayerFee }]
        });

        const icsPackage: FungibleTokenPacketData = {
          amount: transferAmount,
          denom: airiIbcDenom,
          receiver: bobAddress,
          sender: oraibridgeSenderAddress,
          memo: `${bobAddress}:orai`
        };
        // transfer from cosmos to oraichain, should pass
        let result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: relayerAddress
        });

        const hasFees = result.events.find(
          (event) =>
            event.type === 'wasm' &&
            assertKeyValue(event, 'to', senderAddress) &&
            assertKeyValue(event, 'amount', expectedTotalFee)
        );
        console.dir(result, { depth: null });
        expect(hasFees).not.toBeUndefined();
        expect(
          result.attributes.find((attr) => attr.key === 'token_fee' && attr.value === expectedTokenFee)
        ).not.toBeUndefined();
        expect(
          result.attributes.find((attr) => attr.key === 'relayer_fee' && attr.value === expectedRelayerFee)
        ).not.toBeUndefined();
      }
    );

    // execute transfer to remote test cases
    it('test-execute_transfer_back_to_remote_chain-native-FAILED-no-funds-sent', async () => {
      oraiClient.app.bank.setBalance(senderAddress, coins(initialBalanceAmount, ORAI));
      try {
        await ics20Contract.transferToRemote(
          {
            localChannelId: '1',
            memo: null,
            remoteAddress: 'a',
            remoteDenom: 'a',
            timeout: 60
          },
          'auto',
          null
        );
      } catch (error) {
        expect(error.toString()).toContain('No funds sent');
      }
    });

    it('test-execute_transfer_back_to_remote_chain-native-FAILED-no-mapping-found', async () => {
      oraiClient.app.bank.setBalance(senderAddress, coins(initialBalanceAmount, ORAI));
      try {
        await ics20Contract.transferToRemote(
          {
            localChannelId: '1',
            memo: null,
            remoteAddress: 'a',
            remoteDenom: 'a',
            timeout: 60
          },
          'auto',
          null,
          [{ denom: ORAI, amount: '100' }]
        );
      } catch (error) {
        expect(error.toString()).toContain('Could not find the mapping pair');
      }
    });

    it('test-execute_transfer_back_to_remote_chain-native-FAILED-no-mapping-found', async () => {
      oraiClient.app.bank.setBalance(senderAddress, coins(initialBalanceAmount, ORAI));
      try {
        await ics20Contract.transferToRemote(
          {
            localChannelId: '1',
            memo: null,
            remoteAddress: 'a',
            remoteDenom: 'a',
            timeout: 60
          },
          'auto',
          null,
          [{ denom: ORAI, amount: '100' }]
        );
      } catch (error) {
        expect(error.toString()).toContain('Could not find the mapping pair');
      }
    });
  });
});
