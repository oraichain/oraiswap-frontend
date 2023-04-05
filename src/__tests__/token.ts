import { readFileSync } from 'fs';
import path from 'path';
import { SimulateCosmWasmClient } from '@terran-one/cw-simulate';
import { InstantiateMsg as OraiswapInstantiateMsg } from 'libs/contracts/OraiswapToken.types';
import { Contract } from 'config/contracts';

describe('token', () => {
  let senderAddress = 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g';
  let airiContractAddress = '';
  const client = new SimulateCosmWasmClient({
    chainId: 'Oraichain',
    bech32Prefix: 'orai'
  });
  // for Contract singleton
  Contract.client = client;

  beforeAll(async () => {
    // init airi token
    const wasmBytecode = readFileSync(path.resolve(__dirname, 'testdata', 'oraiswap_token.wasm'));

    const { codeId } = await client.upload(senderAddress, wasmBytecode, 'auto');
    const initAiriRes = await client.instantiate(
      senderAddress,
      codeId,
      {
        decimals: 6,
        symbol: 'AIRI',
        name: 'Airight token',
        initial_balances: [{ address: senderAddress, amount: '1000000000' }]
      } as OraiswapInstantiateMsg,
      'token',
      'auto'
    );
    airiContractAddress = initAiriRes.contractAddress;
  });

  it('balance airi token', async () => {
    const airiToken = Contract.token(airiContractAddress);
    const balanceRes = await airiToken.balance({ address: senderAddress });

    expect(balanceRes.balance).toBe('1000000000');
  });
});
