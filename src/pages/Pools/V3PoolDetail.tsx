import Content from 'layouts/Content';
import styles from './PoolDetail.module.scss';
import PoolDetailV3 from './components/PoolDetailV3';

const V3PoolDetailPage: React.FC = () => {
  return (
    <Content nonBackground otherBackground>
      <div className={styles.v3PoolDetailPage}>
        <PoolDetailV3 />
      </div>
    </Content>
  );
};

export default V3PoolDetailPage;
