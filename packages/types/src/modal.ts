export interface BaseModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsidePress?: boolean;
  closeOnEscape?: boolean;
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
