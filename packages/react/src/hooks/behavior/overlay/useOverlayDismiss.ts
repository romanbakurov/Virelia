import { useEffect, useRef } from 'react';

import { overlayManager } from '@/managers';

import type { OverlayDismissOptions } from '../types.js';
import { createOutsideEvent } from '../utils/events.js';

let activeEscapeHandlers = 0;
let detachEscapeKeyDown: (() => void) | undefined;

function attachEscapeKeyDown() {
  if (detachEscapeKeyDown || typeof document === 'undefined') return;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;

    overlayManager.dispatchEscapeKeyDown(event);
  };

  document.addEventListener('keydown', handleKeyDown);

  detachEscapeKeyDown = () => {
    document.removeEventListener('keydown', handleKeyDown);
    detachEscapeKeyDown = undefined;
  };
}

function retainEscapeKeyDown() {
  activeEscapeHandlers += 1;
  attachEscapeKeyDown();

  return () => {
    activeEscapeHandlers = Math.max(0, activeEscapeHandlers - 1);

    if (activeEscapeHandlers > 0) return;

    detachEscapeKeyDown?.();
  };
}

export const useOverlayDismiss = ({
  active,
  id,
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

    const releaseEscapeKeyDown = retainEscapeKeyDown();
    const unregisterEscapeHandler = overlayManager.registerEscapeHandler(
      id,
      (event) => {
        onEscapeKeyDown?.(event);

        if (event.defaultPrevented || !closeOnEscape) return;

        requestClose('escape-key', event);
      }
    );

    return () => {
      unregisterEscapeHandler();
      releaseEscapeKeyDown();
    };
  }, [active, closeOnEscape, id, onEscapeKeyDown, requestClose]);

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

      requestClose('outside-press', event);
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
