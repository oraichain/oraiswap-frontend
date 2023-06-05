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
import { ORAI } from 'config/constants';
import { getCosmWasmClient } from 'libs/cosmjs';
import { Asset } from '@oraichain/oraidex-contracts-sdk';
import useClickOutside from 'hooks/useClickOutSide';
import { Pairs } from 'config/pools';
import { OraidexListingContractClient } from 'libs/contracts';
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

const NewRewardItems = ({ setIsNewReward, oraiReward, isNewReward, i }) => {
  const [oraiPer, setOraiPer] = useState(BigInt(1e6));
  const [searchText, setSearchText] = useState('');
  const originalFromToken = tokenMap?.[isNewReward?.[i]?.denom];
  let Icon = originalFromToken?.Icon ?? originalFromToken?.IconLight;

  return (
    <div className={cx('orai')}>
      <div className={cx('orai_label')}>
        <Icon className={cx('logo')} />
        <div
          className={cx('per')}
          onClick={() => {
            const isNewArrReward = isNewReward.map((reward, index) => {
              return {
                ...reward,
                isOpen: i === index && !isNewReward[index]?.isOpen ? true : false
              };
            });
            setIsNewReward(isNewArrReward);
          }}
        >
          <span style={{ textTransform: 'uppercase' }}>{isNewReward?.[i]?.denom}</span> Reward/s
        </div>
        {isNewReward?.[i]?.isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 50,
              background: '#23262F',
              width: 330,
              maxHeight: 373,
              zIndex: 1,
              overflow: 'auto',
              borderRadius: 8,
              padding: 16
            }}
          >
            <div>
              <div style={{ paddingLeft: 10, paddingRight: 10, color: 'rgba(255, 222, 91, 1)', fontSize: 14 }}>
                Enter Token’s contract to add new tokens !
              </div>
              <div
                style={{
                  height: 48,
                  backgroundColor: '#333443',
                  borderRadius: 8,
                  fontWeight: 500,
                  fontSize: 16,
                  color: 'white',
                  marginTop: 16,
                  padding: '13px 4px 13px 16px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="0xd3f2jlwxt...1f009"
                />
                <div
                  style={{
                    backgroundColor: 'rgba(126, 92, 197, 1)',
                    color: 'rgba(217, 217, 217, 1)',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: 8,
                      paddingBottom: 8,
                      paddingLeft: 4,
                      paddingRight: 4
                    }}
                  >
                    <PlusIcon />
                    <span
                      style={{
                        fontSize: 12
                      }}
                    >
                      Add Token
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <ul
                  style={{
                    paddingTop: 16
                  }}
                >
                  {Pairs.getPoolTokens().map((t, index) => {
                    return (
                      <li
                        key={index + '' + t.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: 10,
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setIsNewReward(
                            isNewReward.map((isReward, ind) => {
                              return i == ind ? { ...isReward, denom: t.denom, isOpen: false } : isReward;
                            })
                          );
                        }}
                      >
                        <t.Icon
                          style={{
                            width: 28,
                            height: 28
                          }}
                        />
                        <span style={{ paddingLeft: 10 }}>{t.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={cx('input_per')}>
        <NumberFormat
          placeholder="0"
          thousandSeparator
          decimalScale={6}
          customInput={Input}
          value={toDisplay(oraiPer.toString(), oraiReward.decimals)}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onValueChange={(e) => {
            setOraiPer(toAmount(Number(e.value), 6));
          }}
          className={cx('value')}
        />
      </div>
      <div
        style={{
          cursor: 'pointer'
        }}
        onClick={() => {
          setIsNewReward([...isNewReward.filter((_, ind) => ind !== i)]);
        }}
      >
        <TrashIcon />
      </div>
    </div>
  );
};

const NewTokenModal: FC<ModalProps> = ({ isOpen, close, open }) => {
  const [tokenName, setTokenName] = useState('');
  const [minter, setMinter] = useState('');
  // const [numToken, setNumToken] = useState(1);
  // const [oraiPer, setOraiPer] = useState(BigInt(1e6));
  // const [oraixPer, setOraixPer] = useState(BigInt(1e6));
  const [isLoading, setIsLoading] = useState(false);
  const [isNewReward, setIsNewReward] = useState([
    {
      denom: 'orai',
      isOpen: false,
      value: 100000
    }
  ]);

  const handleOutsideClick = () => {
    const checkOpenReward = isNewReward.find((re) => re.isOpen);
    if (!checkOpenReward) return;
    setIsNewReward(isNewReward.map((re) => ({ ...re, isOpen: false })));
  };

  const ref = useClickOutside(handleOutsideClick);

  const oraiReward = oraichainTokens.find((token) => token.coinGeckoId === 'oraichain-token');
  // const oraixReward = oraichainTokens.find(
  //   (token) => token.contractAddress === 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge'
  // );
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

      if (!tokenName) {
        return displayToast(TToastType.TX_FAILED, {
          message: 'Empty token symbol!'
        });
      }

      const oraidexListing = new OraidexListingContractClient(client, address.address, network.oraidex_listing);
      const liquidityPoolRewardAssets = isNewReward.map((isReward) => {
        return {
          amount: isReward?.value,
          info: { native_token: { denom: ORAI } }
        };
      });
      // TODO: add more options for users like name, marketing, additional token rewards

      // const result = await oraidexListing.listToken({
      //   symbol: tokenSymbol,
      //   liquidityPoolRewardAssets: [
      //     { amount: rewardPerSecondOrai.toString(), info: { native_token: { denom: ORAI } } },
      //     { amount: envVariables.orai_reward_per_sec, info: { native_token: { denom: 'orai' } } }
      //   ]
      // });
      // if (result) {
      //   displayToast(TToastType.TX_SUCCESSFUL, {
      //     customLink: `${network.explorer}/txs/${result.transactionHash}`
      //   });
      //   setIsLoading(false);
      // }
    } catch (error) {
      console.log('error listing token: ', error);
      handleErrorTransaction(error);
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true} className={cx('modal')}>
      <div className={cx('container')}>
        <RewardIcon className={cx('reward-icon')} />
        <div className={cx('title')}>List a new token</div>
        <div className={cx('content')}>
          <div className={cx('token')}>
            <div className={cx('label')}>Token name</div>
            <div className={cx('input')}>
              <div>
                <Input value={tokenName} onChange={(e) => setTokenName(e?.target?.value)} placeholder="ORAICHAIN" />
              </div>
            </div>
          </div>
          <div style={{ height: 24 }} />
          <div className={cx('token')}>
            <div className={cx('label')}>Minter</div>
            <Input
              className={cx('input')}
              value={minter}
              onChange={(e) => setMinter(e?.target?.value)}
              placeholder="MINTER"
            />
          </div>
          <div
            className={cx('add-reward-btn')}
            onClick={() =>
              setIsNewReward([
                ...isNewReward,
                {
                  denom: 'orai',
                  isOpen: false,
                  value: 100000
                }
              ])
            }
          >
            <span> Add Token Reward</span>
          </div>
          <div className={cx('rewards')} ref={ref}>
            {isNewReward?.map((items, index) => {
              return (
                <div key={index}>
                  <NewRewardItems
                    i={index}
                    setIsNewReward={setIsNewReward}
                    isNewReward={isNewReward}
                    oraiReward={oraiReward}
                  />
                  {index != 4 && <div style={{ height: 32 }} />}
                </div>
              );
            })}
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
