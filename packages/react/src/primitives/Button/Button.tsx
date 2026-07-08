import { forwardRef } from 'react';

import { cn } from '@utils/cn';
import { devWarning } from '@utils/devWarning';

import type { ButtonProps } from './types';

import styles from './Button.module.scss';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      color = 'primary',
      variant = 'solid',
      size = 'md',
      type = 'button',
      disabled = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      iconOnly: iconOnlyProp = false,
      className,
      onClick,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const iconOnly = iconOnlyProp || (!children && (leftIcon || rightIcon));
    const isDisabled = disabled || loading;
    const content = loading && loadingText ? loadingText : children;

    devWarning(
      !iconOnly || Boolean(ariaLabel),
      'Button: icon-only buttons must provide aria-label.'
    );

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        aria-label={ariaLabel || undefined}
        aria-busy={loading || undefined}
        className={cn(
          styles.button,
          styles[color],
          styles[variant],
          styles[size],
          className,
          {
            [styles.disabled]: isDisabled,
            [styles.loading]: loading,
            [styles.fullWidth]: fullWidth,
            [styles.iconOnly]: iconOnly,
          }
        )}
      >
        {loading && <span className={styles.spinner} aria-hidden='true' />}
        {!loading && leftIcon && (
          <span className={styles.icon}>{leftIcon}</span>
        )}
        {content && <span className={styles.label}>{content}</span>}
        {!loading && rightIcon && (
          <span className={styles.icon}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
