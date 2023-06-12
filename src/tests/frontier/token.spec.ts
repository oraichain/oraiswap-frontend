// import { addPairAndLpToken, msgsTextProposal, deployCw20Token, getPairAndLpAddress } from 'libs/frontier/token';
import { toAmount } from 'libs/utils';
import { deployOraiDexContracts } from 'tests/listing-simulate';
import { network } from 'config/networks';
import { CODE_ID_CW20 } from 'config/constants';
import { generateMsgFrontierAddToken, getInfoLiquidityPool } from 'pages/Pools/helpers';

describe('frontier-cw20-token', () => {
  const marketing = {
    description: null,
    logo: null,
    marketing: null,
    project: null
  };
  const tokenName = 'BabyMario';
  const name = '';
  const isNewReward = [
    {
      name: 'orai',
      denom: 'orai',
      value: BigInt(1e6),
      contract_addr: ''
    }
  ];

  const mint = {
    minter: 'orai12zyu8w93h0q2lcnt50g3fn0w3yqnhy4fvawaqz',
    cap: '100000000000000'
  };

  const initBalances = [
    {
      address: 'orai12zyu8w93h0q2lcnt50g3fn0w3yqnhy4fvawaqz',
      amount: BigInt(1e6)
    }
  ];

  it('msgs-list-token', async () => {
    const initialBalances = initBalances.map((e) => ({ ...e, amount: e?.amount.toString() }));
    const liquidityPoolRewardAssets = isNewReward.map((isReward) => {
      return {
        amount: isReward?.value.toString(),
        info: getInfoLiquidityPool(isReward)
      };
    });

    const msgs = await generateMsgFrontierAddToken({
      marketing,
      symbol: tokenName,
      liquidityPoolRewardAssets,
      name,
      initialBalances,
      mint
    });

    expect(msgs && typeof msgs === 'object').toBe(true);
    expect(msgs).toHaveProperty('marketing');
    expect(msgs).toHaveProperty('symbol');
    expect(msgs).toHaveProperty('mint');
    expect(msgs).toHaveProperty('name');
    expect(msgs).toHaveProperty('initialBalances');
    expect(Array.isArray(msgs.initialBalances)).toBe(true);
    expect(Array.isArray(msgs.liquidityPoolRewardAssets)).toBe(true);
  });

  // beforeAll(async () => {
  //   const { factory, tokenCodeId } = await deployOraiDexContracts();
  //   factoryContract = factory;
  //   codeId = tokenCodeId;
  // });

  // it('deploy-cw20-token', async () => {
  //   cw20ContractAddress = await deployCw20Token({
  //     tokenSymbol,
  //     client,
  //     address: senderAddress,
  //     codeId
  //   });
  //   expect(typeof cw20ContractAddress).toBe('string');
  // });

  // it('add-pair-and-lp-token', async () => {
  //   const res = await addPairAndLpToken({
  //     cw20ContractAddress,
  //     factory: factoryContract,
  //     client,
  //     address: senderAddress
  //   });

  //   if (res.logs?.length) {
  //     const { pairAddress, lpAddress } = getPairAndLpAddress(res);
  //     pairAddressSimulate = pairAddress;
  //     lpAddressSimulate = lpAddress;
  //   } else {
  //     const wasmAttributes = res?.events.find((event) => {
  //       return event.type === 'wasm' && event.attributes.find((attr) => attr.key === 'liquidity_token_address');
  //     })?.attributes;
  //     pairAddressSimulate = wasmAttributes?.find((attr) => attr.key === 'pair_contract_address')?.value;
  //     lpAddressSimulate = wasmAttributes?.find((attr) => attr.key === 'liquidity_token_address')?.value;
  //   }
  //   expect(typeof pairAddressSimulate).toBe('string');
  //   expect(typeof lpAddressSimulate).toBe('string');
  // });

  // it('msgs-create-text-proposal', async () => {
  //   const msgs = await msgsTextProposal({
  //     cw20ContractAddress,
  //     lpAddress: lpAddressSimulate,
  //     address: senderAddress,
  //     rewardPerSecondOrai,
  //     rewardPerSecondOraiX
  //   });

  //   expect(msgs && typeof msgs === 'object').toBe(true);
  //   expect(msgs).toHaveProperty('typeUrl');
  //   expect(msgs).toHaveProperty('value');
  //   expect(typeof msgs.value === 'object').toBe(true);
  //   expect(msgs.value).toHaveProperty('content');
  //   expect(msgs.value).toHaveProperty('proposer');
  //   expect(msgs.value).toHaveProperty('initialDeposit');
  // });
});
