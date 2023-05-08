import { coin } from '@cosmjs/proto-signing';
import { flattenTokens, TokenItemType, tokenMap } from 'config/bridgeTokens';
import { COMMISSION_RATE } from 'config/constants';
import { Contract } from 'config/contracts';
import { network } from 'config/networks';
import { Pairs, Pair } from 'config/pools';
import { AggregateResult } from 'libs/contracts';
import { PoolInfoResponse, RewardsPerSecResponse } from 'libs/contracts/OraiswapStaking.types';
import { OraiswapTokenClient } from 'libs/contracts/OraiswapToken.client';
import { buildMultipleMessages } from 'libs/utils';
import compact from 'lodash/compact';
import sumBy from 'lodash/sumBy';
import {
  calculateAprResult,
  calculateReward,
  fetchCachedPairsData,
  fetchMyCachedPairsData,
  fetchPairInfoData,
  fetchPoolListAndOraiPrice,
  PairInfoData,
  toPairDetails
} from 'pages/Pools/helpers';
import {
  fetchAllRewardPerSecInfos,
  fetchAllTokenAssetPools,
  fetchPoolInfoAmount,
  fetchTokenInfos,
  generateContractMessages,
  ProvideQuery,
  Type
} from 'rest/api';
import { TokenInfo } from 'types/token';
import {
  addLiquidity,
  addPairAndLpToken,
  client,
  constants,
  deployOraiDexContracts,
  getPairs,
  instantiateCw20Token
} from './listing-simulate';
import { testCaculateRewardData, testConverToPairsDetailData } from './testdata/test-data-pool';

describe('pool', () => {
  let usdtContractAddress = '',
    airiContractAddress = '';
  let pairsData: PairDetails;
  let pairInfos: PairInfoData[] = [];
  let assetTokens = [];
  const prices = {
    'oraichain-token': 3.93,
    oraidex: 0.01004476
  };
  const { devAddress } = constants;

  beforeAll(async () => {
    Contract.client = client;
    // deploy factory, multicall, staking contract.
    const { factory, tokenCodeId, multicall, staking } = await deployOraiDexContracts();

    // update simulate contract for network
    network.factory = factory;
    network.multicall = multicall;
    network.staking = staking;

    airiContractAddress = await instantiateCw20Token('airi', tokenCodeId);
    usdtContractAddress = await instantiateCw20Token('usdt', tokenCodeId);

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
    Pairs.pairs = listPairs.pairs.map((pair, index) => {
      return {
        contract_addr: pair.contract_addr,
        asset_denoms: index === 0 ? ['orai', 'airi'] : ['orai', 'usdt'],
        liquidity_token: pair.liquidity_token,
        commission_rate: COMMISSION_RATE,
        token_asset: index === 0 ? 'airi' : 'usdt'
      };
    });

    assetTokens = Pairs.pairs.map((p: Pair) => {
      return {
        ...tokenMap[p.token_asset],
        contractAddress: p.token_asset === 'airi' ? airiContractAddress : usdtContractAddress
      };
    });

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
    let allTokenAssetInfos: PoolInfoResponse[] = [];
    let allLpTokenInfos: TokenInfo[] = [];
    let allRewardPerSec: RewardsPerSecResponse[] = [];

    const fromTokenInfo = flattenTokens.find((t) => t.name === 'ORAI' && t.decimals === 6);
    const usdtTokenInfo = flattenTokens.find((t) => t.name === 'USDT' && t.decimals === 6 && t.chainId === 'Oraichain');
    const airiTokenInfo = flattenTokens.find((t) => t.name === 'AIRI' && t.decimals === 6 && t.chainId === 'Oraichain');
    usdtTokenInfo.contractAddress = usdtContractAddress;
    airiTokenInfo.contractAddress = airiContractAddress;

    it('should fetch pairs data correctly', async () => {
      pairsData = await fetchCachedPairsData();
      console.log("pair data: ", pairsData)

      expect(pairsData[Pairs.pairs[0].contract_addr].total_share).toBe('0');
      expect(pairsData[Pairs.pairs[0].contract_addr].assets[0].info).toEqual({
        native_token: {
          denom: 'orai'
        }
      });
      expect(pairsData[Pairs.pairs[0].contract_addr].assets[1].info).toEqual({
        token: {
          contract_addr: airiContractAddress
        }
      });
      expect(pairsData[Pairs.pairs[1].contract_addr].assets[1].info).toEqual({
        token: {
          contract_addr: usdtContractAddress
        }
      });
      expect(pairsData[Pairs.pairs[1].contract_addr].total_share).toBe(constants.amountProvideLiquidity);
    });

    it('should fetch my pairs data correctly', async () => {
      // keep contractAddress of asset token.
      Pairs.pairs.forEach((pair) => {
        const assetToken = tokenMap[pair.token_asset];
        assetToken.contractAddress = pair.token_asset === 'airi' ? airiContractAddress : usdtContractAddress;
      });
      const myCachedPairs = await fetchMyCachedPairsData(devAddress);
      expect(myCachedPairs[Pairs.pairs[0].contract_addr]).toBe(true);
      expect(myCachedPairs[Pairs.pairs[1].contract_addr]).toBe(true);
    });

    it.each(testCaculateRewardData)(
      'should caculate my reward info',
      (aggregateRes: AggregateResult, expectedRewardInfo) => {
        const rewardInfo = calculateReward(aggregateRes);
        expect(Object.values(rewardInfo)).toEqual(expectedRewardInfo);
      }
    );

    it('should fetch pair info data correctly', async () => {
      const poolInfoAmount: PoolInfo = await fetchPoolInfoAmount(fromTokenInfo, usdtTokenInfo, pairsData);
      expect(poolInfoAmount.offerPoolAmount).toBe(10000000n);
      expect(poolInfoAmount.askPoolAmount).toBe(10000000n);

      const pairInfoData = await fetchPairInfoData(Pairs.pairs[1], pairsData);

      expect(pairInfoData.amount).toBe(0);
      expect(JSON.stringify(pairInfoData.pair)).toBe(JSON.stringify(Pairs.pairs[1]));
      expect(pairInfoData.commissionRate).toBe(COMMISSION_RATE);
      expect(pairInfoData.fromToken).toEqual(fromTokenInfo);
      expect(pairInfoData.toToken).toEqual(usdtTokenInfo);
    });

    it.each(testConverToPairsDetailData)(
      'should caculate my reward info',
      (aggregateRes: AggregateResult, expectedPairsDetail) => {
        const pairsDetail = toPairDetails(aggregateRes);
        expect(Object.values(pairsDetail)).toEqual(expectedPairsDetail);
      }
    );

    it('should fetch pool info amount and pool list infos, orai price correctly', async () => {
      const res = await fetchPoolListAndOraiPrice(pairsData);
      pairInfos = res.pairInfo;

      expect(res.pairInfo[0].offerPoolAmount).toEqual(10000000n);
      expect(res.pairInfo[0].askPoolAmount).toEqual(10000000n);
      expect(res.pairInfo[0].amount).toEqual(20);
      expect(JSON.stringify(res.pairInfo[0].fromToken)).toEqual(JSON.stringify(fromTokenInfo));
      expect(JSON.stringify(res.pairInfo[0].toToken)).toEqual(JSON.stringify(usdtTokenInfo));

      expect(res.pairInfo[1].offerPoolAmount).toEqual(0n);
      expect(res.pairInfo[1].askPoolAmount).toEqual(0n);
      expect(JSON.stringify(res.pairInfo[1].fromToken)).toEqual(JSON.stringify(fromTokenInfo));
      expect(JSON.stringify(res.pairInfo[1].toToken)).toEqual(JSON.stringify(airiTokenInfo));
      expect(res.pairInfo[0].commissionRate).toEqual(COMMISSION_RATE);

      expect(res.oraiPrice).toEqual(1);
    });

    describe('fetch apr', () => {
      it('should fetch LP token infos with multicall correctly', async () => {
        const lpTokens = Pairs.pairs.map((p) => ({ contractAddress: p.liquidity_token } as TokenItemType));
        allLpTokenInfos = await fetchTokenInfos(lpTokens);
        // expect LP token contract address and total supply is correctly
        expect(allLpTokenInfos[0].contractAddress).toBe(Pairs.pairs[0].liquidity_token);
        expect(allLpTokenInfos[1].contractAddress).toBe(Pairs.pairs[1].liquidity_token);
        expect(allLpTokenInfos[0].total_supply).toBe('0');
        expect(allLpTokenInfos[1].total_supply).toBe('10000000');
      });

      it('should fetch all token asset in pools correctly', async () => {
        allTokenAssetInfos = await fetchAllTokenAssetPools(assetTokens);
        // expect token asset info in pair has the required properties
        for (const info of allTokenAssetInfos) {
          expect(info).toHaveProperty('asset_info');
          expect(info).toHaveProperty('staking_token');
          expect(info).toHaveProperty('total_bond_amount');
          expect(info).toHaveProperty('reward_index');
          expect(info).toHaveProperty('pending_reward');
          expect(info).toHaveProperty('migration_index_snapshot');
          expect(info).toHaveProperty('migration_deprecated_staking_token');
        }
        expect(allTokenAssetInfos[0].staking_token).toBe(devAddress);
        expect(allTokenAssetInfos[1].staking_token).toBe(devAddress);
      });

      it('should fetch all reward infos per second correctly', async () => {
        allRewardPerSec = await fetchAllRewardPerSecInfos(assetTokens);
        expect(allRewardPerSec[0].assets).toEqual([
          { amount: constants.rewardPerSecAmount, info: { token: { contract_addr: airiContractAddress } } },
          { amount: constants.rewardPerSecAmount, info: { native_token: { denom: 'orai' } } }
        ]);
        expect(allRewardPerSec[1].assets).toEqual([
          {
            info: {
              token: { contract_addr: usdtContractAddress }
            },
            amount: constants.rewardPerSecAmount
          },
          { amount: constants.rewardPerSecAmount, info: { native_token: { denom: 'orai' } } }
        ]);
      });

      // it.each(testCaculateAprDatas)(
      //   'should fetch apr correctly',
      //   ({ poolList, allLpTokenInfos, allTokenAssetInfos, allRewardPerSec }) => {
      //     const aprResult = calculateAprResult(poolList, prices, allLpTokenInfos, allTokenAssetInfos, allRewardPerSec);
      //     console.log({ aprResult });
      //     // expect(something...)
      //   }
      // );

      it('should fetch apr correctly', () => {
        const aprResult = calculateAprResult(pairInfos, prices, allLpTokenInfos, allTokenAssetInfos, allRewardPerSec);
        expect(aprResult[Pairs.pairs[0].contract_addr]).toBe(0);
        expect(aprResult[Pairs.pairs[1].contract_addr]).toBe(6196.830196830198);
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
      const msgs = generateContractMessages({
        type: Type.PROVIDE,
        sender: devAddress,
        fromInfo: token1InfoData!,
        toInfo: token2InfoData!,
        fromAmount: amount1.toString(),
        toAmount: amount2.toString(),
        pair: Pairs.pairs[0].contract_addr
      } as ProvideQuery);

      const msg = msgs[0];
      // check if the contract address, sent_funds and sender are correct
      expect(msg.contract).toEqual(Pairs.pairs[0].contract_addr);
      expect(msg.sender).toEqual(devAddress);
      expect(msg.sent_funds).toEqual([{ denom: 'orai', amount: '100' }]);
      expect(msg).toHaveProperty('msg');

      const messages = buildMultipleMessages(msg, [], []);
      // check if the contract address, sent_funds and sender are correct
      expect(messages[0].contractAddress).toEqual(Pairs.pairs[0].contract_addr);
      expect(messages[0]).toHaveProperty('handleOptions');

      expect(JSON.parse(messages[0].handleMsg)).toEqual({
        provide_liquidity: {
          assets: [
            { info: { token: { contract_addr: token2InfoData.contractAddress } }, amount: '100' },
            { info: { native_token: { denom: 'orai' } }, amount: '100' }
          ]
        }
      });
    });
  });
});
