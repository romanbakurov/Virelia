import { useEffect } from 'react';

import type { RefObject } from 'react';

import type { ModalAutoFocusEvent } from '../types';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const createAutoFocusEvent = (): ModalAutoFocusEvent => {
  let defaultPrevented = false;

  return {
    preventDefault: () => {
      defaultPrevented = true;
    },
    get defaultPrevented() {
      return defaultPrevented;
    },
  };
};

const focusFirst = (content: HTMLElement) => {
  const focusable = content.querySelector<HTMLElement>(focusableSelector);

  (focusable ?? content).focus();
};

export const useModalFocusTrap = ({
  active,
  contentRef,
  enabled,
  initialFocus,
  finalFocus,
  restoreFocus,
  onOpenAutoFocus,
  onCloseAutoFocus,
}: {
  active: boolean;
  contentRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  initialFocus?: RefObject<HTMLElement>;
  finalFocus?: RefObject<HTMLElement>;
  restoreFocus: boolean;
  onOpenAutoFocus?: (event: ModalAutoFocusEvent) => void;
  onCloseAutoFocus?: (event: ModalAutoFocusEvent) => void;
}) => {
  useEffect(() => {
    if (!active) return;

    const previouslyFocused = document.activeElement;
    const finalFocusElement = finalFocus?.current;
    const openEvent = createAutoFocusEvent();

    onOpenAutoFocus?.(openEvent);

    if (!openEvent.defaultPrevented) {
      queueMicrotask(() => {
        initialFocus?.current?.focus();

        if (!initialFocus?.current && contentRef.current) {
          focusFirst(contentRef.current);
        }
      });
    }

    return () => {
      const closeEvent = createAutoFocusEvent();

      onCloseAutoFocus?.(closeEvent);

      if (closeEvent.defaultPrevented || !restoreFocus) return;

      queueMicrotask(() => {
        if (finalFocusElement) {
          finalFocusElement.focus();
          return;
        }

        if (previouslyFocused instanceof HTMLElement) {
          previouslyFocused.focus();
        }
      });
    };
  }, [
    active,
    contentRef,
    finalFocus,
    initialFocus,
    onCloseAutoFocus,
    onOpenAutoFocus,
    restoreFocus,
  ]);

  useEffect(() => {
    if (!active || !enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !contentRef.current) return;

      const focusable = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => !element.hasAttribute('disabled'));

      if (focusable.length === 0) {
        event.preventDefault();
        contentRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, contentRef, enabled]);
};
