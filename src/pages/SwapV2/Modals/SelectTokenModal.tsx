import { FC } from 'react';
import Modal from 'components/Modal';
import styles from './SelectTokenModal.module.scss';
import cn from 'classnames/bind';
import { TokenItemType, tokenMap } from 'config/bridgeTokens';
import { getSubAmountDetails, getTotalUsd, toSumDisplay, truncDecimals } from 'libs/utils';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { ChainInfoCustom } from 'config/networkInfos';

const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
  amounts: AmountDetails;
  prices: CoinGeckoPrices<string>;
  listToken: TokenItemType[] | ChainInfoCustom[];
  setToken: (denom: string | ChainInfoCustom) => void;
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
          {listToken.map((item: TokenItemType | ChainInfoCustom) => {
            let key: string, title: string, balance: string;
            let network: ChainInfoCustom;
            if (type === 'token') {
              const token = item as TokenItemType;
              key = token.coinDenom;
              title = token.name;
              let sumAmountDetails: AmountDetails = {};
              // by default, we only display the amount that matches the token denom
              sumAmountDetails[token.coinDenom] = amounts[token.coinDenom];
              let sumAmount: number = toSumDisplay(sumAmountDetails);
              // if there are sub-denoms, we get sub amounts & calculate sum display of both sub & main amount
              if (token.evmDenoms) {
                const subAmounts = getSubAmountDetails(amounts, token);
                sumAmountDetails = { ...sumAmountDetails, ...subAmounts };
                sumAmount = toSumDisplay(sumAmountDetails);
              }
              balance = sumAmount > 0 ? sumAmount.toFixed(truncDecimals) : '0';
            } else {
              network = item as ChainInfoCustom;
              key = network.chainId.toString();
              title = network.chainName;
              const subAmounts = Object.fromEntries(
                Object.entries(amounts).filter(([denom]) => tokenMap?.[denom]?.chainId == network.chainId)
              );

              const totalUsd = getTotalUsd(subAmounts, prices);
              balance = '$' + (totalUsd > 0 ? totalUsd.toFixed(2) : '0');
            }
            return (
              <div
                className={cx('item')}
                key={key}
                onClick={() => {
                  setToken(network);
                  close();
                }}
              >
                <item.Icon className={cx('logo')} />
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
