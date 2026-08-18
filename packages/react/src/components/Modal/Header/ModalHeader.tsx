import type { ModalHeaderProps } from './types';

import styles from './ModalHeader.module.scss';

import { cn } from '#utils/cn';

export const ModalHeader = ({ children, className }: ModalHeaderProps) => (
  <div className={cn(styles.modalHeader, className)}>{children}</div>
);

ModalHeader.displayName = 'ModalHeader';
