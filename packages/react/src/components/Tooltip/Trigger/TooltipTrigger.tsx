import { cloneElement, isValidElement } from 'react';

import { cn } from '@utils/cn';
import type {
  FocusEventHandler,
  HTMLAttributes,
  MouseEventHandler,
  PointerEventHandler,
  Ref,
} from 'react';

import {
  composeEventHandlers,
  composeRefs,
} from '../internal/composeEventHandlers';
import { useTooltipContext } from '../internal/TooltipContext';

import type { TooltipTriggerElement, TooltipTriggerProps } from './types';

type TooltipTriggerHtmlProps = HTMLAttributes<HTMLElement> & {
  'data-state'?: 'open' | 'closed';
  disabled?: boolean;
  ref?: Ref<HTMLElement>;
};

export const TooltipTrigger = ({
  asChild = false,
  children,
  disabled = false,
  className,
  ...props
}: TooltipTriggerProps) => {
  const tooltip = useTooltipContext();
  const child =
    asChild && isValidElement(children)
      ? (children as TooltipTriggerElement)
      : undefined;
  const isDisabled = tooltip.disabled || disabled || child?.props.disabled;
  const interactionProps = tooltip.getTriggerProps({
    ...props,
    'aria-describedby': tooltip.open ? tooltip.contentId : undefined,
    'aria-disabled': isDisabled || undefined,
    'data-state': tooltip.open ? 'open' : 'closed',
  } as TooltipTriggerHtmlProps);
  const triggerProps = {
    ...interactionProps,
    ref: child
      ? composeRefs(child.props.ref, tooltip.setTriggerRef)
      : tooltip.setTriggerRef,
    className: cn(child?.props.className, className),
    disabled: isDisabled || undefined,
    onMouseEnter: composeEventHandlers(
      child?.props.onMouseEnter as MouseEventHandler<HTMLElement> | undefined,
      interactionProps.onMouseEnter as MouseEventHandler<HTMLElement>
    ),
    onMouseLeave: composeEventHandlers(
      child?.props.onMouseLeave as MouseEventHandler<HTMLElement> | undefined,
      interactionProps.onMouseLeave as MouseEventHandler<HTMLElement>
    ),
    onPointerEnter: composeEventHandlers(
      child?.props.onPointerEnter as
        PointerEventHandler<HTMLElement> | undefined,
      interactionProps.onPointerEnter as PointerEventHandler<HTMLElement>
    ),
    onPointerLeave: composeEventHandlers(
      child?.props.onPointerLeave as
        PointerEventHandler<HTMLElement> | undefined,
      interactionProps.onPointerLeave as PointerEventHandler<HTMLElement>
    ),
    onFocus: composeEventHandlers(
      child?.props.onFocus as FocusEventHandler<HTMLElement> | undefined,
      interactionProps.onFocus as FocusEventHandler<HTMLElement>
    ),
    onBlur: composeEventHandlers(
      child?.props.onBlur as FocusEventHandler<HTMLElement> | undefined,
      interactionProps.onBlur as FocusEventHandler<HTMLElement>
    ),
  } satisfies TooltipTriggerHtmlProps;

  if (child) {
    return cloneElement(child, triggerProps);
  }

  return (
    <button type='button' {...triggerProps}>
      {children}
    </button>
  );
};

TooltipTrigger.displayName = 'Tooltip.Trigger';
