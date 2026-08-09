import type { ReactNode } from 'react';

import { Container } from '@/components/layout/Container';

import { ComponentSidebar } from '../ComponentSidebar';

import styles from './ComponentExplorer.module.css';

interface ComponentExplorerProps {
  activeSlug: string;
  children: ReactNode;
}

export function ComponentExplorer({
  activeSlug,
  children,
}: ComponentExplorerProps) {
  return (
    <Container size='wide' className={styles.container}>
      <div className={styles.layout}>
        <ComponentSidebar activeSlug={activeSlug} />

        <div className={styles.content}>{children}</div>
      </div>
    </Container>
  );
}
