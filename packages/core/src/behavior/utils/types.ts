export type OverlayAutoFocusEvent = {
  preventDefault: () => void;
  readonly defaultPrevented: boolean;
};

export type OverlayOutsideEvent<TOriginalEvent = PointerEvent> = {
  originalEvent: TOriginalEvent;
  preventDefault: () => void;
  readonly defaultPrevented: boolean;
};
