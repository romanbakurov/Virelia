import { createContext, useContext } from 'react';

import type { ModalContextValue } from './types';

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider = ModalContext.Provider;

export const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('Modal compound components must be used inside Modal');
  }

  return context;
};

ModalContext.displayName = 'ModalContext';
