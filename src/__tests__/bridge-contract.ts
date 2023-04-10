import { AppResponse, CWSimulateApp, IbcOrder, SimulateCosmWasmClient } from '@terran-one/cw-simulate';
import * as CwIcs20LatestTypes from 'libs/contracts/CwIcs20Latest.types';
import bech32 from 'bech32';
import path from 'path';
import { toBinary } from '@cosmjs/cosmwasm-stargate';
import { FungibleTokenPacketData } from 'libs/proto/ibc/applications/transfer/v2/packet';
import { CwIcs20LatestClient } from 'libs/contracts/CwIcs20Latest.client';
import { Asset, TransferBackMsg } from 'libs/contracts/types';
import { Coin, coins } from '@cosmjs/proto-signing';
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
const routerContractAddress = 'placeholder'; // we will update the contract config later when we need to deploy the actual router contract
const cosmosSenderAddress = bech32.encode(cosmosChain.bech32Prefix, bech32.decode(oraiSenderAddress).words);
const ibcTransferAmount = '100000000';
const initialBalanceAmount = '10000000000000';

describe.only('IBCModule', () => {
  let oraiPort: string;
  let oraiIbcDenom: string = 'oraib0xA325Ad6D9c92B55A3Fc5aD7e412B1518F96441C0';
  let airiIbcDenom: string = 'oraib0x7e2A35C746F2f7C240B664F1Da4DD100141AE71F';
  let cosmosPort: string = 'transfer';
  let channel = 'channel-0';
  let ics20Contract: CwIcs20LatestClient;
  let airiToken: OraiswapTokenClient;
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
      path.join(__dirname, 'testdata', 'cw-ics20-latest.wasm'),
      {
        allowlist: [],
        default_timeout: 3600,
        gov_contract: oraiSenderAddress, // mulitsig contract
        swap_router_contract: routerContractAddress
      },
      'cw-ics20'
    );

    oraiPort = 'wasm.' + contractAddress;
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
    oraiClient.app.ibc.relay('channel-0', oraiPort, 'channel-0', cosmosPort, cosmosChain);
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
            channel_id: 'channel-0'
          },
          endpoint: {
            port_id: cosmosPort,
            channel_id: 'channel-0'
          },
          order: IbcOrder.Unordered,
          version: 'ics20-1',
          connection_id: 'connection-0'
        },
        counterparty_version: 'ics20-1'
      }
    });
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
          contract_addr: 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu' // has to hard-code address due to jest issue: https://github.com/facebook/jest/issues/6888
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
          contract_addr: 'orai18cvw806fj5n7xxz06ak8vjunveeks4zzzn37cu' // has to hard-code address due to jest issue: https://github.com/facebook/jest/issues/6888
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
          localChannelId: 'channel-0'
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
          src: {
            port_id: cosmosPort,
            channel_id: 'channel-0'
          },
          dest: {
            port_id: oraiPort,
            channel_id: 'channel-0'
          },
          sequence: 27,
          timeout: {
            block: {
              revision: 1,
              height: 12345678
            }
          }
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
      localChannelId: 'channel-0'
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
        src: {
          port_id: cosmosPort,
          channel_id: 'channel-0'
        },
        dest: {
          port_id: oraiPort,
          channel_id: 'channel-0'
        },
        sequence: 27,
        timeout: {
          block: {
            revision: 1,
            height: 12345678
          }
        }
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
      expect(error).toEqual(new Error('Insufficient funds to redeem voucher on channel'));
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
      localChannelId: 'channel-0'
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
        src: {
          port_id: cosmosPort,
          channel_id: 'channel-0'
        },
        dest: {
          port_id: oraiPort,
          channel_id: 'channel-0'
        },
        sequence: 27,
        timeout: {
          block: {
            revision: 1,
            height: 12345678
          }
        }
      },
      relayer: cosmosSenderAddress
    });

    // try to send back to cosmos from oraichain, which will pass
    cosmosChain.ibc.addMiddleWare((msg, app) => {
      console.log('handle midle ware for ibc', msg, app);
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
        localChannelId: 'channel-0'
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
          src: {
            port_id: cosmosPort,
            channel_id: 'channel-0'
          },
          dest: {
            port_id: oraiPort,
            channel_id: 'channel-0'
          },
          sequence: 27,
          timeout: {
            block: {
              revision: 1,
              height: 12345678
            }
          }
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
    beforeEach(async () => {
      // upload pair & lp token code id
      const { codeId: pairCodeId } = await oraiClient.upload(
        oraiSenderAddress,
        readFileSync(path.join(__dirname, 'wasm/oraiswap_pair.wasm')),
        'auto'
      );
      const { codeId: lpCodeId } = await oraiClient.upload(
        oraiSenderAddress,
        readFileSync(path.join(__dirname, 'wasm/oraiswap_token.wasm')),
        'auto'
      );
      // deploy oracle addr
      const { contractAddress: oracleAddress } = await oraiClient.deploy<OraiswapOracleIsntantiateMsg>(
        oraiSenderAddress,
        path.join(__dirname, 'wasm/oraiswap_oracle.wasm'),
        {},
        'oraiswap-oracle'
      );
      // deploy factory contract
      const { contractAddress: factoryAddress } = await oraiClient.deploy<OraiswapFactoryInstantiateMsg>(
        oraiSenderAddress,
        path.join(__dirname, 'wasm/oraiswap_factory.wasm'),
        {
          commission_rate: null,
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
          factory_addr_v2: ''
        },
        'oraiswap-router'
      );
      factoryContract = new OraiswapFactoryClient(oraiClient, oraiSenderAddress, factoryAddress);
      routerContract = new OraiswapRouterClient(oraiClient, oraiSenderAddress, routerAddress);
    });
  });
});
