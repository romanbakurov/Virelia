import type { ModalContentProps } from './types';

import styles from './ModalContent.module.scss';

export const ModalContent = ({ children }: ModalContentProps) => {
  return <div className={styles.content}>{children}</div>;
};

ModalContent.displayName = 'ModalContent';
