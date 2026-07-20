import { useEffect } from 'react';

import type { ReactNode } from 'react';

import { useModalContext } from '../internal/ModalContext';

import styles from './ModalHeader.module.scss';

export const ModalDescription = ({ children }: { children: ReactNode }) => {
  const { descriptionId, setDescriptionPresent } = useModalContext();

  useEffect(() => {
    setDescriptionPresent(true);

    return () => setDescriptionPresent(false);
  }, [setDescriptionPresent]);

  return (
    <p id={descriptionId} className={styles.modalHeaderDescription}>
      {children}
    </p>
  );
};

ModalDescription.displayName = 'Modal.Description';
