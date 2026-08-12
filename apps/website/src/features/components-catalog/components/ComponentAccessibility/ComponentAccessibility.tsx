import type { ReactNode } from 'react';

import styles from './ComponentAccessibility.module.css';

export type AccessibilityItem = {
  title: string;
  description: ReactNode;
};

type ComponentAccessibilityProps = {
  title?: string;
  description?: string;
  items: readonly AccessibilityItem[];
};

export function ComponentAccessibility({
  title = 'Accessibility',
  description = 'Guidance for accessible usage and interaction.',
  items,
}: ComponentAccessibilityProps) {
  return (
    <section className={styles.root}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{title}</h2>

        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <article key={item.title} className={styles.item}>
            <div className={styles.marker} aria-hidden='true' />

            <div>
              <h3 className={styles.itemTitle}>{item.title}</h3>

              <div className={styles.itemDescription}>{item.description}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
