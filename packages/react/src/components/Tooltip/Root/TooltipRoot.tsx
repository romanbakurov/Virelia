import { useId, useRef } from 'react';

import { useControllableState, useOverlayDismiss } from '@/hooks';

import { composeRefs } from '../internal/composeEventHandlers';
import { TooltipRootProvider } from '../internal/TooltipContext';
import { useTooltipDelay } from '../internal/useTooltipDelay';
import { useTooltipInteractions } from '../internal/useTooltipInteractions';
import { useTooltipPosition } from '../internal/useTooltipPosition';

import type { TooltipRootProps } from './types';

export const TooltipRoot = ({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'top',
  offset = 8,
  delay,
  skipDelay,
  disabled = false,
  interactive = false,
  avoidCollisions = true,
  matchTriggerWidth = false,
  modal: _modal = false,
}: TooltipRootProps) => {
  const generatedId = useId();
  const contentId = `${generatedId}-content`;
  const contentRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const setOpen = (nextOpen: boolean) => {
    if (disabled) return;
    setOpenState(nextOpen);
  };

  const position = useTooltipPosition({
    open,
    onOpenChange: setOpen,
    placement,
    offset,
    avoidCollisions,
    matchTriggerWidth,
  });
  const resolvedDelay = useTooltipDelay(delay, skipDelay);
  const interactions = useTooltipInteractions({
    context: position.context,
    delay: resolvedDelay,
    disabled,
    interactive,
  });
  const dismiss = useOverlayDismiss({
    active: open,
    id: contentId,
    layer: 'tooltip',
    contentRef,
    ignoreRefs: [triggerRef],
    closeOnEscape: true,
    closeOnOutsidePress: !interactive,
    requestClose: () => setOpen(false),
  });

  return (
    <TooltipRootProvider
      value={{
        contentId,
        open,
        disabled,
        interactive,
        contentRef,
        arrowRef: position.arrowRef,
        arrowX: position.arrowX,
        arrowY: position.arrowY,
        placement: position.placement,
        floatingStyles: {
          ...position.floatingStyles,
          zIndex: dismiss.zIndex,
        },
        setOpen,
        setTriggerRef: composeRefs(triggerRef, position.setRef),
        setContentRef: composeRefs(contentRef, position.setFloatingRef),
        getTriggerProps: interactions.getReferenceProps,
        getContentProps: interactions.getFloatingProps,
      }}
    >
      {children}
    </TooltipRootProvider>
  );
};

TooltipRoot.displayName = 'Tooltip.Root';
