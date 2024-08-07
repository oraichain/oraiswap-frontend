import { BigDecimal, toDisplay, TokenItemType } from '@oraichain/oraidex-common';
import { TonbridgeBridgeClient } from '@oraichain/tonbridge-contracts-sdk';
import { tonNetworkMainnet } from 'config/chainInfos';
import { network } from 'config/networks';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect, useState } from 'react';

const useGetFee = ({ token }: { token: TokenItemType }) => {
  const [oraiAddress] = useConfigReducer('address');
  const [bridgeFee, setBridgeFee] = useState(0);
  const [tokenFee, setTokenFee] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        if (token) {
          const tokenInTon = tonNetworkMainnet.currencies.find((tk) => tk.coinGeckoId === token.coinGeckoId);
          if (!tokenInTon) {
            return;
          }

          const tonBridgeClient = new TonbridgeBridgeClient(window.client, oraiAddress, network.CW_TON_BRIDGE);

          const tokenFeeConfig = await tonBridgeClient.tokenFee({
            remoteTokenDenom: tokenInTon?.contractAddress
          });

          if (tokenFeeConfig) {
            const { nominator, denominator } = tokenFeeConfig;
            const fee = new BigDecimal(nominator).div(denominator).toNumber();

            setTokenFee(fee);
          }
        }
      } catch (error) {
        if (error.message.toString().includes('type: tonbridge_bridge::state::Ratio; key:')) {
          setTokenFee(0);
        } else {
          console.log(error);
        }
      }
    })();
  }, [token, oraiAddress]);

  useEffect(() => {
    (async () => {
      const tonBridgeClient = new TonbridgeBridgeClient(window.client, oraiAddress, network.CW_TON_BRIDGE);

      const config = await tonBridgeClient.config();
      if (config) {
        const { relayer_fee } = config;

        setBridgeFee(toDisplay(relayer_fee));
      }
    })();
  }, []);

  return {
    bridgeFee,
    tokenFee
  };
};

export default useGetFee;
