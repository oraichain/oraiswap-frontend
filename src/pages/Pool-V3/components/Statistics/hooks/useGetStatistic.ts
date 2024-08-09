import { TokenItemType } from '@oraichain/oraidex-common';
import { oraichainTokensWithIcon } from 'config/chainInfos';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import SingletonOraiswapV3, { poolKeyToString } from 'libs/contractSingleton';
import axios from 'rest/request';
import { extractAddress, TokenDataOnChain } from '../../PriceRangePlot/utils';
import { getIconPoolData, getTokenInfo } from 'pages/Pool-V3/helpers/format';

export interface PoolWithStringKey extends PoolStructure {
  poolKey: string;
}

export interface TimeData {
  timestamp: number;
  value: number;
}

export interface TokenStatsData {
  address: string;
  price: number;
  priceChange: number;
  volume24: number;
  tvl: number;
}

export interface PoolStatsData {
  poolAddress: string;
  tokenX: string;
  tokenY: string;
  fee: number;
  volume24: number;
  tvl: number;
  apy: number;
}

export interface PoolStructure {
  tokenX: string;
  tokenY: string;
  fee: bigint;
}
export interface SnapshotValueData {
  tokenBNFromBeginning: string;
  usdValue24: number;
}

export interface PoolSnapshot {
  timestamp: number;
  volumeX: SnapshotValueData;
  volumeY: SnapshotValueData;
  liquidityX: SnapshotValueData;
  liquidityY: SnapshotValueData;
  feeX: SnapshotValueData;
  feeY: SnapshotValueData;
}

export interface TokenPriceData {
  price: number;
}

export interface Token {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
  logoURI: string;
  balance?: bigint;
  coingeckoId?: string;
  isUnknown?: boolean;
}

export const getNetworkStats = async (): Promise<Record<string, PoolSnapshot[]>> => {
  const { data } = await axios.get<Record<string, PoolSnapshot[]>>(`https://api.oraidex.io/v1/pool-v3/status`);

  return data;
};

export const formatTokenList = (): Record<string, TokenItemType & Token> => {
  return oraichainTokensWithIcon.reduce((acc, cur) => {
    const key = extractAddress(cur);

    acc[key] = {
      ...cur,
      symbol: cur.name,
      address: key,
      decimals: cur.decimals,
      name: cur.name
    };

    return acc;
  }, {});
};

export const getPoolsFromAddresses = async (): Promise<PoolWithStringKey[]> => {
  const pools = await SingletonOraiswapV3.getPools();

  const poolWithStringKey: PoolWithStringKey[] = pools.map((pool) => {
    return {
      tokenX: pool.pool_key.token_x,
      tokenY: pool.pool_key.token_y,
      fee: BigInt(pool.pool_key.fee_tier.fee),
      poolKey: poolKeyToString(pool.pool_key)
    };
  });

  return poolWithStringKey;
};

export const getTokenDataByAddresses = async (tokens: string[], address?: string): Promise<Record<string, Token>> => {
  const tokenInfos: TokenDataOnChain[] = await SingletonOraiswapV3.getTokensInfo(tokens, address);

  const newTokens: Record<string, Token> = {};
  tokenInfos.forEach((token) => {
    newTokens[token.address] = {
      symbol: token.symbol ? (token.symbol as string) : 'UNKNOWN',
      address: token.address,
      name: token.name ? (token.name as string) : '',
      decimals: token.decimals,
      balance: token.balance,
      logoURI: '/unknownToken.svg',
      isUnknown: true
    };
  });
  return newTokens;
};

const useGetStatistic = () => {
  const { data: prices } = useCoinGeckoPrices();

  const getStats = async () => {
    try {
      // get pool data snapshoted
      const data = await getNetworkStats();

      // get all pool data aggregated
      const allPoolsData = await getPoolsFromAddresses(); // (Object.keys(data));

      // transform aggregated pool data to object: poolKey in string -> poolData
      const poolsDataObject: Record<string, PoolWithStringKey> = {};
      allPoolsData.forEach((pool) => {
        poolsDataObject[pool.poolKey.toString()] = pool;
      });

      // get all tokens we have
      const allTokens = formatTokenList();

      // prepare price for each tokens
      const preparedTokens: Record<string, Required<TokenItemType>> = {};
      Object.entries(allTokens).forEach(([key, val]) => {
        if (typeof val.coinGeckoId !== 'undefined') {
          preparedTokens[key] = val as Required<TokenItemType>;
        }
      });

      const volume24 = {
        value: 0,
        change: 0
      };
      const tvl24 = {
        value: 0,
        change: 0
      };
      const fees24 = {
        value: 0,
        change: 0
      };

      const tokensDataObject: Record<string, TokenStatsData> = {};
      let poolsData: PoolStatsData[] = [];

      const volumeForTimestamps: Record<string, number> = {};
      const liquidityForTimestamps: Record<string, number> = {};
      const feesForTimestamps: Record<string, number> = {};

      const lastTimestamp = Math.max(
        ...Object.values(data)
          .filter((snaps) => snaps.length > 0)
          .map((snaps) => +snaps[snaps.length - 1].timestamp)
      );

      Object.entries(data).forEach(([address, snapshots]) => {
        if (!poolsDataObject[address]) {
          return;
        }

        const tokenXId = allTokens?.[poolsDataObject[address].tokenX.toString()]?.coinGeckoId ?? '';

        const tokenYId = preparedTokens?.[poolsDataObject[address].tokenY.toString()]?.coinGeckoId ?? '';

        if (!tokensDataObject[poolsDataObject[address].tokenX.toString()]) {
          tokensDataObject[poolsDataObject[address].tokenX.toString()] = {
            address: poolsDataObject[address].tokenX,
            price: prices?.[tokenXId] ?? 0,
            volume24: 0,
            tvl: 0,
            priceChange: 0
          };
        }

        if (!tokensDataObject[poolsDataObject[address].tokenY.toString()]) {
          tokensDataObject[poolsDataObject[address].tokenY.toString()] = {
            address: poolsDataObject[address].tokenY,
            price: prices?.[tokenYId] ?? 0,
            volume24: 0,
            tvl: 0,
            priceChange: 0
          };
        }

        if (!snapshots.length) {
          poolsData.push({
            volume24: 0,
            tvl: 0,
            tokenX: poolsDataObject[address].tokenX,
            tokenY: poolsDataObject[address].tokenY,
            // TODO: hard code decimals
            fee: Number(poolsDataObject[address].fee),
            apy: 0, // TODO: calculate apy
            poolAddress: address
          });
          return;
        }

        const tokenX = allTokens[poolsDataObject[address].tokenX.toString()];
        const tokenY = allTokens[poolsDataObject[address].tokenY.toString()];

        const lastSnapshot = snapshots[snapshots.length - 1];

        tokensDataObject[tokenX.address.toString()].volume24 +=
          lastSnapshot.timestamp === lastTimestamp ? lastSnapshot.volumeX.usdValue24 : 0;
        tokensDataObject[tokenY.address.toString()].volume24 +=
          lastSnapshot.timestamp === lastTimestamp ? lastSnapshot.volumeY.usdValue24 : 0;
        tokensDataObject[tokenX.address.toString()].tvl += lastSnapshot.liquidityX.usdValue24;
        tokensDataObject[tokenY.address.toString()].tvl += lastSnapshot.liquidityY.usdValue24;

        poolsData.push({
          volume24:
            lastSnapshot.timestamp === lastTimestamp
              ? lastSnapshot.volumeX.usdValue24 + lastSnapshot.volumeY.usdValue24
              : 0,
          tvl:
            lastSnapshot.timestamp === lastTimestamp
              ? lastSnapshot.liquidityX.usdValue24 + lastSnapshot.liquidityY.usdValue24
              : 0,
          tokenX: poolsDataObject[address].tokenX,
          tokenY: poolsDataObject[address].tokenY,
          fee: Number(poolsDataObject[address].fee),
          apy: 0, // TODO: calculate apy
          poolAddress: address
        });

        snapshots.slice(-30).forEach((snapshot) => {
          const timestamp = snapshot.timestamp.toString();

          if (!volumeForTimestamps[timestamp]) {
            volumeForTimestamps[timestamp] = 0;
          }

          if (!liquidityForTimestamps[timestamp]) {
            liquidityForTimestamps[timestamp] = 0;
          }

          if (!feesForTimestamps[timestamp]) {
            feesForTimestamps[timestamp] = 0;
          }

          volumeForTimestamps[timestamp] += snapshot.volumeX.usdValue24 + snapshot.volumeY.usdValue24;
          liquidityForTimestamps[timestamp] += snapshot.liquidityX.usdValue24 + snapshot.liquidityY.usdValue24;
          feesForTimestamps[timestamp] += snapshot.feeX.usdValue24 + snapshot.feeY.usdValue24;
        });
      });

      const volumePlot: TimeData[] = Object.entries(volumeForTimestamps)
        .map(([timestamp, value]) => ({
          timestamp: +timestamp,
          value
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
      const liquidityPlot: TimeData[] = Object.entries(liquidityForTimestamps)
        .map(([timestamp, value]) => ({
          timestamp: +timestamp,
          value
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
      const feePlot: TimeData[] = Object.entries(feesForTimestamps)
        .map(([timestamp, value]) => ({
          timestamp: +timestamp,
          value
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      const tiersToOmit = [0.001, 0.003];

      poolsData = poolsData.filter((pool) => !tiersToOmit.includes(pool.fee));

      volume24.value = volumePlot.length ? volumePlot[volumePlot.length - 1].value : 0;
      tvl24.value = liquidityPlot.length ? liquidityPlot[liquidityPlot.length - 1].value : 0;
      fees24.value = feePlot.length ? feePlot[feePlot.length - 1].value : 0;

      const prevVolume24 = volumePlot.length > 1 ? volumePlot[volumePlot.length - 2].value : 0;
      const prevTvl24 = liquidityPlot.length > 1 ? liquidityPlot[liquidityPlot.length - 2].value : 0;
      const prevFees24 = feePlot.length > 1 ? feePlot[feePlot.length - 2].value : 0;

      volume24.change = ((volume24.value - prevVolume24) / prevVolume24) * 100;
      tvl24.change = ((tvl24.value - prevTvl24) / prevTvl24) * 100;
      fees24.change = ((fees24.value - prevFees24) / prevFees24) * 100;

      const fmtPoolData = poolsData.map((p) => {
        const iconsData = getIconPoolData(p.tokenX, p.tokenY, false);

        return {
          ...iconsData,
          ...p
        };
      });

      const fmtTokenData = Object.values(tokensDataObject).map((tk) => {
        const iconsData = getTokenInfo(tk.address, false);

        return {
          ...iconsData,
          ...tk
        };
      });

      return {
        volume24,
        tvl24,
        fees24,
        tokensData: fmtTokenData,
        poolsData: fmtPoolData,
        volumePlot,
        liquidityPlot
      };
    } catch (error) {
      console.log(error);

      return {
        volume24: {
          value: 0,
          change: 0
        },
        tvl24: {
          value: 0,
          change: 0
        },
        fees24: {
          value: 0,
          change: 0
        },
        tokensData: [],
        poolsData: [],
        volumePlot: [],
        liquidityPlot: []
      };
    }
  };

  return {
    getStats
  };
};

export default useGetStatistic;
