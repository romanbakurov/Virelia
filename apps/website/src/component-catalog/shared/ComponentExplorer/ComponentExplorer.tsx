import type { ReactNode } from 'react';

import { Container } from '@/components/layout/Container';

import { ComponentNavigationShell } from '../ComponentNavigationShell';

import styles from './ComponentExplorer.module.css';

interface ComponentExplorerProps {
  activeSlug: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function ComponentExplorer({
  activeSlug,
  children,
  footer,
}: ComponentExplorerProps) {
  return (
    <Container size='wide' className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.sidebarColumn}>
          <ComponentNavigationShell activeSlug={activeSlug} />
        </div>

        <div className={styles.mainColumn}>
          <div className={styles.content}>{children}</div>

          {footer}
        </div>
      </div>
    </Container>
  );
}
