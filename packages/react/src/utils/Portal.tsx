import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { defaultPortalTarget } from '@vellira-ui/core';
import type React from 'react';

interface PortalProps {
  children: React.ReactNode;
}

export const Portal = ({ children }: PortalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const root = document.getElementById('overlay-root') ?? defaultPortalTarget();

  if (!root) return null;

  return createPortal(children, root);
};
