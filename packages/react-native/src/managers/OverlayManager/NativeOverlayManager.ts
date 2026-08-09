import type { OverlayManagerStoreSnapshot } from '@vellira-ui/core';
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
  NativeOverlaySnapshot,
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

  const toNativeEntry = (id: string) => ({
    id,
    zIndex: store.getZIndex(id) ?? nativeOverlayZIndexPolicy.levels.modal,
  });
  let cachedStoreSnapshot:
    | OverlayManagerStoreSnapshot<keyof typeof nativeOverlayZIndexPolicy.levels>
    | undefined;
  let cachedNativeSnapshot: NativeOverlaySnapshot | undefined;

  const getNativeSnapshot = (): NativeOverlaySnapshot => {
    const snapshot = store.getSnapshot();

    if (cachedStoreSnapshot === snapshot && cachedNativeSnapshot) {
      return cachedNativeSnapshot;
    }

    const stack = snapshot.stack.map((entry) => toNativeEntry(entry.id));

    cachedStoreSnapshot = snapshot;
    cachedNativeSnapshot = {
      registry: new Map(stack.map((entry) => [entry.id, entry])),
      stack,
      topmost: snapshot.topmost
        ? toNativeEntry(snapshot.topmost.id)
        : undefined,
    };

    return cachedNativeSnapshot;
  };

  return {
    register(id: string) {
      const entry = store.register({ id });

      return toNativeEntry(entry.id);
    },

    unregister(id: string) {
      dismissHandlers.delete(id);
      outsidePressHandlers.delete(id);
      store.unregister(id);
    },

    getSnapshot() {
      return getNativeSnapshot();
    },

    isTop(id: string) {
      return store.isTopmost(id);
    },

    getTop() {
      return getNativeSnapshot().topmost;
    },

    getZIndex(id: string) {
      return (
        store.getZIndex(id) ??
        nativeOverlayZIndexPolicy.levels[nativeOverlayZIndexPolicy.defaultLevel]
      );
    },

    subscribe(listener: () => void) {
      return store.subscribe(listener);
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
