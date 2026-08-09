import { useEffect, useRef } from 'react';

import { createRetainedResourceRegistry } from '@vellira-ui/core';

import { type OverlayManager, useOverlayManager } from '@/managers';

import type { OverlayDismissOptions } from '../types.js';
import { createOutsideEvent } from '../utils/events.js';

import { useOverlayRegistration } from './useOverlayRegistration.js';

const escapeKeyDownListeners = createRetainedResourceRegistry<OverlayManager>(
  (manager) => {
    if (typeof document === 'undefined') return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      manager.dispatchEscapeKeyDown(event);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }
);

const pointerDownOutsideListeners =
  createRetainedResourceRegistry<OverlayManager>((manager) => {
    if (typeof document === 'undefined') return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      manager.dispatchPointerDownOutside(event);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  });

function retainEscapeKeyDown(manager: OverlayManager) {
  return escapeKeyDownListeners.retain(manager);
}

function retainPointerDownOutside(manager: OverlayManager) {
  return pointerDownOutsideListeners.retain(manager);
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
