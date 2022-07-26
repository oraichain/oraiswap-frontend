import React, { useEffect, useState } from 'react';
import style from './index.module.scss';
import cn from 'classnames/bind';
import SettingModal from './Modals/SettingModal';
import SelectTokenModal from './Modals/SelectTokenModal';
import { useQuery } from 'react-query';
import useGlobalState from 'hooks/useGlobalState';
import {
  fetchBalance,
  fetchBalanceWithMapping,
  fetchTokenInfo,
  generateContractMessages,
  generateConvertErc20Cw20Message,
  TransferQuery
} from 'rest/api';
import CosmJs, { HandleOptions } from 'libs/cosmjs';
import { ORAI } from 'config/constants';
import { buildMultipleMessages, parseAmount, parseDisplayAmount } from 'libs/utils';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import TokenBalance from 'components/TokenBalance';
import { network } from 'config/networks';
import NumberFormat from 'react-number-format';
import { cw20Tokens, TokenItemType, tokens } from 'config/bridgeTokens';
import { Type } from 'rest/api';
import Loader from 'components/Loader';
import Content from 'layouts/Content';
import { Input } from 'antd';

const cx = cn.bind(style);

const Transfer: React.FC = () => {
  const [isOpenSettingModal, setIsOpenSettingModal] = useState(false);
  const [isSelectFrom, setIsSelectFrom] = useState(false);
  const [fromTokenDenom, setDenomTokens] = useState<string>('airi');
  const [fromAmount, setAmount] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [address] = useGlobalState('address');
  const [transferLoading, setTransferLoading] = useState(false);
  const [txHash, setTxHash] = useState<String>();

  const onChangeFromAmount = (amount: number) => {
    setAmount(amount);
  };

  const onChangeRecipientAddress = (address: string) => {
    if (address.match(/\s/g)) return;
    setRecipientAddress(address);
  };

  const onMaxFromAmount = (amount: number) => {
    let finalAmount = parseFloat(
      parseDisplayAmount(amount, fromTokenInfoData?.decimals) as string
    );
    setAmount(finalAmount);
  };

  const fromToken = cw20Tokens.find((token) => token.denom === fromTokenDenom);

  const {
    data: fromTokenInfoData,
    error: fromTokenInfoError,
    isError: isFromTokenInfoError,
    isLoading: isFromTokenInfoLoading
  } = useQuery(['from-token-info', fromToken], () =>
    fetchTokenInfo(fromToken!)
  );

  // suggest tokens
  useEffect(() => {
    if (fromToken) {
      window.Keplr.suggestToken(fromToken);
    }
  }, [fromToken]);

  const {
    data: fromTokenBalance = 0,
    error: fromTokenBalanceError,
    isError: isFromTokenBalanceError,
    isLoading: isFromTokenBalanceLoading
  } = useQuery(
    ['from-token-balance', fromToken, txHash],
    () =>
      fromToken.erc20Cw20Map ? fetchBalanceWithMapping(address, fromToken) : fetchBalance(
        address,
        fromToken!.denom,
        fromToken!.contractAddress,
        fromToken!.lcd
      ),
    { enabled: !!address && !!fromToken }
  );

  const handleSubmit = async () => {
    if (fromAmount <= 0)
      return displayToast(TToastType.TX_FAILED, {
        message: 'From amount should be higher than 0!'
      });

    setTransferLoading(true);
    displayToast(TToastType.TX_BROADCASTING);
    try {
      const msgs = await generateContractMessages({
        type: Type.TRANSFER,
        sender: address,
        amount: parseAmount(fromAmount, fromTokenInfoData?.decimals),
        token: fromTokenInfoData?.contractAddress,
        recipientAddress
      } as TransferQuery);

      const msgConvertsFrom = await generateConvertErc20Cw20Message(JSON.parse(JSON.stringify(fromTokenInfoData)), address);

      const msg = msgs[0];

      var messages = buildMultipleMessages(msg, msgConvertsFrom);

      const result = await CosmJs.executeMultiple({
        prefix: ORAI,
        msgs: messages,
        walletAddr: address,
        gasAmount: { denom: ORAI, amount: '0' },
      });
      if (result) {
        console.log('in correct result');
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        setTxHash(result.transactionHash);
        setTransferLoading(false);
      }
    } catch (error) {
      console.log('error in transfer form: ', error);
      let finalError = '';
      if (typeof error === 'string' || error instanceof String) {
        finalError = error as string;
      } else finalError = String(error);
      displayToast(TToastType.TX_FAILED, {
        message: finalError
      });
    } finally {
      setTransferLoading(false);
    }
  };

  const FromIcon = fromToken?.Icon;

  return (
    <Content>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div className={cx('container')}>
          <div className={cx('from')}>
            <div className={cx('header')}>
              <div className={cx('title')}>FROM</div>
            </div>
            <div className={cx('balance')}>
              <TokenBalance
                balance={{
                  amount: fromTokenBalance,
                  denom: fromTokenInfoData?.symbol ?? ''
                }}
                prefix="Balance: "
                decimalScale={6}
              />
              <div
                className={cx('btn')}
                onClick={() =>
                  onMaxFromAmount(fromTokenBalance - (fromToken?.maxGas ?? 0))
                }
              >
                MAX
              </div>
              <div
                className={cx('btn')}
                onClick={() => onMaxFromAmount(fromTokenBalance / 2)}
              >
                HALF
              </div>
            </div>
            <div className={cx('input')}>
              <div
                className={cx('token')}
                onClick={() => setIsSelectFrom(true)}
              >
                {FromIcon && <FromIcon className={cx('logo')} />}
                <span>{fromTokenInfoData?.symbol}</span>
                <div className={cx('arrow-down')} />
              </div>
              <NumberFormat
                className={cx('amount')}
                thousandSeparator
                decimalScale={6}
                type="text"
                value={fromAmount}
                onValueChange={({ floatValue }) => {
                  onChangeFromAmount(floatValue ?? 0);
                }}
              />
            </div>
            <div className={cx('header')}>
              <div className={cx('title')}>RECIPIENT</div>
            </div>
            <div className={cx('input')}>
              <Input
                placeholder="Oraichain recipient address"
                type="text"
                value={recipientAddress}
                onChange={({ target }) => {
                  onChangeRecipientAddress(target.value || '');
                }}
                style={{
                  width: '100%',
                  fontSize: 16,
                  textAlign: 'right'
                }}
              />
            </div>
          </div>
          <button
            className={cx('transfer-btn')}
            onClick={handleSubmit}
            disabled={transferLoading}
          >
            {transferLoading && <Loader width={40} height={40} />}
            <span>Transfer</span>
          </button>

          <SettingModal
            isOpen={isOpenSettingModal}
            open={() => setIsOpenSettingModal(true)}
            close={() => setIsOpenSettingModal(false)}
            slippage={slippage}
            setSlippage={setSlippage}
          />

          {isSelectFrom && (
            <SelectTokenModal
              isOpen={isSelectFrom}
              open={() => setIsSelectFrom(true)}
              close={() => setIsSelectFrom(false)}
              listToken={cw20Tokens}
              setToken={(denom) => {
                setAmount(0);
                setDenomTokens(denom);
              }}
            />
          )}
        </div>
      </div>
    </Content>
  );
};

export default Transfer;
