import { useEffect, useRef } from 'react';

import { type OverlayManager, useOverlayManager } from '@/managers';

import type { OverlayDismissOptions } from '../types.js';
import { createOutsideEvent } from '../utils/events.js';

import { useOverlayRegistration } from './useOverlayRegistration.js';

const escapeListeners = new Map<
  OverlayManager,
  { count: number; detach: () => void }
>();
const pointerDownOutsideListeners = new Map<
  OverlayManager,
  { count: number; detach: () => void }
>();

function attachEscapeKeyDown(manager: OverlayManager) {
  if (typeof document === 'undefined') return;
  if (escapeListeners.has(manager)) return;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;

    manager.dispatchEscapeKeyDown(event);
  };

  document.addEventListener('keydown', handleKeyDown);

  escapeListeners.set(manager, {
    count: 0,
    detach: () => {
      document.removeEventListener('keydown', handleKeyDown);
      escapeListeners.delete(manager);
    },
  });
}

function retainEscapeKeyDown(manager: OverlayManager) {
  attachEscapeKeyDown(manager);

  const retained = escapeListeners.get(manager);
  if (!retained) return () => undefined;

  retained.count += 1;

  return () => {
    const current = escapeListeners.get(manager);
    if (!current) return;

    current.count = Math.max(0, current.count - 1);

    if (current.count > 0) return;

    current.detach();
  };
}

function attachPointerDownOutside(manager: OverlayManager) {
  if (typeof document === 'undefined') return;
  if (pointerDownOutsideListeners.has(manager)) return;

  const handlePointerDown = (event: PointerEvent) => {
    manager.dispatchPointerDownOutside(event);
  };

  document.addEventListener('pointerdown', handlePointerDown);

  pointerDownOutsideListeners.set(manager, {
    count: 0,
    detach: () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      pointerDownOutsideListeners.delete(manager);
    },
  });
}

function retainPointerDownOutside(manager: OverlayManager) {
  attachPointerDownOutside(manager);

  const retained = pointerDownOutsideListeners.get(manager);
  if (!retained) return () => undefined;

  retained.count += 1;

  return () => {
    const current = pointerDownOutsideListeners.get(manager);
    if (!current) return;

    current.count = Math.max(0, current.count - 1);

    if (current.count > 0) return;

    current.detach();
  };
}

export const useOverlayDismiss = ({
  active,
  id,
  zIndexLevel,
  registrationActive = active,
  registered = false,
  zIndex,
  contentRef,
  ignoreRefs = [],
  closeOnEscape,
  closeOnOutsidePress,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  requestClose,
}: OverlayDismissOptions) => {
  const overlayManager = useOverlayManager();
  const registration = useOverlayRegistration({
    active: registrationActive && !registered,
    id,
    zIndexLevel,
    zIndex,
  });

  const ignoreRefsRef = useRef(ignoreRefs);
  ignoreRefsRef.current = ignoreRefs;

  useEffect(() => {
    if (!active) return;

    const releaseEscapeKeyDown = retainEscapeKeyDown(overlayManager);
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
  }, [
    active,
    closeOnEscape,
    id,
    overlayManager,
    onEscapeKeyDown,
    requestClose,
  ]);

  useEffect(() => {
    if (!active) return;

    const releasePointerDownOutside = retainPointerDownOutside(overlayManager);
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
    overlayManager,
    onInteractOutside,
    onPointerDownOutside,
    requestClose,
  ]);

  return registration;
};
