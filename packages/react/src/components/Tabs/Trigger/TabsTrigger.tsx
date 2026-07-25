import { Children, forwardRef, isValidElement, useCallback } from 'react';

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
      badge,
      description,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const {
      value: selectedValue,
      focusedValue,
      setValue,
      setFocusedValue,
      orientation,
      variant,
      disabled: rootDisabled,
      registerTrigger,
      onTriggerKeyDown,
      getTriggerId,
      getContentId,
    } = useTabsContext();

    const isDisabled = rootDisabled || disabled;
    const isActive = selectedValue === value;
    const isFocused = focusedValue === value || (!focusedValue && isActive);
    const childArray = Children.toArray(children);
    const hasExplicitIcon = childArray.some(
      (child) =>
        isValidElement(child) &&
        (child.type as { displayName?: string }).displayName === 'Tabs.Icon'
    );
    const hasIcon = Boolean(icon);
    const isOnlyIcon = (hasIcon || hasExplicitIcon) && children == null;

    if (process.env.NODE_ENV !== 'production' && hasIcon && hasExplicitIcon) {
      console.warn(
        `Tabs.Trigger value "${value}" received both icon and Tabs.Icon. Tabs.Icon takes precedence.`
      );
    }

    const triggerRef = useCallback(
      (element: HTMLButtonElement | null) => {
        registerTrigger(value, element, isDisabled);

        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [isDisabled, ref, registerTrigger, value]
    );

    const hasSimpleSlots =
      (hasIcon && !hasExplicitIcon) || badge || description;

    return (
      <button
        {...props}
        ref={triggerRef}
        type='button'
        role='tab'
        id={getTriggerId(value)}
        aria-selected={isActive}
        aria-controls={getContentId(value)}
        disabled={isDisabled}
        tabIndex={isFocused ? 0 : -1}
        data-state={isActive ? 'active' : 'inactive'}
        data-orientation={orientation}
        data-disabled={isDisabled ? '' : undefined}
        className={cn(
          styles.trigger,
          styles[variant],
          orientation === 'vertical' && styles.vertical,
          hasIcon && styles.withIcon,
          isOnlyIcon && styles.iconOnly,
          className
        )}
        onClick={(event) => {
          onClick?.(event);

          if (event.defaultPrevented || isDisabled) return;

          setFocusedValue(value);
          setValue(value);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.defaultPrevented) return;

          onTriggerKeyDown(event);
        }}
      >
        {hasIcon && !hasExplicitIcon && (
          <span className={styles.icon} aria-hidden='true'>
            {icon}
          </span>
        )}

        {children != null &&
          (hasSimpleSlots ? (
            <span className={styles.body}>
              <span className={styles.label}>{children}</span>
              {description != null && (
                <span className={styles.description}>{description}</span>
              )}
            </span>
          ) : (
            children
          ))}

        {badge != null && <span className={styles.badge}>{badge}</span>}
      </button>
    );
  }
);

TabsTrigger.displayName = 'Tabs.Trigger';
