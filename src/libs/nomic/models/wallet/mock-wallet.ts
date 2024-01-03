import { Wallet } from "./wallet";

export class MockWallet implements Wallet {
  address?: string;
  connected = false;
  name?: string;
  logo = "/keplr.svg";
  queryableBalances = ["OraiBtcSubnet"]

  async isPresent() {
      return true;
  }

  async connect() {
    this.address = "oraibtcmock12345667890";
    this.name = "usability tester";
    this.connected = true;
  }

  async sign(data: string) {
      return;
  }
}
