import React, { FC } from 'react';
import Modal from 'components/Modal';
import styles from './SelectTokenModal.module.scss';
import cn from 'classnames/bind';
import { TokenItemType, tokenMap } from 'config/bridgeTokens';
import { getSubAmountDetails, getTotalUsd, toAmount, toDisplay, toSumDisplay } from 'libs/utils';
import { NetworkType } from 'helper';
import { CoinGeckoPrices } from 'hooks/useCoingecko';

const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
  amounts: AmountDetails;
  prices: CoinGeckoPrices<string>;
  listToken: TokenItemType[] | NetworkType[];
  setToken: (denom: string) => void;
  type?: 'token' | 'network';
}

const SelectTokenModal: FC<ModalProps> = ({
  type = 'token',
  isOpen,
  close,
  open,
  listToken,
  setToken,
  prices,
  amounts
}) => {
  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true}>
      <div className={cx('select')}>
        <div className={cx('title')}>
          <div>{type === 'token' ? 'Select a token' : 'Select a network'}</div>
        </div>
        <div className={cx('options')}>
          {listToken.map((item: TokenItemType | NetworkType) => {
            let key: string, title: string, balance: string;

            if (type === 'token') {
              const token = item as TokenItemType;
              key = token.denom;
              title = token.name;
              let amount: bigint | number = BigInt(amounts[token.denom]);
              let subAmounts: AmountDetails;
              if (token.contractAddress && token.evmDenoms) {
                subAmounts = getSubAmountDetails(amounts, token);
                const subAmount = toAmount(toSumDisplay(subAmounts), token.decimals);
                amount += subAmount;
              }
              amount = toDisplay(amount, token.decimals);
              balance = amount > 0 ? amount.toFixed(6) : '0';
            } else {
              const network = item as NetworkType;
              key = network.chainId.toString();
              title = network.title;
              const subAmounts = Object.fromEntries(
                Object.entries(amounts).filter(([denom]) => tokenMap?.[denom]?.chainId === network.chainId)
              );
              const totalUsd = getTotalUsd(subAmounts, prices);
              balance = '$' + (totalUsd > 0 ? totalUsd.toFixed(2) : '0');
            }
            return (
              <div
                className={cx('item')}
                key={key}
                onClick={() => {
                  setToken(key);
                  close();
                }}
              >
                {item.Icon && <item.Icon className={cx('logo')} />}
                <div className={cx('grow')}>
                  <div>{title}</div>
                </div>
                <div>{balance}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default SelectTokenModal;
