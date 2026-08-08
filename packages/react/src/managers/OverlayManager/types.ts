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
  subscribe: (listener: () => void) => () => void;
  clear: () => void;
};
