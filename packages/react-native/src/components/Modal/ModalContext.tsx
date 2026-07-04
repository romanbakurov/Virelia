import { createContext, useContext } from 'react';

interface ModalContextType {
  onClose?: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

ModalContext.displayName = 'ModalContext';

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('Modal compound components must be used inside Modal');
  }

  return context;
};

export default ModalContext;
