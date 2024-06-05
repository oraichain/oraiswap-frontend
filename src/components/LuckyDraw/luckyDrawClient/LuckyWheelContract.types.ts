export type Uint256 = string;
export type Uint128 = string;
export type Addr = string;
export type AssetInfo =
  | {
      token: {
        contract_addr: Addr;
      };
    }
  | {
      native_token: {
        denom: string;
      };
    };
export interface InstantiateMsg {
  cells: Cell[];
  fee_per_spin: Uint128;
  max_limit: Uint256;
  owner: Addr;
  participation_token: AssetInfo;
  reward_token: AssetInfo;
  total_prize: Uint128;
}
export interface Cell {
  end: Uint256;
  reward: Uint128;
  start: Uint256;
}
export type ExecuteMsg =
  | {
      receive: Cw20ReceiveMsg;
    }
  | {
      update_config: {
        fee_per_spin?: Uint128 | null;
        owner?: Addr | null;
        participation_token?: AssetInfo | null;
        reward_token?: AssetInfo | null;
        total_prize?: Uint128 | null;
      };
    }
  | {
      submit_result: {
        salt: string;
      };
    }
  | {
      update_wheel_cells: {
        cells: Cell[];
      };
    }
  | {
      update_executor: {
        executor: Addr;
      };
    };
export type Binary = string;
export interface Cw20ReceiveMsg {
  amount: Uint128;
  msg: Binary;
  sender: string;
}
export type QueryMsg =
  | {
      config: {};
    }
  | {
      state: {};
    }
  | {
      spin: {
        id: number;
      };
    }
  | {
      last_spin_id: {};
    };
export interface Config {
  fee_per_spin: Uint128;
  max_limit: Uint256;
  owner: Addr;
  participation_token: AssetInfo;
  reward_token: AssetInfo;
  total_prize: Uint128;
}
export type Uint64 = number;
export interface Spin {
  id: number;
  participant: Addr;
  random_number: Uint256;
  result_time: number;
  reward: Uint128;
  spin_time: number;
}
export interface State {
  last_submit_spin: number;
  total_fee: Uint128;
  total_prize_won: Uint128;
  wheel_cells: WheelCell[];
}
export interface WheelCell {
  end: Uint256;
  num_won_prizes: number;
  reward: Uint128;
  start: Uint256;
}
