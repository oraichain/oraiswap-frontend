import { coin } from '@cosmjs/proto-signing';
import { MulticallQueryClient } from '@oraichain/common-contracts-sdk';
import { AggregateResult } from '@oraichain/common-contracts-sdk/build/Multicall.types';
import {
  ORAI,
  TokenItemType,
  USDT_CONTRACT,
  buildMultipleExecuteMessages,
  parseAssetInfo
} from '@oraichain/oraidex-common';
import { AssetInfo, OraiswapStakingTypes, OraiswapTokenClient, PairInfo } from '@oraichain/oraidex-contracts-sdk';
import { assetInfoMap, flattenTokens, oraichainTokens, tokenMap } from 'config/bridgeTokens';
import { network } from 'config/networks';
import { Pairs } from 'config/pools';
import sumBy from 'lodash/sumBy';
import { estimateShare, formatDisplayUsdt, toFixedIfNecessary } from 'pages/Pools/helpers';
import { fetchPairsData, toPairDetails } from 'pages/Pools/hooks/usePair';
import { ProvideQuery, Type, fetchTokenInfos, generateContractMessages } from 'rest/api';
import { PairInfoExtend, TokenInfo } from 'types/token';
import { client } from './common';
import {
  addLiquidity,
  addPairAndLpToken,
  constants,
  deployOraiDexContracts,
  getPairs,
  instantiateCw20Token
} from './listing-simulate';
import { PairInfoDataLegacy, testConverToPairsDetailData } from './testdata/test-data-pool';

/**
 * We use 2 pairs: ORAI/AIRI & ORAI/USDT for all test below.
 */
describe.skip('pool', () => {
  let usdtContractAddress = '',
    airiContractAddress = '';
  let pairsData: PairDetails;
  let pairInfos: PairInfoDataLegacy[] = [];
  let pairs: PairInfoExtend[];
  const prices = {
    'oraichain-token': 3.93,
    oraidex: 0.01004476,
    tether: 1,
    airight: 0.00283
  };
  const { devAddress } = constants;

  beforeAll(async () => {
    // deploy factory, multicall, staking contract.
    const { factory, tokenCodeId, multicall, staking } = await deployOraiDexContracts();

    // update simulate contract for network
    network.factory = factory;
    network.factory_v2 = factory;
    network.multicall = multicall;
    network.staking = staking;

    airiContractAddress = await instantiateCw20Token('airi', tokenCodeId);
    usdtContractAddress = await instantiateCw20Token('usdt', tokenCodeId);

    assetInfoMap[airiContractAddress] = tokenMap['airi'];
    assetInfoMap[usdtContractAddress] = tokenMap['usdt'];

    /// set balance for native token orai - atom
    client.app.bank.setBalance(devAddress, [
      coin(constants.devInitialBalances, constants.oraiDenom),
      coin(constants.devInitialBalances, constants.atomDenom)
    ]);

    /// add new pair: orai-airi, orai-usdt
    await addPairAndLpToken(network.factory, airiContractAddress, staking);
    await addPairAndLpToken(network.factory, usdtContractAddress, staking);
    const listPairs = await getPairs(network.factory);

    // update config pairs to test
    Pairs.pairs = listPairs.pairs.map((pair) => ({ asset_infos: pair.asset_infos }));
    pairs = listPairs.pairs.map((pair) => ({
      ...pair,
      asset_infos_raw: [parseAssetInfo(pair.asset_infos[0]), parseAssetInfo(pair.asset_infos[1])]
    })) as PairInfoExtend[];

    /// increase allowance for airi
    const airiContract = new OraiswapTokenClient(client, devAddress, airiContractAddress);
    await airiContract.increaseAllowance({
      amount: constants.devInitialBalances,
      spender: listPairs.pairs[0].contract_addr
    });

    /// increase allowance for usdt
    const usdtContract = new OraiswapTokenClient(client, devAddress, usdtContractAddress);
    await usdtContract.increaseAllowance({
      amount: constants.devInitialBalances,
      spender: listPairs.pairs[1].contract_addr
    });

    /// add liquidity for pair orai-usdt
    await addLiquidity(listPairs.pairs[1]);
  });

  describe('get info liquidity pool, pair', () => {
    let allTokenAssetInfos: OraiswapStakingTypes.PoolInfoResponse[] = [];
    let allLpTokenInfos: TokenInfo[] = [];
    let allRewardPerSec: OraiswapStakingTypes.RewardsPerSecResponse[] = [];

    const fromTokenInfo = oraichainTokens.find((t) => t.name === 'ORAI' && t.decimals === 6);
    const usdtTokenInfo = oraichainTokens.find(
      (t) => t.name === 'USDT' && t.decimals === 6 && t.chainId === 'Oraichain'
    );
    const airiTokenInfo = oraichainTokens.find(
      (t) => t.name === 'AIRI' && t.decimals === 6 && t.chainId === 'Oraichain'
    );
    usdtTokenInfo.contractAddress = usdtContractAddress;
    airiTokenInfo.contractAddress = airiContractAddress;

    beforeAll(async () => {
      pairs = await Pairs.getAllPairsFromTwoFactoryVersions();
    });

    it('should fetch pairs data correctly', async () => {
      const multicall = new MulticallQueryClient(client, network.multicall);
      const { pairDetails } = await fetchPairsData(pairs, multicall);
      pairsData = { ...pairDetails };
      expect(pairsData[pairs[0].contract_addr].total_share).toBe('0');
      expect(pairsData[pairs[0].contract_addr].assets[0].info).toEqual({
        native_token: {
          denom: ORAI
        }
      });
      expect(pairsData[pairs[0].contract_addr].assets[1].info).toEqual({
        token: {
          contract_addr: airiContractAddress
        }
      });
      expect(pairsData[pairs[1].contract_addr].assets[1].info).toEqual({
        token: {
          contract_addr: usdtContractAddress
        }
      });
      expect(pairsData[pairs[1].contract_addr].total_share).toBe(constants.amountProvideLiquidity);
    });

    it.each(testConverToPairsDetailData)(
      'should caculate my reward info',
      (aggregateRes: AggregateResult, expectedPairsDetail) => {
        const pairsDetail = toPairDetails(pairs, aggregateRes);
        expect(Object.values(pairsDetail)).toEqual(expectedPairsDetail);
      }
    );

    describe('fetch apr', () => {
      it('should fetch LP token infos with multicall correctly', async () => {
        const lpTokens = pairs.map((p) => ({ contractAddress: p.liquidity_token } as TokenItemType));
        allLpTokenInfos = await fetchTokenInfos(lpTokens);
        // expect LP token contract address and total supply is correctly
        expect(allLpTokenInfos[0].contractAddress).toBe(pairs[0].liquidity_token);
        expect(allLpTokenInfos[1].contractAddress).toBe(pairs[1].liquidity_token);
        expect(allLpTokenInfos[0].total_supply).toBe('0');
        expect(allLpTokenInfos[1].total_supply).toBe('10000000');
      });
    });

    it('should total liquidity correctly', () => {
      const totalAmount = sumBy(pairInfos, (c) => c.amount);
      expect(totalAmount).toBe(20); // 10 + 10 when provide liquidity orai - usdt
    });
  });

  describe('add & withdraw liquidity', () => {
    it('should generate contract messages correcty when add & withdraw liquidity pool ', async () => {
      const [amount1, amount2] = [100, 100];
      const [token1InfoData, token2InfoData] = [
        flattenTokens.find((t) => t.name === 'ORAI' && t.chainId === 'Oraichain'),
        flattenTokens.find((t) => t.name === 'USDT' && t.chainId === 'Oraichain')
      ];
      const msg = generateContractMessages({
        type: Type.PROVIDE,
        sender: devAddress,
        fromInfo: token1InfoData!,
        toInfo: token2InfoData!,
        fromAmount: amount1.toString(),
        toAmount: amount2.toString(),
        pair: pairs[0].contract_addr
      } as ProvideQuery);

      // check if the contract address, sent_funds and sender are correct
      expect(msg.contractAddress).toEqual(pairs[0].contract_addr);
      expect(msg.funds).toEqual([{ amount: '100', denom: ORAI }]);
      expect(msg).toHaveProperty('msg');

      const messages = buildMultipleExecuteMessages(msg);
      // check if the contract address, sent_funds and sender are correct
      expect(messages[0].contractAddress).toEqual(pairs[0].contract_addr);
      expect(messages[0]).toHaveProperty('funds');

      expect(messages[0].msg).toEqual({
        provide_liquidity: {
          assets: [
            { info: { token: { contract_addr: token2InfoData.contractAddress } }, amount: '100' },
            { info: { native_token: { denom: ORAI } }, amount: '100' }
          ]
        }
      });
    });
  });

  it('test Pairs getPoolTokens', () => {
    const poolTokens = Pairs.getPoolTokens();
    expect(Array.isArray(poolTokens)).toBe(true);
    expect(poolTokens.length).toBe(3);
    expect(poolTokens).toEqual([
      assetInfoMap[ORAI],
      assetInfoMap[airiContractAddress],
      assetInfoMap[usdtContractAddress]
    ]);
  });

  describe('test Pairs method', () => {
    let allPairs: PairInfo[] = [];

    it('test getAllPairs should have properties correctly', async () => {
      const multicall = new MulticallQueryClient(client, network.multicall);
      allPairs = await Pairs.getAllPairs(Pairs.pairs, network.factory_v2, multicall);
      for (const info of allPairs) {
        expect(info).toHaveProperty('asset_infos');
        expect(info).toHaveProperty('contract_addr');
        expect(info).toHaveProperty('liquidity_token');
        expect(info).toHaveProperty('oracle_addr');
        expect(info).toHaveProperty('commission_rate');
      }
    });

    it.each([
      [
        'have pair USDT/other-token should return asset info correctly',
        [
          {
            asset_infos: [
              {
                token: {
                  contract_addr: USDT_CONTRACT
                }
              },
              {
                token: {
                  contract_addr: 'other_contract_addr'
                }
              }
            ],
            contract_addr: 'contract_addr',
            liquidity_token: 'liquidity_token',
            oracle_addr: 'oracle_addr',
            commission_rate: '0.003'
          }
        ] as PairInfo[],
        [
          {
            token: {
              contract_addr: 'other_contract_addr'
            }
          },
          {
            token: {
              contract_addr: USDT_CONTRACT
            }
          }
        ] as AssetInfo[]
      ],
      [
        'dont have pair USDT/other-token',
        [
          {
            asset_infos: [
              {
                native_token: {
                  denom: ORAI
                }
              },
              {
                token: {
                  contract_addr: 'other_contract_addr'
                }
              }
            ],
            contract_addr: 'contract_addr',
            liquidity_token: 'liquidity_token',
            oracle_addr: 'oracle_addr',
            commission_rate: '0.003'
          }
        ] as PairInfo[],
        [
          {
            native_token: {
              denom: ORAI
            }
          },
          {
            token: {
              contract_addr: 'other_contract_addr'
            }
          }
        ]
      ]
    ])(
      'test processFetchedAllPairInfos that %s should return asset info correctly',
      (_name: string, input: PairInfo[], expectedAssetInfo: AssetInfo[]) => {
        const processedPairs = Pairs.processFetchedAllPairInfos(input);
        expect(processedPairs[0].asset_infos).toStrictEqual(expectedAssetInfo);
      }
    );

    it('test getAllPairsFromTwoFactoryVersions', async () => {
      const allPairsFromTwoFactoryVersions = await Pairs.getAllPairsFromTwoFactoryVersions();
      console.dir(allPairsFromTwoFactoryVersions, { depth: null });
      expect(allPairsFromTwoFactoryVersions.map((pair) => pair.asset_infos)).toEqual([
        [
          { native_token: { denom: ORAI } },
          {
            token: {
              contract_addr: airiContractAddress
            }
          }
        ],
        [
          { native_token: { denom: ORAI } },
          {
            token: {
              contract_addr: usdtContractAddress
            }
          }
        ]
      ]);
      expect(allPairsFromTwoFactoryVersions.map((pair) => pair.asset_infos_raw)).toEqual([
        [ORAI, airiContractAddress],
        [ORAI, usdtContractAddress]
      ]);
      expect(allPairsFromTwoFactoryVersions.length).toBe(Pairs.pairs.length);
    });
  });

  it.each([
    ['0.001234', '$0.0012'],
    ['2', '$2'],
    ['2.1', '$2.1'],
    ['2.129', '$2.13'],
    ['1234567', '$1,234,567'],
    ['1234567.111', '$1,234,567.11']
  ])('test formatDisplayUsdt should formats %s to %s', (input, expected) => {
    expect(formatDisplayUsdt(input)).toBe(expected);
  });

  it.each([
    ['2.12345', 2, 2.12],
    ['2.1', 2, 2.1],
    ['2', 2, 2],
    ['2.12345', 1, 2.1],
    ['2.129', 1, 2.1]
  ])('test toFixedIfNecessary should rounds %s to %d decimal places as %f', (value, dp, expected) => {
    expect(toFixedIfNecessary(value, dp)).toBeCloseTo(expected);
  });

  it.each<[number, number, number]>([
    [0, 1, 0],
    [1, 0, 0],
    [100, 500, 0.02]
  ])('test-estimateShare-should-return-correctly-share', (totalBaseAmount, totalQuoteAmount, expectedResult) => {
    // setup
    const payload = {
      baseAmount: 1,
      quoteAmount: 2,
      totalShare: 5,
      totalBaseAmount,
      totalQuoteAmount
    };

    // act
    const result = estimateShare(payload);

    // assertion
    expect(result).toEqual(expectedResult);

    // if totalShare is falsy
    payload.totalShare = NaN;
    expect(estimateShare(payload)).toEqual(0);
  });
});
