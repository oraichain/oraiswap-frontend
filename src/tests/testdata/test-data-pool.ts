import { fromBinary, toBinary } from '@cosmjs/cosmwasm-stargate';
import { OraiswapStakingTypes } from '@oraichain/oraidex-contracts-sdk';
import { TokenInfo } from 'types/token';
import { PairInfoData } from 'pages/Pools/helpers';
import { constants } from '../listing-simulate';
interface TestCaculateApr {
  poolList: PairInfoData[];
  allLpTokenInfos: TokenInfo[];
  allTokenAssetInfos: OraiswapStakingTypes.PoolInfoResponse[];
  allRewardPerSec: OraiswapStakingTypes.RewardsPerSecResponse[];
}

// export const testCaculateAprDatas: TestCaculateApr[] = [
//   {
//     poolList: [
//       {
//         offerPoolAmount: 0n,
//         askPoolAmount: 0n,
//         amount: 0,
//         pair: [Object],
//         commissionRate: '0.003',
//         fromToken: [Object],
//         toToken: [Object]
//       },
//       {
//         offerPoolAmount: 10000000n,
//         askPoolAmount: 0n,
//         amount: 0,
//         pair: [Object],
//         commissionRate: '0.003',
//         fromToken: [Object],
//         toToken: [Object]
//       }
//     ],
//     allLpTokenInfos: [
//       {
//         contractAddress: 'orai14fnmt3smwc6ec07g97g8q2pkgd4xvyn4697snn',
//         symbol: 'uLP',
//         verified: false,
//         name: 'oraiswap liquidity token',
//         decimals: 6,
//         total_supply: '0'
//       },
//       {
//         contractAddress: 'orai108fnrydd9pmtv4gjw83fu9zm3er85a6xu254p0',
//         symbol: 'uLP',
//         verified: false,
//         name: 'oraiswap liquidity token',
//         decimals: 6,
//         total_supply: '10000000'
//       }
//     ],
//     allTokenAssetInfos: [
//       {
//         asset_info: { token: { contract_addr: 'orai1dgngrj37f4q4yy86kgdw79jhjxphvvjr8r8mt0' } },
//         staking_token: 'orai1dgngrj37f4q4yy86kgdw79jhjxphvvjr8r8mt0',
//         total_bond_amount: '0',
//         reward_index: '0',
//         pending_reward: '0',
//         migration_index_snapshot: null,
//         migration_deprecated_staking_token: null
//       },
//       {
//         asset_info: { token: { contract_addr: 'orai1x20q8p0dykfq8mpl0zznef2488ggxasp0n63vp' } },
//         staking_token: 'orai1x20q8p0dykfq8mpl0zznef2488ggxasp0n63vp',
//         total_bond_amount: '0',
//         reward_index: '0',
//         pending_reward: '0',
//         migration_index_snapshot: null,
//         migration_deprecated_staking_token: null
//       }
//     ],
//     allRewardPerSec: [
//       {
//         assets: [
//           { info: { token: { contract_addr: 'orai1dgngrj37f4q4yy86kgdw79jhjxphvvjr8r8mt0' } }, amount: '1500000' }
//         ]
//       },
//       {
//         assets: [
//           { info: { token: { contract_addr: 'orai1x20q8p0dykfq8mpl0zznef2488ggxasp0n63vp' } }, amount: '1500000' }
//         ]
//       }
//     ]
//   }
// ];

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
