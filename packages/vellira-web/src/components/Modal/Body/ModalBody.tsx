import { forwardRef } from 'react';

import { cn } from '@utils/cn';

import { useModalContext } from '../ModalContext';

import type { ModalBodyProps } from './types';

import styles from './ModalBody.module.scss';

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className, ...props }, ref) => {
    const { descriptionId } = useModalContext();

    return (
      <div
        {...props}
        ref={ref}
        id={descriptionId}
        className={cn(styles.modalBody, className)}
      >
        {children}
      </div>
    );
  }
);

ModalBody.displayName = 'ModalBody';
