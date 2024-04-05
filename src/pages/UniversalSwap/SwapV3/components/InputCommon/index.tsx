import useOnClickOutside from 'hooks/useOnClickOutside';
import styles from './index.module.scss';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { reduceString } from 'libs/utils';
import { ReactComponent as ErrorIcon } from 'assets/icons/icon_error.svg';

const InputCommon: FC<{
  title: string;
  onChange: (value: string) => void;
  value?: string;

  suffix?: ReactNode;

  extraButton?: ReactNode;
  showPreviewOnBlur?: boolean;

  isOnViewPort?: boolean;

  error?: string;
}> = ({ title, onChange, value, suffix, extraButton, showPreviewOnBlur, isOnViewPort = true, error }) => {
  const [active, setActive] = useState(false);
  const [showError, setShowError] = useState(false);

  const inputRef = useRef<HTMLInputElement>();
  const ref = useRef();

  useOnClickOutside(ref, () => {
    if ((!value || showPreviewOnBlur) && isOnViewPort) {
      setActive(false);
    }
    setShowError(true);
    inputRef.current?.blur();
  });

  useEffect(() => {
    // check case clear all text
    if (!showPreviewOnBlur && value !== '') {
      setActive(!!value);
    }
  }, [value, showPreviewOnBlur]);

  return (
    <div className={`${styles.inputCommonWrapper} ${showError && error ? styles.error : ''}`}>
      <div
        className={`${styles.inputCommon}`}
        ref={ref}
        onClick={() => {
          setActive(true);
          inputRef.current?.focus();
          // setShowError(false);
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

      {showError && error && (
        <div className={styles.errorTxt}>
          <ErrorIcon />
          {error}
        </div>
      )}
    </div>
  );
};

export default InputCommon;
