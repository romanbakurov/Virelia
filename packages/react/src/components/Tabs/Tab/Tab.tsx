import { forwardRef, useCallback } from 'react';

import { cn } from '@utils/cn';

import { useTabs } from '../TabsContext';

import type { TabProps } from './types';

import styles from './Tab.module.scss';

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
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
      appearance = 'default',
      registerTab,
      onTabKeyDown,
    } = useTabs();
    const isActive = activeIndex === index;
    const hasIcon = Boolean(icon);
    const isOnlyIcon = hasIcon && children == null;

    const tabRef = useCallback(
      (el: HTMLButtonElement | null) => {
        registerTab(index, el);

        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      },
      [registerTab, index, ref]
    );

    return (
      <button
        type='button'
        ref={tabRef}
        role='tab'
        aria-selected={isActive}
        aria-controls={`tab-panel-${index}`}
        id={`tab-${index}`}
        disabled={disabled}
        tabIndex={isActive ? 0 : -1}
        className={cn(
          styles.tab,
          styles[appearance],
          orientation === 'vertical' && styles.vertical,
          hasIcon && styles.withIcon,
          isOnlyIcon && styles.iconOnly,
          className
        )}
        onClick={(e) => {
          if (disabled) return;

          setActiveIndex(index);
          onClick?.(e);
        }}
        onKeyDown={(e) => {
          onTabKeyDown(e);
          onKeyDown?.(e);
        }}
        {...props}
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

Tab.displayName = 'Tab';

export default Tab;
