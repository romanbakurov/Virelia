import type { lightTheme } from '@vellira-ui/tokens';

export type OverlayLayer = keyof typeof lightTheme.tokens.zIndex;

export type OverlayEntry = {
  id: string;
  layer: OverlayLayer;
  order: number;
  zIndex?: number;
};

export type OverlayRegistration = {
  id: string;
  layer?: OverlayLayer;
  zIndex?: number;
};

export type OverlayEscapeHandler = (event: KeyboardEvent) => void;
export type OverlayPointerDownOutsideHandler = (event: PointerEvent) => void;

export type OverlaySnapshot = {
  registry: ReadonlyMap<string, OverlayEntry>;
  stack: readonly OverlayEntry[];
  topmost: OverlayEntry | null;
};

export type OverlayManager = {
  register: (registration: OverlayRegistration) => OverlayEntry;
  unregister: (id: string) => void;
  update: (registration: OverlayRegistration) => OverlayEntry | null;
  getSnapshot: () => OverlaySnapshot;
  getEntry: (id: string) => OverlayEntry | null;
  getStack: () => readonly OverlayEntry[];
  getTopmost: () => OverlayEntry | null;
  isTopmost: (id: string) => boolean;
  getZIndex: (id: string) => number | undefined;
  registerEscapeHandler: (
    id: string,
    handler: OverlayEscapeHandler
  ) => () => void;
  dispatchEscapeKeyDown: (event: KeyboardEvent) => boolean;
  registerPointerDownOutsideHandler: (
    id: string,
    handler: OverlayPointerDownOutsideHandler
  ) => () => void;
  dispatchPointerDownOutside: (event: PointerEvent) => boolean;
  subscribe: (listener: () => void) => () => void;
  clear: () => void;
};
