export type NativeOverlayEntry = {
  id: string;
  zIndex: number;
};

export type NativeOverlayDismissHandler = () => boolean;
export type NativeOverlayOutsidePressHandler = () => boolean;

export type NativeOverlayManager = {
  register: (id: string) => NativeOverlayEntry;
  unregister: (id: string) => void;
  isTop: (id: string) => boolean;
  getTop: () => NativeOverlayEntry | undefined;
  getZIndex: (id: string) => number;
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
