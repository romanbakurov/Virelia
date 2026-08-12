export type ModalAnimation = 'scale' | 'slide' | 'fade' | 'none';

export type ModalAnimationEasing =
  'standard' | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

export type ModalAnimationDuration =
  | number
  | {
      close?: number;
      open?: number;
    };

export interface BaseModalProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Closes the modal when the overlay is pressed. */
  closeOnOutsidePress?: boolean;
  /** Closes the modal when the Escape key is pressed. */
  closeOnEscape?: boolean;
  /** Animation style used when the modal opens and closes. */
  animation?: ModalAnimation;
  /** Animation duration in milliseconds, or separate open and close durations. */
  duration?: ModalAnimationDuration;
  /** Animation easing curve. */
  easing?: ModalAnimationEasing;
  /** Restores focus to the previously focused element after closing when supported. */
  restoreFocus?: boolean;
}

export interface BaseModalOverlayProps {
  /** Whether the overlay is currently visible. */
  open: boolean;
  /** Called when overlay interaction requests an open state change. */
  onOpenChange?: (open: boolean) => void;
  /** Closes the modal when the overlay is pressed. */
  closeOnOutsidePress?: boolean;
}

export type BaseModalBodyProps = Record<never, never>;
export type BaseModalContentProps = Record<never, never>;
export type BaseModalFooterProps = Record<never, never>;
export type BaseModalHeaderProps = Record<never, never>;
