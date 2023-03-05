import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import { filteredTokens, TokenItemType } from './bridgeTokens';
import { MILKY, MILKY_DENOM, ORAI, STABLE_DENOM } from './constants';

export type Pair = {
  contract_addr: string;
  asset_denoms: [string, string];
  liquidity_token: string;
  commission_rate: string;
  token_asset: string;
};

export type TokensSwap = { [key: string]: TokenItemType };

export const pairs: Pair[] = [
  {
    contract_addr: 'orai1wkhkazf88upf2dxqedggy3ldja342rzmfs2mep',
    asset_denoms: [ORAI, 'airi'],
    liquidity_token: 'orai1hxm433hnwthrxneyjysvhny539s9kh6s2g2n8y',
    commission_rate: '0.003',
    token_asset: 'airi'
  },
  {
    contract_addr: 'orai1m6q5k5nr2eh8q0rdrf57wr7phk7uvlpg7mwfv5',
    asset_denoms: [ORAI, 'oraix'],
    liquidity_token: 'orai1qmy3uuxktflvreanaqph6yua7stjn6j65rur62',
    commission_rate: '0.003',
    token_asset: 'oraix'
  },
  {
    contract_addr: 'orai15aunrryk5yqsrgy0tvzpj7pupu62s0t2n09t0dscjgzaa27e44esefzgf8',
    asset_denoms: [ORAI, 'scorai'],
    liquidity_token: 'orai1ay689ltr57jt2snujarvakxrmtuq8fhuat5rnvq6rct89vjer9gqm2vde6',
    commission_rate: '0.003',
    token_asset: 'scorai'
  },
  {
    contract_addr: 'orai1jf74ry4m0jcy9emsaudkhe7vte9l8qy8enakvs',
    asset_denoms: [ORAI, process.env.REACT_APP_ATOM_ORAICHAIN_DENOM],
    liquidity_token: 'orai1g2prqry343kx566cp7uws9w7v78n5tejylvaz6',
    commission_rate: '0.003',
    token_asset: process.env.REACT_APP_ATOM_ORAICHAIN_DENOM
  },
  {
    contract_addr: 'orai1c5s03c3l336dgesne7dylnmhszw8554tsyy9yt',
    asset_denoms: [ORAI, STABLE_DENOM],
    liquidity_token: 'orai1mav52eqhd07c3lwevcnqdykdzhh4733zf32jcn',
    commission_rate: '0.003',
    token_asset: STABLE_DENOM
  },
  {
    contract_addr: 'orai1ynmd2cemryhcwtjq3adhcwayrm89l2cr4tws4v',
    asset_denoms: [ORAI, 'kwt'],
    liquidity_token: 'orai17rcfcrwltujfvx7w4l2ggyku8qrncy0hdvrzvc',
    commission_rate: '0.003',
    token_asset: 'kwt'
  },
  {
    contract_addr: 'orai1d37artrk4tkhz2qyjmaulc2jzjkx7206tmpfug',
    asset_denoms: [ORAI, process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM],
    liquidity_token: 'orai19ltj97jmdqnz5mrd2amethetvcwsp0220kww3e',
    commission_rate: '0.003',
    token_asset: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM
  },
  {
    contract_addr: 'orai1hr2l03ep6p9lwdkuqu5253fgpzc40xcpwymjfc',
    asset_denoms: [MILKY, STABLE_DENOM],
    liquidity_token: 'orai18ywllw03hvy720l06rme0apwyyq9plk64h9ccf',
    commission_rate: '0.003',
    token_asset: 'milky'
  },
  {
    contract_addr: 'orai105q4n6n8hclxcm3hj0306jqh09dxffy3j4ze2rzaylklqmu9hlcs7a39kq',
    asset_denoms: [ORAI, 'usdc'],
    liquidity_token: 'orai1ssg8qy3teld8tjwyjlqhw7j0xllxyw88fp5af72z50lr5akqu68qlugue5',
    commission_rate: '0.003',
    token_asset: 'usdc'
  }
];

export const pairDenoms = uniq(flatten(pairs.map((pair) => pair.asset_denoms)));

export const poolTokens = filteredTokens.filter((token) => pairDenoms.includes(token.denom));

export const getPair = (denom1: string | string[], denom2?: string): Pair | undefined => {
  const asset_denoms = typeof denom1 === 'string' ? [denom1, denom2] : denom1;

  // ORAI should be at the start
  if (asset_denoms[1] === ORAI) {
    asset_denoms.reverse();
  }

  return pairs.find(
    (pair) =>
      (pair.asset_denoms[0] === asset_denoms[0] && pair.asset_denoms[1] === asset_denoms[1]) ||
      (pair.asset_denoms[0] === asset_denoms[1] && pair.asset_denoms[1] === asset_denoms[0])
  );
};
