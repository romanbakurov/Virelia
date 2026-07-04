import { forwardRef } from 'react';

import { cn } from '@utils/cn';

import type { ButtonProps } from './types';

import styles from './Button.module.scss';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      onClick,
      ariaLabel,
    },
    ref
  ) => {
    const iconOnly = !children && (leftIcon || rightIcon);

    if (iconOnly && !ariaLabel && process.env.NODE_ENV !== 'production') {
      console.warn('Button: icon-only buttons must provide ariaLabel.');
    }

    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel || undefined}
        className={cn(styles.button, styles[variant], styles[size], className, {
          [styles.disabled]: disabled,
          [styles.fullWidth]: fullWidth,
          [styles.iconOnly]: iconOnly,
        })}
      >
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        {children && <span className={styles.label}>{children}</span>}
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
