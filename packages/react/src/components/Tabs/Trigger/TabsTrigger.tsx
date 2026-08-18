import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type MouseEventHandler,
  type ReactElement,
  type Ref,
  useCallback,
} from 'react';

import { useTabsContext } from '../internal/TabsContext';

import type { TabsTriggerChildProps, TabsTriggerProps } from './types';

import styles from './TabsTrigger.module.scss';

import { cn } from '#utils/cn';

export const TabsTrigger = forwardRef<HTMLElement, TabsTriggerProps>(
  (
    {
      value,
      children,
      className,
      disabled = false,
      asChild = false,
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
      mode,
      orientation,
      variant,
      size,
      disabled: rootDisabled,
      registerTrigger,
      onTriggerKeyDown,
      getTriggerId,
      getContentId,
    } = useTabsContext();

    const isDisabled = rootDisabled || disabled;
    const isActive = selectedValue === value;
    const isFocused = focusedValue === value || (!focusedValue && isActive);
    const child =
      asChild && isValidElement<TabsTriggerChildProps>(children)
        ? (children as ReactElement<TabsTriggerChildProps>)
        : undefined;
    const visibleChildren = child ? child.props.children : children;
    const childArray = Children.toArray(visibleChildren);
    const hasExplicitIcon = childArray.some(
      (child) =>
        isValidElement(child) &&
        (child.type as { displayName?: string }).displayName === 'Tabs.Icon'
    );
    const hasIcon = Boolean(icon);
    const isOnlyIcon = (hasIcon || hasExplicitIcon) && visibleChildren == null;

    if (process.env.NODE_ENV !== 'production' && hasIcon && hasExplicitIcon) {
      console.warn(
        `Tabs.Trigger value "${value}" received both icon and Tabs.Icon. Tabs.Icon takes precedence.`
      );
    }

    const triggerRef = useCallback(
      (element: HTMLElement | null) => {
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
    const hasOnlyTextChildren = childArray.every(
      (child) => typeof child === 'string' || typeof child === 'number'
    );

    const resolvedClassName = cn(
      styles.trigger,
      styles[variant],
      styles[size],
      orientation === 'vertical' && styles.vertical,
      hasIcon && styles.withIcon,
      isOnlyIcon && styles.iconOnly,
      className
    );

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      setFocusedValue(value);
      setValue(value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented) return;

      onTriggerKeyDown(event);
    };

    if (mode === 'navigation' && child) {
      return cloneElement(child, {
        ...props,
        ref: triggerRef as Ref<HTMLElement>,
        id: getTriggerId(value),
        className: cn(child.props.className, resolvedClassName),
        'aria-current': isActive ? 'page' : undefined,
        'aria-disabled': isDisabled || undefined,
        'data-state': isActive ? 'active' : 'inactive',
        tabIndex: isDisabled ? -1 : child.props.tabIndex,
        onClick: (event: ReactMouseEvent<HTMLElement>) => {
          child.props.onClick?.(event);

          if (isDisabled) {
            event.preventDefault();
            return;
          }

          handleClick(event);
        },

        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          child.props.onKeyDown?.(event);

          if (event.defaultPrevented) return;

          handleKeyDown(event);
        },
        children: (
          <>
            {hasIcon && !hasExplicitIcon && (
              <span className={styles.icon} aria-hidden='true'>
                {icon}
              </span>
            )}

            {visibleChildren != null &&
              (hasSimpleSlots ? (
                <span className={styles.body}>
                  <span className={styles.label}>{visibleChildren}</span>
                  {description != null && (
                    <span className={styles.description}>{description}</span>
                  )}
                </span>
              ) : hasOnlyTextChildren ? (
                <span className={styles.label}>{visibleChildren}</span>
              ) : (
                visibleChildren
              ))}

            {badge != null && <span className={styles.badge}>{badge}</span>}
          </>
        ),
      });
    }

    if (process.env.NODE_ENV !== 'production' && mode === 'tabs' && asChild) {
      console.warn(
        'Tabs.Trigger: asChild is only supported when Tabs mode="navigation".'
      );
    }

    if (
      process.env.NODE_ENV !== 'production' &&
      mode === 'navigation' &&
      asChild &&
      !child
    ) {
      console.warn(
        'Tabs.Trigger: asChild requires a single valid React element child.'
      );
    }

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
        className={resolvedClassName}
        onClick={(event) => {
          onClick?.(event);

          if (event.defaultPrevented) return;

          handleClick(event);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.defaultPrevented) return;

          handleKeyDown(event);
        }}
      >
        {hasIcon && !hasExplicitIcon && (
          <span className={styles.icon} aria-hidden='true'>
            {icon}
          </span>
        )}

        {visibleChildren != null &&
          (hasSimpleSlots ? (
            <span className={styles.body}>
              <span className={styles.label}>{visibleChildren}</span>
              {description != null && (
                <span className={styles.description}>{description}</span>
              )}
            </span>
          ) : hasOnlyTextChildren ? (
            <span className={styles.label}>{visibleChildren}</span>
          ) : (
            visibleChildren
          ))}

        {badge != null && <span className={styles.badge}>{badge}</span>}
      </button>
    );
  }
);

TabsTrigger.displayName = 'Tabs.Trigger';
