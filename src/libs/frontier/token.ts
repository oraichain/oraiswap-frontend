import { CODE_ID_CW20, CW20_DECIMALS } from 'config/constants';
import { AccountData } from '@cosmjs/proto-signing';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { TextProposal } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { network } from 'config/networks';
import { OraiswapFactoryClient } from 'libs/contracts/OraiswapFactory.client';
import { InstantiateMsg as Cw20InstantiateMsg } from '../contracts/OraiswapToken.types';
import { collectWallet } from 'libs/cosmjs';

// deploy cw20 token
const getWallet = async (): Promise<{ accounts: readonly AccountData[]; wallet }> => {
  const wallet = await collectWallet();
  const accounts = await wallet.getAccounts();
  return { accounts, wallet };
};

const getSigningCosmWasmClient = async () => {
  const { accounts, wallet } = await getWallet();
  const address = accounts[0].address;
  const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(network.rpc as string, wallet, {
    gasPrice: GasPrice.fromString(network.fee.gasPrice)
  });
  return { client, address, wallet };
};

const deployCw20Token = async (tokenSymbol: string, cap?: number | string) => {
  const { client, address } = await getSigningCosmWasmClient();
  const instantiateResult = await client.instantiate(
    address,
    CODE_ID_CW20,
    {
      mint: { minter: address, cap },
      name: `${tokenSymbol} token`,
      symbol: tokenSymbol,
      decimals: CW20_DECIMALS,
      initial_balances: []
    } as Cw20InstantiateMsg,
    `Production CW20 ${tokenSymbol} token`,
    'auto',
    { admin: address }
  );
  return instantiateResult.contractAddress;
};

const addPairAndLpToken = async (cw20ContractAddress: string) => {
  const { client, address } = await getSigningCosmWasmClient();
  const factoryContract = new OraiswapFactoryClient(
    client,
    address,
    process.env.REACT_APP_FACTORY_V2_CONTRACT as string
  );

  // force the token to be paired with native orai by default. It will then be able to be swapped with other tokens that pairs with ORAI
  const result = await factoryContract.createPair({
    assetInfos: [{ native_token: { denom: 'orai' } }, { token: { contract_addr: cw20ContractAddress } }]
  });
  const wasmAttributes = result.logs[0].events.find((event) => event.type === 'wasm')?.attributes;
  const pairAddress = wasmAttributes?.find((attr) => attr.key === 'pair_contract_address')?.value;
  const lpAddress = wasmAttributes?.find((attr) => attr.key === 'liquidity_token_address')?.value;
  return { pairAddress, lpAddress };
};

const createTextProposal = async (
  cw20ContractAddress: string,
  lpAddress: string,
  rewardPerSecOrai: number,
  rewardPerSecOraiX: number
) => {
  const title = `OraiDEX frontier - Listing new LP mining pool of token ${cw20ContractAddress}`;
  const description = `Create a new liquidity mining pool for CW20 token ${cw20ContractAddress} with LP Address: ${lpAddress}. Total rewards per second for the liquidity mining pool: ${rewardPerSecOrai} orai & ${rewardPerSecOraiX} uORAIX`;
  const { client, address } = await getSigningCosmWasmClient();
  const initial_deposit = [];
  const message = {
    typeUrl: '/cosmos.gov.v1beta1.MsgSubmitProposal',
    value: {
      content: Any.fromPartial({
        typeUrl: '/cosmos.gov.v1beta1.TextProposal',
        value: TextProposal.encode({
          title,
          description
        }).finish()
      }),
      proposer: address,
      initialDeposit: initial_deposit
    }
  };
  return client.signAndBroadcast(address, [message], 'auto');
  // return client.simulate(address, [message], 'auto');
};

export { deployCw20Token, addPairAndLpToken, createTextProposal };
