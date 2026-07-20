import { cn } from '@utils/cn';

import type { ModalFooterProps } from './types';

import styles from './ModalFooter.module.scss';

export const ModalFooter = ({ children, className }: ModalFooterProps) => {
  return <div className={cn(styles.modalFooter, className)}>{children}</div>;
};

ModalFooter.displayName = 'ModalFooter';
