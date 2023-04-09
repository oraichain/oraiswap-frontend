import { Coin } from '@cosmjs/stargate';
import { filteredTokens, TokenItemType, tokens } from 'config/bridgeTokens';
import { ORAI_BRIDGE_CHAIN_ID, ORAI_BRIDGE_UDENOM } from 'config/constants';
import { toDisplay } from 'libs/utils';
import uniqBy from 'lodash/uniqBy';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';

export type RemainingOraibTokenItem = TokenItemType & { amount: string };
export default function useGetOraiBridgeBalances(moveOraib2OraiLoading: boolean) {
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const [remainingOraib, setRemainingOraib] = useState<RemainingOraibTokenItem[]>([]);
  const [otherChainTokens] = tokens;

  const getBalanceOraibridge = async () => {
    try {
      const oraiBridgeAddress = await window.Keplr.getKeplrAddr(ORAI_BRIDGE_CHAIN_ID);
      if (!oraiBridgeAddress) {
        setRemainingOraib([]);
        return;
      }

      const data: readonly Coin[] = uniqBy(
        filteredTokens.filter((token) => !token.contractAddress && token.chainId === ORAI_BRIDGE_CHAIN_ID),
        (c) => c.coinDenom
      )
        .map((token) => ({ denom: token.coinDenom, amount: amounts[token.coinDenom] }))
        .filter((coin) => Number(coin.amount) > 0);

      const remainingOraib = data
        .reduce((acc, item) => {
          // denom: "uoraib" not use => filter out
          if (item.denom !== ORAI_BRIDGE_UDENOM) {
            const findedOraib = otherChainTokens.find(
              (token: TokenItemType) => token.coinDenom.toLowerCase() === item.denom.toLowerCase()
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
        .filter((token: RemainingOraibTokenItem) => toDisplay(token.amount, token.coinDecimals) > 0);
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
