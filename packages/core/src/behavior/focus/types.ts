import type { OverlayAutoFocusEvent } from '../utils/types.js';

export type RefObjectLike<T> = {
  current: T;
};

export type FocusScopeOptions = {
  active: boolean;
  contentRef: RefObjectLike<HTMLElement | null>;
  enabled: boolean;
  initialFocus?: RefObjectLike<HTMLElement | null>;
  finalFocus?: RefObjectLike<HTMLElement | null>;
  restoreFocus: boolean;
  onOpenAutoFocus?: (event: OverlayAutoFocusEvent) => void;
  onCloseAutoFocus?: (event: OverlayAutoFocusEvent) => void;
};

export type AriaIsolationOptions = {
  active: boolean;
  enabled: boolean;
  content: HTMLElement | null;
};
