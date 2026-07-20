import type { RefObject } from 'react';

export type OverlayAutoFocusEvent = {
  preventDefault: () => void;
  readonly defaultPrevented: boolean;
};

export type OverlayOutsideEvent<TOriginalEvent = PointerEvent> = {
  originalEvent: TOriginalEvent;
  preventDefault: () => void;
  readonly defaultPrevented: boolean;
};

export type FocusManagerOptions = {
  active: boolean;
  contentRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  initialFocus?: RefObject<HTMLElement>;
  finalFocus?: RefObject<HTMLElement>;
  restoreFocus: boolean;
  onOpenAutoFocus?: (event: OverlayAutoFocusEvent) => void;
  onCloseAutoFocus?: (event: OverlayAutoFocusEvent) => void;
};

export type DismissManagerOptions = {
  active: boolean;
  contentRef: RefObject<HTMLElement | null>;
  ignoreRefs?: Array<RefObject<HTMLElement | null>>;
  closeOnEscape: boolean;
  closeOnOutsidePress: boolean;
  isTopOverlay: () => boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: OverlayOutsideEvent) => void;
  onInteractOutside?: (event: OverlayOutsideEvent) => void;
  requestClose: () => void;
};

export type AriaHiddenOptions = {
  active: boolean;
  enabled: boolean;
  content: HTMLElement | null;
};
