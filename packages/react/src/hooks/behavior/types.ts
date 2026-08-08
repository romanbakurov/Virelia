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

export type FocusScopeOptions = {
  active: boolean;
  contentRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  initialFocus?: RefObject<HTMLElement | null>;
  finalFocus?: RefObject<HTMLElement | null>;
  restoreFocus: boolean;
  onOpenAutoFocus?: (event: OverlayAutoFocusEvent) => void;
  onCloseAutoFocus?: (event: OverlayAutoFocusEvent) => void;
};

export type OverlayDismissReason = 'escape-key' | 'outside-press';

export type OverlayDismissOptions = {
  active: boolean;
  id: string;
  contentRef: RefObject<HTMLElement | null>;
  ignoreRefs?: Array<RefObject<HTMLElement | null>>;
  closeOnEscape: boolean;
  closeOnOutsidePress: boolean;
  isTopOverlay: () => boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: OverlayOutsideEvent) => void;
  onInteractOutside?: (event: OverlayOutsideEvent) => void;
  requestClose: (
    reason: OverlayDismissReason,
    event: KeyboardEvent | PointerEvent
  ) => void;
};

export type AriaIsolationOptions = {
  active: boolean;
  enabled: boolean;
  content: HTMLElement | null;
};
