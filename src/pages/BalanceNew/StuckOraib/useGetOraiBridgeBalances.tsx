import { TokenItemType, tokens } from "config/bridgeTokens";
import {
    ORAI_BRIDGE_CHAIN_ID,
    ORAI_BRIDGE_LCD
} from 'config/constants';
import { toDisplay } from 'libs/utils';
import { useEffect, useState } from 'react';
import token from "reducer/token";
import axios from 'rest/request';
import { Balance, BalancesOraiBridge } from '../type';

export type RemainingOraibTokenItem = TokenItemType & { amount: string };
const ORAIB_DECIMALS = 18;
export default function useGetOraiBridgeBalances(moveOraib2OraiLoading: boolean) {
    const [remainingOraib, setRemainingOraib] = useState<RemainingOraibTokenItem[]>([])

    const getBalanceOraibridge = async () => {
        try {
            const oraiBridgeAddress = await window.Keplr.getKeplrAddr(ORAI_BRIDGE_CHAIN_ID);
            if (!oraiBridgeAddress) {
                setRemainingOraib([]);
                return;
            }
            const { data }: { data: BalancesOraiBridge } = await axios.get(`${ORAI_BRIDGE_LCD}/cosmos/bank/v1beta1/balances/${oraiBridgeAddress}`);
            const [otherChainTokens] = tokens
            const remainingOraib = data.balances.filter((item: Balance) => toDisplay(item.amount, ORAIB_DECIMALS) > 0)
                .map((item: Balance) => {
                    const findedOraib = otherChainTokens.find((token: TokenItemType) => token.denom.toLowerCase() === item.denom.toLowerCase())
                    return {
                        ...findedOraib,
                        amount: item.amount 
                    } as RemainingOraibTokenItem
                })

            setRemainingOraib(remainingOraib);
        } catch (error) {
            console.log("error in getBalanceOraibridge: ", error)
        }
    };

    // refetch balance
    useEffect(() => {
        !moveOraib2OraiLoading && getBalanceOraibridge();
    }, [moveOraib2OraiLoading]);

    return { remainingOraib }
}
