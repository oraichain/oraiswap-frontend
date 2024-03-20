import { useQuery } from '@tanstack/react-query';
import DoneStepImg from 'assets/images/done-step.svg';
import cn from 'classnames/bind';
import Modal from 'components/Modal';
import Pie from 'components/Pie';
import TokenBalance from 'components/TokenBalance';
import { TokenItemType } from '@oraichain/oraidex-common';
import { getPoolTokens } from 'config/pools';
import { useCoinGeckoPrices } from 'hooks/useCoingecko';
import { toDisplay } from '@oraichain/oraidex-common';
import { SelectTokenModal } from 'components/Modals/SelectTokenModal';
import { FC, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { fetchTokenInfo } from 'rest/api';
import { RootState } from 'store/configure';
import styles from './NewPoolModal.module.scss';

const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
}

const steps = ['Set token ratio', 'Add Liquidity', 'Confirm'];

const NewPoolModal: FC<ModalProps> = ({ isOpen, close, open }) => {
  const { data: prices } = useCoinGeckoPrices();
  const [step, setStep] = useState(1);
  const [isSelectingToken, setIsSelectingToken] = useState<'token1' | 'token2' | null>(null);
  const [token1, setToken1] = useState<string | null>(null);
  const [token2, setToken2] = useState<string | null>(null);
  const [listToken1Option, setListToken1Option] = useState<TokenItemType[]>(getPoolTokens());
  const [listToken2Option, setListToken2Option] = useState<TokenItemType[]>(getPoolTokens());
  const [supplyToken1, setSupplyToken1] = useState(0);
  const [supplyToken2, setSupplyToken2] = useState(0);
  const [amountToken1, setAmountToken1] = useState(0);
  const [amountToken2, setAmountToken2] = useState(0);
  const amounts = useSelector((state: RootState) => state.token.amounts);
  const tokenObj1 = getPoolTokens().find((token) => token?.denom === token1);
  const tokenObj2 = getPoolTokens().find((token) => token?.denom === token2);

  const { data: token1InfoData } = useQuery(['token-info', token1], () => fetchTokenInfo(tokenObj1!), {
    enabled: !!tokenObj1
  });

  const { data: token2InfoData } = useQuery(['token-info', token2], () => fetchTokenInfo(tokenObj2!), {
    enabled: !!tokenObj2
  });

  const token1Balance = BigInt(amounts[tokenObj1?.denom] ?? '0');
  const token2Balance = BigInt(amounts[tokenObj2?.denom] ?? '0');

  const Token1Icon = tokenObj1?.Icon;
  const Token2Icon = tokenObj2?.Icon;

  const getBalanceValue = (tokenSymbol: string | undefined, amount: number | string) => {
    if (!tokenSymbol) return 0;
    const coingeckoId = getPoolTokens().find((token) => token.name === tokenSymbol)?.coinGeckoId;
    const pricePer = prices[coingeckoId!] ?? 0;

    return pricePer * +amount;
  };

  const step1Component = (
    <>
      <div className={cx('supply')}>
        <div className={cx('header')}>
          <div className={cx('title')}>Supply</div>
        </div>
        <div className={cx('input')}>
          <div className={cx('token')} onClick={() => setIsSelectingToken('token1')}>
            {!!token1 ? (
              (() => {
                return (
                  <>
                    {Token1Icon && <Token1Icon className={cx('logo')} />}
                    <div className={cx('title')}>
                      <div>{token1InfoData?.symbol ?? ''}</div>
                      <div className={cx('des')}>Cosmos Hub</div>
                    </div>
                    <div className={cx('arrow-down')} />
                  </>
                );
              })()
            ) : (
              <>
                <div className={cx('placeholder-logo')} />
                <span className={cx('title')}>Select assets</span>
                <div className={cx('arrow-down')} />
              </>
            )}
          </div>
          <div className={cx('amount')}>
            <NumberFormat
              placeholder="0"
              thousandSeparator
              decimalScale={6}
              type="text"
              value={supplyToken1 ? supplyToken1 : ''}
              onValueChange={({ floatValue }) => {
                setSupplyToken1(floatValue ?? 0);
              }}
            />
            <span>%</span>
          </div>
        </div>
      </div>
      <div className={cx('supply')}>
        <div className={cx('header')}>
          <div className={cx('title')}>Supply</div>
        </div>
        <div className={cx('input')}>
          <div className={cx('token')} onClick={() => setIsSelectingToken('token2')}>
            {!!token2 ? (
              (() => {
                return (
                  <>
                    {Token2Icon && <Token2Icon className={cx('logo')} />}
                    <div className={cx('title')}>
                      <div>{token2InfoData?.symbol ?? ''}</div>
                      <div className={cx('highlight')}>Cosmos Hub</div>
                    </div>
                    <div className={cx('arrow-down')} />
                  </>
                );
              })()
            ) : (
              <>
                <div className={cx('placeholder-logo')} />
                <span className={cx('title')}>Select assets</span>
                <div className={cx('arrow-down')} />
              </>
            )}
          </div>
          <div className={cx('amount')}>
            <NumberFormat
              placeholder="0"
              thousandSeparator
              decimalScale={6}
              type="text"
              value={supplyToken2 ? supplyToken2 : ''}
              onValueChange={({ floatValue }) => {
                setSupplyToken2(floatValue ?? 0);
              }}
            />
            <span>%</span>
          </div>
        </div>
      </div>
      <div className={cx('swap-btn')} onClick={() => setStep(2)}>
        Next
      </div>
    </>
  );

  const step2Component = (
    <>
      <div className={cx('supply')}>
        <div className={cx('header')}>
          <div className={cx('title')}>Supply</div>
          <div className={cx('percent')}>{supplyToken1}%</div>
        </div>
        <div className={cx('balance')}>
          <TokenBalance
            balance={{
              amount: token1Balance,
              denom: token1InfoData?.symbol
            }}
            prefix="Balance: "
            decimalScale={6}
          />
          <div
            className={cx('btn')}
            onClick={() => setAmountToken1(toDisplay(token1Balance, token1InfoData?.decimals))}
          >
            MAX
          </div>
          <div
            className={cx('btn')}
            onClick={() => setAmountToken1(toDisplay(token1Balance / BigInt(2), token1InfoData?.decimals))}
          >
            HALF
          </div>
          <TokenBalance
            balance={getBalanceValue(token1InfoData?.symbol ?? '', toDisplay(token1Balance, token1InfoData?.decimals))}
            style={{ flexGrow: 1, textAlign: 'right' }}
            decimalScale={2}
          />
        </div>
        <div className={cx('input')}>
          <div className={cx('token')}>
            {Token1Icon && <Token1Icon className={cx('logo')} />}
            <div className={cx('title')}>
              <div>{token1InfoData?.symbol}</div>
              <div className={cx('des')}>Cosmos Hub</div>
            </div>
          </div>
          <NumberFormat
            placeholder="0"
            className={cx('amount')}
            thousandSeparator
            decimalScale={6}
            type="text"
            value={!!amountToken1 ? amountToken1 : ''}
            onValueChange={({ floatValue }) => {
              setAmountToken1(floatValue);
            }}
          />
        </div>
      </div>

      <div className={cx('supply')}>
        <div className={cx('header')}>
          <div className={cx('title')}>Supply</div>
          <div className={cx('percent')}>{supplyToken2}%</div>
        </div>
        <div className={cx('balance')}>
          <TokenBalance
            balance={{
              amount: token2Balance,
              denom: token2InfoData?.symbol
            }}
            prefix="Balance: "
            decimalScale={6}
          />
          <div
            className={cx('btn')}
            onClick={() => setAmountToken2(toDisplay(token2Balance, token2InfoData?.decimals))}
          >
            MAX
          </div>
          <div
            className={cx('btn')}
            onClick={() => setAmountToken2(toDisplay(token2Balance / BigInt(2), token2InfoData?.decimals))}
          >
            HALF
          </div>
          <TokenBalance
            balance={getBalanceValue(token2InfoData?.symbol ?? '', toDisplay(token2Balance, token2InfoData?.decimals))}
            style={{ flexGrow: 1, textAlign: 'right' }}
            decimalScale={2}
          />
        </div>
        <div className={cx('input')}>
          <div className={cx('token')}>
            {Token2Icon && <Token2Icon className={cx('logo')} />}
            <div className={cx('title')}>
              <div>{token2InfoData?.symbol}</div>
              <div className={cx('highlight')}>Cosmos Hub</div>
            </div>
          </div>
          <NumberFormat
            placeholder="0"
            className={cx('amount')}
            thousandSeparator
            decimalScale={6}
            type="text"
            value={!!amountToken2 ? amountToken2 : ''}
            onValueChange={({ floatValue }) => {
              setAmountToken2(floatValue);
            }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div className={cx('back-btn')} onClick={() => setStep(1)}>
          Back
        </div>
        <div
          className={cx('swap-btn')}
          onClick={() => {
            setStep(3);
          }}
        >
          Next
        </div>
      </div>
    </>
  );

  const step3Component = (
    <>
      <div className={cx('stat')}>
        <Pie percent={50}>
          {token1InfoData?.symbol}/${token2InfoData?.symbol}
        </Pie>
        <div className={cx('stats_info')}>
          <div className={cx('stats_info_row')}>
            <div className={cx('stats_info_cl')} style={{ background: '#612FCA' }} />
            {Token1Icon && <Token1Icon className={cx('stats_info_lg')} />}
            <div className={cx('stats_info_name')}>{token1InfoData?.symbol}</div>
            <div className={cx('stats_info_percent')}>{supplyToken1}%</div>
            <div className={cx('stats_info_value_amount')}>{amountToken1}</div>
          </div>
          <div className={cx('stats_info_row')}>
            <TokenBalance
              balance={getBalanceValue(token1InfoData?.symbol ?? '', +amountToken1)}
              className={cx('stats_info_value_usd')}
              decimalScale={2}
            />
          </div>
          <div className={cx('stats_info_row')}>
            <div className={cx('stats_info_cl')} style={{ background: '#FFD5AE' }} />
            {Token2Icon && <Token2Icon className={cx('stats_info_lg')} />}
            <div className={cx('stats_info_name')}>{token2InfoData?.symbol}</div>
            <div className={cx('stats_info_percent')}>{supplyToken2}%</div>
            <div className={cx('stats_info_value_amount')}>{amountToken2}</div>
          </div>
          <div className={cx('stats_info_row')}>
            <TokenBalance
              balance={getBalanceValue(token2InfoData?.symbol ?? '', +amountToken2)}
              className={cx('stats_info_value_usd')}
              decimalScale={2}
            />
          </div>
        </div>
      </div>
      <div className={cx('supply')}>
        <div className={cx('input')}>
          <div className={cx('token')}>
            <span className={cx('title')}>Swap Fee</span>
          </div>
          <div className={cx('amount')}>
            <NumberFormat
              placeholder="0"
              thousandSeparator
              decimalScale={6}
              type="text"
            // value={supplyToken2 ? supplyToken2 : ''}
            // onValueChange={({ floatValue }) => {
            //   setSupplyToken2(floatValue);
            // }}
            />
            <span>%</span>
          </div>
        </div>
      </div>
      <div className={cx('detail')}>
        <div className={cx('row')}>
          <div className={cx('row-title')}>
            <span>Pool Creation Fee</span>
            {/* <TooltipIcon /> */}
          </div>
          <span>50 ORAI</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div className={cx('back-btn')} onClick={() => setStep(2)}>
          Back
        </div>
        <div className={cx('swap-btn')} onClick={() => { }}>
          Create
        </div>
      </div>
    </>
  );

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true} className={cx('modal')}>
      <div className={cx('container')}>
        <div className={cx('title')}>Create new pool</div>
        <div className={cx('steps')}>
          <div className={cx('progress')}>
            <div className={cx('purple-line')} style={{ width: `${50 * (step - 1)}%` }} />
            <div className={cx('white-line')} />
            {steps.map((undefine, _idx) => {
              const idx = _idx + 1;
              if (step > idx)
                return <img key={idx} className={cx('done', `point-${idx}`)} alt="done-step" src={DoneStepImg} />;
              if (step === idx)
                return (
                  <div key={idx} className={cx('point', `point-${idx}`, 'highlight')}>
                    {idx}
                  </div>
                );
              return (
                <div key={idx} className={cx('point', `point-${idx}`)}>
                  {idx}
                </div>
              );
            })}
          </div>
          <div className={cx('text')}>
            {steps.map((step, idx) => (
              <div key={idx} className={cx(`point-${idx + 1}`)}>
                {step}
              </div>
            ))}
          </div>
        </div>
        {(() => {
          if (step === 1) return step1Component;
          if (step === 2) return step2Component;
          if (step === 3) return step3Component;
        })()}
      </div>
      <SelectTokenModal
        isOpen={isSelectingToken === 'token1'}
        open={() => setIsSelectingToken('token1')}
        close={() => setIsSelectingToken(null)}
        prices={prices}
        setToken={(token1: string) => {
          setToken1(token1);
          setListToken2Option(getPoolTokens().filter((t) => t.denom !== token1));
        }}
        amounts={amounts}
        items={listToken1Option}
      />
      <SelectTokenModal
        isOpen={isSelectingToken === 'token2'}
        open={() => setIsSelectingToken('token2')}
        close={() => setIsSelectingToken(null)}
        prices={prices}
        amounts={amounts}
        setToken={(token2: string) => {
          setToken2(token2);
          setListToken1Option(getPoolTokens().filter((t) => t.denom !== token2));
        }}
        items={listToken2Option}
      />
    </Modal>
  );
};

export default NewPoolModal;
