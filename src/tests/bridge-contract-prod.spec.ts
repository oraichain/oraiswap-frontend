import { SimulateCosmWasmClient } from '@oraichain/cw-simulate';
import { CwIcs20LatestClient } from '@oraichain/common-contracts-sdk';
import * as commonArtifacts from '@oraichain/common-contracts-build';
import { readFileSync } from 'fs';
import { ORAI } from 'config/constants';
import { senderAddress } from './common';
import ics20Data from './testdata/ics20-prod-state.json';

const client = new SimulateCosmWasmClient({
  chainId: 'Oraichain',
  bech32Prefix: ORAI,
  metering: true
});

describe.only('IBCModule', () => {
  const admin = 'orai1fs25usz65tsryf0f8d5cpfmqgr0xwup4kjqpa0';
  const ics20Contract = new CwIcs20LatestClient(client, senderAddress, process.env.REACT_APP_IBC_WASM_CONTRACT);
  beforeEach(async () => {
    const { codeId } = await client.upload(
      senderAddress,
      readFileSync(commonArtifacts.getContractDir('cw-ics20-latest')),
      'auto'
    );
    await client.loadContract(
      process.env.REACT_APP_IBC_WASM_CONTRACT,
      { codeId, label: 'CW20-ICS20 contract for IBC Wasm"', admin, created: 1, creator: senderAddress },
      ics20Data
    );
  });

  it('loading-success', async () => {
    expect(await ics20Contract.listChannels()).toMatchObject({
      channels: [
        {
          id: 'channel-29',
          counterparty_endpoint: { port_id: 'transfer', channel_id: 'channel-1' },
          connection_id: 'connection-38'
        },
        {
          id: 'channel-30',
          counterparty_endpoint: { port_id: 'transfer', channel_id: 'channel-2' },
          connection_id: 'connection-38'
        }
      ]
    });
  });
});
