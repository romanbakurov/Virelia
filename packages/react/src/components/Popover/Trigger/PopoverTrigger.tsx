import { cloneElement, isValidElement, type MouseEvent } from 'react';

import { usePopoverContext } from '../Context';

import type {
  PopoverTriggerChild,
  PopoverTriggerChildProps,
  PopoverTriggerProps,
} from './types';

import { cn } from '#utils/cn';

export function PopoverTrigger({
  children,
  asChild = false,
  disabled = false,
  className,
  onClick,
  ...triggerProps
}: PopoverTriggerProps) {
  const { open, triggerId, contentId, setOpen, setTriggerRef } =
    usePopoverContext('Popover.Trigger');

  const child =
    asChild && isValidElement<PopoverTriggerChildProps>(children)
      ? (children as PopoverTriggerChild)
      : undefined;

  const isDisabled = disabled || child?.props.disabled === true;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    child?.props.onClick?.(event);
    onClick?.(event);

    if (event.defaultPrevented || isDisabled) {
      return;
    }

    setOpen(!open, {
      reason: 'trigger',
      event: event.nativeEvent,
    });
  };

  const sharedProps = {
    id: triggerId,
    'aria-controls': open ? contentId : undefined,
    'aria-expanded': open,
    'aria-haspopup': 'dialog' as const,
    'aria-disabled': isDisabled || undefined,
    'data-state': open ? 'open' : 'closed',
    onClick: handleClick,
  };

  if (child) {
    return cloneElement(child, {
      ...triggerProps,
      ...sharedProps,
      disabled: isDisabled || undefined,
      className: cn(child.props.className, className),
      ref: (node: HTMLElement | null) => {
        const childRef = child.props.ref;

        if (typeof childRef === 'function') {
          childRef(node);
        } else if (childRef) {
          childRef.current = node;
        }

        setTriggerRef(node);
      },
    });
  }

  return (
    <button
      {...triggerProps}
      {...sharedProps}
      ref={setTriggerRef}
      type='button'
      disabled={isDisabled}
      className={className}
    >
      {children}
    </button>
  );
}

PopoverTrigger.displayName = 'Popover.Trigger';
