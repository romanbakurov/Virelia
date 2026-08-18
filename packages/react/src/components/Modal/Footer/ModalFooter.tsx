import type { ModalFooterProps } from './types';

import styles from './ModalFooter.module.scss';

import { cn } from '#utils/cn';

export const ModalFooter = ({ children, className }: ModalFooterProps) => {
  return <div className={cn(styles.modalFooter, className)}>{children}</div>;
};

ModalFooter.displayName = 'ModalFooter';
