export const TIMER = {
  HAFT_MILLISECOND: 500,

  MILLISECOND: 1000,
  SECOND: 60,
  MINUTE: 60,
  HOUR: 24
};

export const ORAIX_DECIMAL = 6;

export const MONTHS_ARR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const INIT_AMOUNT_SIMULATE = 1000;

export const TF_PRICE_CHANGE = 1440;

export const MILLISECOND_PER_DAY = 24 * 60 * 60 * 1000;

export const LIMIT_PAGE = 5;

export enum TAB_HISTORY {
  MY_BID = 'my',
  ALL_BID = 'all'
}

export const ROUND_QUERY_KEY = 'round';
export const TAB_QUERY_KEY = 'tab';

export enum BidStatus {
  WIN = 'Won',
  DRAW = 'Draw',
  BIDDING = 'Bidding'
}

export enum BID_ROUND_STATUS {
  ONGOING = 'ONGOING',
  ENDED = 'ENDED'
}
