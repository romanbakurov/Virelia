import { useCallback, useId, useRef } from 'react';

import type { Placement } from '@floating-ui/react';
import type {
  PopoverAlign,
  PopoverOpenChangeDetails,
  PopoverSide,
} from '@vellira-ui/types';

import { useControllableState } from '@/hooks/useControllableState';
import { useFloatingPosition } from '@/managers/FloatingManager';

import { PopoverProvider } from '../Context';

import type { PopoverRootProps } from './types';

function getPopoverPlacement(
  side: PopoverSide,
  align: PopoverAlign
): Placement {
  if (align === 'center') {
    return side;
  }

  return `${side}-${align}` as Placement;
}

export function PopoverRoot({
  children,
  open: openProp,
  defaultOpen = false,
  modal = false,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  alignOffset: _alignOffset = 0,
  collisionPadding = 8,
  avoidCollisions = true,
  portal = true,
  strategy,
}: PopoverRootProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  const openChangeDetailsRef = useRef<PopoverOpenChangeDetails>({
    reason: 'programmatic',
  });

  const generatedId = useId();

  const triggerId = `vellira-popover-trigger-${generatedId}`;
  const contentId = `vellira-popover-content-${generatedId}`;
  const titleId = `vellira-popover-title-${generatedId}`;
  const descriptionId = `vellira-popover-description-${generatedId}`;

  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: (nextOpen) => {
      onOpenChange?.(nextOpen, openChangeDetailsRef.current);
    },
  });

  const setOpen = useCallback(
    (nextOpen: boolean, details: PopoverOpenChangeDetails) => {
      openChangeDetailsRef.current = details;
      setOpenState(nextOpen);
    },
    [setOpenState]
  );

  const { floatingStyles, isPositioned, placement, setFloatingRef, setRef } =
    useFloatingPosition({
      open,
      placement: getPopoverPlacement(side, align),
      strategy: strategy ?? (portal ? 'fixed' : 'absolute'),
      offset: sideOffset,
      collisionPadding,
      avoidCollisions,
    });

  const setReferenceRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;
      setRef(node);
    },
    [setRef]
  );

  const setContentRef = useCallback(
    (node: HTMLElement | null) => {
      contentRef.current = node;
      setFloatingRef(node);
    },
    [setFloatingRef]
  );

  return (
    <PopoverProvider
      value={{
        open,
        modal,
        portal,
        triggerRef,
        anchorRef,
        contentRef,
        triggerId,
        contentId,
        titleId,
        descriptionId,
        placement,
        floatingStyles,
        isPositioned,
        setReferenceRef,
        setContentRef,
        setOpen,
      }}
    >
      {children}
    </PopoverProvider>
  );
}
