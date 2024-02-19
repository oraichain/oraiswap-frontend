import { isMobile } from '@walletconnect/browser-utils';
import { ReactComponent as CloseBannerIcon } from 'assets/icons/close.svg';
import { ReactComponent as OrchaiIcon } from 'assets/icons/orchaiIcon.svg';
import { ReactComponent as TimpiIcon } from 'assets/icons/timpiIcon.svg';
import useTheme from 'hooks/useTheme';
import { useEffect, useState } from 'react';
import styles from './NoticeBanner.module.scss';

const INTERVAL_TIME = 3000;

export const NoticeBanner = ({
  openBanner,
  setOpenBanner
}: {
  openBanner: boolean;
  setOpenBanner: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [noteIdx, setNoteIdx] = useState(0);

  const note = LIST_NOTICES[noteIdx];

  useEffect(() => {
    if (LIST_NOTICES.length <= 1) return;

    const carousel = () => {
      setNoteIdx((noteIdx) => {
        if (noteIdx === LIST_NOTICES.length - 1) {
          return 0;
        }

        return noteIdx + 1;
      });
    };

    const interval = setInterval(carousel, INTERVAL_TIME);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!openBanner) return null;

  return (
    <>
      <div className={styles.noticeWrapper}>
        {/* <div className={styles.noteList}>
          {LIST_NOTICES.map((note, index) => {
            return ( */}
        <div className={styles.note}>
          <div className={styles.icon}>{note.icon}</div>
          <div className={styles.text}>
            <span className={styles.title}>{note.title}</span>
            <span>{note.content}</span>
          </div>
        </div>
        {/* );
          })}
        </div> */}
        <div className={styles.closeBanner} onClick={() => setOpenBanner(false)}>
          <CloseBannerIcon />
        </div>
      </div>
    </>
  );
};

export const LIST_NOTICES = [
  {
    title: 'NTMPI Premiere Listing',
    content: 'Timpi (NTMPI) will be listed on Feb 19th',
    icon: <TimpiIcon />
  },
  {
    title: 'OCH Premiere Listing',
    content: 'Orchai (OCH) will be listed soon',
    icon: <OrchaiIcon />
  }
];
