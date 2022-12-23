import React, { ReactNode } from 'react';
import classnames from 'classnames';
import TickIcon from '../../icons/TickIcon';

import * as styles from './ToolbarItem.css';

interface Props {
  children: ReactNode;
  title: string;
  active?: boolean;
  success?: boolean;
  disabled?: boolean;
  onClick: () => void;
  ['data-testid']?: string;
}

export default function ToolbarItem({
  children,
  title,
  active = false,
  disabled = false,
  success = false,
  onClick,
  'data-testid': dataTestId,
}: Props) {
  return (
    <button
      data-testid={dataTestId}
      className={classnames(styles.button, {
        [styles.button_isActive]: active,
        [styles.disabled]: disabled,
      })}
      disabled={disabled}
      title={title}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {children}
      {success && (
        <span className={styles.successIndicator}>
          <TickIcon size={8} />
        </span>
      )}
    </button>
  );
}
