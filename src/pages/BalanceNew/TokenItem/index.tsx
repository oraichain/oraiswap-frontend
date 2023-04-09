import classNames from 'classnames';
import styles from './index.module.scss';
import TokenBalance from 'components/TokenBalance';
import { TokenItemType } from 'config/bridgeTokens';
import TransferConvertToken from '../TransferConvertToken';
interface TokenItemProps {
  token: TokenItemType;
  amountDetail?: { amount: string, usd: number };
  transferIBC?: any;
  name?: string;
  onClickTransfer?: any;
  active: Boolean;
  className?: string;
  onClick?: Function;
  onBlur?: Function;
  convertKwt?: any;
  subAmounts?: AmountDetails;
}

const TokenItem: React.FC<TokenItemProps> = ({
  token,
  amountDetail,
  active,
  className,
  onClick,
  transferIBC,
  onClickTransfer,
  convertKwt,
  subAmounts
}) => {
  return (
    <div
      className={classNames(styles.tokenWrapper, { [styles.active]: active }, className)}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <div className={styles.balanceAmountInfo}>
        <div className={styles.token}>
          {token.Icon && <token.Icon className={styles.tokenIcon} />}
          <div className={styles.tokenInfo}>
            <div className={styles.tokenName}>{token.name}</div>
          </div>
        </div>
        <div className={styles.tokenBalance}>
          <div className={styles.row}>
            <TokenBalance
              balance={{
                amount: amountDetail.amount ?? '0',
                denom: '',
                decimals: token.decimals
              }}
              className={styles.tokenAmount}
              decimalScale={Math.min(6, token.decimals)}
            />
          </div>
          <TokenBalance balance={amountDetail.usd} className={styles.subLabel} decimalScale={2} />
        </div>
      </div>
      <div>
        {active && (
          <TransferConvertToken
            token={token}
            subAmounts={subAmounts}
            amountDetail={amountDetail}
            transferIBC={transferIBC}
            onClickTransfer={onClickTransfer}
            convertKwt={convertKwt}
          />
        )}
      </div>
    </div>
  );
};

export default TokenItem;
