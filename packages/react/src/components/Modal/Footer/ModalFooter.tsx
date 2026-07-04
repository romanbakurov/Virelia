import type { ModalFooterProps } from './types';

import styles from './ModalFooter.module.scss';

export const ModalFooter = ({ children }: ModalFooterProps) => {
  return <div className={styles.modalFooter}>{children}</div>;
};

ModalFooter.displayName = 'ModalFooter';
