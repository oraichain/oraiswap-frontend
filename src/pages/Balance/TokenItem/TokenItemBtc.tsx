import classNames from 'classnames';
import styles from './index.module.scss';

import TokenItem, { TokenItemProps } from './index';

export const TokenItemBtc: React.FC<TokenItemProps> = ({ onDepositBtc, ...props }) => {
  return (
    <div>
      <TokenItem {...props} />
      <button onClick={() => onDepositBtc()}>Deposit</button>
    </div>
  );
};
