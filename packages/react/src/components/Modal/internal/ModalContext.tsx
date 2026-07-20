import { createContext, useContext } from 'react';

import type { ModalContentContextValue, ModalContextValue } from './types';

const ModalContext = createContext<ModalContextValue | undefined>(undefined);
const ModalContentContext = createContext<ModalContentContextValue | undefined>(
  undefined
);

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('Modal compound components must be used inside Modal');
  }

  return context;
};

export const useModalContentContext = () => useContext(ModalContentContext);

export const ModalProvider = ModalContext.Provider;
export const ModalContentProvider = ModalContentContext.Provider;

ModalContext.displayName = 'ModalContext';
ModalContentContext.displayName = 'ModalContentContext';
