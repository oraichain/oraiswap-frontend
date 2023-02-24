import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import cn from 'classnames/bind';
import styles from './index.module.scss';
const cx = cn.bind(styles);

type ReactElement =
  | React.ReactNode
  | React.ReactElement
  | React.ReactElement[]
  | React.ReactNode[];

const DropdownCustom: React.FC<{
  triggerElement?: ReactElement;
  content?: ReactElement;
  position?:
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right';
  styles?: CSSProperties;
}> = ({ triggerElement, content, position, styles }) => {
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef<any>(null);
  const triggerRef = useRef<any>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className={cx('dropdown-custom')}>
      <div
        className={cx('dropdown-trigger')}
        onClick={() => setVisible(!visible)}
        ref={triggerRef}
      >
        {triggerElement || 'Title-Dropdown'}
      </div>
      <div
        className={cx(
          'dropdown-content',
          visible ? 'visible' : '',
          position || 'bottom'
        )}
        style={styles}
        ref={dropdownRef}
      >
        {content || 'Content-Dropdown'}
      </div>
    </div>
  );
};

export default DropdownCustom;
