export type NativeOverlayEntry = {
  id: string;
  layer: number;
};

const BASE_LAYER = 1000;
const LAYER_STEP = 10;

let stack: NativeOverlayEntry[] = [];

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
};
