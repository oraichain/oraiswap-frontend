import { oraichainTokens } from '@oraichain/oraidex-common/build/token';

export const TIMER = {
  HAFT_MILLISECOND: 500,

  MILLISECOND: 1000,
  SECOND: 60,
  MINUTE: 60,
  HOUR: 24,

  MILLISECOND_OF_DAY: 1000 * 60 * 60 * 24
};

export const MONTHLY_SECOND = 30 * 24 * 60 * 60;

export const YEARLY_SECOND = 365 * 24 * 60 * 60;

export const STAKING_PERIOD = 30;

export const ORAIX_DECIMAL = 6;

export const MONTHS_ARR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export enum STAKE_TAB {
  Stake = 'Stake',
  UnStake = 'Unstake'
}

export const ORAIX_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'oraidex');
export const USDC_TOKEN_INFO = oraichainTokens.find((e) => e.coinGeckoId === 'usd-coin');
