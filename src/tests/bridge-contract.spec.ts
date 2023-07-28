import { toBinary } from '@cosmjs/cosmwasm-stargate';
import { Coin, coins } from '@cosmjs/proto-signing';
import { CWSimulateApp, GenericError, IbcOrder, IbcPacket, SimulateCosmWasmClient } from '@oraichain/cw-simulate';
import { Ok } from 'ts-results';
import bech32 from 'bech32';
import { readFileSync } from 'fs';
import {
  AssetInfo,
  OraiswapFactoryClient,
  OraiswapRouterClient,
  OraiswapTokenClient,
  OraiswapPairClient,
  OraiswapOracleClient
} from '@oraichain/oraidex-contracts-sdk';
import { CwIcs20LatestClient, TransferBackMsg } from '@oraichain/common-contracts-sdk';
import * as oraidexArtifacts from '@oraichain/oraidex-contracts-build';
import { FungibleTokenPacketData } from 'libs/proto/ibc/applications/transfer/v2/packet';
import { deployIcs20Token, deployToken, senderAddress as oraiSenderAddress, senderAddress } from './common';
import { oraib2oraichain } from 'config/ibcInfos';
import { ORAI } from 'config/constants';

let cosmosChain: CWSimulateApp;
// oraichain support cosmwasm
let oraiClient: SimulateCosmWasmClient;

const bobAddress = 'orai1ur2vsjrjarygawpdwtqteaazfchvw4fg6uql76';
const bridgeReceiver = 'tron-testnet0x3C5C6b570C1DA469E8B24A2E8Ed33c278bDA3222';
const routerContractAddress = 'placeholder'; // we will update the contract config later when we need to deploy the actual router contract
const cosmosSenderAddress = bech32.encode('cosmos', bech32.decode(oraiSenderAddress).words);
const oraibridgeSenderAddress = bech32.encode('oraib', bech32.decode(oraiSenderAddress).words);
console.log({ cosmosSenderAddress });
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
      bech32Prefix: ORAI
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
      relayer: cosmosSenderAddress
    });

    const transferBackMsg: TransferBackMsg = {
      local_channel_id: channel,
      remote_address: cosmosSenderAddress,
      remote_denom: airiIbcDenom
    };
    console.log({ transferBackMsg, ibcTransferAmount });
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
      // here, ratio is 1:1 => 1 AIRI = 1 ORAI
      oraiClient.app.bank.setBalance(firstPairInfo.contract_addr, coins(initialBalanceAmount, ORAI));
      airiToken.mint({ amount: initialBalanceAmount, recipient: firstPairInfo.contract_addr });
      oraiClient.app.bank.setBalance(secondPairInfo.contract_addr, coins(initialBalanceAmount, ORAI));
      usdtToken.mint({ amount: initialBalanceAmount, recipient: secondPairInfo.contract_addr });
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
      console.log('result: ', result);

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
      console.log({ simulateResult });
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
        expect(bobBalance[0].denom).toEqual(ORAI);
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
          relayer: cosmosSenderAddress
        });
        const ibcEvent = result.events.find(
          (event) => event.type === 'transfer' && event.attributes.find((attr) => attr.key === 'channel')
        );
        // get swap operation event
        expect(ibcEvent).toBeUndefined();
        console.log('result: ', result);
        const ibcErrorMsg = result.attributes.find(
          (attr) =>
            attr.key === 'ibc_error_msg' &&
            attr.value === 'Generic error: The destination info is neither evm or cosmos based'
        );
        expect(ibcErrorMsg).not.toBeUndefined();
      }
    );

    it.each([
      [channel, 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g', 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu'], // edge case, dest denom is also airi
      [channel, 'cosmos1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejl67nlm', 'orai1n6fwuamldz6mv5f3qwe9296pudjjemhmkfcgc3'], // hard-coded usdt
      [channel, 'cosmos1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejl67nlm', ORAI]
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
        let result = await cosmosChain.ibc.sendPacketReceive({
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

        // pass 1 day with 86_400 seconds
        cosmosChain.store.tx((setter) => Ok(setter('time')(cosmosChain.time + 86_400 * 1e9)));

        // transfer from cosmos to oraichain, should pass
        result = await cosmosChain.ibc.sendPacketReceive({
          packet: {
            data: toBinary(icsPackage),
            ...packetData
          },
          relayer: cosmosSenderAddress
        });
        // expect(
        //   flatten(result.events.map((e) => e.attributes)).find((a) => a.key === 'error_follow_up_msgs').value
        // ).toContain('Generic error: timeout at');
      }
    );

    it('cw-ics20-test-single-step-ibc-msg-map-with-fee-denom-orai-and-airi-destination-denom-should-swap-normally', async () => {
      await ics20Contract.updateMappingPair({
        assetInfo: {
          native_token: {
            denom: ORAI
          }
        },
        assetInfoDecimals: 6,
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
        relayer: cosmosSenderAddress
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
        assetInfo: {
          native_token: {
            denom: ORAI
          }
        },
        assetInfoDecimals: 6,
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
        relayer: cosmosSenderAddress
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

    it('cw-ics20-test-single-step-ibc-msg-map-with-fee-denom-orai-and-orai-destination-denom-with-dest-channel-should-do-ibctransfer', async () => {
      await ics20Contract.updateMappingPair({
        assetInfo: {
          native_token: {
            denom: ORAI
          }
        },
        assetInfoDecimals: 6,
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
        memo: `${channel}/${bobAddress}:orai`
      };
      // transfer from cosmos to oraichain, should pass
      let result = await cosmosChain.ibc.sendPacketReceive({
        packet: {
          data: toBinary(icsPackage),
          ...packetData
        },
        relayer: cosmosSenderAddress
      });
      const transferEvent = result.events.find((event) => event.type === 'transfer');
      console.log(JSON.stringify(transferEvent));
      expect(
        transferEvent.attributes.filter((attr) => attr.key === 'recipient' && attr.value === bobAddress).length
      ).toBeGreaterThan(0);
      expect(
        transferEvent.attributes.filter((attr) => attr.key === 'amount' && attr.value === `${ibcTransferAmount}orai`)
          .length
      ).toBeGreaterThan(0);
      expect(
        transferEvent.attributes.filter((attr) => attr.key === 'channel' && attr.value === channel).length
      ).toBeGreaterThan(0);
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
        relayer: cosmosSenderAddress
      });
      const hasRelayerFee = result.events.find(
        (event) =>
          event.type === 'wasm' &&
          event.attributes.find((attr) => attr.key === 'to' && attr.value === senderAddress) &&
          event.attributes.find((attr) => attr.key === 'amount' && attr.value === relayerFee)
      );
      expect(hasRelayerFee).not.toBeUndefined();
      expect(
        result.attributes.find((attr) => attr.key === 'relayer_fee' && attr.value === relayerFee)
      ).not.toBeUndefined();
    });

    it('cw-ics20-test-single-step-ibc-handle_ibc_packet_receive_native_remote_chain-has-token-fee-should-be-deducted', async () => {
      // setup relayer fee
      const numberator = 1;
      const denominator = 10;
      const tokenFee = ((parseInt(ibcTransferAmount) * numberator) / denominator).toString();
      await ics20Contract.updateConfig({
        tokenFee: [{ token_denom: airiIbcDenom, ratio: { numerator: 1, denominator: 10 } }]
      });

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
        relayer: cosmosSenderAddress
      });
      const hasTokenFee = result.events.find(
        (event) =>
          event.type === 'wasm' &&
          event.attributes.find((attr) => attr.key === 'to' && attr.value === senderAddress) &&
          event.attributes.find((attr) => attr.key === 'amount' && attr.value === tokenFee)
      );
      expect(hasTokenFee).not.toBeUndefined();
      expect(result.attributes.find((attr) => attr.key === 'token_fee' && attr.value === tokenFee)).not.toBeUndefined();
    });

    it('cw-ics20-test-single-step-handle_ibc_packet_receive_native_remote_chain-has-both-token-fee-and-relayer-fee-should-be-both-deducted', async () => {
      // setup relayer fee
      const relayerFee = '100000';
      const numberator = 1;
      const denominator = 10;
      const tokenFee = ((parseInt(ibcTransferAmount) * numberator) / denominator).toString();
      await ics20Contract.updateConfig({
        tokenFee: [{ token_denom: airiIbcDenom, ratio: { numerator: 1, denominator: 10 } }],
        relayerFee: [{ prefix: 'tron-testnet', fee: relayerFee }]
      });

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
        relayer: cosmosSenderAddress
      });
      const hasRelayerFee = result.events.find(
        (event) =>
          event.type === 'wasm' &&
          event.attributes.find((attr) => attr.key === 'to' && attr.value === senderAddress) &&
          event.attributes.find((attr) => attr.key === 'amount' && attr.value === relayerFee)
      );
      expect(hasRelayerFee).not.toBeUndefined();
      expect(
        result.attributes.find((attr) => attr.key === 'relayer_fee' && attr.value === relayerFee)
      ).not.toBeUndefined();

      const hasTokenFee = result.events.find(
        (event) =>
          event.type === 'wasm' &&
          event.attributes.find((attr) => attr.key === 'to' && attr.value === senderAddress) &&
          event.attributes.find((attr) => attr.key === 'amount' && attr.value === tokenFee)
      );
      expect(hasTokenFee).not.toBeUndefined();
      expect(result.attributes.find((attr) => attr.key === 'token_fee' && attr.value === tokenFee)).not.toBeUndefined();
    });
  });
});
