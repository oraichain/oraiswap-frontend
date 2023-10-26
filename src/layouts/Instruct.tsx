import React, { memo } from 'react';
import useTheme from 'hooks/useTheme';
import QuestionImg from 'assets/icons/question.svg';
import IconoirGift from 'assets/icons/iconoir_gift.svg';
import MediaVideo from 'assets/icons/media-video.svg';
import GroupImg from 'assets/icons/group.svg';
import GraduationImg from 'assets/icons/graduation.svg';
import UniversalWallet from 'assets/images/universal_wallet.png';
import UniversalSwapBridge from 'assets/images/universalswap_bridge.png';
import TrackingTransaction from 'assets/images/tracking_transaction.png';
import ImprovedPoolInterface from 'assets/images/improved-pool-interface.png';
import TrackingHistory from 'assets/images/tracking_history.png';
import styles from './Instruct.module.scss';
import cn from 'classnames/bind';
import Modal from 'components/Modal';
import SearchInput from 'components/SearchInput';
import { ReactComponent as ChatBubbleQuestion } from 'assets/icons/chat-bubble-question.svg';

const cx = cn.bind(styles);

interface InstructProps { }

const WhatsNewItems = [
  {
    label: 'Universal Swap & Bridge',
    icon: true,
    img: UniversalSwapBridge
  },
  {
    label: 'Universal Wallet',
    img: UniversalWallet
  },
  {
    label: 'Tracking Transaction status',
    img: TrackingTransaction
  },
  {
    label: 'Transaction History',
    img: TrackingHistory
  },

  {
    label: 'Improved Pool Interface',
    icon: true,
    img: ImprovedPoolInterface
  }
];

const Instruct: React.FC<InstructProps> = () => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeInd, setActiveInd] = React.useState(0);
  return (
    <div className={cx('instruct')}>
      <div className={cx('question')} onClick={() => setIsOpen(!isOpen)}>
        <img src={QuestionImg} alt="question" />
      </div>
      <Modal className={cx('helper-modal')} isOpen={isOpen} close={() => setIsOpen(false)} isCloseBtn={true}>
        <div className={cx('helper-center', `${theme}-center`)}>
          <div className={cx('topic', `${theme}-topic`)}>
            <div className={cx('title')}>Help Center</div>
            <SearchInput
              placeholder="Search for tutorials, help..."
              onSearch={() => { }}
              theme={theme}
              isBorder
              className={cx('search-input', `search-input-${theme}`)}
            />
            <div className={cx('what-news')}>
              <div className={cx('label')}>
                <img src={IconoirGift} alt="gift" width={20} height={20} />
                <div>What’s new</div>
              </div>
              <div className={cx('what-news-items')}>
                {WhatsNewItems.map((whatsNew, ind) => {
                  return (
                    <div
                      onClick={() => ind !== activeInd && setActiveInd(ind)}
                      key={ind}
                      className={cx('what-news-item', `what-news-item-${theme}`, `${activeInd === ind && `${theme}-active`}`)}
                    >
                      <div>{whatsNew.label}</div>
                      {whatsNew.icon && <img src={MediaVideo} alt="media-video" width={14} height={14} />}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={cx('ask')}>
              <img src={GroupImg} alt="gift" width={20} height={20} />
              <div> Ask the community</div>
            </div>
            <div className={cx('ai')}>
              <img src={GraduationImg} alt="gift" width={20} height={20} />
              <div>AI x Blockchain Savvy</div>
            </div>
          </div>
          <div className={cx('content', `${theme}-content`)}>
            <img src={WhatsNewItems[activeInd].img} alt="universal-swap" />
            <div className={cx('info')}>
              <div className={cx('title', `${theme}-title`)}>
                {WhatsNewItems[activeInd].label}
              </div>
              <div className={cx('describe', `${theme}-describe`)}>
                Bridge and universal swap all in one place. Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen
                book.
              </div>
              <div className={cx('contact', `${theme}-contact`)}>
                <ChatBubbleQuestion className={cx('icon')} />
                <div>Contact us</div>
              </div>
            </div>
          </div>
        </div>
      </Modal >
    </div >
  );
};

export default memo(Instruct);
