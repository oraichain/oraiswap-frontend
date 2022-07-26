import { filteredTokens, TokenItemType, tokens } from './bridgeTokens';
import { ORAI, STABLE_DENOM } from './constants';
import { network, NetworkKey } from './networks';
import _ from 'lodash';

export type Pair = {
  contract_addr: string;
  asset_denoms: [string, string];
};

export type TokensSwap = { [key: string]: TokenItemType };

const pairsMap: Record<NetworkKey, Pair[]> = {
  [NetworkKey.TESTNET]: [],
  [NetworkKey.MAINNET]: [
    {
      contract_addr: 'orai1wkhkazf88upf2dxqedggy3ldja342rzmfs2mep',
      asset_denoms: [ORAI, 'airi'],
    },
    {
      contract_addr: 'orai1m6q5k5nr2eh8q0rdrf57wr7phk7uvlpg7mwfv5',
      // contract_addr: '',
      asset_denoms: [ORAI, 'oraix'],
    },
    {
      contract_addr: 'orai1jf74ry4m0jcy9emsaudkhe7vte9l8qy8enakvs',
      asset_denoms: [ORAI, process.env.REACT_APP_ATOM_ORAICHAIN_DENOM],
    },
    {
      contract_addr: 'orai14lpk5gnmj688f957xvd6c42w9dygl9c2dlxjzw',
      asset_denoms: [ORAI, process.env.REACT_APP_UST_ORAICHAIN_DENOM],
    },
    {
      contract_addr: 'orai1d2h9phsu6rau87d2l8adlxfhrdun2wrgdhsqxt',
      asset_denoms: [ORAI, process.env.REACT_APP_LUNA_ORAICHAIN_DENOM],
    },
    {
      contract_addr: 'orai1c5s03c3l336dgesne7dylnmhszw8554tsyy9yt',
      asset_denoms: [ORAI, STABLE_DENOM],
    },
    {
      contract_addr: 'orai1ynmd2cemryhcwtjq3adhcwayrm89l2cr4tws4v',
      asset_denoms: [ORAI, 'kwt'],
    },
    // {
    //   contract_addr: 'orai1d37artrk4tkhz2qyjmaulc2jzjkx7206tmpfug',
    //   asset_denoms: [
    //     ORAI,
    //     process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM
    //   ]
    // }
  ],
};

export const pairs =
  process.env.REACT_APP_DEPRECATED === 'true'
    ? pairsMap[network.id]
    : pairsMap[network.id].filter(
      // filter out LUNA and UST pool
      (p) =>
        !_.isEqual(p.asset_denoms, [
          ORAI,
          process.env.REACT_APP_UST_ORAICHAIN_DENOM,
        ]) &&
        !_.isEqual(p.asset_denoms, [
          ORAI,
          process.env.REACT_APP_LUNA_ORAICHAIN_DENOM,
        ])
    );

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
      pair.asset_denoms[0] === asset_denoms[0] &&
      pair.asset_denoms[1] === asset_denoms[1]
  );
};
