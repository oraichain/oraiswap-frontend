import useConfigReducer from 'hooks/useConfigReducer';
import styles from './Escrow.module.scss';
import { toDisplay } from '@oraichain/oraidex-common';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { useContext, useState } from 'react';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { handleErrorTransaction } from 'helper';
import { useGetEscrowBalance } from 'pages/BitcoinDashboard/hooks';
import { OraiBTCBridgeNetwork } from 'config/chainInfos';
import { fromBech32, toBech32 } from '@cosmjs/encoding';
import { NomicContext } from 'context/nomic-context';
import { makeStdTx } from '@cosmjs/amino';
import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { config } from 'libs/nomic/config';
import Long from 'long';
import { SigningStargateClient } from '@cosmjs/stargate';
import { Coin } from '@cosmjs/proto-signing';

const Escrow = () => {
  const [theme] = useConfigReducer('theme');
  const [address] = useConfigReducer('address');
  const [loading, setLoading] = useState<boolean>(false);
  const data = useGetEscrowBalance(deriveNomicAddress(address));
  const nomic = useContext(NomicContext);

  function deriveNomicAddress(addr: string) {
    let address = fromBech32(addr);
    return toBech32(OraiBTCBridgeNetwork.bech32Config.bech32PrefixAccAddr, address.data);
  }

  const handleClaim = async () => {
    setLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const btcAddr = await window.Bitcoin.getAddress();
      if (!btcAddr) throw Error('Not found your bitcoin address!');
      // @ts-ignore-check
      const oraiBtcAddress = await window.Keplr.getKeplrAddr(OraiBTCBridgeNetwork.chainId);
      //   const timeoutTimestampSeconds = Math.floor((Date.now() + 60 * 60 * 1000) / 1000);
      //   const timeoutTimestampNanoseconds = Long.fromNumber(timeoutTimestampSeconds).multiply(1000000000);
      if (btcAddr && oraiBtcAddress) {
        const client = await SigningStargateClient.connectWithSigner(
          'https://btc.rpc.orai.io',
          window.owallet.getOfflineSigner('oraibtc-mainnet-1')
        );

        console.log(await client.getChainId());

        await client.sendIbcTokens(
          deriveNomicAddress(address),
          address,
          {
            denom: 'usat',
            amount: (data?.escrow_balance || 0).toString()
          },
          'transfer',
          'channel-1',
          undefined,
          3600,
          {
            amount: [{ amount: '0', denom: 'uoraibtc' }],
            gas: '0'
          }
        );
        // const accountInfo = await nomic.getAccountInfo(oraiBtcAddress);

        // const signDoc = {
        //   account_number: accountInfo?.account?.account_number,
        //   chain_id: OraiBTCBridgeNetwork.chainId,
        //   fee: { amount: [{ amount: '0', denom: 'uoraibtc' }], gas: '10000' },
        //   memo: '',
        //   msgs: [
        //     // {
        //     //   type: 'nomic/MsgClaimIbcBitcoin',
        //     //   value: {}
        //     // }
        //     {
        //       type: 'nomic/MsgIbcTransferOut',
        //       value: {
        //         channel_id: 'channel-1',
        //         port_id: 'transfer',
        //         denom: 'usat',
        //         amount: data?.escrow_balance || 0,
        //         sender: deriveNomicAddress(address),
        //         receiver: address,
        //         timeout_timestamp: timeoutTimestampNanoseconds.toString(),
        //         memo: ''
        //       }
        //     }
        //   ],
        //   sequence: accountInfo?.account?.sequence
        // };

        // const signature = await window.owallet.signAmino(config.chainId, oraiBtcAddress, signDoc);
        // const tx = makeStdTx(signDoc, signature.signature);
        // const tmClient = await Tendermint37Client.connect(config.rpcUrl);

        // const result = await tmClient.broadcastTxSync({ tx: Uint8Array.from(Buffer.from(JSON.stringify(tx))) });
        //@ts-ignore
        displayToast(result.code === 0 ? TToastType.TX_SUCCESSFUL : TToastType.TX_FAILED, {
          message: 'result?.log'
        });
      }
    } catch (error) {
      console.log('error in claim: ', error);
      handleErrorTransaction(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.escrow}>
      <h3 className={styles.escrow_title}>Escrow:</h3>
      <div className={styles.stakeInfo}>
        <div className={styles.info}>
          <div className={styles.item}>
            <div className={styles.title}>Total Stucked BTC Amount:</div>
            <div className={styles.usd}>{toDisplay((data?.escrow_balance || 0).toString(), 14)} BTC</div>
          </div>
        </div>

        <div className={styles.itemBtn}>
          <Button type="primary" onClick={() => handleClaim()} disabled={loading}>
            {loading && <Loader width={22} height={22} />}&nbsp;
            <span>Claim</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Escrow;
