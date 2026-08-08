import { useEffect, useRef } from 'react';

import { overlayManager } from '@/managers';

import type { OverlayDismissOptions } from '../types.js';
import { createOutsideEvent } from '../utils/events.js';

import { useOverlayRegistration } from './useOverlayRegistration.js';

let activeEscapeHandlers = 0;
let detachEscapeKeyDown: (() => void) | undefined;
let activePointerDownOutsideHandlers = 0;
let detachPointerDownOutside: (() => void) | undefined;

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

function attachPointerDownOutside() {
  if (detachPointerDownOutside || typeof document === 'undefined') return;

  const handlePointerDown = (event: PointerEvent) => {
    overlayManager.dispatchPointerDownOutside(event);
  };

  document.addEventListener('pointerdown', handlePointerDown);

  detachPointerDownOutside = () => {
    document.removeEventListener('pointerdown', handlePointerDown);
    detachPointerDownOutside = undefined;
  };
}

function retainPointerDownOutside() {
  activePointerDownOutsideHandlers += 1;
  attachPointerDownOutside();

  return () => {
    activePointerDownOutsideHandlers = Math.max(
      0,
      activePointerDownOutsideHandlers - 1
    );

    if (activePointerDownOutsideHandlers > 0) return;

    detachPointerDownOutside?.();
  };
}

export const useOverlayDismiss = ({
  active,
  id,
  contentRef,
  ignoreRefs = [],
  closeOnEscape,
  closeOnOutsidePress,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  requestClose,
}: OverlayDismissOptions) => {
  useOverlayRegistration({
    active,
    id,
  });

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

    const releasePointerDownOutside = retainPointerDownOutside();
    const unregisterPointerDownOutsideHandler =
      overlayManager.registerPointerDownOutsideHandler(id, (event) => {
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
      });

    return () => {
      unregisterPointerDownOutsideHandler();
      releasePointerDownOutside();
    };
  }, [
    active,
    closeOnOutsidePress,
    contentRef,
    id,
    onInteractOutside,
    onPointerDownOutside,
    requestClose,
  ]);
};
