import { useEffect, useRef } from 'react';

import type { OverlayDismissOptions } from '../types.js';
import { createOutsideEvent } from '../utils/events.js';

export const useOverlayDismiss = ({
  active,
  contentRef,
  ignoreRefs = [],
  closeOnEscape,
  closeOnOutsidePress,
  isTopOverlay,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  requestClose,
}: OverlayDismissOptions) => {
  const ignoreRefsRef = useRef(ignoreRefs);
  ignoreRefsRef.current = ignoreRefs;

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !isTopOverlay()) return;

      onEscapeKeyDown?.(event);

      if (event.defaultPrevented || !closeOnEscape) return;

      requestClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, closeOnEscape, isTopOverlay, onEscapeKeyDown, requestClose]);

  useEffect(() => {
    if (!active) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!isTopOverlay()) return;
      if (
        event.target instanceof Node &&
        [contentRef, ...ignoreRefsRef.current].some((ref) =>
          ref.current?.contains(event.target as Node)
        )
      ) {
        return;
      }

      const outsideEvent = createOutsideEvent(event);
      onPointerDownOutside?.(outsideEvent);
      onInteractOutside?.(outsideEvent);

      if (outsideEvent.defaultPrevented || !closeOnOutsidePress) return;

      requestClose();
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [
    active,
    closeOnOutsidePress,
    contentRef,
    isTopOverlay,
    onInteractOutside,
    onPointerDownOutside,
    requestClose,
  ]);
};
