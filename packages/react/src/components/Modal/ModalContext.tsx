import { createContext, useContext } from 'react';

interface ModalContextType {
  onClose?: () => void;
  titleId: string;
  descriptionId: string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('Modal compound components must be used inside Modal');
  }

  return context;
};

export default ModalContext;
ModalContext.displayName = 'ModalContext';
