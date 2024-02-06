import { ReactComponent as ChatBubbleQuestionDark } from 'assets/icons/chat-bubble-question-dark.svg';
import { ReactComponent as ChatBubbleQuestion } from 'assets/icons/chat-bubble-question.svg';
import { ReactComponent as CloseBannerIcon } from 'assets/icons/close.svg';
import MaintainNodeImg from 'assets/images/maintain_note.png';
import { Button } from 'components/Button';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useTheme from 'hooks/useTheme';
import { useRef, useState } from 'react';
import styles from './MaintainModeBanner.module.scss';
import { isMobile } from '@walletconnect/browser-utils';

export const MaintainModeBanner = ({
  openBanner,
  setOpenBanner
}: {
  openBanner: boolean;
  setOpenBanner: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { REACT_APP_MAINTAIN_NOTE = '', REACT_APP_IS_MAINTAIN_MODE = false } = process.env || {
    REACT_APP_MAINTAIN_NOTE: `We're addressing an RPC issue causing temporary instability on OraiDEX and Oraiscan. Rest assured, our team is actively working on a fix.`,
    REACT_APP_IS_MAINTAIN_MODE: false
  };

  const [open, setOpen] = useState(REACT_APP_IS_MAINTAIN_MODE);
  // const [openBanner, setOpenBanner] = useState(REACT_APP_IS_MAINTAIN_MODE);
  const theme = useTheme();
  const mobileMode = isMobile();

  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setOpen(false);
  });

  if (!openBanner) return null;

  return (
    <>
      {/* {!mobileMode && ( */}
      <div className={styles.maintainWrapper}>
        <div className={styles.note}>🚧 [Notice] OraiDEX Maintenance: {REACT_APP_MAINTAIN_NOTE}</div>
        <div className={styles.closeBanner} onClick={() => setOpenBanner(false)}>
          <CloseBannerIcon />
        </div>
      </div>
      {/* )} */}

      {open && (
        <div className={styles.maintainModal}>
          <div ref={ref} className={styles.modalContentWrapper}>
            <div className={styles.closeModal} onClick={() => setOpen(false)}>
              <CloseBannerIcon />
            </div>
            <img src={MaintainNodeImg} alt="" />
            <div className={styles.contentText}>
              <div>
                We're addressing an RPC issue causing temporary instability on OraiDEX and Oraiscan. Rest assured, our
                team is actively working on a fix.
              </div>
              <div>
                To ensure a smooth experience, please refrain from making transactions during this maintenance period.
              </div>
              <div>
                We'll keep you updated and let you know when you’re safe to resume. Thank you for your patience and
                understanding!
              </div>
            </div>
            <div className={styles.footer}>
              <div className={styles.contactUs} onClick={() => window.open('mailto:support@orai.io')}>
                {theme === 'light' ? <ChatBubbleQuestion /> : <ChatBubbleQuestionDark />} Contact us
              </div>
              <div>
                <Button type="primary-sm" onClick={() => setOpen(false)}>
                  Got it
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
