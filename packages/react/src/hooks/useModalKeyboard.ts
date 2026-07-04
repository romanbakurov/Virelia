import { useCallback, useEffect } from 'react';

interface UseModalKeyboardProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const useModalKeyboard = ({
  isOpen,
  onClose,
}: UseModalKeyboardProps) => {
  const handlerKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handlerKeyDown);
    return () => document.removeEventListener('keydown', handlerKeyDown);
  }, [handlerKeyDown]);
};
