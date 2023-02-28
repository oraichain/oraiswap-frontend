import { KWT_BSC_CONTRACT, MILKY_BSC_CONTRACT } from 'config/constants';
import { oraib2oraichain } from 'config/ibcInfos';

/**
 * This function converts the destination address (from BSC / ETH -> Oraichain) to an appropriate format based on the BSC / ETH token contract address
 * @param keplrAddress - receiver address on Oraichain
 * @param contractAddress - BSC / ETH token contract address
 * @returns converted receiver address
 */
export const getOneStepKeplrAddr = (
  keplrAddress: string,
  contractAddress: string
): string => {
  let oneStepKeplrAddr = `${oraib2oraichain}/${keplrAddress}`;
  // we only support the old oraibridge ibc channel <--> Oraichain for MILKY & KWT
  if (
    contractAddress === KWT_BSC_CONTRACT ||
    contractAddress === MILKY_BSC_CONTRACT
  ) {
    oneStepKeplrAddr = keplrAddress;
  }
  return oneStepKeplrAddr;
};
