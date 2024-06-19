import Tippy, { TippyProps } from '@tippyjs/react';
import classNames from 'classnames';
import React, { FC } from 'react';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import styles from './index.module.scss';

export const DefaultTippyProps: TippyProps = {
  animation: false,
  interactive: true,
  appendTo: document.body
};

const TooltipTippyProps: TippyProps = {
  ...DefaultTippyProps,
  placement: 'top',
  theme: 'dark-border',
  className: styles.tooltip
};

interface Props extends TippyProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
}

const TooltipContainer: FC<Props> = ({ className, children, setVisible, visible, ...props }) => {
  const hide = () => setVisible(false);

  const button = (
    <span className={classNames(styles.button, className)} onClick={() => setVisible(!visible)}>
      {children}
    </span>
  );

  return props.content ? (
    <Tippy
      visible={visible}
      onClickOutside={hide}
      popperOptions={{
        modifiers: [
          {
            name: 'arrow',
            options: {
              element: null
            }
          }
        ]
      }}
      {...TooltipTippyProps}
      {...props}
    >
      {button}
    </Tippy>
  ) : (
    button
  );
};

export const TooltipIcon: FC<Props> = ({ children }) => {
  return (
    <div className={styles.flex}>
      {children}
    </div>
  );
};

export default TooltipContainer;
