import { useEffect } from 'react';

import { createAutoFocusEvent } from './events.js';
import { focusFirstElement, getFocusableElements } from './focus.js';
import type { FocusScopeOptions } from './types.js';

export const useFocusScope = ({
  active,
  contentRef,
  enabled,
  initialFocus,
  finalFocus,
  restoreFocus,
  onOpenAutoFocus,
  onCloseAutoFocus,
}: FocusScopeOptions) => {
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
          focusFirstElement(contentRef.current);
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

      const focusable = getFocusableElements(contentRef.current);

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
