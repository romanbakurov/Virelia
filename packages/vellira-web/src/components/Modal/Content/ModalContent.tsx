import { forwardRef } from 'react';

import { cn } from '@utils/cn';

import type { ModalContentProps } from './types';

import styles from './ModalContent.module.scss';

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div {...props} ref={ref} className={cn(styles.content, className)}>
        {children}
      </div>
    );
  }
);

ModalContent.displayName = 'ModalContent';
