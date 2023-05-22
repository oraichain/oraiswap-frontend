import { TokenItemType, cosmosTokens } from './bridgeTokens';
import { ORAI } from './constants';
import { AssetInfo, OraiswapFactoryQueryClient, OraiswapFactoryReadOnlyInterface, PairInfo } from 'libs/contracts';
import { parseAssetInfo } from 'helper';
import { Contract } from './contracts';
import { flatten, uniq } from 'lodash';
import { parseTokenInfo } from 'rest/api';

export type PairMapping = {
  asset_infos: [AssetInfo, AssetInfo];
};

export type TokensSwap = { [key: string]: TokenItemType };

export class Pairs {
  public static pairs: PairMapping[] = [
    {
      asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_AIRI_CONTRACT } }],
    },
    {
      asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_ORAIX_CONTRACT } }],
    },
    {
      asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_SCORAI_CONTRACT } }],
    },
    {
      asset_infos: [{ native_token: { denom: ORAI } }, { native_token: { denom: process.env.REACT_APP_ATOM_ORAICHAIN_DENOM } }],
    },
    {
      asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_USDT_CONTRACT } }],
    },
    {
      asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_KWT_CONTRACT } }],
    },
    {
      asset_infos: [{ native_token: { denom: ORAI } }, { native_token: { denom: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM } }],
    },
    {
      asset_infos: [{ token: { contract_addr: process.env.REACT_APP_MILKY_CONTRACT } }, { token: { contract_addr: process.env.REACT_APP_USDT_CONTRACT } }],
    },
    {
      asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_USDC_CONTRACT } }],
    },
    {
      asset_infos: [{ native_token: { denom: ORAI } }, { token: { contract_addr: process.env.REACT_APP_TRX_CONTRACT } }],
    }
  ];

  static poolTokens = cosmosTokens.filter(token => uniq(flatten(this.pairs.map(pair => pair.asset_infos))).includes(parseTokenInfo(token).info))

  static getAllPairs = async (factoryClient: OraiswapFactoryReadOnlyInterface): Promise<PairInfo[]> => {
    return (await factoryClient.pairs({})).pairs;
  };

  static getAllPairsFromTwoFactoryVersions = async (): Promise<PairInfo[]> => {
    const firstVersionAllPairs = await this.getAllPairs(Contract.factory);
    const secondVersionAllPairs = await this.getAllPairs(Contract.factory_v2);
    return flatten([firstVersionAllPairs, secondVersionAllPairs]);
  }

  static getStakingAssetInfo = (assetInfos: AssetInfo[]): AssetInfo => {
    return parseAssetInfo(assetInfos[0]) === ORAI ? assetInfos[1] : assetInfos[0];
  }
}
