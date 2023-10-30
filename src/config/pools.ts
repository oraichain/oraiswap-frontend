import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { flatten, uniq } from 'lodash';
import { assetInfoMap } from './bridgeTokens';
import { INJECTIVE_CONTRACT, ORAI, PAIRS, TokenItemType, USDT_CONTRACT } from '@oraichain/oraidex-common';
import { MulticallQueryClient, MulticallReadOnlyInterface } from '@oraichain/common-contracts-sdk';
import { AssetInfo } from '@oraichain/common-contracts-sdk/build/CwIcs20Latest.types';

import { network } from './networks';
import { PairInfoExtend } from 'types/token';
import { PairInfo } from '@oraichain/oraidex-contracts-sdk';
import { parseAssetInfo } from '@oraichain/oraidex-common';

export type PairMapping = {
  asset_infos: [AssetInfo, AssetInfo];
  factoryV1?: boolean;
};

export type TokensSwap = { [key: string]: TokenItemType };

export class Pairs {
  public static pairs: PairMapping[] = PAIRS;

  public static getPoolTokens(): TokenItemType[] {
    return uniq(flatten(this.pairs.map((pair) => pair.asset_infos)).map((info) => assetInfoMap[parseAssetInfo(info)]));
  }

  static getAllPairs = async (
    pairs: PairMapping[],
    factoryAddress: string,
    multicall: MulticallReadOnlyInterface
  ): Promise<PairInfo[]> => {
    const results = await multicall.aggregate({
      queries: pairs.map((pair) => {
        return {
          address: factoryAddress,
          data: toBinary({
            pair: {
              asset_infos: pair.asset_infos
            }
          })
        };
      })
    });
    return results.return_data.map((data) => fromBinary(data.data));
  };

  /**
   *
   * @param pairs pairs info from contract
   * @returns pairs info after processed to have correctly index of asset info matched with list pairs of Pairs.pairs
   * note: this case use for pair that have USDT token with other token (example: USDT/MILKY should return MILKY/USDT)
   */
  static processFetchedAllPairInfos = (pairs: PairInfo[]): PairInfoExtend[] => {
    return pairs.map((pair) => {
      let firstInfoIndex = 0;
      let secondInfoIndex = 1;
      // we reverse the pair because the main asset info is not USDT, but the other token
      if (parseAssetInfo(pair.asset_infos[0]) === USDT_CONTRACT) {
        firstInfoIndex = 1;
        secondInfoIndex = 0;
      }
      const { asset_infos } = pair;
      return {
        ...pair,
        asset_infos: [asset_infos[firstInfoIndex], asset_infos[secondInfoIndex]],
        asset_infos_raw: [parseAssetInfo(asset_infos[firstInfoIndex]), parseAssetInfo(asset_infos[secondInfoIndex])]
      };
    });
  };

  static getAllPairsFromTwoFactoryVersions = async (
    multicallClient?: MulticallReadOnlyInterface
  ): Promise<PairInfoExtend[]> => {
    const firstVersionWhiteListPairs = this.pairs.filter((pair) => pair.factoryV1);
    const secondVersionWhiteListPairs = this.pairs.filter((pair) => !firstVersionWhiteListPairs.includes(pair));

    const multicall = multicallClient ? multicallClient : new MulticallQueryClient(window.client, network.multicall);
    const [firstVersionAllPairs, secondVersionAllPairs] = await Promise.all([
      this.getAllPairs(firstVersionWhiteListPairs, network.factory, multicall),
      this.getAllPairs(secondVersionWhiteListPairs, network.factory_v2, multicall)
    ]);
    return this.processFetchedAllPairInfos([...firstVersionAllPairs, ...secondVersionAllPairs]);
  };

  static getStakingAssetInfo = (assetInfos: AssetInfo[]): AssetInfo => {
    return parseAssetInfo(assetInfos[0]) === ORAI ? assetInfos[1] : assetInfos[0];
  };

  static getStakingInfoTokenItemTypeFromPairs = (pairs: PairInfo[]): TokenItemType[] => {
    return pairs.map((p) => assetInfoMap[parseAssetInfo(this.getStakingAssetInfo(p.asset_infos))]);
  };
}
