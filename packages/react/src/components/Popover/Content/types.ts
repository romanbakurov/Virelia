import type { HTMLAttributes, RefObject } from 'react';

import type { OverlayAutoFocusEvent, OverlayOutsideEvent } from '#hooks';

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Composes content behavior onto a single child element. */
  asChild?: boolean;
  /** Element that should receive focus when the popover opens. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Restores focus to the trigger when the popover closes. */
  returnFocus?: boolean;
  /** Closes the popover when Escape is pressed. */
  closeOnEscape?: boolean;
  /** Closes the popover when pressing outside the content. */
  closeOnOutsidePress?: boolean;
  /** Called when Escape is pressed while the popover is open. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Called when a pointer down occurs outside popover content. */
  onPointerDownOutside?: (event: OverlayOutsideEvent) => void;
  /** Called when an interaction occurs outside popover content. */
  onInteractOutside?: (event: OverlayOutsideEvent) => void;
  /** Called before focus moves into the popover after opening. */
  onOpenAutoFocus?: (event: OverlayAutoFocusEvent) => void;
  /** Called before focus is restored after closing. */
  onCloseAutoFocus?: (event: OverlayAutoFocusEvent) => void;
}
