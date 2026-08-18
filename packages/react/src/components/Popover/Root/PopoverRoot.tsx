import { useCallback, useId, useMemo, useRef } from 'react';

import type { Middleware, Placement } from '@floating-ui/react';
import { arrow as floatingArrow } from '@floating-ui/react';
import type {
  PopoverAlign,
  PopoverOpenChangeDetails,
  PopoverSide,
} from '@vellira-ui/types';

import { PopoverProvider } from '../Context';

import type { PopoverRootProps } from './types';

import { useOverlayPresentation } from '#hooks';
import { useControllableState } from '#hooks/useControllableState';

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

  const arrowRef = useRef<SVGSVGElement | null>(null);

  const arrowMiddleware = useMemo<Middleware[]>(
    () => [
      floatingArrow({
        element: arrowRef,
        padding: 8,
      }),
    ],
    []
  );

  const {
    context: floatingContext,
    floatingStyles,
    isPositioned,
    placement,
    setFloatingRef,
    setRef,
  } = useOverlayPresentation({
    open,
    placement: getPopoverPlacement(side, align),
    strategy,
    portal,
    offset: sideOffset + 7,
    collisionPadding,
    avoidCollisions,
    middleware: arrowMiddleware,
  });

  const setTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;

      if (!anchorRef.current) {
        setRef(node);
      }
    },
    [setRef]
  );

  const setAnchorRef = useCallback(
    (node: HTMLElement | null) => {
      anchorRef.current = node;
      setRef(node ?? triggerRef.current);
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
        floatingContext,
        arrowRef,
        setTriggerRef,
        setAnchorRef,
        setContentRef,
        setOpen,
      }}
    >
      {children}
    </PopoverProvider>
  );
}
