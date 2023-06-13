import { ORAI } from 'config/constants';
import { generateMsgFrontierAddToken, getInfoLiquidityPool } from 'pages/Pools/helpers';

describe('frontier-cw20-token', () => {
  const marketing = {
    description: null,
    logo: null,
    marketing: null,
    project: null
  };
  const tokenName = 'BabyMario';
  const name = 'test';
  const label = 'label';
  const isNewReward = [
    {
      name: 'orai',
      denom: 'orai',
      value: BigInt(1e6),
      contract_addr: ''
    },
    {
      name: 'milky',
      denom: 'milky',
      value: BigInt(1e6),
      contract_addr: process.env.REACT_APP_MILKY_CONTRACT
    }
  ];

  const mint = {
    minter: 'orai12zyu8w93h0q2lcnt50g3fn0w3yqnhy4fvawaqz',
    cap: BigInt(0).toString()
  };

  const initBalances = [
    {
      address: 'orai12zyu8w93h0q2lcnt50g3fn0w3yqnhy4fvawaqz',
      amount: BigInt(1e6)
    }
  ];

  let liquidityPoolRewardAssets = [];
  let initialBalances = [];

  it('get-info-native-token-liquidity-pool', async () => {
    const nativeTokenInfo = getInfoLiquidityPool({ denom: ORAI, contract_addr: '' });
    expect(typeof nativeTokenInfo === 'object').toBe(true);
    expect(nativeTokenInfo).toHaveProperty('native_token');
    expect(nativeTokenInfo).toEqual({
      native_token: {
        denom: ORAI
      }
    });
  });

  it('get-info-cw20-token-liquidity-pool', async () => {
    const cw20TokenInfo = getInfoLiquidityPool({
      denom: 'milky',
      contract_addr: process.env.REACT_APP_AIRI_CONTRACT
    });
    expect(typeof cw20TokenInfo === 'object').toBe(true);
    expect(cw20TokenInfo).toHaveProperty('token');
    expect(cw20TokenInfo).toEqual({
      token: {
        contract_addr: process.env.REACT_APP_AIRI_CONTRACT
      }
    });
  });

  it('get-init-balances', async () => {
    initialBalances = initBalances.map((e) => ({ ...e, amount: e?.amount.toString() }));
    expect(Array.isArray(initialBalances)).toBe(true);
    for (const info of initialBalances) {
      expect(info.amount).toBe(initBalances[0]?.amount.toString());
    }
  });

  it('get-liquidity-pool-reward-assets', async () => {
    liquidityPoolRewardAssets = isNewReward.map((isReward) => {
      return {
        amount: isReward?.value.toString(),
        info: getInfoLiquidityPool(isReward)
      };
    });
    expect(Array.isArray(liquidityPoolRewardAssets)).toBe(true);
    for (const liquidity of liquidityPoolRewardAssets) {
      expect(liquidity.amount).toBe(isNewReward[0]?.value.toString());
      if (liquidity.info.native_token) {
        expect(liquidity.info).toEqual({
          native_token: {
            denom: ORAI
          }
        });
      }
      if (liquidity.info.token) {
        expect(liquidity.info).toEqual({
          token: {
            contract_addr: process.env.REACT_APP_MILKY_CONTRACT
          }
        });
      }
    }
  });

  it('msgs-list-token', async () => {
    const msgs = await generateMsgFrontierAddToken({
      marketing,
      symbol: tokenName,
      liquidityPoolRewardAssets,
      name,
      initialBalances,
      mint,
      label
    });
    expect(typeof msgs === 'object').toBe(true);
    expect(msgs).toHaveProperty('marketing');
    expect(msgs).toHaveProperty('symbol');
    expect(msgs).toHaveProperty('label');
    expect(msgs).toHaveProperty('mint');
    expect(msgs).toHaveProperty('name');
    expect(msgs).toHaveProperty('initialBalances');
    expect(Array.isArray(msgs.initialBalances)).toBe(true);
    expect(Array.isArray(msgs.liquidityPoolRewardAssets)).toBe(true);
  });
});
