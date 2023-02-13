export const CHROME = 'https://google.com/chrome';

/* oraiswap:unit */
export const ORAI = 'orai';
export const UAIRI = 'uAIRI';
export const AIRI = 'AIRI';
export const ATOM = 'ATOM';
export const LP = 'LP';
export const KWT = 'oraie';
export const MILKY = 'milky';
export const STABLE_DENOM = 'usdt';
export const BEP20_ORAI = 'bep20_orai';
export const ERC20_ORAI = 'erc20_orai';
export const KAWAII_ORAI = 'kawaii_orai';

export const NATIVE_TOKENS = [ORAI];
export const EVM_DECIMALS = 18;
export const COSMOS_DECIMALS = 6;
export const DECIMAL_FRACTION = Math.pow(10, EVM_DECIMALS);

/* oraiswap:configs */
export const DEFAULT_MAX_SPREAD = 0.5;
export const MAX_MSG_LENGTH = 1024;

/* network:settings */
export const IBC_TRANSFER_TIMEOUT = 3600;
export const AXIOS_THROTTLE_THRESHOLD = 2000;
export const AXIOS_TIMEOUT = 10000;

/* project */
export const MEDIUM = '';
export const DISCORD = '';
export const TELEGRAM = '';
export const WECHAT = '';
export const GITHUB = 'https://github.com/oraichain/oraiswap-frontend.git';

// bsc and eth information
export const ETHEREUM_CHAIN_ID = 1;
export const ETHEREUM_RPC = 'https://1rpc.io/eth';
export const ETHEREUM_SCAN = 'https://etherscan.io';
export const BSC_CHAIN_ID = 56;
export const BSC_RPC = 'https://bsc-dataseed.binance.org';
export const BSC_SCAN = 'https://bscscan.com';
export const ORAI_BRIDGE_CHAIN_ID = 'oraibridge-subnet-2';

export const KWT_SCAN = 'https://scan.kawaii.global';
export const KWT_SUBNETWORK_CHAIN_ID = 'kawaii_6886-1';
export const KWT_SUBNETWORK_EVM_CHAIN_ID = 6886; //'0x1ae6';
export const ORAICHAIN_ID = 'Oraichain';
export const BSC_ORG = 'BNB Chain';
export const ETHEREUM_ORG = 'Ethereum';
export const COSMOS_CHAIN_ID = 'cosmoshub-4';
export const OSMOSIS_CHAIN_ID = 'osmosis-1';
export const JUNO_CHAIN_ID = 'juno-1';

export const ORAI_BRIDGE_DENOM = 'ORAIB';
export const ORAI_BRIDGE_UDENOM = 'uoraib';
export const ORAI_BRIDGE_EVM_DENOM_PREFIX = 'oraib';
export const ORAI_BRIDGE_EVM_ETH_DENOM_PREFIX = 'eth-mainnet';
export const ORAI_BRIDGE_EVM_FEE = '1';
export const ORAI_BRIDGE_CHAIN_FEE = '1';
export const ORAI_SCAN = 'https://scan.orai.io';
export const ORAI_BRIDGE_RPC = 'https://bridge-v2.rpc.orai.io';
export const ORAI_BRIDGE_LCD = 'https://bridge-v2.lcd.orai.io';
export const ORAI_LCD = 'https://lcd-balance.orai.io';
export const ORAI_RPC = 'https://rpc-balance.orai.io';
export const ORAI_NETWORK_LCD = 'https://lcd.orai.network';
export const ORAI_BRIDGE_PREFIX = 'oraib';

export const ORAI_BSC_CONTRACT = '0xA325Ad6D9c92B55A3Fc5aD7e412B1518F96441C0';
export const AIRI_BSC_CONTRACT = '0x7e2A35C746F2f7C240B664F1Da4DD100141AE71F';
export const USDT_BSC_CONTRACT = '0x55d398326f99059fF775485246999027B3197955';
export const KWT_BSC_CONTRACT = '0x257a8d1E03D17B8535a182301f15290F11674b53';
export const MILKY_BSC_CONTRACT = '0x6fE3d0F096FC932A905accd1EB1783F6e4cEc717';

// erc20 contracts
export const ORAI_ETH_CONTRACT = '0x4c11249814f11b9346808179Cf06e71ac328c1b5';
export const MILKY_ERC_CONTRACT = '0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75';
export const ORAIX_DENOM = 'ORAIX';
export const scORAI_DENOM = 'scorai';
export const KWT_DENOM = ORAI_BRIDGE_EVM_DENOM_PREFIX + KWT_BSC_CONTRACT;
export const MILKY_DENOM = ORAI_BRIDGE_EVM_DENOM_PREFIX + MILKY_BSC_CONTRACT;

// Kawaiiverse subnetwork
export const KAWAII_RPC = 'https://tendermint1.kawaii.global';
export const KAWAII_LCD = 'https://cosmos1.kawaii.global';
export const KAWAII_API_DEV = 'https://developers.kawaii.global';
export const KAWAII_CONTRACT = '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd';
export const KAWAII_SUBNET_RPC = 'https://endpoint1.kawaii.global';

// noti install owallet chorme extensions
export const NOTI_INSTALL_OWALLET = {
  message: 'You need to install OWallet or Keplr to continue.',
  customLink:
    'https://chrome.google.com/webstore/detail/owallet/hhejbopdnpbjgomhpmegemnjogflenga',
  textLink: 'View on store'
};
