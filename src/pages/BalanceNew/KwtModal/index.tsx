import { FC, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import cn from 'classnames/bind';
import styles from './index.module.scss';
import axios from 'rest/request';
import useConfigReducer from 'hooks/useConfigReducer';
import orderbook from 'assets/images/oraidex_launching_button.png';

const cx = cn.bind(styles);
interface ModalProps { }

const KwtModal: FC<ModalProps> = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [address] = useConfigReducer('address')

  useEffect(() => {
    axios.get(`https://api-staging-orderbook.oraidex.io/v1/volumes/1/current-volume/${address}?granularity=60`).then(res => console.log(res))
  }, [address])

  return (
    <Modal isOpen={isOpen} close={() => setIsOpen(false)} open={() => { }} isCloseBtn={true} className={cx('modal')}>
      {/* <div  className={styles.container} style={{ padding: 30,height: "fit-content", textAlign: "center", background: "rgba(0,0,0,0.5)"  }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px"}}>
          Decentralized Order Book Trading Competition and Win your share of up to $15,000
        </h1>
        <h5  style={{ textAlign: "left" }}>
        Your current volume (from 11:30 UTC, May 16): [API 1]
        </h5> */}
        <img
        style={{cursor: "pointer"}}
        onClick={() => window.open('https://blog.orai.io/oraidex-decentralized-order-book-trading-competition-25c23a4271f2')}
        src={orderbook}
        alt='orderbook'
        width="100%"
      />
        {/* <div> */}
          {/* <h5 style={{ textAlign: "left" }}>
            Leader board
          </h5>
          <table>
            <thead>
              <th>Rank</th>
              <th>Address</th>
              <th>Volumn</th>
            </thead>
            <tbody>
              <tr>
                <td>#1</td>
                <td>{address}</td>
                <td>22 ORAI</td>
              </tr>
            </tbody>
          </table> */}
        {/* </div>
      </div> */}

    </Modal>
  );
};

export default KwtModal;
