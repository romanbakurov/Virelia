import type { NativeOverlayDismissHandler, NativeOverlayEntry } from './types';

const BASE_LAYER = 1000;
const LAYER_STEP = 10;

let stack: NativeOverlayEntry[] = [];
const dismissHandlers = new Map<string, NativeOverlayDismissHandler>();

export const nativeOverlayManager = {
  register(id: string) {
    stack = stack.filter((item) => item.id !== id);

    const entry: NativeOverlayEntry = {
      id,
      layer: BASE_LAYER + stack.length * LAYER_STEP,
    };

    stack.push(entry);

    return entry;
  },

  unregister(id: string) {
    dismissHandlers.delete(id);
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

  dispatchTopDismiss() {
    const top = this.getTop();

    if (!top) return false;

    const handler = dismissHandlers.get(top.id);

    if (!handler) return false;

    return handler();
  },

  clear() {
    stack = [];
    dismissHandlers.clear();
  },
};
