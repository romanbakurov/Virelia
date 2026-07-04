import { useEffect, useRef } from 'react';

import type React from 'react';

interface UseFocusManagerProps {
  active: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
}

//Focus trap + restore focus (Modal, Dialog)
export const useFocusManager = ({
  active,
  containerRef,
}: UseFocusManagerProps) => {
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) {
      previousFocus.current?.focus();
      return;
    }

    previousFocus.current = document.activeElement as HTMLElement;

    containerRef.current?.focus();

    return () => previousFocus.current?.focus();
  }, [active, containerRef]);
};
