import { toBinary } from '@cosmjs/cosmwasm-stargate';
import { fromBech32 } from '@cosmjs/encoding';
import {
  BigDecimal,
  CW20_DECIMALS,
  handleSentFunds,
  toAmount,
  toDisplay,
  TokenItemType
} from '@oraichain/oraidex-common';
import { BridgeAdapter, JettonMinter, JettonWallet } from '@oraichain/ton-bridge-contracts';
import { TonbridgeBridgeClient } from '@oraichain/tonbridge-contracts-sdk';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { Address, beginCell, Cell, toNano } from '@ton/core';
import { TonClient } from '@ton/ton';
import { Base64 } from '@tonconnect/protocol';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { oraichainTokens } from 'config/bridgeTokens';
import { TON_ZERO_ADDRESS, tonNetworkMainnet } from 'config/chainInfos';
import { network } from 'config/networks';
import { TON_SCAN, TonChainId, TonInteractionContract, TonNetwork } from 'context/ton-provider';
import { getTransactionUrl, handleErrorTransaction } from 'helper';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import useConfigReducer from 'hooks/useConfigReducer';
import { useEffect, useState } from 'react';
import useGetStateData from './useGetStateData';
import useLoadTokens from 'hooks/useLoadTokens';

const FWD_AMOUNT = toNano(0.15);
const TON_MESSAGE_VALID_UNTIL = 100000;
const BRIDGE_TON_TO_ORAI_MINIMUM_GAS = toNano(1);
const EXTERNAL_MESSAGE_FEE = toNano(0.01);
const MINIMUM_BRIDGE_PER_USD = 1; // 10; // TODO: update for product is 10

export {
  BRIDGE_TON_TO_ORAI_MINIMUM_GAS,
  EXTERNAL_MESSAGE_FEE,
  FWD_AMOUNT,
  MINIMUM_BRIDGE_PER_USD,
  TON_MESSAGE_VALID_UNTIL
};

const handleCheckBalanceBridgeOfTonNetwork = async (token: TokenItemType) => {
  try {
    // get the decentralized RPC endpoint
    const endpoint = await getHttpEndpoint();
    const client = new TonClient({
      endpoint
    });
    const bridgeAdapter = TonInteractionContract[TonNetwork.Mainnet].bridgeAdapter;

    if (token.contractAddress === TON_ZERO_ADDRESS) {
      const balance = await client.getBalance(Address.parse(bridgeAdapter));

      return {
        balance: balance
      };
    }

    const jettonMinter = JettonMinter.createFromAddress(Address.parse(token.contractAddress));
    const jettonMinterContract = client.open(jettonMinter);
    const jettonWalletAddress = await jettonMinterContract.getWalletAddress(Address.parse(bridgeAdapter));
    const jettonWallet = JettonWallet.createFromAddress(jettonWalletAddress);
    const jettonWalletContract = client.open(jettonWallet);
    const balance = await jettonWalletContract.getBalance();

    return {
      balance: balance.amount
    };
  } catch (error) {
    console.log('error :>> handleCheckBalanceBridgeOfTonNetwork', error);
  }
};

const handleCheckBalanceBridgeOfOraichain = async (token: TokenItemType) => {
  try {
    if (token) {
      if (!token.contractAddress) {
        const data = await window.client.getBalance(network.CW_TON_BRIDGE, token.denom);
        return {
          balance: data.amount
        };
      }

      const tx = await window.client.queryContractSmart(token.contractAddress, {
        balance: { address: network.CW_TON_BRIDGE }
      });

      return {
        balance: tx?.balance || 0
      };
    }
  } catch (error) {
    console.log('error :>> handleCheckBalanceBridgeOfOraichain', error);
  }
};

const checkBalanceBridgeByNetwork = async (networkFrom: string, token: TokenItemType) => {
  const handler = {
    [network.chainId]: handleCheckBalanceBridgeOfTonNetwork,
    [TonChainId]: handleCheckBalanceBridgeOfOraichain
  };

  const { balance } = handler[networkFrom] ? await handler[networkFrom](token) : { balance: 0 };

  return toDisplay((balance || '0').toString(), token.decimals || CW20_DECIMALS);
};

const useTonBridgeHandler = ({ token }: { token: TokenItemType }) => {
  const [tonAddress, setTonAddress] = useConfigReducer('tonAddress');
  const [oraiAddress, setOraiAddress] = useConfigReducer('address');

  const { balances: sentBalance, getChanelStateData } = useGetStateData();
  const loadTokenAmounts = useLoadTokens();

  const [tonConnectUI] = useTonConnectUI();
  const { data: prices } = useCoinGeckoPrices();
  const [tokenInfo, setTokenInfo] = useState({
    jettonWalletAddress: null
  });
  const [deductNativeAmount, setDeductNativeAmount] = useState(0n);

  useEffect(() => {
    if (token?.chainId === TonChainId && token?.contractAddress === TON_ZERO_ADDRESS) {
      setDeductNativeAmount(BRIDGE_TON_TO_ORAI_MINIMUM_GAS);
      return;
    }
    setDeductNativeAmount(0n);
  }, [token]);

  // @dev: this function will changed based on token minter address (which is USDT, USDC, bla bla bla)
  useEffect(() => {
    try {
      (async () => {
        if (token?.chainId !== TonChainId) return;

        // get the decentralized RPC endpoint
        const endpoint = await getHttpEndpoint();
        const client = new TonClient({
          endpoint
        });
        if (token?.contractAddress === TON_ZERO_ADDRESS) {
          setDeductNativeAmount(BRIDGE_TON_TO_ORAI_MINIMUM_GAS);
          setTokenInfo({
            jettonWalletAddress: ''
          });
          return;
        }

        const jettonMinter = JettonMinter.createFromAddress(Address.parse(token.contractAddress));
        const jettonMinterContract = client.open(jettonMinter);
        const jettonWalletAddress = await jettonMinterContract.getWalletAddress(Address.parse(tonAddress));

        setTokenInfo({
          jettonWalletAddress
        });
        setDeductNativeAmount(0n);
      })();
    } catch (error) {
      console.log('error :>>', error);
    }
  }, [token]); // toNetwork, tonAddress

  const validatePrice = (token: TokenItemType, amount: number) => {
    const usdPrice = new BigDecimal(amount || 0).mul(prices?.[token?.coinGeckoId] || 0).toNumber();

    const minimumAmount = Math.ceil((MINIMUM_BRIDGE_PER_USD * amount * 100) / usdPrice) / 100;

    if (amount < minimumAmount) {
      throw Error(`Minimum bridge is ${minimumAmount} ${token.name}`);
    }
  };

  const handleBridgeFromTon = async (amount: number | string) => {
    try {
      if (!oraiAddress) {
        throw new Error('Please connect OWallet or Kelpr!');
      }

      if (!tonAddress) {
        throw new Error('Please connect Ton Wallet');
      }

      if (!token || !amount) {
        throw new Error('Not valid!');
      }

      validatePrice(token, Number(amount));

      const tokenInOrai = oraichainTokens.find((tk) => tk.coinGeckoId === token.coinGeckoId);
      const balanceMax = await checkBalanceBridgeByNetwork(TonChainId, tokenInOrai);

      if (Number(balanceMax) < Number(amount) && token.contractAddress !== TON_ZERO_ADDRESS) {
        throw new Error(
          `The bridge contract does not have enough balance to process this bridge transaction. Wanted ${amount} ${token.name}, have ${balanceMax} ${token.name}`
        );
      }

      const bridgeAdapterAddress = Address.parse(TonInteractionContract[TonNetwork.Mainnet].bridgeAdapter);
      const fmtAmount = new BigDecimal(10).pow(token.decimals).mul(amount);
      const isNativeTon: boolean = token.contractAddress === TON_ZERO_ADDRESS;
      const toAddress: string = isNativeTon
        ? bridgeAdapterAddress.toString()
        : tokenInfo.jettonWalletAddress?.toString();
      const oraiAddressBech32 = fromBech32(oraiAddress).data;
      const gasAmount = isNativeTon
        ? fmtAmount.add(BRIDGE_TON_TO_ORAI_MINIMUM_GAS).toString()
        : BRIDGE_TON_TO_ORAI_MINIMUM_GAS.toString();
      const timeout = BigInt(Math.floor(new Date().getTime() / 1000) + 3600);
      const memo = beginCell().endCell();

      const getNativeBridgePayload = () =>
        BridgeAdapter.buildBridgeTonBody(
          {
            amount: BigInt(fmtAmount.toString()),
            memo,
            remoteReceiver: oraiAddress,
            timeout
          },
          oraiAddressBech32,
          {
            queryId: 0,
            value: toNano(0) // don't care this
          }
        ).toBoc();

      const getOtherBridgeTokenPayload = () =>
        JettonWallet.buildSendTransferPacket(
          Address.parse(tonAddress),
          {
            fwdAmount: FWD_AMOUNT,
            jettonAmount: BigInt(fmtAmount.toString()),
            jettonMaster: Address.parse(token.contractAddress),
            remoteReceiver: oraiAddress,
            timeout,
            memo,
            toAddress: bridgeAdapterAddress
          },
          0
        ).toBoc();

      const boc = isNativeTon ? getNativeBridgePayload() : getOtherBridgeTokenPayload();

      const tx = await tonConnectUI.sendTransaction({
        validUntil: TON_MESSAGE_VALID_UNTIL,
        messages: [
          {
            address: toAddress, // dia chi token
            amount: gasAmount, // gas
            payload: Base64.encode(boc)
          }
        ]
      });

      const txHash = Cell.fromBoc(Buffer.from(tx.boc, 'base64'))[0].hash().toString('hex');

      if (txHash) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${TON_SCAN}/transaction/${txHash}`
        });

        loadTokenAmounts({ oraiAddress, tonAddress });
        getChanelStateData();

        return txHash;
      }
    } catch (error) {
      console.log('error Bridge from TON :>>', error);

      handleErrorTransaction(error, {
        tokenName: token.name,
        chainName: token.chainId
      });
    }
  };

  const handleBridgeFromOraichain = async (amount: number | string) => {
    try {
      if (!oraiAddress) {
        throw new Error('Please connect OWallet or Kelpr!');
      }

      if (!tonAddress) {
        throw new Error('Please connect Ton Wallet');
      }

      if (!token || !amount) {
        throw new Error('Not valid!');
      }

      validatePrice(token, Number(amount));

      const tokenInTon = tonNetworkMainnet.currencies.find((tk) => tk.coinGeckoId === token.coinGeckoId);

      const balanceMax = (sentBalance || []).find((b) => b.native.denom === tokenInTon.contractAddress)?.native.amount;

      // const balanceMax = await checkBalanceBridgeByNetwork(
      //   NetworkList.oraichain.id,
      //   tokenInTon
      // );

      const displayBalance = toDisplay(balanceMax, tokenInTon?.coinDecimals || CW20_DECIMALS);

      if (displayBalance < Number(amount) && token.contractAddress !== null) {
        throw new Error(
          `The bridge contract does not have enough balance to process this bridge transaction. Wanted ${amount} ${token.name}, have ${displayBalance} ${token.name}`
        );
      }

      const tonBridgeClient = new TonbridgeBridgeClient(window.client, oraiAddress, network.CW_TON_BRIDGE);

      let tx;

      const timeout = Math.floor(new Date().getTime() / 1000) + 3600;
      const msg = {
        // crcSrc: ARG_BRIDGE_TO_TON.CRC_SRC,
        denom: tonNetworkMainnet.currencies.find((tk) => tk.coinGeckoId === token.coinGeckoId).contractAddress,
        timeout,
        to: tonAddress
      };

      const funds = handleSentFunds({
        denom: token.denom,
        amount: toAmount(amount, token.decimals).toString()
      });

      // native token
      if (!token.contractAddress) {
        tx = await tonBridgeClient.bridgeToTon(msg, 'auto', null, funds);
      }
      // cw20 token
      else {
        tx = await window.client.execute(
          oraiAddress,
          token.contractAddress,
          {
            send: {
              contract: network.CW_TON_BRIDGE,
              amount: toAmount(amount, token.decimals).toString(),
              msg: toBinary({
                denom: msg.denom,
                timeout,
                to: msg.to
              })
            }
          },
          'auto'
        );
      }

      if (tx?.transactionHash) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: getTransactionUrl(token.chainId as any, tx.transactionHash)
        });

        loadTokenAmounts({ oraiAddress, tonAddress });
        getChanelStateData();

        return tx?.transactionHash;
      }
    } catch (error) {
      console.log('error Bridge from Oraichain :>>', error);
      handleErrorTransaction(error, {
        tokenName: token.name,
        chainName: token.chainId
      });
    }
  };

  return {
    handleBridgeFromOraichain,
    handleBridgeFromTon
  };
};

export default useTonBridgeHandler;
