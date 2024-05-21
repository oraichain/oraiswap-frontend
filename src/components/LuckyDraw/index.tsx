import ModalCustom from 'components/ModalCustom';
import { FC, useRef, useState } from 'react';
import { LuckyWheel } from 'react-luck-draw';
import styles from './index.module.scss';

const LuckyDraw: FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeDuration, setTimeDuration] = useState(10);
  const myLuckyRef = useRef(null);
  const [item, setItem] = useState('');
  const [isStart, setIsStart] = useState(false);

  const [dataSource, setDataSource] = useState<any>({
    blocks: [{ padding: '13px', background: '#2f5711' }],
    prizes: [
      {
        title: '20 ORAI',
        background: '#92e54c',
        fonts: [{ text: '20 ORAI ', top: '18%' }]
      },
      {
        title: '5 ORAI',
        background: '#d7f5bf',
        fonts: [{ text: '0.1 ORAI', top: '18%' }]
      },
      {
        title: '0.1 ORAI',
        background: '#92e54c',
        fonts: [{ text: '0.1 ORAI', top: '18%' }]
      },
      {
        title: '1 ORAI',
        background: '#d7f5bf',
        fonts: [{ text: '1 ORAI', top: '18%' }]
      },
      {
        title: '5 ORAI',
        background: '#92e54c',
        fonts: [{ text: '5 ORAI', top: '18%' }]
      },
      {
        title: '',
        background: '#d7f5bf',
        fonts: [{ text: 'Try Again', top: '18%' }]
      },
      {
        title: '0.1 ORAI',
        background: '#92e54c',
        fonts: [{ text: '0.1 ORAI', top: '18%' }]
      },
      {
        title: '1 ORAI',
        background: '#d7f5bf',
        fonts: [{ text: '1 ORAI', top: '18%' }]
      },
      {
        title: '',
        background: '#92e54c',
        fonts: [{ text: 'Try Again', top: '18%' }]
      },
      {
        title: '0.1 ORAI',
        background: '#d7f5bf',
        fonts: [{ text: '0.1 ORAI', top: '18%' }]
      },
      {
        title: '5 ORAI',
        background: '#92e54c',
        fonts: [{ text: '5 ORAI', top: '18%' }]
      },
      {
        title: '',
        background: '#d7f5bf',
        fonts: [{ text: 'Try Again', top: '18%' }]
      },
      {
        title: '1 ORAI',
        background: '#92e54c',
        fonts: [{ text: '1 ORAI', top: '18%' }]
      },
      {
        title: '',
        background: '#d7f5bf',
        fonts: [{ text: 'Try Again', top: '18%' }]
      }
    ],
    buttons: [
      { radius: '50px', background: '#2f5711' },
      { radius: '45px', background: '#fff' },
      { radius: '41px', background: '#89a571', pointer: true },
      {
        radius: '35px',
        background: '#d7f5bf',
        fonts: [{ text: 'Spin', fontSize: '18px', top: '-30%' }]
      }
    ],
    defaultStyle: {
      fontColor: '#2f5711',
      fontSize: '14px'
    }
  });

  return (
    <>
      <button className={styles.btn} onClick={() => setIsOpen(true)}>
        open lucky draw
      </button>
      <ModalCustom
        title="Lucky Draw"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setItem('');
          setIsStart(false);
        }}
        className={styles.contentModal}
      >
        <div className={styles.wheel}>
          <h2>
            {!isStart ? 'Let Spin...' : !item ? `Opps! You Loose... Try Again!` : `Congratulation! You Won: ${item}`}
          </h2>
          <LuckyWheel
            ref={myLuckyRef}
            width="500px"
            height="500px"
            blocks={dataSource.blocks}
            prizes={dataSource.prizes}
            buttons={dataSource.buttons}
            defaultStyle={dataSource.defaultStyle}
            onStart={() => {
              setIsStart(false);
              setItem('');
              if (!myLuckyRef) return;
              myLuckyRef?.current?.play();
              setTimeout(() => {
                let indexPrize = (Math.random() * 14) >> 0;
                while (indexPrize === 0 || indexPrize === 3 || indexPrize === 4) {
                  indexPrize = (Math.random() * 14) >> 0;
                }
                myLuckyRef.current.stop(indexPrize);
              }, timeDuration);
            }}
            onEnd={(prize) => {
              console.log(prize);
              setIsStart(true);
              setItem(prize.title as string);
            }}
          />
        </div>
      </ModalCustom>
    </>
  );
};

export default LuckyDraw;
