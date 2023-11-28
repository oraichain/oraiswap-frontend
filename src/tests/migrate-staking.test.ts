import { DownloadState, SimulateCosmWasmClient } from '@oraichain/cw-simulate';
import { fetchStakingPoolInfo, fetchRewardPerSecInfo } from '../rest/api';
import path from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { STAKING_CONTRACT, MULTICALL_CONTRACT } from '@oraichain/oraidex-common';
import { OraiswapStakingClient } from '@oraichain/oraidex-contracts-sdk';

const downloadPath = path.resolve(__dirname, './wasm');
let download = new DownloadState('https://lcd.orai.io', downloadPath);
let client = new SimulateCosmWasmClient({
  chainId: 'Oraichain',
  bech32Prefix: 'orai'
});
window.client = client;
const senderAddress = 'orai1gkr56hlnx9vc7vncln2dkd896zfsqjn300kfq0';
const owner = 'orai1fs25usz65tsryf0f8d5cpfmqgr0xwup4kjqpa0';

export async function setupSimulateClient() {
  if (!existsSync(path.resolve(downloadPath))) {
    mkdirSync(path.resolve(downloadPath));
  }
  await download.loadState(client, senderAddress, STAKING_CONTRACT, 'mainnet staking contract');
  const oldAssetKeys = [
    'orai19q4qak2g3cj2xc2y3060t0quzn3gfhzx08rjlrdd3vqxhjtat0cq668phq',
    'orai19rtmkk6sn4tppvjmp5d5zj6gfsdykrl5rw2euu5gwur3luheuuusesqn49',
    'orai1gzvndtzceqwfymu2kqhta2jn6gmzxvzqwdgvjw',
    'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    'ibc/4F7464EEE736CCFB6B444EB72DE60B3B43C0DD509FFA2B87E05D584467AAE8C8',
    'ibc/A2E2EEC9057A4A1C2C0A6A4C78B0239118DF5F278830F50B4A6BDD7A66506B78',
    'ibc/9C4DCD21B48231D0BC2AC3D1B74A864746B37E4292694C93C617324250D002FC',
    'ibc/9E4F68298EE0A201969E583100E5F9FAD145BAA900C04ED3B6B302D834D8E3C4',
    'ibc/BA44E90EAFEA8F39D87A94A4A61C9FFED5887C2730DFBA668C197BA331372859',
    'orai1065qe48g7aemju045aeyprflytemx7kecxkf5m7u5h5mphd0qlcs47pclp',
    'orai10ldgzued6zjp0mkqwsv2mux3ml50l97c74x8sg',
    'orai1nd4r053e3kgedgld2ymen8l9yrw8xpjyaal7j5',
    'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
    'orai1c7tpjenafvgjtgm9aqwm7afnke6c56hpdms8jc6md40xs3ugd0es5encn0',
    'orai1l22k254e8rvgt5agjm3nn9sy0cmvhjmhd6ew6shacfmexkgzymhsyc2sr2',
    'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
    'orai1llsm2ly9lchj006cw2mmlu8wmhr0sa988sp3m5'
  ];
  const oldAssetInfos = oldAssetKeys.map((info) => {
    if (info[0] === 'i') return { native_token: { denom: info } };
    return { token: { contract_addr: info } };
  });

  const oldPools = [];
  for (const oldInfo of oldAssetInfos) {
    const pool = await client.queryContractSmart(STAKING_CONTRACT, {
      pool_info: { asset_info: oldInfo }
    });
    oldPools.push(pool);
  }

  const { codeId } = await client.upload(
    senderAddress,
    readFileSync(path.join(__dirname, './wasm/oraiswap_staking.wasm')),
    'auto'
  );
  console.log({ codeId });

  const migrateResult = await client.migrate(senderAddress, STAKING_CONTRACT, codeId, {}, 'auto');

  console.log('Migrate Staking contract successfully at tx:', migrateResult.transactionHash);

  const newStakingInstance = new OraiswapStakingClient(client, owner, STAKING_CONTRACT);

  for (const assetKey of oldAssetInfos) {
    await newStakingInstance.migrateStore({ assetInfo: assetKey });
  }

  //Load multicall

  await download.loadState(client, senderAddress, MULTICALL_CONTRACT, 'multicall contract');
  console.log('Update State successfully');
}
const liquidAddrs = [
  'orai1g2prqry343kx566cp7uws9w7v78n5tejylvaz6',
  'orai19ltj97jmdqnz5mrd2amethetvcwsp0220kww3e',
  'orai1hxm433hnwthrxneyjysvhny539s9kh6s2g2n8y',
  'orai1e0x87w9ezwq2sdmvv5dq5ngzy98lt47tqfaf2m7zpkg49g5dj6fqred5d7',
  'orai1qmy3uuxktflvreanaqph6yua7stjn6j65rur62',
  'orai17rcfcrwltujfvx7w4l2ggyku8qrncy0hdvrzvc',
  'orai18ywllw03hvy720l06rme0apwyyq9plk64h9ccf',
  'orai1ay689ltr57jt2snujarvakxrmtuq8fhuat5rnvq6rct89vjer9gqm2vde6',
  'orai1e0x87w9ezwq2sdmvv5dq5ngzy98lt47tqfaf2m7zpkg49g5dj6fqred5d7',
  'orai1wgywgvumt5dxhm7vjpwx5es9ecrtl85qaqdspjqwx2lugy7vmw5qlwrn88',
  'orai1hcjne0hmdj6pjrc3xuksucr0yplsa9ny7v047c34y8k8hfflq6yqyjapnn',
  'orai1slqw6gfvs6l2jgvh5ryjayf4g77d7sgfv6fumtyzcr06a6g9gnrq6c4rgg'
];

describe('Migrate staking contract', () => {
  beforeAll(async () => {
    await setupSimulateClient();
  }, 100000);

  it.each(liquidAddrs)(`must have reward info for liquid address %s`, async (lpToken) => {
    const rewardInfoPerSec = await fetchRewardPerSecInfo(lpToken);
    const pool = await fetchStakingPoolInfo(lpToken);
    expect(rewardInfoPerSec).toBeDefined();
    expect(pool).toBeDefined();
    expect(pool.staking_token).toBe(lpToken);
  });
});
