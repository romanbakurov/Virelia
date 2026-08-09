import {
  createConsoleOverlayDiagnostics,
  createOverlayManagerStore,
  createOverlayZIndexPolicy,
} from '@vellira-ui/core';
import { lightTheme } from '@vellira-ui/tokens';

import type {
  NativeOverlayDismissHandler,
  NativeOverlayManager,
  NativeOverlayOutsidePressHandler,
} from './types';

const nativeOverlayZIndexPolicy = createOverlayZIndexPolicy({
  defaultLevel: 'modal',
  levels: {
    modal: lightTheme.tokens.zIndex.modal,
  },
});
const nativeOverlayDiagnostics = createConsoleOverlayDiagnostics(
  'NativeOverlayManager'
);

export const createNativeOverlayManager = (): NativeOverlayManager => {
  const store = createOverlayManagerStore({
    diagnostics: nativeOverlayDiagnostics,
    policy: nativeOverlayZIndexPolicy,
  });
  const dismissHandlers = new Map<string, NativeOverlayDismissHandler>();
  const outsidePressHandlers = new Map<
    string,
    NativeOverlayOutsidePressHandler
  >();

  return {
    register(id: string) {
      const entry = store.register({ id });

      return {
        id: entry.id,
        zIndex: store.getZIndex(id) ?? nativeOverlayZIndexPolicy.levels.modal,
      };
    },

    unregister(id: string) {
      dismissHandlers.delete(id);
      outsidePressHandlers.delete(id);
      store.unregister(id);
    },

    isTop(id: string) {
      return store.isTopmost(id);
    },

    getTop() {
      const topmost = store.getTopmost();

      if (!topmost) return undefined;

      return {
        id: topmost.id,
        zIndex:
          store.getZIndex(topmost.id) ?? nativeOverlayZIndexPolicy.levels.modal,
      };
    },

    getZIndex(id: string) {
      return (
        store.getZIndex(id) ??
        nativeOverlayZIndexPolicy.levels[nativeOverlayZIndexPolicy.defaultLevel]
      );
    },

    registerDismissHandler(id: string, handler: NativeOverlayDismissHandler) {
      dismissHandlers.set(id, handler);

      return () => {
        if (dismissHandlers.get(id) !== handler) return;

        dismissHandlers.delete(id);
      };
    },

    registerOutsidePressHandler(
      id: string,
      handler: NativeOverlayOutsidePressHandler
    ) {
      outsidePressHandlers.set(id, handler);

      return () => {
        if (outsidePressHandlers.get(id) !== handler) return;

        outsidePressHandlers.delete(id);
      };
    },

    dispatchTopDismiss() {
      const top = this.getTop();

      if (!top) return false;

      const handler = dismissHandlers.get(top.id);

      if (!handler) return false;

      return handler();
    },

    dispatchTopOutsidePress() {
      const top = this.getTop();

      if (!top) return false;

      const handler = outsidePressHandlers.get(top.id);

      if (!handler) return false;

      return handler();
    },

    clear() {
      dismissHandlers.clear();
      outsidePressHandlers.clear();
      store.clear();
    },
  };
};

export const nativeOverlayManager = createNativeOverlayManager();
