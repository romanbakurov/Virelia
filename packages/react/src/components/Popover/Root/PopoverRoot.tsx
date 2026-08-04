import { useCallback, useId, useRef } from 'react';

import type { PopoverOpenChangeDetails } from '@vellira-ui/types';

import { useControllableState } from '../../../hooks/useControllableState';
import { PopoverProvider } from '../Context';

import type { PopoverRootProps } from './types';

export function PopoverRoot({
  children,
  open: openProp,
  defaultOpen = false,
  modal = false,
  onOpenChange,
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

  return (
    <PopoverProvider
      value={{
        open,
        modal,
        triggerRef,
        anchorRef,
        contentRef,
        triggerId,
        contentId,
        titleId,
        descriptionId,
        setOpen,
      }}
    >
      {children}
    </PopoverProvider>
  );
}
