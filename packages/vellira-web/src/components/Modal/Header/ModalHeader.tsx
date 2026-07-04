import { forwardRef } from 'react';

import { Close } from '@romanbakurov/vellira-icons';
import { cn } from '@utils/cn';

import { useModalContext } from '../ModalContext';

import type { ModalHeaderProps } from './types';

import styles from './ModalHeader.module.scss';

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const { onClose, titleId } = useModalContext();

    return (
      <div {...props} ref={ref} className={cn(styles.modalHeader, className)}>
        <h2 id={titleId} className={styles.modalHeaderTitle}>
          {children}
        </h2>

        {onClose && (
          <button
            type='button'
            className={styles.modalHeaderCloseButton}
            onClick={onClose}
            aria-label='Close modal'
          >
            <Close size={16} />
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';
