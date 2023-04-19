import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { coin } from '@cosmjs/proto-signing';
import { flattenTokens, TokenItemType, tokenMap } from 'config/bridgeTokens';
import { COMMISSION_RATE } from 'config/constants';
import { Pair } from 'config/pools';
import { MulticallQueryClient } from 'libs/contracts/Multicall.client';
import { PoolInfoResponse, QueryMsg as StakingQueryMsg } from 'libs/contracts/OraiswapStaking.types';
import { OraiswapTokenClient } from 'libs/contracts/OraiswapToken.client';
import { QueryMsg as TokenQueryMsg } from 'libs/contracts/OraiswapToken.types';
import { buildMultipleMessages, toAssetInfo, toDecimal, toDisplay, toTokenInfo } from 'libs/utils';
import { compact, sumBy } from 'lodash';
import {
  calculateAprResult,
  calculateReward,
  fetchPairInfoData,
  PairInfoData,
  toPairDetails
} from 'pages/Pools/helpers';
import { fetchPoolInfoAmount, generateContractMessages, parseTokenInfo, ProvideQuery, Type } from 'rest/api';
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

describe('pool', () => {
  let usdtContractAddress = '',
    airiContractAddress = '';
  let factoryContractAddress = '';
  let multicallContract = '';
  let stakingContract = '';
  let pairs: Pair[] = [];
  let pairsData: PairDetails;
  let multicallClient: MulticallQueryClient;
  let allTokenAssetInfos: PoolInfoResponse[] = [];
  let allLpTokenInfos: TokenInfo[] = [];
  let poolList: PairInfoData[] = [];
  let oraiPrice: number;
  const prices = {
    'oraichain-token': 3.93,
    oraidex: 0.01004476
  };
  const { devAddress } = constants;

  beforeAll(async () => {
    // deploy factory, multicall, staking contract.
    const { factory, tokenCodeId, multicall, staking } = await deployOraiDexContracts();
    factoryContractAddress = factory;
    multicallContract = multicall;
    stakingContract = staking;
    airiContractAddress = await instantiateCw20Token('airi', tokenCodeId);
    usdtContractAddress = await instantiateCw20Token('usdt', tokenCodeId);

    multicallClient = new MulticallQueryClient(client, multicallContract);

    /// set balance for native token orai - atom
    client.app.bank.setBalance(devAddress, [
      coin(constants.devInitialBalances, constants.oraiDenom),
      coin(constants.devInitialBalances, constants.atomDenom)
    ]);

    /// add new pair: orai-airi, orai-usdt
    await addPairAndLpToken(factoryContractAddress, airiContractAddress, stakingContract);
    await addPairAndLpToken(factoryContractAddress, usdtContractAddress, stakingContract);
    const listPairs = await getPairs(factoryContractAddress);

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
    it('should fetch pairs data correctly', async () => {
      const listPairs = await getPairs(factoryContractAddress);
      pairs = listPairs.pairs.map((pair, index) => {
        return {
          contract_addr: pair.contract_addr,
          asset_denoms: index === 0 ? ['orai', 'airi'] : ['orai', 'usdt'],
          liquidity_token: pair.liquidity_token,
          commission_rate: COMMISSION_RATE,
          token_asset: index === 0 ? 'airi' : 'usdt'
        };
      });
      const queries = listPairs.pairs.map((pair) => ({
        address: pair.contract_addr,
        data: toBinary({
          pool: {}
        })
      }));
      const res = await multicallClient.aggregate({ queries });
      pairsData = toPairDetails(res, pairs);
      expect(pairsData[pairs[0].contract_addr].assets[0].info).toEqual({ native_token: { denom: 'orai' } });
      expect(pairsData[pairs[0].contract_addr].assets[1].info).toEqual({
        token: { contract_addr: airiContractAddress }
      });
      expect(pairsData[pairs[0].contract_addr].total_share).toBe('0');
      expect(pairsData[pairs[1].contract_addr].assets[1].info).toEqual({
        token: { contract_addr: usdtContractAddress }
      });
      expect(pairsData[pairs[1].contract_addr].total_share).toBe(constants.amountProvideLiquidity);
    });

    it('should fetch my pairs data correctly', async () => {
      const queries = pairs.map((pair) => {
        const assetToken = tokenMap[pair.token_asset];
        assetToken.contractAddress = pair.token_asset === 'airi' ? airiContractAddress : usdtContractAddress;
        const { info: assetInfo } = parseTokenInfo(assetToken);
        return {
          address: stakingContract,
          data: toBinary({
            reward_info: {
              asset_info: assetInfo,
              staker_addr: devAddress
            }
          })
        };
      });

      const res = await multicallClient.aggregate({
        queries
      });
      const myPairs = calculateReward(res, pairs);
      expect(myPairs[pairs[0].contract_addr]).toBe(false);
      expect(myPairs[pairs[1].contract_addr]).toBe(false);
    });

    it('should fetch pool amount and pair info data correctly', async () => {
      const fromTokenInfo = flattenTokens.find((t) => t.name === 'ORAI' && t.decimals === 6);
      const toTokenInfo = flattenTokens.find((t) => t.name === 'USDT' && t.decimals === 6 && t.chainId === 'Oraichain');
      toTokenInfo.contractAddress = usdtContractAddress;
      const pollInfoAmount: PoolInfo = await fetchPoolInfoAmount(fromTokenInfo, toTokenInfo, pairs[1], pairsData);
      expect(pollInfoAmount.offerPoolAmount).toBe(10000000n);
      expect(pollInfoAmount.askPoolAmount).toBe(10000000n);

      const pairInfoData = await fetchPairInfoData(pairs[1], pairsData);
      expect(pairInfoData.amount).toBe(0);
      expect(JSON.stringify(pairInfoData.pair)).toBe(JSON.stringify(pairs[1]));
      expect(pairInfoData.commissionRate).toBe(COMMISSION_RATE);
      expect(pairInfoData.fromToken.name).toBe('ORAI');
      expect(pairInfoData.toToken.name).toBe('USDT');
    });

    it('should fetch orai price correctly', async () => {
      let poolList: PairInfoData[] = compact(await Promise.all(pairs.map((p) => fetchPairInfoData(p, pairsData))));
      const oraiUsdtPool = poolList.find((pool) => pool.fromToken.denom === 'orai' && pool.toToken.denom === 'usdt');
      oraiPrice = toDecimal(oraiUsdtPool.askPoolAmount, oraiUsdtPool.offerPoolAmount);
      expect(oraiPrice).toBe(1);
    });

    it('should fetch LP token infos with multicall correctly', async () => {
      const lpTokens = pairs.map((p) => ({ contractAddress: p.liquidity_token } as TokenItemType));

      const tokensContract = [airiContractAddress, usdtContractAddress];
      const queries = tokensContract.map((contractAddress) => ({
        address: contractAddress,
        data: toBinary({
          token_info: {}
        } as TokenQueryMsg)
      }));

      const res = await multicallClient.aggregate({
        queries
      });
      let ind = 0;
      allLpTokenInfos = lpTokens.map((t) =>
        toTokenInfo(t, t.contractAddress ? fromBinary(res.return_data[ind++].data) : undefined)
      );

      // expect LP token contract address is correctly
      expect(allLpTokenInfos[0].contractAddress).toBe(pairs[0].liquidity_token);
      expect(allLpTokenInfos[1].contractAddress).toBe(pairs[1].liquidity_token);
    });

    it('should fetch all token asset in pools correctly', async () => {
      const assetTokens = pairs.map((p: Pair) => {
        return {
          ...tokenMap[p.token_asset],
          contractAddress: p.token_asset === 'airi' ? airiContractAddress : usdtContractAddress
        };
      });

      const queries = assetTokens.map((token) => {
        return {
          address: stakingContract,
          data: toBinary({
            pool_info: {
              asset_info: toAssetInfo(token)
            }
          })
        };
      });

      const res = await multicallClient.aggregate({ queries });
      // aggregate no try
      allTokenAssetInfos = res.return_data.map((data) => fromBinary(data.data));

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
      expect(allTokenAssetInfos[0].staking_token).toBe(airiContractAddress);
      expect(allTokenAssetInfos[1].staking_token).toBe(usdtContractAddress);
    });

    it('should fetch all reward infos per second correctly', async () => {
      const assetTokens = pairs.map((p: Pair) => {
        return {
          ...tokenMap[p.token_asset],
          contractAddress: p.token_asset === 'airi' ? airiContractAddress : usdtContractAddress
        };
      });
      const queries = assetTokens.map((token) => {
        return {
          address: stakingContract,
          data: toBinary({
            rewards_per_sec: {
              asset_info: toAssetInfo(token)
            }
          } as StakingQueryMsg)
        };
      });
      poolList = compact(await Promise.all(pairs.map((p) => fetchPairInfoData(p, pairsData))));
      const res = await multicallClient.aggregate({ queries });
      const allRewardPerSec = res.return_data.map((data) => fromBinary(data.data));
      const aprResult = calculateAprResult(
        poolList,
        prices,
        allLpTokenInfos,
        allTokenAssetInfos,
        allRewardPerSec,
        pairs
      );
      expect(aprResult[pairs[0].contract_addr]).toBe(0);
      expect(aprResult[pairs[1].contract_addr]).toBe(0);
    });

    it('should total liquidity correctly', () => {
      poolList.forEach((pool) => {
        pool.amount = 2 * toDisplay(pool.offerPoolAmount, 6) * oraiPrice;
      });
      const totalAmount = sumBy(poolList, (c) => c.amount);
      console.log({ totalAmount });
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
        pair: pairs[0].contract_addr
      } as ProvideQuery);

      const msg = msgs[0];
      // check if the contract address, sent_funds and sender are correct
      expect(msg.contract).toEqual(pairs[0].contract_addr);
      expect(msg.sender).toEqual(devAddress);
      expect(msg.sent_funds).toEqual([{ denom: 'orai', amount: '100' }]);
      expect(msg).toHaveProperty('msg');

      const messages = buildMultipleMessages(msg, [], []);
      // check if the contract address, sent_funds and sender are correct
      expect(messages[0].contractAddress).toEqual(pairs[0].contract_addr);
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
