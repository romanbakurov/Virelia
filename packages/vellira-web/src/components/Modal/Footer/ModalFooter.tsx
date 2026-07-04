import { forwardRef } from 'react';

import { cn } from '@utils/cn';

import type { ModalFooterProps } from './types';

import styles from './ModalFooter.module.scss';

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div {...props} ref={ref} className={cn(styles.modalFooter, className)}>
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';
