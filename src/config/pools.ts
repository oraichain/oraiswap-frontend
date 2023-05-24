import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { parseAssetInfo } from 'helper';
import { AssetInfo, MulticallReadOnlyInterface, PairInfo } from 'libs/contracts';
import { flatten, uniq } from 'lodash';
import { TokenItemType, assetInfoMap } from './bridgeTokens';
import { ORAI } from './constants';
import { Contract } from './contracts';

export type PairMapping = {
  asset_infos: [AssetInfo, AssetInfo];
};

export type TokensSwap = { [key: string]: TokenItemType };

export class Pairs {
  public static pairs: PairMapping[] = [
    {
      asset_infos: [
        { native_token: { denom: ORAI } },
        { token: { contract_addr: process.env.REACT_APP_AIRI_CONTRACT } }
      ]
    },
    {
      asset_infos: [
        { native_token: { denom: ORAI } },
        { token: { contract_addr: process.env.REACT_APP_ORAIX_CONTRACT } }
      ]
    },
    {
      asset_infos: [
        { native_token: { denom: ORAI } },
        { token: { contract_addr: process.env.REACT_APP_SCORAI_CONTRACT } }
      ]
    },
    {
      asset_infos: [
        { native_token: { denom: ORAI } },
        { native_token: { denom: process.env.REACT_APP_ATOM_ORAICHAIN_DENOM } }
      ]
    },
    {
      asset_infos: [
        { native_token: { denom: ORAI } },
        { token: { contract_addr: process.env.REACT_APP_USDT_CONTRACT } }
      ]
    },
    {
      asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_KWT_CONTRACT } }]
    },
    {
      asset_infos: [
        { native_token: { denom: ORAI } },
        { native_token: { denom: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM } }
      ]
    },
    {
      asset_infos: [
        { token: { contract_addr: process.env.REACT_APP_MILKY_CONTRACT } },
        { token: { contract_addr: process.env.REACT_APP_USDT_CONTRACT } }
      ]
    },
    {
      asset_infos: [
        { native_token: { denom: ORAI } },
        { token: { contract_addr: process.env.REACT_APP_USDC_CONTRACT } }
      ]
    },
    {
      asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_TRX_CONTRACT } }]
    }
  ];

  // TODO: add test cases for this object
  static poolTokens = uniq(flatten(this.pairs.map(pair => pair.asset_infos)).map(info => assetInfoMap[parseAssetInfo(info)]));

  // TODO: add test cases for this function
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
    console.dir(
      results.return_data.map((data) => fromBinary(data.data)),
      { depth: null }
    );
    return results.return_data.map((data) => fromBinary(data.data));
  };

  // TODO: add test cases for this function
  static processFetchedAllPairInfos = (pairs: PairInfo[]): PairInfo[] => {
    return pairs.map(pair => {
      let firstInfoIndex = 0;
      let secondInfoIndex = 1;
      // we reverse the pair because the main asset info is not USDT, but the other token
      if (parseAssetInfo(pair.asset_infos[0]) === process.env.REACT_APP_USDT_CONTRACT) {
        firstInfoIndex = 1;
        secondInfoIndex = 0;
      }
      const { asset_infos } = pair;
      return { ...pair, asset_infos: [asset_infos[firstInfoIndex], asset_infos[secondInfoIndex]], asset_infos_raw: [parseAssetInfo(asset_infos[firstInfoIndex]), parseAssetInfo(asset_infos[secondInfoIndex])] };
    })
  }

  // TODO: add test cases for this function
  static getAllPairsFromTwoFactoryVersions = async (): Promise<PairInfo[]> => {
    const firstVersionWhiteListPairs = this.pairs.filter((pair) =>
      pair.asset_infos.some((info) => assetInfoMap[parseAssetInfo(info)]?.factoryV1)
    );
    const secondVersionWhiteListPairs = this.pairs.filter((pair) => !firstVersionWhiteListPairs.includes(pair));
    const [firstVersionAllPairs, secondVersionAllPairs] = await Promise.all([
      this.getAllPairs(firstVersionWhiteListPairs, Contract.factory.contractAddress, Contract.multicall),
      this.getAllPairs(secondVersionWhiteListPairs, Contract.factory_v2.contractAddress, Contract.multicall)
    ]);
    return this.processFetchedAllPairInfos([...firstVersionAllPairs, ...secondVersionAllPairs]);
  };

  static getStakingAssetInfo = (assetInfos: AssetInfo[]): AssetInfo => {
    return parseAssetInfo(assetInfos[0]) === ORAI ? assetInfos[1] : assetInfos[0];
  };
}
