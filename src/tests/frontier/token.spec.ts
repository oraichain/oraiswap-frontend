import { addPairAndLpToken, msgsTextProposal, deployCw20Token, getPairAndLpAddress } from 'libs/frontier/token';
import { toAmount } from 'libs/utils';
import { client, deployOraiDexContracts } from 'tests/listing-simulate';
import { network } from 'config/networks';
import { CODE_ID_CW20 } from 'config/constants';

describe('frontier-cw20-token', () => {
  let cw20ContractAddress = null;
  let codeId = CODE_ID_CW20;
  let pairAddressSimulate = null;
  let lpAddressSimulate = null;
  let factoryContract = '';

  const senderAddress = 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g';
  const tokenSymbol = 'TokenTest';
  const rewardPerSecondOrai = toAmount(1e6);
  const rewardPerSecondOraiX = toAmount(1e6);

  beforeAll(async () => {
    const { factory, tokenCodeId } = await deployOraiDexContracts();
    factoryContract = factory;
    codeId = tokenCodeId;
  });

  it('deploy-cw20-token', async () => {
    cw20ContractAddress = await deployCw20Token({
      tokenSymbol,
      client,
      address: senderAddress,
      codeId
    });
    expect(typeof cw20ContractAddress).toBe('string');
  });

  it('add-pair-and-lp-token', async () => {
    const res = await addPairAndLpToken({
      cw20ContractAddress,
      factory: factoryContract,
      client,
      address: senderAddress
    });

    if (res.logs?.length) {
      const { pairAddress, lpAddress } = getPairAndLpAddress(res);
      pairAddressSimulate = pairAddress;
      lpAddressSimulate = lpAddress;
    } else {
      const wasmAttributes = res?.events.find((event) => {
        return event.type === 'wasm' && event.attributes.find((attr) => attr.key === 'liquidity_token_address');
      })?.attributes;
      pairAddressSimulate = wasmAttributes?.find((attr) => attr.key === '_contract_addr')?.value;
      lpAddressSimulate = wasmAttributes?.find((attr) => attr.key === 'liquidity_token_address')?.value;
    }
    expect(typeof pairAddressSimulate).toBe('string');
    expect(typeof lpAddressSimulate).toBe('string');
  });

  it('msgs-create-text-proposal', async () => {
    const msgs = await msgsTextProposal({
      cw20ContractAddress,
      lpAddress: lpAddressSimulate,
      address: senderAddress,
      rewardPerSecondOrai,
      rewardPerSecondOraiX
    });

    expect(msgs && typeof msgs === 'object').toBe(true);
    expect(msgs).toHaveProperty('typeUrl');
    expect(msgs).toHaveProperty('value');
    expect(typeof msgs.value === 'object').toBe(true);
    expect(msgs.value).toHaveProperty('content');
    expect(msgs.value).toHaveProperty('proposer');
    expect(msgs.value).toHaveProperty('initialDeposit');
  });
});
