import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { defaultPortalTarget } from '@vellira-ui/core';
import type React from 'react';

interface PortalProps {
  children: React.ReactNode;
  container?: Element | DocumentFragment | null;
}

export const Portal = ({ children, container }: PortalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const root =
    container ??
    document.getElementById('overlay-root') ??
    defaultPortalTarget();

  if (!root) return null;

  return createPortal(children, root);
};
