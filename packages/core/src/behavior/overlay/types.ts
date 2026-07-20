import type { RefObjectLike } from '../focus/types.js';
import type { OverlayOutsideEvent } from '../utils/types.js';

export type OverlayDismissOptions = {
  active: boolean;
  contentRef: RefObjectLike<HTMLElement | null>;
  ignoreRefs?: Array<RefObjectLike<HTMLElement | null>>;
  closeOnEscape: boolean;
  closeOnOutsidePress: boolean;
  isTopOverlay: () => boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: OverlayOutsideEvent) => void;
  onInteractOutside?: (event: OverlayOutsideEvent) => void;
  requestClose: () => void;
};

export type OverlayStackOptions = {
  active: boolean;
  id: string;
};

export type ScrollLockOptions = {
  active: boolean;
  enabled?: boolean;
};
