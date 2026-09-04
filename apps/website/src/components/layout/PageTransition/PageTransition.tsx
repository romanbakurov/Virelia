import type { ReactNode } from 'react';

import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return <div className={styles.root}>{children}</div>;
}
