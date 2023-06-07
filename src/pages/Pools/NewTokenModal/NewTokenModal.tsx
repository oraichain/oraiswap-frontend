import cn from 'classnames/bind';
import Modal from 'components/Modal';
import { FC, useState } from 'react';
import styles from './NewTokenModal.module.scss';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as RewardIcon } from 'assets/icons/reward.svg';
import { ReactComponent as IncreaseIcon } from 'assets/icons/increase.svg';
import { ReactComponent as DecreaseIcon } from 'assets/icons/decrease.svg';
import { ReactComponent as TrashIcon } from 'assets/icons/trash.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import Input from 'components/Input';
import NumberFormat from 'react-number-format';
import Loader from 'components/Loader';
import { handleErrorTransaction } from 'helper';
import { displayToast, TToastType } from 'components/Toasts/Toast';
import { toAmount, toDisplay } from 'libs/utils';
import { oraichainTokens, tokenMap } from 'config/bridgeTokens';
import { network } from 'config/networks';
import { getCosmWasmClient } from 'libs/cosmjs';
import useClickOutside from 'hooks/useClickOutSide';
import { Pairs } from 'config/pools';
import { OraidexListingContractClient } from 'libs/contracts';
import CheckBox from 'components/CheckBox';
import { generateMsgFrontierAddToken, getInfoLiquidityPool } from '../helpers';
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

const ModalListToken = ({ position, isNewReward, setIsNewReward, allRewardSelect }) => {
  const [searchText, setSearchText] = useState('');
  return (
    <div className={cx('dropdown-reward')}>
      <div>
        <div className={cx('label')}>Enter Token’s contract to add new tokens !</div>
        <div className={cx('check')}>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e?.target?.value)}
            placeholder="0xd3f2jlwxt...1f009"
          />
          <div className={cx('btn')}>
            <div>
              <PlusIcon />
              <span>Add Token</span>
            </div>
          </div>
        </div>
        <div className={cx('list')}>
          <ul>
            {Pairs.getPoolTokens()
              .filter((pair) => !allRewardSelect.includes(pair.denom))
              .map((t, index) => {
                return (
                  <li
                    key={index + '' + t?.name}
                    onClick={() => {
                      setIsNewReward(
                        isNewReward.map((isReward, ind) => {
                          return position == ind + 1
                            ? { ...isReward, denom: t.denom, name: t.name, contract_addr: t?.contractAddress }
                            : isReward;
                        })
                      );
                    }}
                  >
                    <t.Icon className={cx('logo')} />
                    <span>{t?.name}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ModalDelete = ({ setDeleteReward, deleteReward, setIsNewReward, isNewReward }) => {
  return (
    <div
      className={cx('dropdown-reward')}
      style={{
        width: 430,
        fontSize: 16
      }}
    >
      <div className={cx('title-reward')}>
        <span> Delete Token Reward</span>
      </div>
      <div className={cx('content-reward')}>
        Are you sure delete <span>{isNewReward?.[deleteReward - 1]?.name} Reward</span> ?
      </div>
      <div className={cx('action')}>
        <div
          className={cx('btn', 'btn-cancel')}
          onClick={() => {
            setDeleteReward(0);
          }}
        >
          <span>Cancel</span>
        </div>
        <div
          className={cx('btn', 'btn-delete')}
          onClick={() => {
            setIsNewReward([...isNewReward.filter((_, ind) => ind + 1 !== deleteReward)]);
            setDeleteReward(0);
          }}
        >
          <span>Delete</span>
        </div>
      </div>
    </div>
  );
};

const NewRewardItems = ({ item, i, setPosition, setDeleteReward }) => {
  const originalFromToken = tokenMap?.[item?.denom];
  let Icon = originalFromToken?.Icon ?? originalFromToken?.IconLight;
  return (
    <div className={cx('orai')}>
      <div className={cx('orai_label')}>
        <Icon className={cx('logo')} />
        <div
          className={cx('per')}
          onClick={() => {
            setPosition(i + 1);
          }}
        >
          <span>{item?.name}</span> Reward/s
        </div>
      </div>
      <div className={cx('input_per')}>
        <NumberFormat
          placeholder="0"
          thousandSeparator
          decimalScale={6}
          customInput={Input}
          value={toDisplay('1000000', 6)}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onValueChange={(e) => {}}
          className={cx('value')}
        />
      </div>
      <div
        style={{
          cursor: 'pointer',
          marginLeft: 6
        }}
        onClick={() => {
          setDeleteReward(i + 1);
        }}
      >
        <TrashIcon />
      </div>
    </div>
  );
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

  const [isInitBalances, setIsInitBalances] = useState(false);
  const [initBalances, setInitBalances] = useState([
    {
      address: '',
      amount: BigInt(1e6)
    }
  ]);

  const [position, setPosition] = useState(0);
  const [deleteReward, setDeleteReward] = useState(0);
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
    if (deleteReward) setDeleteReward(0);
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
      const msg = generateMsgFrontierAddToken({
        marketing,
        symbol: tokenName,
        liquidityPoolRewardAssets,
        name,
        isInitBalances,
        initialBalances,
        isMinter,
        mint: {
          minter,
          cap: !!cap ? cap.toString() : null
        }
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

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true} className={cx('modal')}>
      {position || deleteReward ? <div className={cx('overlay')} /> : null}
      <div className={cx('container')}>
        <RewardIcon className={cx('reward-icon')} />
        <div className={cx('title')}>List a new token</div>
        <div className={cx('content')}>
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
              <CheckBox
                className={cx('c-box')}
                label="Init balance"
                checked={isInitBalances}
                onCheck={setIsInitBalances}
              />
              <CheckBox label="Minter" checked={isMinter} onCheck={setIsMinter} />
            </div>
            {isInitBalances &&
              initBalances.map((inBa, ind) => {
                return (
                  <div key={ind}>
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
                    <div className={cx('row')}>
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
                  </div>
                );
              })}
            {isMinter && (
              <>
                <div className={cx('row')}>
                  <div className={cx('label')}>Minter</div>
                  <Input
                    className={cx('input')}
                    value={minter}
                    onChange={(e) => setMinter(e?.target?.value)}
                    placeholder="MINTER"
                  />
                </div>
                <div className={cx('row')}>
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
              </>
            )}
          </div>
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
            <span> Add Token Reward</span>
          </div>
          <div className={cx('rewards')} ref={ref}>
            {isNewReward?.map((item, index) => {
              return (
                <div key={index}>
                  <NewRewardItems setPosition={setPosition} i={index} item={item} setDeleteReward={setDeleteReward} />
                  {index >= 0 && <div style={{ height: 32 }} />}
                </div>
              );
            })}
            {deleteReward ? (
              <ModalDelete
                deleteReward={deleteReward}
                setIsNewReward={setIsNewReward}
                setDeleteReward={setDeleteReward}
                isNewReward={isNewReward}
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
        <div
          className={cx('create-btn', (isLoading || !checkRegex(tokenName)) && 'disable-btn')}
          onClick={() => !isLoading && checkRegex(tokenName) && handleCreateToken()}
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
