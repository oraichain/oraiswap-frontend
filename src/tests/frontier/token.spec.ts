import { AIRI_CONTRACT, MILKY_CONTRACT, ORAI } from '@oraichain/oraidex-common';
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
      contract_addr: MILKY_CONTRACT
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

  it.each([
    { denom: ORAI, contract_addr: '' },
    {
      denom: 'milky',
      contract_addr: AIRI_CONTRACT
    }
  ])('get-info-native-cw20-token-liquidity-pool', (item) => {
    const tokenInfo = getInfoLiquidityPool(item);
    expect(typeof tokenInfo === 'object').toBe(true);
    if (tokenInfo.native_token) {
      expect(tokenInfo).toEqual({
        native_token: {
          denom: item.denom
        }
      });
    }
    if (tokenInfo.token) {
      expect(tokenInfo).toEqual({
        token: {
          contract_addr: item.contract_addr
        }
      });
    }
  });

  it('get-init-balances', () => {
    initialBalances = initBalances.map((e) => ({ ...e, amount: e?.amount.toString() }));
    expect(Array.isArray(initialBalances)).toBe(true);
    for (const info of initialBalances) {
      expect(info.amount).toBe(initBalances[0]?.amount.toString());
    }
  });

  it('get-liquidity-pool-reward-assets', () => {
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
            contract_addr: MILKY_CONTRACT
          }
        });
      }
    }
  });

  it('msgs-list-token', () => {
    const msgs = generateMsgFrontierAddToken({
      marketing,
      symbol: tokenName,
      liquidityPoolRewardAssets,
      name,
      initialBalances,
      mint,
      label,
      pairAssetInfo: { native_token: { denom: 'foobar' } }
    });
    expect(typeof msgs === 'object').toBe(true);
    expect(msgs).toHaveProperty('marketing');
    expect(msgs).toHaveProperty('symbol');
    expect(msgs).toHaveProperty('label');
    expect(msgs).toHaveProperty('mint');
    expect(msgs).toHaveProperty('name');
    expect(msgs).toHaveProperty('initialBalances');
    expect(msgs).toHaveProperty('pairAssetInfo');
    expect(Array.isArray(msgs.initialBalances)).toBe(true);
    expect(Array.isArray(msgs.liquidityPoolRewardAssets)).toBe(true);
  });
});
