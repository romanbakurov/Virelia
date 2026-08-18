import {
  type ButtonHTMLAttributes,
  cloneElement,
  isValidElement,
  type MouseEventHandler,
  type ReactElement,
} from 'react';

import { usePopoverContext } from '../Context';

import type { PopoverCloseProps } from './types';

import { cn } from '#utils/cn';

type CloseChildProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PopoverClose({
  children,
  asChild = false,
  className,
  disabled,
  onClick,
  ...closeProps
}: PopoverCloseProps) {
  const { setOpen } = usePopoverContext('Popover.Close');

  const child =
    asChild && isValidElement<CloseChildProps>(children)
      ? (children as ReactElement<CloseChildProps>)
      : undefined;

  const isDisabled = disabled || child?.props.disabled === true;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    child?.props.onClick?.(event);
    onClick?.(event);

    if (event.defaultPrevented || isDisabled) {
      return;
    }

    setOpen(false, {
      reason: 'close',
      event: event.nativeEvent,
    });
  };

  const sharedProps = {
    ...closeProps,
    disabled: isDisabled || undefined,
    'aria-disabled': isDisabled || undefined,
    onClick: handleClick,
  };

  if (child) {
    return cloneElement(child, {
      ...sharedProps,
      className: cn(child.props.className, className),
    });
  }

  return (
    <button type='button' {...sharedProps} className={className}>
      {children}
    </button>
  );
}

PopoverClose.displayName = 'Popover.Close';
