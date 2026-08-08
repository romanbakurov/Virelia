import { useCallback, useId, useRef } from 'react';

import type { PopoverOpenChangeDetails } from '@vellira-ui/types';
import type { MutableRefObject } from 'react';
import type { View } from 'react-native';

import {
  useControllableState,
  useOverlayDismiss,
  useOverlayFocusRestore,
} from '../../../hooks';
import { useNativeFloatingPosition } from '../../../managers/FloatingManager';
import { PopoverProvider } from '../internal';
import type { PopoverProps } from '../types';

function getNativePlacement(
  side: PopoverProps['side'],
  align: PopoverProps['align']
) {
  if (!side) {
    return 'bottom';
  }

  if (!align || align === 'center') {
    return side;
  }

  return `${side}-${align}` as const;
}

export function PopoverRoot({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  closeOnOutsidePress = true,
}: PopoverProps) {
  const triggerRef = useRef<View | null>(null);
  const anchorRef = useRef<View | null>(null);
  const overlayId = useId();

  const { restoreFocusAfterClose } = useOverlayFocusRestore({
    triggerRef,
  });

  const getReferenceRef = useCallback(
    () => (anchorRef.current ? anchorRef : triggerRef),
    []
  );

  const openChangeDetailsRef = useRef<PopoverOpenChangeDetails>({
    reason: 'programmatic',
  });

  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: (nextOpen: boolean) => {
      onOpenChange?.(nextOpen, openChangeDetailsRef.current);
    },
  });

  const {
    position,
    arrowPosition,
    placement,
    updatePosition: updateFloatingPosition,
    onFloatingLayout,
  } = useNativeFloatingPosition(getNativePlacement(side, align), sideOffset);

  const setOpen = useCallback(
    (nextOpen: boolean, details: PopoverOpenChangeDetails) => {
      openChangeDetailsRef.current = details;
      setOpenState(nextOpen);

      if (!nextOpen) {
        restoreFocusAfterClose();
      }
    },
    [restoreFocusAfterClose, setOpenState]
  );

  const dismiss = useOverlayDismiss({
    id: overlayId,
    active: open,
    closeOnOutsidePress,
    requestClose: () => {
      setOpen(false, {
        reason: 'escape-key',
      });
    },
    requestOutsideClose: () => {
      setOpen(false, {
        reason: 'outside-press',
      });
    },
  });

  const updatePosition = useCallback(
    (containerRef?: MutableRefObject<View | null>) => {
      updateFloatingPosition(getReferenceRef(), containerRef);
    },
    [getReferenceRef, updateFloatingPosition]
  );

  return (
    <PopoverProvider
      value={{
        open,
        closeOnOutsidePress,
        triggerRef,
        anchorRef,
        side,
        align,
        placement,
        position,
        arrowPosition,
        requestClose: dismiss.requestClose,
        requestOutsideClose: dismiss.requestOutsideClose,
        onFloatingLayout,
        updatePosition,
        setOpen,
      }}
    >
      {children}
    </PopoverProvider>
  );
}

PopoverRoot.displayName = 'Popover.Root';
