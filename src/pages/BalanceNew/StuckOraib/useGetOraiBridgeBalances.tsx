import { Coin, StargateClient } from '@cosmjs/stargate';
import { TokenItemType, tokens } from 'config/bridgeTokens';
import { ORAI_BRIDGE_CHAIN_ID, ORAI_BRIDGE_RPC, ORAI_BRIDGE_UDENOM } from 'config/constants';
import { toDisplay } from 'libs/utils';
import { useEffect, useState } from 'react';

export type RemainingOraibTokenItem = TokenItemType & { amount: string };
export default function useGetOraiBridgeBalances(moveOraib2OraiLoading: boolean) {
  const [remainingOraib, setRemainingOraib] = useState<RemainingOraibTokenItem[]>([]);
  const [otherChainTokens] = tokens;

  const getBalanceOraibridge = async () => {
    try {
      const oraiBridgeAddress = await window.Keplr.getKeplrAddr(ORAI_BRIDGE_CHAIN_ID);
      if (!oraiBridgeAddress) {
        setRemainingOraib([]);
        return;
      }
      const client = await StargateClient.connect(ORAI_BRIDGE_RPC);
      const data: readonly Coin[] = await client.getAllBalances(oraiBridgeAddress);
      const remainingOraib = data
        .reduce((acc, item) => {
          // denom: "uoraib" not use => filter out
          if (item.denom !== ORAI_BRIDGE_UDENOM) {
            const findedOraib = otherChainTokens.find(
              (token: TokenItemType) => token.denom.toLowerCase() === item.denom.toLowerCase()
            );
            if (findedOraib) {
              acc.push({
                ...findedOraib,
                amount: item.amount
              });
            }
          }
          return acc;
        }, [] as RemainingOraibTokenItem[])
        .filter((token: RemainingOraibTokenItem) => toDisplay(token.amount, token.decimals) > 0);
      setRemainingOraib(remainingOraib);
    } catch (error) {
      console.log('error in getBalanceOraibridge: ', error);
    }
  };

  // refetch balance
  useEffect(() => {
    !moveOraib2OraiLoading && getBalanceOraibridge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveOraib2OraiLoading]);

  return { remainingOraib };
}
