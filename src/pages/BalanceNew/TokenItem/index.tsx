import classNames from 'classnames';
import styles from './index.module.scss';
import TokenBalance from 'components/TokenBalance';
import { TokenItemType, tokenMap } from 'config/bridgeTokens';
import TransferConvertToken from '../TransferConvertToken';
import { TooltipIcon } from 'components/Tooltip';
import { isMobile } from '@walletconnect/browser-utils';
interface TokenItemProps {
  token: TokenItemType;
  amountDetail?: [string, number];
  convertToken?: any;
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
  convertToken,
  transferIBC,
  onClickTransfer,
  convertKwt,
  subAmounts
}) => {
  const [amount, usd] = amountDetail;
  return (
    <div
      className={classNames(styles.tokenWrapper, { [styles.active]: active }, className)}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(token);
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
                amount: amount ?? '0',
                denom: '',
                decimals: token.decimals
              }}
              className={styles.tokenAmount}
              decimalScale={Math.min(6, token.decimals)}
            />
          </div>
          <TokenBalance balance={usd} className={styles.subLabel} decimalScale={2} />
        </div>
      </div>
      <div>
        {active && (
          <TransferConvertToken
            token={token}
            subAmounts={subAmounts}
            amountDetail={amountDetail}
            convertToken={convertToken}
            transferIBC={transferIBC}
            onClickTransfer={onClickTransfer}
            convertKwt={convertKwt}
          />
        )}

        {/* // TODO: {active && token.contractAddress && token.cosmosBased && (
          <ConvertToNative
            name={evmName}
            token={token}
            amountDetail={amountDetail}
            convertToken={convertToken}
          />
        )} */}
      </div>
    </div>
  );
};

export default TokenItem;
