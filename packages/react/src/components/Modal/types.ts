import type {
  BaseModalProps,
  ModalAnimation,
  ModalAnimationDuration,
  ModalAnimationEasing,
} from '@vellira-ui/types';
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

export interface ModalProps extends BaseModalProps {
  children: ReactNode;
  modal?: boolean;
  preventScroll?: boolean;
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

export type { ModalAnimation, ModalAnimationDuration, ModalAnimationEasing };
