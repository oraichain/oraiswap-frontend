import React, { FC, useState } from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import classNames from 'classnames';
import { ReactComponent as SettingImg } from 'assets/images/setting.svg';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import styles from './SettingTooltip.module.scss';

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

interface Props extends Omit<TippyProps, 'children'> {
  onClick?: () => void;
}

const SettingTooltip: FC<Props> = ({ className, onClick, children, ...props }) => {
  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const button = (
    <span className={classNames(styles.button, className)} onClick={visible ? hide : show}>
      {children}
    </span>
  );

  return props.content ? (
    <Tippy visible={visible} onClickOutside={hide} popperOptions={{
      modifiers: [
        {
          name: 'arrow',
          options: {
            element: null,
          },
        },
      ],
    }}
      {...TooltipTippyProps} {...props} hideOnClick={props.visible}>
      {button}
    </Tippy>
  ) : (
    button
  );
};

export const TooltipIcon: FC<Props> = ({ children, ...props }) => (
  <div className={styles.flex}>
    {children}
    <div className={styles.icon}>
      <SettingTooltip {...props}>
        <SettingImg />
      </SettingTooltip>
    </div>
  </div>
);

export default SettingTooltip;
