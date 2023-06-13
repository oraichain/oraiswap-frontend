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
import _ from 'lodash';
import { ModalDelete, ModalListToken } from './ModalComponent';
import { InitBalancesItems, RewardItems } from './ItemsComponent';
import { checkRegex } from 'libs/utils';
const cx = cn.bind(styles);

interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
}

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

  const [indReward, setIndReward] = useState(0);
  const [cap, setCap] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [rewardTokens, setRewardTokens] = useState([
    {
      name: 'orai',
      denom: 'orai',
      value: BigInt(1e6),
      contract_addr: ''
    }
  ]);

  const allRewardSelect = rewardTokens.map((item) => item['denom']);
  const handleOutsideClick = () => {
    if (indReward) setIndReward(0);
    // if (typeDelete) setTypeDelete('');
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
      const liquidityPoolRewardAssets = rewardTokens.map((isReward) => {
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
      {indReward || typeDelete ? <div className={cx('overlay')} /> : null}
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
                      />
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
                setRewardTokens([
                  ...rewardTokens,
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
                      setIndReward={setIndReward}
                      ind={index}
                      item={item}
                    />
                  </div>
                );
              })}

              {indReward ? (
                <ModalListToken
                  indReward={indReward}
                  setRewardTokens={setRewardTokens}
                  rewardTokens={rewardTokens}
                  allRewardSelect={allRewardSelect}
                />
              ) : null}
            </div>
          </div>
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
