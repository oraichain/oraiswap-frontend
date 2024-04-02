import useOnClickOutside from 'hooks/useOnClickOutside';
import styles from './index.module.scss';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { reduceString } from 'libs/utils';

const InputCommon: FC<{
  title: string;
  onChange: (value: string) => void;
  value?: string;

  suffix?: ReactNode;

  extraButton?: ReactNode;
  showPreviewOnBlur?: boolean;

  isOnViewPort?: boolean;
}> = ({ title, onChange, value, suffix, extraButton, showPreviewOnBlur, isOnViewPort = true }) => {
  const [active, setActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>();
  const ref = useRef();

  useOnClickOutside(ref, () => {
    if ((!value || showPreviewOnBlur) && isOnViewPort) {
      setActive(false);
    }
    inputRef.current?.blur();
  });

  useEffect(() => {
    // check case clear all text
    if (!showPreviewOnBlur && value !== '') {
      setActive(!!value);
    }
  }, [value, showPreviewOnBlur]);

  return (
    <div
      className={styles.inputCommon}
      ref={ref}
      onClick={() => {
        setActive(true);
        inputRef.current?.focus();
      }}
    >
      <div className={styles.prefix}>
        <p>{title}</p>
        <input
          className={`${styles.input} ${active ? styles.activeInput : ''}`}
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e?.target?.value)}
        />
        {extraButton && <div className={`${styles.extraBtn} ${active ? styles.activeExtra : ''}`}>{extraButton}</div>}
      </div>
      {!active && value && showPreviewOnBlur && <div className={styles.prev}>{reduceString(value, 8, 8)}</div>}
      {suffix && <div className={styles.suffix}>{suffix}</div>}
    </div>
  );
};

export default InputCommon;
