import { toBinary } from '@cosmjs/cosmwasm-stargate';
import { coin } from '@cosmjs/proto-signing';
import { client } from './common';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { readFileSync } from 'fs';
import {
  OraiswapFactoryClient,
  OraiswapStakingClient,
  OraiswapPairClient,
  OraiswapFactoryTypes,
  OraiswapStakingTypes,
  OraiswapTokenTypes
} from '@oraichain/oraidex-contracts-sdk';
import { MulticallTypes } from '@oraichain/common-contracts-sdk';
import * as oraidexArtifacts from '@oraichain/oraidex-contracts-build';
import * as commonArtifacts from '@oraichain/common-contracts-build';
import { PairInfo } from '@oraichain/oraidex-contracts-sdk';

dotenv.config();

export const constants = {
  codeId: 761,
  adminInitialBalances: '10000000000',
  devInitialBalances: '20000000',
  ibcWasmInitialBalances: '1000000000',
  amountProvideLiquidity: '10000000',
  cw20Decimals: 6,
  devAddress: 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g',
  oraiDenom: 'orai',
  atomDenom: 'ibc/a2e2eec9057a4a1c2c0a6a4c78b0239118df5f278830f50b4a6bdd7a66506b78',
  osmoDenom: 'ibc/9c4dcd21b48231d0bc2ac3d1b74a864746b37e4292694c93c617324250d002fc',
  rewardPerSecAmount: '1'
};

export async function deployOraiDexContracts(): Promise<{
  factory: string;
  staking: string;
  multicall: string;
  tokenCodeId: number;
}> {
  const { devAddress } = constants;
  // deploy fixed multisig
  // upload pair & lp token code id
  const { codeId: tokenCodeId } = await client.upload(
    devAddress,
    readFileSync(oraidexArtifacts.getContractDir('oraiswap_token')),
    'auto'
  );
  const { codeId: pairCodeId } = await client.upload(
    devAddress,
    readFileSync(oraidexArtifacts.getContractDir('oraiswap_pair')),
    'auto'
  );

  // deploy oracle addr
  const { contractAddress: oracleAddr } = await oraidexArtifacts.deployContract(
    client,
    devAddress,
    {},
    'oracle',
    'oraiswap_oracle'
  );
  // deploy factory contract
  const { contractAddress: factoryAddr } = await oraidexArtifacts.deployContract(
    client,
    devAddress,

    {
      commission_rate: null,
      oracle_addr: oracleAddr,
      pair_code_id: pairCodeId,
      token_code_id: tokenCodeId
    },
    'factory',
    'oraiswap_factory'
  );
  // deploy staking contract address
  const { contractAddress: stakingAddr } = await oraidexArtifacts.deployContract(
    client,
    devAddress,

    {
      base_denom: constants.oraiDenom,
      factory_addr: factoryAddr,
      minter: null,
      oracle_addr: oracleAddr,
      owner: devAddress,
      rewarder: devAddress
    },
    'staking',
    'oraiswap_staking'
  );

  // deploy multicall contract address
  const { contractAddress: multicallAddr } = await commonArtifacts.deployContract(
    client,
    devAddress,
    undefined,
    'multicall',
    'multicall'
  );

  return {
    factory: factoryAddr,
    staking: stakingAddr,
    multicall: multicallAddr,
    tokenCodeId
  };
}

export async function instantiateCw20Token(tokenSymbol: string, codeId: number): Promise<string> {
  const result = await client.instantiate(
    constants.devAddress,
    codeId,
    {
      name: `${tokenSymbol} token`,
      symbol: tokenSymbol,
      decimals: constants.cw20Decimals,
      initial_balances: [{ amount: constants.devInitialBalances, address: constants.devAddress }],
      marketing: null
    } as OraiswapTokenTypes.InstantiateMsg,
    'cw20',
    'auto'
  );

  return result.contractAddress;
}

export async function addPairAndLpToken(factory: string, cw20ContractAddress: string, stakingContract: string) {
  const factoryContract = new OraiswapFactoryClient(client, constants.devAddress, factory);
  const assetInfos = [
    { native_token: { denom: constants.oraiDenom } },
    { token: { contract_addr: cw20ContractAddress } }
  ];
  await factoryContract.createPair(
    {
      assetInfos
    },
    'auto'
  );

  // register asset to pool
  const staking = new OraiswapStakingClient(client, constants.devAddress, stakingContract);
  await staking.registerAsset({
    stakingToken: constants.devAddress
  });

  // add reward per sec to fetch
  await staking.updateRewardsPerSec({
    stakingToken: constants.devAddress,
    assets: [
      {
        amount: constants.rewardPerSecAmount,
        info: {
          token: {
            contract_addr: cw20ContractAddress
          }
        }
      },
      {
        amount: constants.rewardPerSecAmount,
        info: {
          native_token: {
            denom: 'orai'
          }
        }
      }
    ]
  });

  // bond to pool
  await staking.receive({
    amount: '999999',
    msg: toBinary({
      bond: {
        asset_info: {
          token: {
            contract_addr: cw20ContractAddress
          }
        }
      }
    }),
    sender: constants.devAddress
  });
}

export async function addPairNative(factory: string) {
  const factoryContract = new OraiswapFactoryClient(client, constants.devAddress, factory);
  const assetInfos = [
    { native_token: { denom: constants.oraiDenom } },
    { native_token: { denom: constants.atomDenom } }
  ];
  await factoryContract.createPair(
    {
      assetInfos
    },
    'auto'
  );
}

export async function addLiquidity(pair: PairInfo) {
  const pairContract = new OraiswapPairClient(client, constants.devAddress, pair.contract_addr);
  await pairContract.provideLiquidity(
    {
      assets: [
        {
          amount: constants.amountProvideLiquidity,
          info: pair.asset_infos[0]
        },
        {
          amount: constants.amountProvideLiquidity,
          info: pair.asset_infos[1]
        }
      ]
    },
    'auto',
    null,
    [coin(constants.amountProvideLiquidity, constants.oraiDenom)]
  );
}

export async function getPairs(factory: string) {
  const factoryContract = new OraiswapFactoryClient(client, constants.devAddress, factory);
  const pairs = await factoryContract.pairs({});
  return pairs;
}

describe('test', () => {
  it('', () => {});
});
