import { filteredTokens, TokenItemType } from './bridgeTokens';
import { ORAI, STABLE_DENOM } from './constants';

import _ from 'lodash';

export type Pair = {
  contract_addr: string;
  asset_denoms: [string, string];
  commission_rate: string;
};

export type TokensSwap = { [key: string]: TokenItemType };

export const pairs: Pair[] = [
  {
    contract_addr: 'orai1wkhkazf88upf2dxqedggy3ldja342rzmfs2mep',
    asset_denoms: [ORAI, 'airi'],
    commission_rate: '0.003'
  },
  {
    contract_addr: 'orai1m6q5k5nr2eh8q0rdrf57wr7phk7uvlpg7mwfv5',
    asset_denoms: [ORAI, 'oraix'],
    commission_rate: '0.003'
  },
  {
    contract_addr:
      'orai15aunrryk5yqsrgy0tvzpj7pupu62s0t2n09t0dscjgzaa27e44esefzgf8',
    asset_denoms: [ORAI, 'scorai'],
    commission_rate: '0.003'
  },
  {
    contract_addr: 'orai1jf74ry4m0jcy9emsaudkhe7vte9l8qy8enakvs',
    asset_denoms: [ORAI, process.env.REACT_APP_ATOM_ORAICHAIN_DENOM],
    commission_rate: '0.003'
  },
  {
    contract_addr: 'orai14lpk5gnmj688f957xvd6c42w9dygl9c2dlxjzw',
    asset_denoms: [ORAI, process.env.REACT_APP_UST_ORAICHAIN_DENOM],
    commission_rate: '0.003'
  },
  {
    contract_addr: 'orai1c5s03c3l336dgesne7dylnmhszw8554tsyy9yt',
    asset_denoms: [ORAI, STABLE_DENOM],
    commission_rate: '0.003'
  },
  {
    contract_addr: 'orai1ynmd2cemryhcwtjq3adhcwayrm89l2cr4tws4v',
    asset_denoms: [ORAI, 'kwt'],
    commission_rate: '0.003'
  },
  {
    contract_addr: 'orai1d37artrk4tkhz2qyjmaulc2jzjkx7206tmpfug',
    asset_denoms: [ORAI, process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM],
    commission_rate: '0.003'
  },
  {
    contract_addr: 'orai1hr2l03ep6p9lwdkuqu5253fgpzc40xcpwymjfc',
    asset_denoms: ['milky', STABLE_DENOM],
    commission_rate: '0.003'
  }
];

export const pairDenoms = _.uniq(
  _.flatten(pairs.map((pair) => pair.asset_denoms))
);

export const poolTokens = filteredTokens.filter((token) =>
  pairDenoms.includes(token.denom)
);

export const getPair = (
  denom1: string | string[],
  denom2?: string
): Pair | undefined => {
  const asset_denoms = typeof denom1 === 'string' ? [denom1, denom2] : denom1;

  // ORAI should be at the start
  if (asset_denoms[1] === ORAI) {
    asset_denoms.reverse();
  }

  return pairs.find(
    (pair) =>
      (pair.asset_denoms[0] === asset_denoms[0] &&
        pair.asset_denoms[1] === asset_denoms[1]) ||
      (pair.asset_denoms[0] === asset_denoms[1] &&
        pair.asset_denoms[1] === asset_denoms[0])
  );
};
