import { useCallback, useEffect, useRef } from 'react';

import {
  deferOverlayFocusRestore,
  runOverlayCloseAutoFocus,
} from '@vellira-ui/core';
import type { RefObject } from 'react';

import type { OverlayAutoFocusEvent } from '../types.js';

export type OverlayFocusRestoreOptions = {
  active: boolean;
  enabled?: boolean;
  finalFocus?: RefObject<HTMLElement | null>;
  onCloseAutoFocus?: (event: OverlayAutoFocusEvent) => void;
};

function focusElement(element: Element | null | undefined) {
  if (!(element instanceof HTMLElement)) return false;
  if (!element.isConnected) return false;

  element.focus();

  return document.activeElement === element;
}

export const useOverlayFocusRestore = ({
  active,
  enabled = true,
  finalFocus,
  onCloseAutoFocus,
}: OverlayFocusRestoreOptions) => {
  const previouslyFocusedRef = useRef<Element | null>(null);
  const enabledRef = useRef(enabled);
  const finalFocusRef = useRef(finalFocus);
  const onCloseAutoFocusRef = useRef(onCloseAutoFocus);

  enabledRef.current = enabled;
  finalFocusRef.current = finalFocus;
  onCloseAutoFocusRef.current = onCloseAutoFocus;

  const saveFocusSnapshot = useCallback(() => {
    if (typeof document === 'undefined') return;

    previouslyFocusedRef.current = document.activeElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (!enabledRef.current) return;

    if (focusElement(finalFocusRef.current?.current)) return;

    focusElement(previouslyFocusedRef.current);
  }, []);

  const restoreFocusAfterClose = useCallback(
    (event?: OverlayAutoFocusEvent) => {
      if (
        !runOverlayCloseAutoFocus({
          enabled: enabledRef.current,
          event,
          onCloseAutoFocus: onCloseAutoFocusRef.current,
        })
      ) {
        return;
      }

      deferOverlayFocusRestore(restoreFocus);
    },
    [restoreFocus]
  );

  useEffect(() => {
    if (!active) return;

    saveFocusSnapshot();

    return () => {
      restoreFocusAfterClose();
    };
  }, [active, restoreFocusAfterClose, saveFocusSnapshot]);

  return {
    restoreFocus,
    restoreFocusAfterClose,
    saveFocusSnapshot,
  };
};
