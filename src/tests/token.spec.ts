import { SimulateCosmWasmClient } from '@terran-one/cw-simulate';
import { Contract } from 'config/contracts';
import { OraiswapTokenClient } from 'libs/contracts/OraiswapToken.client';
import { deployToken } from './common';

describe('token', () => {
  let senderAddress = 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g';
  let airiToken: OraiswapTokenClient;
  const client = new SimulateCosmWasmClient({
    chainId: 'Oraichain',
    bech32Prefix: 'orai'
  });
  // for Contract singleton
  Contract.client = client;

  beforeAll(async () => {
    // init airi token
    airiToken = await deployToken(
      client,

      {
        decimals: 6,
        symbol: 'AIRI',
        name: 'Airight token'
      }
    );
  });

  it('balance airi token', async () => {
    const balanceRes = await airiToken.balance({ address: senderAddress });

    expect(balanceRes.balance).toBe('1000000000');
  });
});
