export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  /** @deprecated Use closeOnBackdrop instead. */
  closeOnClick?: boolean;
}

export interface BaseModalOverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  /** @deprecated Use closeOnBackdrop instead. */
  closeOnClick?: boolean;
}

export type BaseModalBodyProps = Record<never, never>;
export type BaseModalContentProps = Record<never, never>;
export type BaseModalFooterProps = Record<never, never>;
export type BaseModalHeaderProps = Record<never, never>;
