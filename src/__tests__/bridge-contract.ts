import { AppResponse, CWSimulateApp, IbcOrder, SimulateCosmWasmClient } from '@terran-one/cw-simulate';
import * as CwIcs20LatestTypes from 'libs/contracts/CwIcs20Latest.types';
import bech32 from 'bech32';
import { readFileSync } from 'fs';
import path from 'path';
import { toBinary } from '@cosmjs/cosmwasm-stargate';
import { FungibleTokenPacketData } from 'libs/proto/ibc/applications/transfer/v2/packet';
import { CwIcs20LatestClient } from 'libs/contracts/CwIcs20Latest.client';
import { coins } from '@cosmjs/proto-signing';

const cosmosChain = new CWSimulateApp({
  chainId: 'cosmoshub-4',
  bech32Prefix: 'cosmos'
});
// oraichain support cosmwasm
const oraiClient = new SimulateCosmWasmClient({
  chainId: 'Oraichain',
  bech32Prefix: 'orai'
});

const oraiSenderAddress = 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g';
const bobAddress = 'orai1ur2vsjrjarygawpdwtqteaazfchvw4fg6uql76';
const routerContractAddress = 'orai1x7s4a42y8scugcac5vj2zre96z86lhntq7qg23';
const cosmosSenderAddress = bech32.encode(cosmosChain.bech32Prefix, bech32.decode(oraiSenderAddress).words);
const oraiIbcDenom = 'A2E2EEC9057A4A1C2C0A6A4C78B0239118DF5F278830F50B4A6BDD7A66506B78';

describe.only('IBCModule', () => {
  let oraiPort: string;
  let cosmosPort: string = 'transfer';
  let ics20Contract: CwIcs20LatestClient;
  beforeEach(async () => {
    const { codeId } = await oraiClient.upload(
      oraiSenderAddress,
      readFileSync(path.join(__dirname, 'testdata', 'cw-ics20-latest.wasm')),
      'auto'
    );
    const { contractAddress } = await oraiClient.instantiate(
      oraiSenderAddress,

      codeId,
      {
        allowlist: [],
        default_timeout: 3600,
        gov_contract: oraiSenderAddress, // mulitsig contract
        swap_router_contract: routerContractAddress
      } as CwIcs20LatestTypes.InstantiateMsg,
      'cw-ics20',
      'auto'
    );

    oraiPort = 'wasm.' + contractAddress;
    ics20Contract = new CwIcs20LatestClient(oraiClient, oraiSenderAddress, contractAddress);
  });

  it('handle ibc', async () => {
    cosmosChain.ibc.relay('channel-0', oraiPort, oraiClient.app);

    await cosmosChain.ibc.sendChannelOpen({
      open_init: {
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

    // create mapping
    await ics20Contract.updateMappingPair({
      assetInfo: {
        native_token: {
          denom: 'orai'
        }
      },
      assetInfoDecimals: 6,
      denom: oraiIbcDenom,
      remoteDecimals: 6,
      localChannelId: 'channel-0'
    });

    // topup
    oraiClient.app.bank.setBalance(ics20Contract.contractAddress, coins('10000000000000', 'orai'));

    // now send ibc package
    const icsPackage: FungibleTokenPacketData = {
      amount: '100000000',
      denom: oraiIbcDenom,
      receiver: bobAddress,
      sender: cosmosSenderAddress,
      memo: ''
    };
    let packetReceiveRes = await cosmosChain.ibc.sendPacketReceive({
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

    const bobBalance = oraiClient.app.bank.getBalance(bobAddress);
    expect(bobBalance).toEqual(coins('100000000', 'orai'));
  });
});
