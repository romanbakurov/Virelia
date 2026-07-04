import { useModalContext } from '../ModalContext';

import type { ModalBodyProps } from './types';

import styles from './ModalBody.module.scss';

export const ModalBody = ({ children }: ModalBodyProps) => {
  const { descriptionId } = useModalContext();

  return (
    <div id={descriptionId} className={styles.modalBody}>
      {children}
    </div>
  );
};

ModalBody.displayName = 'ModalBody';
