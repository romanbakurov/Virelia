import {
  createConsoleOverlayDiagnostics,
  createOverlayManagerStore,
  createOverlayZIndexPolicy,
} from '@vellira-ui/core';
import { lightTheme } from '@vellira-ui/tokens';

import type {
  OverlayEscapeHandler,
  OverlayManager,
  OverlayPointerDownOutsideHandler,
  OverlayRegistration,
  OverlayZIndexLevel,
} from './types';

const overlayZIndexPolicy = createOverlayZIndexPolicy<OverlayZIndexLevel>({
  defaultLevel: 'popover',
  levels: lightTheme.tokens.zIndex,
});
const overlayDiagnostics = createConsoleOverlayDiagnostics('WebOverlayManager');

export function createOverlayManager(): OverlayManager {
  const store = createOverlayManagerStore({
    diagnostics: overlayDiagnostics,
    policy: overlayZIndexPolicy,
  });
  const escapeHandlers = new Map<string, OverlayEscapeHandler>();
  const pointerDownOutsideHandlers = new Map<
    string,
    OverlayPointerDownOutsideHandler
  >();

  return {
    register(registration: OverlayRegistration) {
      return store.register(registration);
    },

    unregister(id: string) {
      escapeHandlers.delete(id);
      pointerDownOutsideHandlers.delete(id);
      store.unregister(id);
    },

    update(registration: OverlayRegistration) {
      return store.update(registration);
    },

    getSnapshot() {
      return store.getSnapshot();
    },

    getEntry(id: string) {
      return store.getEntry(id);
    },

    getStack() {
      return store.getStack();
    },

    getTopmost() {
      return store.getTopmost();
    },

    isTopmost(id: string) {
      return store.isTopmost(id);
    },

    getZIndex(id: string) {
      return store.getZIndex(id);
    },

    registerEscapeHandler(id: string, handler: OverlayEscapeHandler) {
      escapeHandlers.set(id, handler);

      return () => {
        if (escapeHandlers.get(id) !== handler) return;

        escapeHandlers.delete(id);
      };
    },

    dispatchEscapeKeyDown(event: KeyboardEvent) {
      const topmost = store.getTopmost();

      if (!topmost) return false;

      const handler = escapeHandlers.get(topmost.id);

      if (!handler) return false;

      handler(event);

      return true;
    },

    registerPointerDownOutsideHandler(
      id: string,
      handler: OverlayPointerDownOutsideHandler
    ) {
      pointerDownOutsideHandlers.set(id, handler);

      return () => {
        if (pointerDownOutsideHandlers.get(id) !== handler) return;

        pointerDownOutsideHandlers.delete(id);
      };
    },

    dispatchPointerDownOutside(event: PointerEvent) {
      const topmost = store.getTopmost();

      if (!topmost) return false;

      const handler = pointerDownOutsideHandlers.get(topmost.id);

      if (!handler) return false;

      handler(event);

      return true;
    },

    subscribe(listener: () => void) {
      return store.subscribe(listener);
    },

    clear() {
      escapeHandlers.clear();
      pointerDownOutsideHandlers.clear();
      store.clear();
    },
  };
}

export const overlayManager = createOverlayManager();
