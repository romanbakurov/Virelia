import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { defaultPortalTarget } from '@vellira-ui/core';

import { useModalContext } from '../internal/ModalContext';

import type { ModalPortalProps } from './types';

export const ModalPortal = ({
  children,
  container,
  forceMount = false,
}: ModalPortalProps) => {
  const { open } = useModalContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || (!open && !forceMount)) return null;

  const root =
    container ??
    document.getElementById('overlay-root') ??
    defaultPortalTarget();

  if (!root) return null;

  return createPortal(children, root);
};

ModalPortal.displayName = 'Modal.Portal';
