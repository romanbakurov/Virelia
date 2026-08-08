export type NativeOverlayEntry = {
  id: string;
  layer: number;
  zIndex: number;
};

export type NativeOverlayDismissHandler = () => boolean;
export type NativeOverlayOutsidePressHandler = () => boolean;

export type NativeOverlayManager = {
  register: (id: string) => NativeOverlayEntry;
  unregister: (id: string) => void;
  isTop: (id: string) => boolean;
  getTop: () => NativeOverlayEntry | undefined;
  getLayer: (id: string) => number;
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
