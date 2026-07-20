import { useEffect } from 'react';

import { createOutsideEvent } from './events.js';
import type { DismissManagerOptions } from './types.js';

export const useDismissManager = ({
  active,
  contentRef,
  closeOnEscape,
  closeOnOutsidePress,
  isTopOverlay,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  requestClose,
}: DismissManagerOptions) => {
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
        contentRef.current?.contains(event.target)
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
