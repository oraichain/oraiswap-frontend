import { AssetInfo } from '@oraichain/oraidex-contracts-sdk';
import { Bar as BarType } from 'charting_library';

export type Bar = BarType & {
  ticker?: string;
};

export type PairMapping = {
  asset_infos: [AssetInfo, AssetInfo];
  symbols: [string, string];
  denoms?: [string, string];
};
