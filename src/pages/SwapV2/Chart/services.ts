import axios from "rest/request";
import { BASE_API_URL } from "./constaints";
import { GetPoolLiquidity } from "./type";

export const getPoolAllSv = async () => await axios.get(`${BASE_API_URL}/pools/v2/all`);

export const getPoolLiquiditySv = async ({poolId, typeData, range}: GetPoolLiquidity) => await axios.get(
  `${BASE_API_URL}/pools/v2/liquidity/${poolId}/chart?range=${range}&&type=${typeData}`
);

export const getPoolSv = async (poolId: number) => await axios.get(`${BASE_API_URL}/pools/v2/${poolId}`);