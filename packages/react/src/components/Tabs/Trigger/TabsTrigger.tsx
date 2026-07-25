import { forwardRef, useCallback } from 'react';

import { cn } from '@utils/cn';

import { useTabsContext } from '../internal/TabsContext';

import type { TabsTriggerProps } from './types';

import styles from './TabsTrigger.module.scss';

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  (
    {
      value,
      children,
      className,
      disabled = false,
      icon,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const {
      value: selectedValue,
      setValue,
      orientation,
      variant,
      registerTrigger,
      onTriggerKeyDown,
      getTriggerId,
      getContentId,
    } = useTabsContext();

    const isActive = selectedValue === value;
    const hasIcon = Boolean(icon);
    const isOnlyIcon = hasIcon && children == null;

    const triggerRef = useCallback(
      (element: HTMLButtonElement | null) => {
        registerTrigger(value, element, disabled);

        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [disabled, ref, registerTrigger, value]
    );

    return (
      <button
        {...props}
        ref={triggerRef}
        type='button'
        role='tab'
        id={getTriggerId(value)}
        aria-selected={isActive}
        aria-controls={getContentId(value)}
        disabled={disabled}
        tabIndex={isActive ? 0 : -1}
        data-state={isActive ? 'active' : 'inactive'}
        data-orientation={orientation}
        className={cn(
          styles.tab,
          styles[variant],
          orientation === 'vertical' && styles.vertical,
          hasIcon && styles.withIcon,
          isOnlyIcon && styles.iconOnly,
          className
        )}
        onClick={(event) => {
          onClick?.(event);

          if (event.defaultPrevented || disabled) return;

          setValue(value);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.defaultPrevented) return;

          onTriggerKeyDown(event);
        }}
      >
        {hasIcon && (
          <span className={styles.tabIcon} aria-hidden='true'>
            {icon}
          </span>
        )}

        {children != null && <span className={styles.label}>{children}</span>}
      </button>
    );
  }
);

TabsTrigger.displayName = 'Tabs.Trigger';
