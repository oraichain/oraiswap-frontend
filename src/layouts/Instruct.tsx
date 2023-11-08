import { ReactComponent as ChatBubbleQuestionDark } from 'assets/icons/chat-bubble-question-dark.svg';
import { ReactComponent as ChatBubbleQuestion } from 'assets/icons/chat-bubble-question.svg';
import GraduationImg from 'assets/icons/graduation.svg';
import GroupImg from 'assets/icons/group.svg';
import IconoirGift from 'assets/icons/iconoir_gift.svg';
import MediaVideo from 'assets/icons/media-video.svg';
import QuestionImg from 'assets/icons/question.svg';
import ImprovedPoolInterface from 'assets/images/improved-pool-interface.png';
import TrackingHistory from 'assets/images/tracking_history.png';
import TrackingTransaction from 'assets/images/tracking_transaction.png';
import UniversalWallet from 'assets/images/universal_wallet.png';
import UniversalSwapBridge from 'assets/images/universalswap_bridge.png';
import cn from 'classnames/bind';
import Modal from 'components/Modal';
import useTheme from 'hooks/useTheme';
import React from 'react';
import styles from './Instruct.module.scss';

const cx = cn.bind(styles);

interface InstructProps {}

const WhatsNewItems = [
  {
    label: 'Bridge & Swap: All in one place',
    icon: true,
    img: UniversalSwapBridge,
    content:
      'Bridging and universal swapping are now optimized, all in one place. OraiDEX brings you convenience and enhancements.'
  },
  {
    label: 'Universal Wallet',
    img: UniversalWallet,
    content: 'Effortlessly manage all your wallets at once. Seamlessly connect to multiple wallets with ease.'
  },
  {
    label: 'Tracking Transaction status',
    img: TrackingTransaction,
    content: 'Coming soon in the next update!'
  },
  {
    label: 'Transaction History',
    img: TrackingHistory,
    content: 'Effortlessly access details of your recent transactions with real-time updates.'
  },

  {
    label: 'Improved Pool Interface',
    icon: true,
    img: ImprovedPoolInterface,
    content:
      'Liquidity pools are presented with comprehensive details, streamlining option comparison and asset control with real-time data.'
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
                      className={cx(
                        'what-news-item',
                        `what-news-item-${theme}`,
                        `${activeInd === ind && `${theme}-active`}`
                      )}
                    >
                      <div>{whatsNew.label}</div>
                      {whatsNew.icon && <img src={MediaVideo} alt="media-video" width={14} height={14} />}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={cx('ask')} onClick={() => window.open('https://beacons.ai/oraidex')}>
              <img src={GroupImg} alt="gift" width={20} height={20} />
              <div> Join the community</div>
            </div>
            <div className={cx('ai')} onClick={() => window.open('https://academy.orai.io/tag/oraisavvy')}>
              <img src={GraduationImg} alt="gift" width={20} height={20} />
              <div>AI x Blockchain Savvy</div>
            </div>
          </div>
          <div className={cx('content', `${theme}-content`)}>
            <img src={WhatsNewItems[activeInd].img} alt="universal-swap" />
            <div className={cx('info')}>
              <div className={cx('title', `${theme}-title`)}>{WhatsNewItems[activeInd].label}</div>
              <div className={cx('describe', `${theme}-describe`)}>{WhatsNewItems[activeInd].content}</div>
              <div className={cx('contact', `${theme}-contact`)}>
                {theme === 'light' ? <ChatBubbleQuestion /> : <ChatBubbleQuestionDark />}
                <div onClick={() => window.open('mailto:support@orai.io')}>Contact us</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Instruct;
