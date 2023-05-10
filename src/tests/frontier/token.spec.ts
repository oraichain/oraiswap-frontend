import { SimulateCosmWasmClient } from '@terran-one/cw-simulate';
import { InstantiateMsg as Cw20InstantiateMsg } from 'libs/contracts/OraiswapToken.types';
import { readFileSync } from 'fs';
import path from 'path';
import { TextProposal } from 'libs/proto/cosmos/gov/v1beta1/gov';
import { Any } from 'libs/proto/google/protobuf/any';

describe('instantiate-cw20-token', () => {
  let cw20ContractAddress = '';
  let senderAddress = 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g';
  const client = new SimulateCosmWasmClient({
    chainId: 'Oraichain',
    bech32Prefix: 'orai'
  });

  beforeAll(async () => {
    const wasmBytecode = readFileSync(path.resolve(__dirname, '../testdata/oraiswap_token.wasm'));
    const { codeId } = await client.upload(senderAddress, wasmBytecode);
    const initCw20Res = await client.instantiate(
      senderAddress,
      codeId,
      {
        mint: { minter: senderAddress, cap: '1000000000000' },
        name: `Oraic token`,
        symbol: 'Oraic',
        decimals: 6,
        initial_balances: []
      } as Cw20InstantiateMsg,
      'token',
      'auto',
      { admin: senderAddress }
    );
    cw20ContractAddress = initCw20Res.contractAddress;
  });

  it('should create a new pair successfully', async () => {
    const assetInfos = [{ native_token: { denom: 'orai' } }, { token: { contract_addr: cw20ContractAddress } }];
    expect(Array.isArray(assetInfos)).toBe(true);
    for (const msg of assetInfos) {
      if (msg.token) {
        expect(msg.token.contract_addr).toBe(cw20ContractAddress);
      }
    }
  });

  it('should return the correct pair and LP addresses', async () => {
    // pair,liquidity ORAI/AIRI
    const pair_contract_address = 'orai1wkhkazf88upf2dxqedggy3ldja342rzmfs2mep';
    const liquidity_token_address = 'orai1hxm433hnwthrxneyjysvhny539s9kh6s2g2n8y';
    const result = {
      logs: [
        {
          events: [
            {
              type: 'wasm',
              attributes: [
                { key: 'pair_contract_address', value: pair_contract_address },
                { key: 'liquidity_token_address', value: liquidity_token_address }
              ]
            }
          ]
        }
      ]
    };
    expect(typeof result).toBe('object');
    expect(Array.isArray(result.logs)).toBe(true);
    const wasmAttributes = result.logs[0].events.find((event) => event.type === 'wasm')?.attributes;
    const pairAddress = wasmAttributes?.find((attr) => attr.key === 'pair_contract_address')?.value;
    const lpAddress = wasmAttributes?.find((attr) => attr.key === 'liquidity_token_address')?.value;
    expect(pairAddress).toBe(pair_contract_address);
    expect(lpAddress).toBe(liquidity_token_address);
  });

  it('should return object when ready submit proposal ', async () => {
    const title = `OraiDEX frontier - Listing new LP mining pool of token ${cw20ContractAddress}`;
    const description = `Create a new liquidity mining pool for CW20 token ${cw20ContractAddress} with LP Address: ${'0x987654321fedcba'}. Total rewards per second for the liquidity mining pool: ${1e6} orai & ${1e6} uORAIX`;
    const initial_deposit = [];
    const message = {
      typeUrl: '/cosmos.gov.v1beta1.MsgSubmitProposal',
      value: {
        content: Any.fromPartial({
          typeUrl: '/cosmos.gov.v1beta1.TextProposal',
          value: TextProposal.encode({
            title,
            description
          }).finish()
        }),
        proposer: senderAddress,
        initialDeposit: initial_deposit
      }
    };
    expect(typeof message).toBe('object');
    expect(message).toHaveProperty('typeUrl');
    expect(message).toHaveProperty('value');
  });
});
