import { useEffect } from 'react';

import { useOverlayFocusRestore } from '../overlay/useOverlayFocusRestore.js';
import type { FocusScopeOptions } from '../types.js';
import { createAutoFocusEvent } from '../utils/events.js';
import {
  focusFirstElement,
  getFocusableElements,
} from '../utils/focusUtils.js';

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
  useOverlayFocusRestore({
    active,
    enabled: restoreFocus,
    finalFocus,
    onCloseAutoFocus,
  });

  useEffect(() => {
    if (!active) return;

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
  }, [active, contentRef, initialFocus, onOpenAutoFocus]);

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
