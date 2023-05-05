import cn from 'classnames/bind';
import Modal from 'components/Modal';
import { TokenItemType, tokenMap } from 'config/bridgeTokens';
import { CustomChainInfo } from 'config/chainInfos';
import { CoinGeckoPrices } from 'hooks/useCoingecko';
import { getSubAmountDetails, getTotalUsd, toSumDisplay, truncDecimals } from 'libs/utils';
import { FC } from 'react';
import styles from './SelectTokenModal.module.scss';

const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
  amounts: AmountDetails;
  prices: CoinGeckoPrices<string>;
  items?: TokenItemType[] | CustomChainInfo[];
  setToken: (denom: string) => void;
  type?: 'token' | 'network';
}

const SelectTokenModal: FC<ModalProps> = ({
  type = 'token',
  isOpen,
  close,
  open,
  items,
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
          {items?.map((item: TokenItemType | CustomChainInfo) => {
            let key: string, title: string, balance: string, org: string;

            if (type === 'token') {
              const token = item as TokenItemType;
              key = token.denom;
              title = token.name;
              org = token.org;
              let sumAmountDetails: AmountDetails = {};
              // by default, we only display the amount that matches the token denom
              sumAmountDetails[token.denom] = amounts[token.denom];
              let sumAmount: number = toSumDisplay(sumAmountDetails);
              // if there are sub-denoms, we get sub amounts & calculate sum display of both sub & main amount
              if (token.evmDenoms) {
                const subAmounts = getSubAmountDetails(amounts, token);
                sumAmountDetails = { ...sumAmountDetails, ...subAmounts };
                sumAmount = toSumDisplay(sumAmountDetails);
              }
              balance = sumAmount > 0 ? sumAmount.toFixed(truncDecimals) : '0';
            } else {
              const network = item as CustomChainInfo;
              key = network.chainId.toString();
              title = network.chainName;
              org = network.chainName;
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
                <item.Icon className={cx('logo')} />
                <div className={cx('grow')}>
                  <div>{title}</div>
                  <div className={cx('org')}>{org}</div>
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
