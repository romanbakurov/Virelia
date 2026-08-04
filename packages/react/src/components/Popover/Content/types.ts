import type { HTMLAttributes, RefObject } from 'react';

import type { OverlayAutoFocusEvent, OverlayOutsideEvent } from '@/hooks';

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  initialFocus?: RefObject<HTMLElement | null>;
  returnFocus?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePress?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: OverlayOutsideEvent) => void;
  onInteractOutside?: (event: OverlayOutsideEvent) => void;
  onOpenAutoFocus?: (event: OverlayAutoFocusEvent) => void;
  onCloseAutoFocus?: (event: OverlayAutoFocusEvent) => void;
}
