import { cn } from '@utils/cn';

import { ModalClose } from '../Close';

import { ModalDescription } from './ModalDescription';
import { ModalTitle } from './ModalTitle';
import type { ModalHeaderProps } from './types';

import styles from './ModalHeader.module.scss';

export const ModalHeader = ({
  children,
  title,
  description,
  showClose = false,
  className,
}: ModalHeaderProps) => {
  const hasShorthand = title !== undefined || description !== undefined;

  return (
    <div className={cn(styles.modalHeader, className)}>
      {hasShorthand ? (
        <div className={styles.modalHeaderText}>
          {title !== undefined && <ModalTitle>{title}</ModalTitle>}
          {description !== undefined && (
            <ModalDescription>{description}</ModalDescription>
          )}
        </div>
      ) : (
        children
      )}
      {showClose && <ModalClose />}
    </div>
  );
};

ModalHeader.displayName = 'ModalHeader';
