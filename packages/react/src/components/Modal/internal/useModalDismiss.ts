import type { KeyboardEvent, RefObject } from 'react';

import { useOverlayDismiss } from '@/hooks';

import type { ModalOutsideEvent } from '../types';

export const useModalDismiss = ({
  active,
  registrationActive = active,
  id,
  contentRef,
  closeOnEscape,
  closeOnOutsidePress,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  requestClose,
}: {
  active: boolean;
  registrationActive?: boolean;
  id: string;
  contentRef: RefObject<HTMLElement | null>;
  closeOnEscape: boolean;
  closeOnOutsidePress: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: ModalOutsideEvent) => void;
  onInteractOutside?: (event: ModalOutsideEvent) => void;
  requestClose: () => void;
}) => {
  return useOverlayDismiss({
    active,
    registrationActive,
    id,
    zIndexLevel: 'modal',
    closeOnOutsidePress,
    closeOnEscape,
    contentRef,
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
