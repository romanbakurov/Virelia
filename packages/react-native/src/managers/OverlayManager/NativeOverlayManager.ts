import { lightTheme } from '@vellira-ui/tokens';

import type {
  NativeOverlayDismissHandler,
  NativeOverlayEntry,
  NativeOverlayManager,
  NativeOverlayOutsidePressHandler,
} from './types';

const BASE_LAYER = lightTheme.tokens.zIndex.modal;
const LAYER_STEP = 10;

export const createNativeOverlayManager = (): NativeOverlayManager => {
  let stack: NativeOverlayEntry[] = [];
  const dismissHandlers = new Map<string, NativeOverlayDismissHandler>();
  const outsidePressHandlers = new Map<
    string,
    NativeOverlayOutsidePressHandler
  >();

  return {
    register(id: string) {
      stack = stack.filter((item) => item.id !== id);

      const layer = BASE_LAYER + stack.length * LAYER_STEP;
      const entry: NativeOverlayEntry = {
        id,
        layer,
        zIndex: layer,
      };

      stack.push(entry);

      return entry;
    },

    unregister(id: string) {
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

    getLayer(id: string) {
      return stack.find((item) => item.id === id)?.layer ?? BASE_LAYER;
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
