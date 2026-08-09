'use client';

import type { ReactNode } from 'react';

import styles from './ComponentPlayground.module.css';

type ComponentPlaygroundProps = {
  children: ReactNode;
  controls?: ReactNode;
};

export function ComponentPlayground({
  children,
  controls,
}: ComponentPlaygroundProps) {
  return (
    <section className={styles.root} aria-label='Component playground'>
      <div className={styles.toolbar}>
        <span className={styles.label}>Preview</span>

        <div className={styles.liveStatus}>
          <span aria-hidden='true' />
          Live
        </div>
      </div>

      <div className={styles.preview}>{children}</div>

      {controls && <div className={styles.controls}>{controls}</div>}
    </section>
  );
}
