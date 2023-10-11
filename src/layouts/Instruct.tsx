import React, { memo } from 'react';
import useTheme from 'hooks/useTheme';
import QuestionImg from 'assets/icons/question.svg';
import IconoirGift from 'assets/icons/iconoir_gift.svg';
import MediaVideo from 'assets/icons/media-video.svg';
import GroupImg from 'assets/icons/group.svg';
import GraduationImg from 'assets/icons/graduation.svg';
import UniversalSwap from 'assets/icons/universal-swap.svg';
import ChatBubbleQuestion from 'assets/icons/chat-bubble-question.svg';
import styles from './Instruct.module.scss';
import cn from 'classnames/bind';
import Modal from 'components/Modal';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import SearchInput from 'components/SearchInput';

const cx = cn.bind(styles);

interface InstructProps {}

const Instruct: React.FC<InstructProps> = () => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div className={cx('instruct')}>
      <div className={cx('question')} onClick={() => setIsOpen(!isOpen)}>
        <img src={QuestionImg} alt="question" />
      </div>

      <Modal
        className={cx('helper-modal')}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        isCloseBtn={false}
        open={() => {}}
      >
        <div className={cx('helper-center')}>
          <div className={cx('topic')}>
            <div className={cx('title')}>Help Center</div>
            <div>Search for tutorials, help...</div>
            {/* <SearchInput placeholder="Search Token" onSearch={() => {}} theme={theme} /> */}
            <div className={cx('what-news')}>
              <div className={cx('label')}>
                <img src={IconoirGift} alt="gift" width={20} height={20} />
                <div>What’s new</div>
              </div>
              <div className={cx('what-news-items')}>
                <div className={cx('what-news-item')}>
                  <div>Universal Swap & Bridge</div>
                  <img src={MediaVideo} alt="media-video" width={14} height={14} />
                </div>
                <div className={cx('what-news-item', 'active')}>
                  <div>Universal Wallet</div>
                </div>
                <div className={cx('what-news-item')}>
                  <div>Tracking Transaction status</div>
                </div>
                <div className={cx('what-news-item')}>
                  <div>Improved Pool Interface</div>
                </div>
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
          <div className={cx('content')}>
            <img src={UniversalSwap} alt="universal-swap" />
            <div className={cx('info')}>
              <div className={cx('title')}>Universal Wallet</div>
              <div className={cx('describe')}>
                Bridge and universal swap all in one place. Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen
                book.
              </div>
              <div className={cx('contact')}>
                <img src={ChatBubbleQuestion} alt="chat" width={20} height={20} />
                <div>Contact us</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default memo(Instruct);
