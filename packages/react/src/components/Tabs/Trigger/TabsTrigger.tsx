import { forwardRef, useCallback } from 'react';

import { cn } from '@utils/cn';

import { useTabsContext } from '../internal/TabsContext';

import type { TabsTriggerProps } from './types';

import styles from './TabsTrigger.module.scss';

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  (
    {
      index,
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
      activeIndex,
      setActiveIndex,
      orientation,
      appearance,
      registerTab,
      onTabKeyDown,
    } = useTabsContext();

    const isActive = activeIndex === index;
    const hasIcon = Boolean(icon);
    const isOnlyIcon = hasIcon && children == null;

    const tabRef = useCallback(
      (element: HTMLButtonElement | null) => {
        registerTab(index, element);

        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [index, ref, registerTab]
    );

    return (
      <button
        {...props}
        ref={tabRef}
        type='button'
        role='tab'
        id={`tab-${index}`}
        aria-selected={isActive}
        aria-controls={`tab-panel-${index}`}
        disabled={disabled}
        tabIndex={isActive ? 0 : -1}
        data-state={isActive ? 'active' : 'inactive'}
        data-orientation={orientation}
        className={cn(
          styles.tab,
          styles[appearance],
          orientation === 'vertical' && styles.vertical,
          hasIcon && styles.withIcon,
          isOnlyIcon && styles.iconOnly,
          className
        )}
        onClick={(event) => {
          onClick?.(event);

          if (event.defaultPrevented || disabled) return;

          setActiveIndex(index);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.defaultPrevented) return;

          onTabKeyDown(event, index);
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
