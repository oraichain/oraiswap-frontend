import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import { filteredTokens, TokenItemType } from './bridgeTokens';
import { COMMISSION_RATE, MILKY, ORAI, STABLE_DENOM, TRON_DENOM } from './constants';

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
    commission_rate: COMMISSION_RATE,
    token_asset: 'airi'
  },
  {
    contract_addr: 'orai1m6q5k5nr2eh8q0rdrf57wr7phk7uvlpg7mwfv5',
    asset_denoms: [ORAI, 'oraix'],
    liquidity_token: 'orai1qmy3uuxktflvreanaqph6yua7stjn6j65rur62',
    commission_rate: COMMISSION_RATE,
    token_asset: 'oraix'
  },
  {
    contract_addr: 'orai15aunrryk5yqsrgy0tvzpj7pupu62s0t2n09t0dscjgzaa27e44esefzgf8',
    asset_denoms: [ORAI, 'scorai'],
    liquidity_token: 'orai1ay689ltr57jt2snujarvakxrmtuq8fhuat5rnvq6rct89vjer9gqm2vde6',
    commission_rate: COMMISSION_RATE,
    token_asset: 'scorai'
  },
  {
    contract_addr: 'orai1jf74ry4m0jcy9emsaudkhe7vte9l8qy8enakvs',
    asset_denoms: [ORAI, process.env.REACT_APP_ATOM_ORAICHAIN_DENOM],
    liquidity_token: 'orai1g2prqry343kx566cp7uws9w7v78n5tejylvaz6',
    commission_rate: COMMISSION_RATE,
    token_asset: process.env.REACT_APP_ATOM_ORAICHAIN_DENOM
  },
  {
    contract_addr: 'orai1c5s03c3l336dgesne7dylnmhszw8554tsyy9yt',
    asset_denoms: [ORAI, STABLE_DENOM],
    liquidity_token: 'orai1mav52eqhd07c3lwevcnqdykdzhh4733zf32jcn',
    commission_rate: COMMISSION_RATE,
    token_asset: STABLE_DENOM
  },
  {
    contract_addr: 'orai1ynmd2cemryhcwtjq3adhcwayrm89l2cr4tws4v',
    asset_denoms: [ORAI, 'kwt'],
    liquidity_token: 'orai17rcfcrwltujfvx7w4l2ggyku8qrncy0hdvrzvc',
    commission_rate: COMMISSION_RATE,
    token_asset: 'kwt'
  },
  {
    contract_addr: 'orai1d37artrk4tkhz2qyjmaulc2jzjkx7206tmpfug',
    asset_denoms: [ORAI, process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM],
    liquidity_token: 'orai19ltj97jmdqnz5mrd2amethetvcwsp0220kww3e',
    commission_rate: COMMISSION_RATE,
    token_asset: process.env.REACT_APP_OSMOSIS_ORAICHAIN_DENOM
  },
  {
    contract_addr: 'orai1hr2l03ep6p9lwdkuqu5253fgpzc40xcpwymjfc',
    asset_denoms: [MILKY, STABLE_DENOM],
    liquidity_token: 'orai18ywllw03hvy720l06rme0apwyyq9plk64h9ccf',
    commission_rate: COMMISSION_RATE,
    token_asset: MILKY
  },
  {
    contract_addr: 'orai19ttg0j7w5kr83js32tmwnwxxdq9rkmw4m3d7mn2j2hkpugwwa4tszwsnkg',
    asset_denoms: [ORAI, 'usdc'],
    liquidity_token: 'orai1e0x87w9ezwq2sdmvv5dq5ngzy98lt47tqfaf2m7zpkg49g5dj6fqred5d7',
    commission_rate: COMMISSION_RATE,
    token_asset: 'usdc'
  },
  {
    contract_addr: 'orai103ya8qkcf3vg4nksqquy0v5pvnugjtlt0uxpfh0fkuqge2a6k4aqwurg22',
    asset_denoms: [ORAI, TRON_DENOM],
    liquidity_token: 'orai1wgywgvumt5dxhm7vjpwx5es9ecrtl85qaqdspjqwx2lugy7vmw5qlwrn88',
    commission_rate: COMMISSION_RATE,
    token_asset: TRON_DENOM
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
