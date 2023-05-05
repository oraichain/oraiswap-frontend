import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { constants } from '../listing-simulate';

export const aggregateResultData = [
  {
    res: {
      return_data: [
        {
          success: true,
          data: toBinary({
            staker_addr: constants.devAddress,
            reward_infos: [
              {
                asset_info: {
                  token: {
                    contract_addr: ''
                  }
                },
                bond_amount: '1000000',
                pending_reward: '10000',
                pending_withdraw: [],
                should_migrate: null
              }
            ]
          })
        },
        {
          success: true,
          data: toBinary({
            staker_addr: constants.devAddress,
            reward_infos: [
              {
                asset_info: {
                  token: {
                    contract_addr: ''
                  }
                },
                bond_amount: '1000000',
                pending_reward: '10000',
                pending_withdraw: [],
                should_migrate: null
              }
            ]
          })
        }
      ]
    },
    expectMyReward: [true, true]
  },

  {
    res: {
      return_data: [
        {
          success: false,
          data: toBinary({
            staker_addr: constants.devAddress,
            reward_infos: []
          })
        },
        {
          success: false,
          data: toBinary({
            staker_addr: constants.devAddress,
            reward_infos: []
          })
        }
      ]
    },
    expectMyReward: [{}, {}]
  },
  {
    res: {
      return_data: [
        {
          success: true,
          data: toBinary({
            staker_addr: constants.devAddress,
            reward_infos: []
          })
        },
        {
          success: true,
          data: toBinary({
            staker_addr: constants.devAddress,
            reward_infos: []
          })
        }
      ]
    },
    expectMyReward: [false, false]
  },
  {
    res: {
      return_data: [
        {
          success: true,
          data: toBinary({
            staker_addr: constants.devAddress,
            reward_infos: [
              {
                asset_info: {
                  token: {
                    contract_addr: ''
                  }
                },
                bond_amount: '1000000',
                pending_reward: '10000',
                pending_withdraw: [],
                should_migrate: null
              }
            ]
          })
        },
        {
          success: true,
          data: toBinary({
            staker_addr: constants.devAddress,
            reward_infos: []
          })
        }
      ]
    },
    expectMyReward: [true, false]
  }
];

export const testCaculateRewardData = aggregateResultData.map((data) => {
  return [data.res, data.expectMyReward];
});
export const testConverToPairsDetailData = aggregateResultData.map((data, index) => {
  return [
    data.res,
    [
      !data.res.return_data[0].success ? {} : fromBinary(data.res.return_data[0].data),
      !data.res.return_data[1].success ? {} : fromBinary(data.res.return_data[1].data)
    ]
  ];
});
