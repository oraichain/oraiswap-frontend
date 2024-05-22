export const LUCKY_DRAW_CONTRACT = 'orai1xlsjarys4p4jkq9ca0dayqxmcya5pac6v9ys5rhrs2wfcfy6t2hq9lah7w';
export const LUCKY_DRAW_INTERVAL = 30 * 60 * 60;
export const FETCH_RESULT_INTERVAL = 500;
// export const LUCKY_DRAW_FEE = '33000000';
export const LUCKY_DRAW_FEE = '100000';
export const SPIN_ID_KEY = 'spin_id';

export enum REWARD_ENUM {
  // DIAMOND = '20000000',
  // GOLD = '5000000',
  // SILVER = '1000000',
  // BRONZE = '100000',
  // NOTHING = '0'

  DIAMOND = '200',
  GOLD = '50',
  SILVER = '10',
  BRONZE = '1',
  NOTHING = '0'
}

export const REWARD_MAP = {
  [REWARD_ENUM.DIAMOND]: [0],
  [REWARD_ENUM.GOLD]: [1],
  [REWARD_ENUM.SILVER]: [3],
  [REWARD_ENUM.BRONZE]: [4],
  [REWARD_ENUM.NOTHING]: [2, 5]
};

export enum REWARD_TITLE {
  DIAMOND = '20 ORAI',
  GOLD = '5 ORAI',
  SILVER = '1 ORAI',
  BRONZE = '0.1 ORAI',
  NOTHING = 'Try again'
}

export const MSG_TITLE = {
  [REWARD_TITLE.DIAMOND]: '✨ NO WAY! You just scored the BIGGEST prize - 20 ORAI!',
  [REWARD_TITLE.GOLD]: "Winner, Winner! You've just won 5 ORAI",
  [REWARD_TITLE.SILVER]: 'Holy Moly! You just snagged 1 ORAI!',
  [REWARD_TITLE.BRONZE]: 'Cha-ching! 0.1 ORAI just landed in your wallet - lucky you!',
  [REWARD_TITLE.NOTHING]: "This spin wasn't a win, but who knows what's next?"
};

export const DATA_LUCKY_DRAW = {
  blocks: [{ padding: '13px', background: '#2f5711' }],
  prizes: [
    {
      id: 0,
      title: '20 ORAI',
      background: '#92e54c',
      fonts: [{ text: '20 ORAI ', top: '18%' }]
    },
    {
      id: 1,
      title: '5 ORAI',
      background: '#d7f5bf',
      fonts: [{ text: '5 ORAI', top: '18%' }]
    },

    {
      id: 2,
      title: 'Try again',
      background: '#92e54c',
      fonts: [{ text: 'Try Again', top: '18%' }]
    },
    {
      id: 3,
      title: '1 ORAI',
      background: '#d7f5bf',
      fonts: [{ text: '1 ORAI', top: '18%' }]
    },
    {
      id: 4,
      title: '0.1 ORAI',
      background: '#92e54c',
      fonts: [{ text: '0.1 ORAI', top: '18%' }]
    },
    {
      id: 5,
      title: 'Try again',
      background: '#d7f5bf',
      fonts: [{ text: 'Try Again', top: '18%' }]
    }
  ],
  buttons: [
    { radius: '50px', background: '#2f5711' },
    { radius: '45px', background: '#fff' },
    { radius: '41px', background: '#89a571', pointer: true },
    {
      radius: '35px',
      background: '#d7f5bf',
      fonts: [{ text: 'Spin', fontSize: '18px', top: '-30%' }]
    }
  ],
  defaultStyle: {
    fontColor: '#2f5711',
    fontSize: '14px',
    fontWeight: 700
  },
  defaultConfig: {
    speed: 10
  }
};
