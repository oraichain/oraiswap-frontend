import { ReactComponent as UsdcIcon } from 'assets/icons/usd_coin.svg';
import { Button } from 'components/Button';
import { useEffect } from 'react';
import TokenBalance from 'components/TokenBalance';
import { useState } from 'react';
import InputBalance from '../InputBalance';
import InputRange from '../InputRange';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configure';
import { getUsd } from 'libs/utils';
import styles from './index.module.scss';
import { flattenTokens } from 'config/bridgeTokens';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { toAmount, toDisplay, ORAIX_CONTRACT } from '@oraichain/oraidex-common';
import { CoharvestBidPoolTypes } from "@oraichain/oraidex-contracts-sdk"
import { useGetPotentialReturn } from 'pages/CoHarvest/hooks/useGetBidRound';
import { numberWithCommas, formatDisplayUsdt } from 'pages/Pools/helpers';
import { fromBinary, toBinary } from "@cosmjs/cosmwasm-stargate";
import useConfigReducer from 'hooks/useConfigReducer';
import { network } from 'config/networks';
import { TToastType, displayToast } from 'components/Toasts/Toast';
import { getTransactionUrl, handleErrorTransaction } from 'helper';
import { useDebounce } from 'pages/CoHarvest/hooks/useDebounce';

const Bidding = ({ isEnd, round }: { isEnd: boolean, round: number }) => {
  const [range, setRange] = useState(1);
  const [amount, setAmount] = useState(0);
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const { data: prices } = useCoinGeckoPrices();
  const balance = amounts['oraix'];
  const ORAI_TOKEN_INFO = flattenTokens.find(e => e.coinGeckoId === "oraidex")
  const amountUsd = getUsd(toAmount(amount), ORAI_TOKEN_INFO, prices);
  const [address] = useConfigReducer('address');
  const rangeDebounce = useDebounce(range, 1000);
  const { potentialReturn, refetchPotentialReturn } = useGetPotentialReturn({
    bidAmount: toAmount(amount).toString(),
    exchangeRate: "13426", // TODO: hardcode simulate test
    round: round,
    slot: range,
  });

  useEffect(() => {
    refetchPotentialReturn();
  }, [rangeDebounce]);

  const esimateReceive = potentialReturn?.residue_bid || "0"
  return (
    <div className={styles.bidding}>
      <div className={styles.title}>Co-Harvest #{round}</div>
      <div className={styles.content}>
        <InputBalance balance={balance} amount={amount} onChangeAmount={setAmount} />
        <div className={styles.interest}>
          <div className={styles.interestTitle}>Interest</div>
          <InputRange className={styles.range} value={range} onChange={(value) => setRange(+value)} />
          <div className={styles.explain}>Get {range}% interest on your bid</div>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.bidValue}>
          <span>Bid value</span>
          <div className={styles.usd}>{formatDisplayUsdt(amountUsd)}</div>
        </div>

        <div className={styles.return}>
          <span>Potential return</span>
          <div className={styles.value}>
            <div className={styles.usdReturn}>{toDisplay(esimateReceive)} ORAIX </div>
            <div className={styles.balance}>
              <div className={styles.token}>{formatDisplayUsdt(amountUsd)}</div>
              <UsdcIcon />
              {/* <TokenBalance
                balance={{
                  amount: '1000',
                  denom: 'USDC',
                  decimals: 6
                }}
              /> */}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.button}>
        <Button type="primary" onClick={async () => {
          try {
            const result = await window.client.execute(
              address,
              ORAIX_CONTRACT,
              {
                send: {
                  contract: network.bid_pool,
                  amount: toAmount(amount).toString(),
                  msg: toBinary({
                    submit_bid: {
                      premium_slot: range,
                      round,
                    },
                  }),
                },
              },
              "auto"
            );
            if (result && result.transactionHash) {
              displayToast(TToastType.TX_SUCCESSFUL, {
                customLink: getTransactionUrl(network.chainId, result.transactionHash)
              });
            }
          } catch (error) {
            console.log({ error });
            handleErrorTransaction(error, {
              tokenName: "ORAIX",
              chainName: network.chainId,
            });
          }
        }} icon={null} disabled={isEnd}>
          Place a bid
        </Button>
      </div>
    </div>
  );
};

export default Bidding;
