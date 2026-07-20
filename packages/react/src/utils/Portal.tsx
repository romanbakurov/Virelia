import { createPortal } from 'react-dom';

import { usePortal } from '@vellira-ui/core';
import type React from 'react';

interface PortalProps {
  children: React.ReactNode;
  container?: Element | DocumentFragment | null;
}

export const Portal = ({ children, container }: PortalProps) => {
  const root = usePortal({ container });

  if (!root) return null;

  return createPortal(children, root);
};
