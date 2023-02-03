import React from 'react';
import OraidexSVG from './OraidexSVG.svg';
import cn from 'classnames/bind';
import styles from './index.module.scss';
const cx = cn.bind(styles);

const BlocLoaderOsmosis: React.FC<{
  open: boolean;
  borderRadius?: boolean;
  classNameLoading?: string;
  classNameLogoLoading?: string;
}> = ({
  open,
  borderRadius = false,
  classNameLoading,
  classNameLogoLoading,
}) => {
  let className = borderRadius
    ? ['loaderRoot', 'loaderRootBorderRadius']
    : ['loaderRoot'];
  return (
    <div
      className={cx(
        open
          ? className.concat(['loaderRootDisplayed', classNameLoading])
          : className
      )}
    >
      <div className={cx('osmosisContainer')}>
        <img
          className={cx('svgLogo', classNameLogoLoading)}
          src={OraidexSVG}
          alt="logoOraiDex"
        />
        <p className={cx('loading')}>
          <span className={cx('letter1')}>L</span>
          <span className={cx('letter2')}>o</span>
          <span className={cx('letter3')}>a</span>
          <span className={cx('letter4')}>d</span>
          <span className={cx('letter5')}>i</span>
          <span className={cx('letter6')}>n</span>
          <span className={cx('letter7')}>g</span>
          <span className={cx('letter8')}> </span>
          <span className={cx('letter9')}>.</span>
          <span className={cx('letter10')}>.</span>
          <span className={cx('letter11')}>.</span>
        </p>
      </div>
    </div>
  );
};

export default BlocLoaderOsmosis;
