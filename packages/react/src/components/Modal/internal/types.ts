import type {
  CSSProperties,
  KeyboardEvent,
  MutableRefObject,
  ReactElement,
  RefObject,
} from 'react';

import type { ModalAutoFocusEvent, ModalOutsideEvent } from '../types';

export type ModalContextValue = {
  closeOnEscape: boolean;
  closeOnOutsidePress: boolean;
  contentId: string;
  contentRef: MutableRefObject<HTMLElement | null>;
  descriptionId: string;
  finalFocus?: RefObject<HTMLElement>;
  initialFocus?: RefObject<HTMLElement>;
  isTopModal: () => boolean;
  modal: boolean;
  onCloseAutoFocus?: (event: ModalAutoFocusEvent) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onInteractOutside?: (event: ModalOutsideEvent) => void;
  onOpenAutoFocus?: (event: ModalAutoFocusEvent) => void;
  onPointerDownOutside?: (event: ModalOutsideEvent) => void;
  open: boolean;
  preventScroll: boolean;
  requestClose: () => void;
  restoreFocus: boolean;
  role: 'dialog' | 'alertdialog';
  setContentRef: (node: HTMLElement | null) => void;
  setDescriptionPresent: (present: boolean) => void;
  setOpen: (open: boolean) => void;
  setTitlePresent: (present: boolean) => void;
  shouldRender: boolean;
  titleId: string;
  trapFocus: boolean;
};

export type ModalSlotComponent<TProps> = ((props: TProps) => ReactElement) & {
  __velliraModalPart?: string;
};

export type ModalContentContextValue = {
  scrollBehavior: 'inside' | 'outside';
  surfaceStyle?: CSSProperties;
};
