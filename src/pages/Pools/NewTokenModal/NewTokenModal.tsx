import cn from 'classnames/bind';
import Modal from 'components/Modal';
import { FC, useState } from 'react';
import styles from './NewTokenModal.module.scss';
import { ReactComponent as OraiIcon } from 'assets/icons/oraichain.svg';
import { ReactComponent as OraixIcon } from 'assets/icons/oraix.svg';
import { ReactComponent as RewardIcon } from 'assets/icons/reward.svg';
import Input from 'components/Input';
import { addPairAndLpToken, createTextProposal, deployCw20Token } from 'libs/frontier/token';
import NumberFormat from 'react-number-format';
import Loader from 'components/Loader';
import { handleErrorTransaction } from 'helper';
import { displayToast, TToastType } from 'components/Toasts/Toast';
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
  const [oraiPer, setOraiPer] = useState(1e6);
  const [oraixPer, setOraixPer] = useState(1e6);
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateToken = async (tokenSymbol, rewardPerSecondOrai, rewardPerSecondOraiX) => {
    try {
      setIsLoading(true);
      let cw20ContractAddress = process.env.CW20_CONTRACT_ADDRESS;
      let lpAddress: string;
      if (tokenSymbol) {
        cw20ContractAddress = await deployCw20Token(tokenSymbol);
        console.log('deployed cw20 token address: ', cw20ContractAddress);
        const result = await addPairAndLpToken(cw20ContractAddress);
        lpAddress = result.lpAddress;
      }
      const simulateResult = await createTextProposal(
        cw20ContractAddress,
        lpAddress,
        parseInt(rewardPerSecondOrai),
        parseInt(rewardPerSecondOraiX)
      ); // in minimal denom aka in 10^6 denom

      if (simulateResult) {
        displayToast(TToastType.TX_SUCCESSFUL);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('error create token: ', error);
      handleErrorTransaction(error);
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} close={close} open={open} isCloseBtn={true} className={cx('modal')}>
      <div className={cx('container')}>
        <RewardIcon className={cx('reward-icon')} />
        <div className={cx('title')}>Create new Token</div>
        <div className={cx('content')}>
          <div className={cx('token')}>
            <div className={cx('label')}>Token name</div>
            <Input
              className={cx('input')}
              value={tokenName}
              onChange={(e) => setTokenName(e?.target?.value)}
              placeholder="ORAIX"
            />
          </div>
          <div className={cx('rewards')}>
            <div className={cx('orai')}>
              <div className={cx('orai_label')}>
                <OraiIcon className={cx('logo')} />
                <div className={cx('per')}>ORAI Reward/s</div>
              </div>
              <div className={cx('input_per')}>
                <NumberFormat
                  placeholder="0"
                  thousandSeparator
                  decimalScale={6}
                  customInput={Input}
                  value={oraiPer}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  onValueChange={(e) => {
                    setOraiPer(e.floatValue);
                  }}
                  className={cx('value')}
                />
              </div>
            </div>
            <div style={{ height: 32 }} />
            <div className={cx('orai')}>
              <div className={cx('orai_label')}>
                <OraixIcon className={cx('logo')} />
                <div className={cx('per')}>ORAIX Reward/s</div>
              </div>
              <div className={cx('input_per')}>
                <NumberFormat
                  placeholder="0"
                  thousandSeparator
                  decimalScale={6}
                  customInput={Input}
                  value={oraixPer}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  onValueChange={(e) => {
                    setOraixPer(e.floatValue);
                  }}
                  className={cx('value')}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={cx('create-btn', isLoading && 'disable-btn')}
          onClick={() => handleCreateToken(tokenName, oraiPer, oraixPer)}
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
