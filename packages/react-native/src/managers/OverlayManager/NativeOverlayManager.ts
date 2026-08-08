import {
  createConsoleOverlayDiagnostics,
  createOverlayZIndexPolicy,
  resolveOverlayZIndex,
} from '@vellira-ui/core';
import { lightTheme } from '@vellira-ui/tokens';

import type {
  NativeOverlayDismissHandler,
  NativeOverlayEntry,
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
  let stack: NativeOverlayEntry[] = [];
  const dismissHandlers = new Map<string, NativeOverlayDismissHandler>();
  const outsidePressHandlers = new Map<
    string,
    NativeOverlayOutsidePressHandler
  >();

  return {
    register(id: string) {
      if (stack.some((item) => item.id === id)) {
        nativeOverlayDiagnostics.duplicateRegistration?.(id);
      }

      stack = stack.filter((item) => item.id !== id);

      const zIndex = resolveOverlayZIndex({
        level: nativeOverlayZIndexPolicy.defaultLevel,
        order: stack.length,
        policy: nativeOverlayZIndexPolicy,
      });
      const entry: NativeOverlayEntry = {
        id,
        zIndex,
      };

      stack.push(entry);

      return entry;
    },

    unregister(id: string) {
      if (!stack.some((item) => item.id === id)) {
        nativeOverlayDiagnostics.unknownUnregister?.(id);
      }

      dismissHandlers.delete(id);
      outsidePressHandlers.delete(id);
      stack = stack.filter((item) => item.id !== id);
    },

    isTop(id: string) {
      return stack.at(-1)?.id === id;
    },

    getTop() {
      return stack.at(-1);
    },

    getZIndex(id: string) {
      return (
        stack.find((item) => item.id === id)?.zIndex ??
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
      stack = [];
      dismissHandlers.clear();
      outsidePressHandlers.clear();
    },
  };
};

export const nativeOverlayManager = createNativeOverlayManager();
