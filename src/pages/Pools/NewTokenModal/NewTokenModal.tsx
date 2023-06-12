import cn from 'classnames/bind';
import Modal from 'components/Modal';
import { FC, useState } from 'react';
import styles from './NewTokenModal.module.scss';
import { ReactComponent as RewardIcon } from 'assets/icons/reward.svg';
import { ReactComponent as WalletIcon } from 'assets/icons/wallet1.svg';
import { ReactComponent as TrashIcon } from 'assets/icons/trash.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import Input from 'components/Input';
import NumberFormat from 'react-number-format';
import Loader from 'components/Loader';
import { handleErrorTransaction } from 'helper';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { toAmount, toDisplay } from 'libs/utils';
import { network } from 'config/networks';
import { getCosmWasmClient } from 'libs/cosmjs';
import useClickOutside from 'hooks/useClickOutSide';
import { Pairs } from 'config/pools';
import { OraidexListingContractClient } from 'libs/contracts';
import CheckBox from 'components/CheckBox';
import { generateMsgFrontierAddToken, getInfoLiquidityPool } from '../helpers';
import _ from 'lodash';
import { ModalDelete, ModalListToken, NewRewardItems } from './ModalComponent';
const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
}

const checkRegex = (str: string) => {
  const regex = /^[a-zA-Z\-]{3,12}$/;
  return regex.test(str);
};

const NewTokenModal: FC<ModalProps> = ({ isOpen, close, open }) => {
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

  const [position, setPosition] = useState(0);
  const [cap, setCap] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewReward, setIsNewReward] = useState([
    {
      name: 'orai',
      denom: 'orai',
      value: BigInt(1e6),
      contract_addr: ''
    }
  ]);

  const allRewardSelect = isNewReward.map((item) => item['denom']);
  const handleOutsideClick = () => {
    if (position) setPosition(0);
  };

  const ref = useClickOutside(handleOutsideClick);

  const handleCreateToken = async () => {
    try {
      if (!checkRegex(tokenName))
        return displayToast(TToastType.TX_FAILED, {
          message: 'Token name is required and must be letter (3 to 12 characters)'
        });

      setIsLoading(true);
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
        initBalances.every((inBa) => {
          if (!inBa.address) {
            return displayToast(TToastType.TX_FAILED, {
              message: 'Wrong address format!'
            });
          }
        });
      }

      if (isMinter && !minter)
        return displayToast(TToastType.TX_FAILED, {
          message: 'Wrong minter format!'
        });

      const initialBalances = initBalances.map((e) => ({ ...e, amount: e?.amount.toString() }));
      const liquidityPoolRewardAssets = isNewReward.map((isReward) => {
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
      const initialBalancesArr = isInitBalances ? initialBalances : undefined;
      const msg = generateMsgFrontierAddToken({
        marketing,
        symbol: tokenName,
        liquidityPoolRewardAssets,
        name,
        initialBalances: initialBalancesArr,
        mint
      });

      const result = await oraidexListing.listToken(msg);
      if (result) {
        displayToast(TToastType.TX_SUCCESSFUL, {
          customLink: `${network.explorer}/txs/${result.transactionHash}`
        });
        close();
        setIsLoading(false);
      }
    } catch (error) {
      console.log('error listing token: ', error);
      handleErrorTransaction(error);
      setIsLoading(false);
    }
  };

  const handleOnCheck = (state, setState, oldState) => {
    if (state.length === oldState.length) {
      setState([]);
    } else {
      let arr = [];
      for (let i = 0; i < oldState.length; i++) {
        arr.push(i);
      }
      setState(arr);
    }
  };

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true} className={cx('modal')}>
      {position || typeDelete ? <div className={cx('overlay')} /> : null}
      <div className={cx('container')}>
        <div className={cx('container-inner')}>
          <RewardIcon />
          <div className={cx('title')}>List a new token</div>
        </div>
        <div className={cx('content')}>
          <div className={cx('box')}>
            <div className={cx('token')}>
              <div className={cx('row')}>
                <div className={cx('label')}>Token name</div>
                <div className={cx('input')}>
                  <div>
                    <Input value={tokenName} onChange={(e) => setTokenName(e?.target?.value)} placeholder="ORAICHAIN" />
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
                    <div className={cx('label')}>Minter</div>
                    <Input
                      className={cx('input')}
                      value={minter}
                      onChange={(e) => setMinter(e?.target?.value)}
                      placeholder="MINTER"
                    />
                  </div>
                  <div
                    className={cx('row')}
                    style={{
                      paddingTop: 16
                    }}
                  >
                    <div className={cx('label')}>Cap (Option)</div>
                    <NumberFormat
                      placeholder="0"
                      className={cx('input')}
                      style={{
                        color: 'rgb(255, 222, 91)'
                      }}
                      thousandSeparator
                      decimalScale={6}
                      type="text"
                      value={cap}
                      onValueChange={({ floatValue }) => {
                        setCap(floatValue);
                      }}
                    />
                  </div>
                </div>
              )}
              <hr />
              <div>
                <CheckBox label="Init balance" checked={isInitBalances} onCheck={setIsInitBalances} />
              </div>
              {isInitBalances && (
                <div
                  className={cx('btn-add-init')}
                  onClick={() => {
                    setInitBalances([...initBalances, initBalances[0]]);
                  }}
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
                    onClick={() => {
                      if (selectedInitBalances.length) {
                        setTypeDelete('Init Balances');
                      }
                    }}
                  >
                    <TrashIcon />
                  </div>
                </div>
              )}
              <div style={{ height: 10 }} />
              {isInitBalances &&
                initBalances.map((inBa, ind) => {
                  return (
                    <div key={ind}>
                      <div className={cx('wrap-init-balances')}>
                        <div>
                          <CheckBox
                            checked={selectedInitBalances.includes(ind)}
                            onCheck={() => {
                              const arr = selectedInitBalances.includes(ind)
                                ? selectedInitBalances.filter((e) => e !== ind)
                                : [...selectedInitBalances, ind];
                              setSelectedInitBalances(arr);
                            }}
                          />
                        </div>
                        <div className={cx('wallet')}>
                          <span>{ind + 1}</span>
                          <WalletIcon />
                        </div>
                      </div>
                      <div className={cx('row')}>
                        <div className={cx('label')}>Address</div>
                        <Input
                          className={cx('input')}
                          value={inBa.address}
                          onChange={(e) => {
                            setInitBalances(
                              initBalances.map((ba, i) => ({
                                amount: ba.amount,
                                address: ind === i ? e?.target?.value : ba.address
                              }))
                            );
                          }}
                          placeholder="ADDRESS"
                        />
                      </div>
                      <div
                        className={cx('row')}
                        style={{
                          paddingTop: 10
                        }}
                      >
                        <div className={cx('label')}>Amount</div>
                        <NumberFormat
                          placeholder="0"
                          className={cx('input')}
                          style={{
                            color: 'rgb(255, 222, 91)'
                          }}
                          thousandSeparator
                          decimalScale={6}
                          type="text"
                          value={toDisplay(inBa.amount)}
                          onValueChange={({ floatValue }) => {
                            setInitBalances(
                              initBalances.map((ba, i) => ({
                                amount: toAmount(ind === i ? floatValue?.toString() : ba.amount.toString()),
                                address: ba.address
                              }))
                            );
                          }}
                        />
                      </div>
                      <hr />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className={cx('box')}>
            <div
              className={cx('add-reward-btn')}
              onClick={() => {
                const filterPair = Pairs.getPoolTokens().find((pair) => !allRewardSelect.includes(pair.denom));
                if (!filterPair) return;
                setIsNewReward([
                  ...isNewReward,
                  {
                    name: filterPair?.name,
                    denom: filterPair?.denom,
                    value: BigInt(1e6),
                    contract_addr: filterPair?.contractAddress
                  }
                ]);
              }}
            >
              <PlusIcon />
              <span>Add Token</span>
            </div>
            <div className={cx('rewards')} ref={ref}>
              <div className={cx('rewards-list')}>
                <CheckBox
                  label={`Select All  ( ${selectedReward.length} )`}
                  checked={isNewReward.length && selectedReward.length === isNewReward.length}
                  onCheck={() => handleOnCheck(selectedReward, setSelectedReward, isNewReward)}
                />
                <div
                  className={cx('trash')}
                  onClick={() => {
                    if (selectedReward.length) {
                      setTypeDelete('Reward');
                    }
                  }}
                >
                  <TrashIcon />
                </div>
              </div>
              <div style={{ height: 24 }} />
              {isNewReward?.map((item, index) => {
                return (
                  <div key={index}>
                    <NewRewardItems
                      selectedReward={selectedReward}
                      setSelectedReward={setSelectedReward}
                      setPosition={setPosition}
                      i={index}
                      item={item}
                    />
                    {index >= 0 && <div style={{ height: 32 }} />}
                  </div>
                );
              })}
              {typeDelete ? (
                <ModalDelete
                  isNewReward={isNewReward}
                  typeDelete={typeDelete}
                  setTypeDelete={setTypeDelete}
                  selectedReward={selectedReward}
                  setSelectedReward={setSelectedReward}
                  setIsNewReward={setIsNewReward}
                  initBalances={initBalances}
                  setInitBalances={setInitBalances}
                  selectedInitBalances={selectedInitBalances}
                  setSelectedInitBalances={setSelectedInitBalances}
                />
              ) : null}
              {position ? (
                <ModalListToken
                  position={position}
                  setIsNewReward={setIsNewReward}
                  isNewReward={isNewReward}
                  allRewardSelect={allRewardSelect}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div
          className={cx('create-btn', (isLoading || !checkRegex(tokenName) || !isNewReward.length) && 'disable-btn')}
          onClick={() => !isLoading && checkRegex(tokenName) && isNewReward.length && handleCreateToken()}
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
