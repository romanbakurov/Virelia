import { useEffect } from 'react';

import type { ReactNode } from 'react';

import { useModalContext } from '../internal/ModalContext';

import styles from './ModalHeader.module.scss';

export const ModalTitle = ({ children }: { children: ReactNode }) => {
  const { setTitlePresent, titleId } = useModalContext();

  useEffect(() => {
    setTitlePresent(true);

    return () => setTitlePresent(false);
  }, [setTitlePresent]);

  return (
    <h2 id={titleId} className={styles.modalHeaderTitle}>
      {children}
    </h2>
  );
};

ModalTitle.displayName = 'Modal.Title';
