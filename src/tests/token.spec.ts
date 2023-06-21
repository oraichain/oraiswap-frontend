import { client } from './common';
import { OraiswapTokenQueryClient, OraiswapTokenTypes } from '@oraichain/oraidex-contracts-sdk';
import * as oraidexArtifacts from '@oraichain/oraidex-contracts-build';

describe('token', () => {
  let senderAddress = 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g';
  let airiContractAddress = '';

  beforeAll(async () => {
    // init airi token
    const initAiriRes = await oraidexArtifacts.deployContract(
      client,
      senderAddress,

      {
        decimals: 6,
        symbol: 'AIRI',
        name: 'Airight token',
        initial_balances: [{ address: senderAddress, amount: '1000000000' }]
      } as OraiswapTokenTypes.InstantiateMsg,
      'token',
      'oraiswap_token'
    );
    airiContractAddress = initAiriRes.contractAddress;
  });

  it('balance airi token', async () => {
    const airiToken = new OraiswapTokenQueryClient(client, airiContractAddress);
    const balanceRes = await airiToken.balance({ address: senderAddress });

    expect(balanceRes.balance).toBe('1000000000');
  });
});
