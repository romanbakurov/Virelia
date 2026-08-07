import { useCallback } from 'react';

import type { RefObject } from 'react';
import type { View } from 'react-native';
import { AccessibilityInfo, findNodeHandle, Platform } from 'react-native';

export type OverlayFocusRestoreOptions = {
  enabled?: boolean;
  triggerRef: RefObject<View | null>;
};

export const useOverlayFocusRestore = ({
  enabled = true,
  triggerRef,
}: OverlayFocusRestoreOptions) => {
  const restoreFocus = useCallback(() => {
    if (!enabled) return;

    if (Platform.OS === 'web') {
      const triggerNode = triggerRef.current;

      if (
        triggerNode &&
        typeof triggerNode === 'object' &&
        'focus' in triggerNode &&
        typeof triggerNode.focus === 'function'
      ) {
        triggerNode.focus();
      }

      return;
    }

    if (typeof findNodeHandle !== 'function') return;

    const handle = findNodeHandle(triggerRef.current);

    if (handle && AccessibilityInfo.setAccessibilityFocus) {
      AccessibilityInfo.setAccessibilityFocus(handle);
    }
  }, [enabled, triggerRef]);

  const restoreFocusAfterClose = useCallback(() => {
    if (!enabled) return;

    requestAnimationFrame(restoreFocus);
  }, [enabled, restoreFocus]);

  return {
    restoreFocus,
    restoreFocusAfterClose,
  };
};
