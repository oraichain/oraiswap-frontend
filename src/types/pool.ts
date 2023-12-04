import { TokenItemType } from '@oraichain/oraidex-common/build/token';
import { Type } from 'rest/api';

export type PairInfoData = {
  firstAssetInfo: string;
  secondAssetInfo: string;
  commissionRate: string;
  pairAddr: string;
  liquidityAddr: string;
  oracleAddr: string;
  symbols: string;
  fromIconUrl: string;
  toIconUrl: string;
};

export type PoolInfoResponse = PairInfoData & {
  apr: number;
  totalLiquidity: number;
  volume24Hour: string;
  volume24hChange: string;
  fee7Days: string;
  rewardPerSec: string;
  offerPoolAmount: number;
  askPoolAmount: number;
  totalSupply: number;
};

export type PoolDetail = {
  info: PoolInfoResponse;
  token1: TokenItemType;
  token2: TokenItemType;
  isLoading: boolean;
};

export type BaseMining = {
  type: Type;
  lpAddress: string;
  sender: string;
};
export type BondLP = BaseMining & {
  lpAddress: string;
  amount: number | string;
};
export type WithdrawLP = BaseMining;
export type UnbondLP = BaseMining & { amount: number | string };
export type MiningLP = BondLP | WithdrawLP | UnbondLP;

export type PoolTableData = PoolInfoResponse & {
  reward: string[];
  myStakedLP: number;
  earned: number;
  claimable: number;
  baseToken: TokenItemType;
  quoteToken: TokenItemType;
};
export interface PoolModalProps {
  className?: string;
  isOpen: boolean;
  close: () => void;
  isCloseBtn?: boolean;
  onLiquidityChange?: (amountLpInUsdt?: number) => void;
  myLpUsdt?: bigint;
  myLpBalance?: bigint;
  pairDenoms?: string;
  open?: () => void;
  assetToken?: TokenItemType | any;
  lpPrice?: number;
}
