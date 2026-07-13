import { type CSSProperties, forwardRef } from 'react';

import { cn } from '@utils/cn';
import { ChevronDown } from '@vellira-ui/icons';

import type { DropdownTriggerProps } from './types';

import styles from './DropdownTrigger.module.scss';

export const DropdownTrigger = forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(
  (
    {
      children,
      isOpen,
      icon,
      arrowIcon,
      showArrow = true,
      rotateAngle = 90,
      label,
      ariaLabel,
      className,
      ...buttonProps
    },
    ref
  ) => {
    // const hasText = typeof children === 'string' && children.trim().length > 0;
    const hasIcon = Boolean(icon);
    const hasContent = Boolean(children);

    const isOnlyIcon = hasIcon && !hasContent;
    const shouldShowArrow = showArrow && hasContent;
    const arrow = arrowIcon ?? <ChevronDown />;
    const resolvedAriaLabel =
      ariaLabel ??
      (isOnlyIcon
        ? typeof label === 'string'
          ? label
          : 'Open menu'
        : undefined);

    return (
      <button
        {...buttonProps}
        ref={ref}
        type='button'
        className={cn(
          styles.button,
          {
            [styles.disabled]: buttonProps.disabled,
            [styles.iconOnly]: isOnlyIcon,
          },
          className
        )}
        aria-label={resolvedAriaLabel}
        aria-expanded={isOpen}
        aria-haspopup='menu'
        style={
          {
            '--dropdown-rotate-angle': `${rotateAngle}deg`,
          } as CSSProperties
        }
      >
        {hasIcon && (
          <span aria-hidden='true' className={styles.iconLeft}>
            {icon}
          </span>
        )}

        {children}

        {shouldShowArrow && (
          <span
            aria-hidden='true'
            className={cn(styles.arrow, {
              [styles.open]: isOpen,
            })}
          >
            {arrow}
          </span>
        )}
      </button>
    );
  }
);

DropdownTrigger.displayName = 'DropdownTrigger';
