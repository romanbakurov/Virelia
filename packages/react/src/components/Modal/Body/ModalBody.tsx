import { cn } from '@utils/cn';

import { useModalContentContext } from '../internal/ModalContext';

import type { ModalBodyProps } from './types';

import styles from './ModalBody.module.scss';

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
