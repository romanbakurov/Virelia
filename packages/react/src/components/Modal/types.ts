import type { KeyboardEvent, ReactNode, RefObject } from 'react';

export type ModalAutoFocusEvent = {
  preventDefault: () => void;
  defaultPrevented: boolean;
};

export type ModalOutsideEvent = {
  originalEvent: PointerEvent | React.PointerEvent<HTMLElement>;
  preventDefault: () => void;
  defaultPrevented: boolean;
};

export type ModalAnimation = 'scale' | 'slide' | 'fade' | 'none';
export type ModalAnimationEasing =
  'standard' | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

export type ModalAnimationDuration =
  | number
  | {
      close?: number;
      open?: number;
    };

export interface ModalProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  animation?: ModalAnimation;
  duration?: ModalAnimationDuration;
  easing?: ModalAnimationEasing;
  modal?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePress?: boolean;
  preventScroll?: boolean;
  restoreFocus?: boolean;
  trapFocus?: boolean;
  initialFocus?: RefObject<HTMLElement>;
  finalFocus?: RefObject<HTMLElement>;
  onOpenAutoFocus?: (event: ModalAutoFocusEvent) => void;
  onCloseAutoFocus?: (event: ModalAutoFocusEvent) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: ModalOutsideEvent) => void;
  onInteractOutside?: (event: ModalOutsideEvent) => void;
  role?: 'dialog' | 'alertdialog';
  className?: string;
}
