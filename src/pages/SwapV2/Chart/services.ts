import axios from "rest/request";
import { BASE_API_URL } from "./constants";

export const getPriceTokenWithTF = async (tokenName: string, tf: number) => await axios.get(`${BASE_API_URL}/tokens/v2/price/${tokenName}/historical?tf=${tf}`);

export const getInfoTokenSv = async (tokenName: string) => await axios.get(`${BASE_API_URL}/tokens/v2/${tokenName}`);