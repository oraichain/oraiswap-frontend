class Config {
  chainId: string;
  chainName: string;
  stakingUrl: string;
  rpcUrl: string;
  restUrl: string;
  relayerUrl: string;

  constructor() {
    this.chainId = 'oraibtc-subnet-1';
    this.chainName = 'OraiBtcSubnet';
    this.stakingUrl = '';
    this.rpcUrl = 'https://btc.rpc.orai.io';
    this.restUrl = 'https://btc.lcd.orai.io';
    this.relayerUrl = 'https://oraibtc.relayer.orai.io';
  }
}

export const config = new Config();
