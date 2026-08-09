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
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsidePress?: boolean;
  closeOnEscape?: boolean;
  animation?: ModalAnimation;
  duration?: ModalAnimationDuration;
  easing?: ModalAnimationEasing;
  restoreFocus?: boolean;
}

export interface BaseModalOverlayProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsidePress?: boolean;
}

export type BaseModalBodyProps = Record<never, never>;
export type BaseModalContentProps = Record<never, never>;
export type BaseModalFooterProps = Record<never, never>;
export type BaseModalHeaderProps = Record<never, never>;
