import { useEffect } from 'react';

import type {
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from 'react';

import type { ModalOutsideEvent } from '../types';

const createOutsideEvent = (
  originalEvent: PointerEvent | ReactPointerEvent<HTMLElement>
): ModalOutsideEvent => {
  let defaultPrevented = false;

  return {
    originalEvent,
    preventDefault: () => {
      defaultPrevented = true;
    },
    get defaultPrevented() {
      return defaultPrevented;
    },
  };
};

export const useModalDismiss = ({
  active,
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
  contentRef: RefObject<HTMLElement | null>;
  closeOnEscape: boolean;
  closeOnOutsidePress: boolean;
  isTopModal: () => boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: ModalOutsideEvent) => void;
  onInteractOutside?: (event: ModalOutsideEvent) => void;
  requestClose: () => void;
}) => {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape' || !isTopModal()) return;

      onEscapeKeyDown?.(event as unknown as KeyboardEvent);

      if (event.defaultPrevented || !closeOnEscape) return;

      requestClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, closeOnEscape, isTopModal, onEscapeKeyDown, requestClose]);

  useEffect(() => {
    if (!active) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!isTopModal()) return;
      if (
        event.target instanceof Node &&
        contentRef.current?.contains(event.target)
      ) {
        return;
      }

      const outsideEvent = createOutsideEvent(event);
      onPointerDownOutside?.(outsideEvent);
      onInteractOutside?.(outsideEvent);

      if (outsideEvent.defaultPrevented || !closeOnOutsidePress) return;

      requestClose();
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [
    active,
    closeOnOutsidePress,
    contentRef,
    isTopModal,
    onInteractOutside,
    onPointerDownOutside,
    requestClose,
  ]);
};
