import { ModalProvider } from '../internal/ModalContext';
import type { ModalProps } from '../types';

import { useModalRootState } from './useModalRootState';

import { cn } from '#utils/cn';

export const ModalRoot = ({ children, className, ...props }: ModalProps) => {
  const { context, open } = useModalRootState(props);

  return (
    <ModalProvider value={context}>
      <div className={cn(className)} data-state={open ? 'open' : 'closed'}>
        {children}
      </div>
    </ModalProvider>
  );
};

ModalRoot.displayName = 'ModalRoot';
