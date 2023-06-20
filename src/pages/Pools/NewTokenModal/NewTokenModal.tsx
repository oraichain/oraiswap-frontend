import cn from 'classnames/bind';
import Modal from 'components/Modal';
import { FC, useState } from 'react';
import styles from './NewTokenModal.module.scss';
import { ReactComponent as RewardIcon } from 'assets/icons/reward.svg';
import { ReactComponent as TrashIcon } from 'assets/icons/trash.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import Input from 'components/Input';
import NumberFormat from 'react-number-format';
import Loader from 'components/Loader';
import { handleErrorTransaction } from 'helper';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { network } from 'config/networks';
import { getCosmWasmClient } from 'libs/cosmjs';
import useClickOutside from 'hooks/useClickOutSide';
import { Pairs } from 'config/pools';
import { OraidexListingContractClient } from 'libs/contracts';
import CheckBox from 'components/CheckBox';
import { generateMsgFrontierAddToken, getInfoLiquidityPool } from '../helpers';
import { ModalDelete, ModalListToken } from './ModalComponent';
import { InitBalancesItems, RewardItems } from './ItemsComponent';
import { checkRegex, toAmount, toDisplay, validateAddressCosmos } from 'libs/utils';
import sumBy from 'lodash/sumBy';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { AccountData } from '@cosmjs/proto-signing';
import useConfigReducer from 'hooks/useConfigReducer';
const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
}

const NewTokenModal: FC<ModalProps> = ({ isOpen, close, open }) => {
  const [theme] = useConfigReducer('theme');
  const [tokenName, setTokenName] = useState('');
  const [isMinter, setIsMinter] = useState(false);
  const [minter, setMinter] = useState('');

  const [name, setName] = useState('');
  const [marketing, setMarketing] = useState({
    description: null,
    logo: null,
    marketing: null,
    project: null
  });

  const [selectedReward, setSelectedReward] = useState([]);
  const [selectedInitBalances, setSelectedInitBalances] = useState([]);

  const [typeDelete, setTypeDelete] = useState('');

  const [isInitBalances, setIsInitBalances] = useState(false);
  const [initBalances, setInitBalances] = useState([
    {
      address: '',
      amount: BigInt(1e6)
    }
  ]);

  const [isAddListToken, setIsAddListToken] = useState(false);
  const [cap, setCap] = useState(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);

  const [tokensNew, setTokensNew] = useState([]);
  const [rewardTokens, setRewardTokens] = useState([
    {
      name: 'orai',
      denom: 'orai',
      value: BigInt(1e6),
      contract_addr: ''
    }
  ]);

  const allRewardSelect = rewardTokens.map(item => item['denom']);
  const handleOutsideClick = () => {
    if (isAddListToken) setIsAddListToken(false);
    if (typeDelete) setTypeDelete('');
  };

  const ref = useClickOutside(handleOutsideClick);

  const handleCreateToken = async () => {
    if (!checkRegex(tokenName))
      return displayToast(TToastType.TX_FAILED, {
        message: 'Token name is required and must be letter (3 to 12 characters)'
      });
    const { client, defaultAddress: address } = await getCosmWasmClient();
    if (!address)
      return displayToast(TToastType.TX_FAILED, {
        message: 'Wallet address does not exist!'
      });

    if (!tokenName)
      return displayToast(TToastType.TX_FAILED, {
        message: 'Empty token symbol!'
      });

    if (isInitBalances) {
      initBalances.every(inBa => {
        if (!inBa.address || !validateAddressCosmos(inBa.address, 'orai')) {
          return displayToast(TToastType.TX_FAILED, {
            message: 'Wrong address init balances format!'
          });
        }
      });
    }

    if (isMinter && !minter)
      return displayToast(TToastType.TX_FAILED, {
        message: 'Wrong minter format!'
      });

    if (minter && !validateAddressCosmos(minter, 'orai'))
      return displayToast(TToastType.TX_FAILED, {
        message: 'Invalid Address Minter!'
      });

    if (isMinter && isInitBalances && cap) {
      const amountAllInit = sumBy(initBalances, 'amount');
      if (amountAllInit > cap) {
        return displayToast(TToastType.TX_FAILED, {
          message: 'Cap need bigger init balances!'
        });
      }
    }
    await signFrontierListToken(client, address);
  };

  const signFrontierListToken = async (client: SigningCosmWasmClient, address: AccountData) => {
    try {
      setIsLoading(true);
      const liquidityPoolRewardAssets = rewardTokens.map(isReward => {
        return {
          amount: isReward?.value.toString(),
          info: getInfoLiquidityPool(isReward)
        };
      });
      const oraidexListing = new OraidexListingContractClient(client, address.address, network.oraidex_listing);
      // TODO: add more options for users like name, marketing, additional token rewards
      const mint = isMinter
        ? {
            minter,
            cap: !!cap ? cap.toString() : null
          }
        : undefined;

      const initialBalances = isInitBalances
        ? initBalances.map(e => ({ ...e, amount: e?.amount.toString() }))
        : undefined;

      const msg = generateMsgFrontierAddToken({
        marketing,
        symbol: tokenName,
        liquidityPoolRewardAssets,
        name,
        initialBalances,
        mint
      });

      const result = await oraidexListing.listToken(msg);
      if (result) {
        const wasm = result?.logs?.[0]?.events.find(e => e.type === 'wasm')?.attributes;
        const cw20Address = wasm?.find(w => w.key === 'cw20_address')?.value;
        displayToast(
          TToastType.TX_SUCCESSFUL,
          {
            customLink: `${network.explorer}/txs/${result.transactionHash}`,
            linkCw20Token: `${network.explorer}/smart-contract/${cw20Address}`,
            cw20Address: `${cw20Address}`
          },
          {
            autoClose: 100000000
          }
        );
        close();
      }
    } catch (error) {
      console.log('error listing token: ', error);
      handleErrorTransaction(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnCheck = (selected, setState, state) => {
    if (selected.length === state.length) {
      setState([]);
    } else {
      let arr = [];
      for (let i = 0; i < state.length; i++) {
        arr.push(i);
      }
      setState(arr);
    }
  };

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true} className={cx('modal')}>
      {isAddListToken || typeDelete ? <div className={cx('overlay')} /> : null}
      <div className={cx('container', `container ${styles[theme]}`)}>
        <div className={cx('container-inner')}>
          <RewardIcon />
          <div className={cx('title', `title ${styles[theme]}`)}>List a new token</div>
        </div>
        <div className={cx('content')} ref={ref}>
          <div className={cx('box', `box ${styles[theme]}`)}>
            <div className={cx('token')}>
              <div className={cx('row')}>
                <div className={cx('label')}>Token name</div>
                <div className={cx('input', `input ${styles[theme]}`)}>
                  <div>
                    <Input
                      value={tokenName}
                      style={{
                        color: theme === 'light' && 'rgba(39, 43, 48, 1)'
                      }}
                      onChange={e => setTokenName(e?.target?.value)}
                      placeholder="ORAICHAIN"
                    />
                  </div>
                </div>
              </div>
              <div className={cx('option')}>
                <CheckBox label="Minter" checked={isMinter} onCheck={setIsMinter} />
              </div>
              {isMinter && (
                <div>
                  <div
                    className={cx('row')}
                    style={{
                      paddingTop: 16
                    }}
                  >
                    <div className={cx('label')}>Minter {'(Optional)'}</div>
                    <Input
                      className={cx('input', `input ${styles[theme]}`)}
                      value={minter}
                      onChange={e => setMinter(e?.target?.value)}
                      placeholder="MINTER"
                    />
                  </div>
                  <div
                    className={cx('row')}
                    style={{
                      paddingTop: 16
                    }}
                  >
                    <div className={cx('label')}>Cap (Optional)</div>
                    <NumberFormat
                      placeholder="0"
                      className={cx('input', `input ${styles[theme]}`)}
                      style={{
                        color: theme === 'light' ? 'rgba(126, 92, 197, 1)' : 'rgb(255, 222, 91)'
                      }}
                      thousandSeparator
                      decimalScale={6}
                      type="text"
                      value={toDisplay(cap)}
                      onValueChange={({ floatValue }) => {
                        setCap(toAmount(floatValue));
                      }}
                    />
                  </div>
                </div>
              )}
              <hr />
              <div>
                <CheckBox label="Initial Balances (Optional)" checked={isInitBalances} onCheck={setIsInitBalances} />
              </div>
              {isInitBalances && (
                <div
                  className={cx('btn-add-init', `btn-add-init ${styles[theme]}`)}
                  onClick={() =>
                    setInitBalances([
                      ...initBalances,
                      {
                        address: '',
                        amount: BigInt(1e6)
                      }
                    ])
                  }
                >
                  <PlusIcon />
                  <span>Add</span>
                </div>
              )}

              {isInitBalances && (
                <div className={cx('header-init')}>
                  <CheckBox
                    label={`Select All  ( ${selectedInitBalances.length} )`}
                    checked={initBalances.length && selectedInitBalances.length === initBalances.length}
                    onCheck={() => handleOnCheck(selectedInitBalances, setSelectedInitBalances, initBalances)}
                  />
                  <div
                    className={cx('trash')}
                    onClick={() => selectedInitBalances.length && setTypeDelete('Init Balances')}
                  >
                    <TrashIcon />
                  </div>
                </div>
              )}

              <div style={{ height: 10 }} />

              {isInitBalances &&
                initBalances.map((item, ind) => {
                  return (
                    <div key={ind}>
                      <InitBalancesItems
                        item={item}
                        ind={ind}
                        selectedInitBalances={selectedInitBalances}
                        setSelectedInitBalances={setSelectedInitBalances}
                        setInitBalances={setInitBalances}
                        initBalances={initBalances}
                        theme={theme}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className={cx('box', `box ${styles[theme]}`)}>
            <div className={cx('add-reward-btn')} onClick={() => setIsAddListToken(true)}>
              <PlusIcon />
              <span>Add a new pool reward token</span>
            </div>
            <div className={cx('rewards')}>
              <div className={cx('rewards-list')}>
                <CheckBox
                  label={`Select All  ( ${selectedReward.length} )`}
                  checked={rewardTokens.length && selectedReward.length === rewardTokens.length}
                  onCheck={() => handleOnCheck(selectedReward, setSelectedReward, rewardTokens)}
                />
                <div className={cx('trash')} onClick={() => selectedReward.length && setTypeDelete('Reward')}>
                  <TrashIcon />
                </div>
              </div>
              <div style={{ height: 24 }} />
              {rewardTokens?.map((item, index) => {
                return (
                  <div key={index}>
                    <RewardItems
                      rewardTokens={rewardTokens}
                      selectedReward={selectedReward}
                      setRewardTokens={setRewardTokens}
                      setSelectedReward={setSelectedReward}
                      ind={index}
                      item={item}
                      theme={theme}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {isAddListToken ? (
            <ModalListToken
              tokensNew={tokensNew}
              setTokensNew={setTokensNew}
              setRewardTokens={setRewardTokens}
              rewardTokens={rewardTokens}
              allRewardSelect={allRewardSelect}
              theme={theme}
              setIsAddListToken={setIsAddListToken}
            />
          ) : null}
          {typeDelete ? (
            <ModalDelete
              rewardTokens={rewardTokens}
              typeDelete={typeDelete}
              setTypeDelete={setTypeDelete}
              selectedReward={selectedReward}
              setSelectedReward={setSelectedReward}
              setRewardTokens={setRewardTokens}
              initBalances={initBalances}
              setInitBalances={setInitBalances}
              selectedInitBalances={selectedInitBalances}
              setSelectedInitBalances={setSelectedInitBalances}
              theme={theme}
            />
          ) : null}
        </div>
        <div
          className={cx('create-btn', (isLoading || !checkRegex(tokenName) || !rewardTokens.length) && 'disable-btn')}
          onClick={() => !isLoading && checkRegex(tokenName) && rewardTokens.length && handleCreateToken()}
        >
          {isLoading && <Loader width={20} height={20} />}
          {isLoading && <div style={{ width: 8 }}></div>}
          <span>Create</span>
        </div>
      </div>
    </Modal>
  );
};

export default NewTokenModal;
