import type { ReactNode } from 'react';

export type NativeOverlayEntry = {
  id: string;
  zIndex: number;
};

export type NativeOverlaySnapshot = {
  registry: ReadonlyMap<string, NativeOverlayEntry>;
  stack: readonly NativeOverlayEntry[];
  topmost: NativeOverlayEntry | undefined;
};

export type NativeOverlayDismissHandler = () => boolean;
export type NativeOverlayOutsidePressHandler = () => boolean;

export type NativeOverlayManager = {
  register: (id: string) => NativeOverlayEntry;
  unregister: (id: string) => void;
  getSnapshot: () => NativeOverlaySnapshot;
  isTop: (id: string) => boolean;
  getTop: () => NativeOverlayEntry | undefined;
  getZIndex: (id: string) => number;
  subscribe: (listener: () => void) => () => void;
  registerDismissHandler: (
    id: string,
    handler: NativeOverlayDismissHandler
  ) => () => void;
  registerOutsidePressHandler: (
    id: string,
    handler: NativeOverlayOutsidePressHandler
  ) => () => void;
  dispatchTopDismiss: () => boolean;
  dispatchTopOutsidePress: () => boolean;
  clear: () => void;
};

export type NativeOverlayManagerProviderProps = {
  children: ReactNode;
  manager?: NativeOverlayManager;
};
