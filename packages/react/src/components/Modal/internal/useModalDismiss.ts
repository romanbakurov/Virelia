import type { KeyboardEvent, RefObject } from 'react';

import { useOverlayDismiss } from '@/hooks';

import type { ModalOutsideEvent } from '../types';

export const useModalDismiss = ({
  active,
  id,
  contentRef,
  closeOnEscape,
  closeOnOutsidePress,
  isTopModal,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  requestClose,
}: {
  active: boolean;
  id: string;
  contentRef: RefObject<HTMLElement | null>;
  closeOnEscape: boolean;
  closeOnOutsidePress: boolean;
  isTopModal: () => boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: ModalOutsideEvent) => void;
  onInteractOutside?: (event: ModalOutsideEvent) => void;
  requestClose: () => void;
}) => {
  useOverlayDismiss({
    active,
    id,
    closeOnOutsidePress,
    closeOnEscape,
    contentRef,
    isTopOverlay: isTopModal,
    onEscapeKeyDown: onEscapeKeyDown
      ? (event) => onEscapeKeyDown(event as unknown as KeyboardEvent)
      : undefined,
    onInteractOutside: onInteractOutside
      ? (event) => onInteractOutside(event as ModalOutsideEvent)
      : undefined,
    onPointerDownOutside: onPointerDownOutside
      ? (event) => onPointerDownOutside(event as ModalOutsideEvent)
      : undefined,
    requestClose,
  });
};
