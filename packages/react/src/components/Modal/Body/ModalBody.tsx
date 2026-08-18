import { useModalContentContext } from '../internal/ModalContext';

import type { ModalBodyProps } from './types';

import styles from './ModalBody.module.scss';

import { cn } from '#utils/cn';

export const ModalBody = ({ children, className }: ModalBodyProps) => {
  const content = useModalContentContext();

  return (
    <div
      className={cn(
        styles.modalBody,
        content?.scrollBehavior === 'inside' && styles.inside,
        className
      )}
    >
      {children}
    </div>
  );
};

ModalBody.displayName = 'ModalBody';
