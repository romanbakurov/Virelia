import type { ReactNode } from 'react';

import { ComponentCodeBlock } from '../ComponentCodeBlock';

import styles from './ComponentExamples.module.css';

export type ComponentExampleItem = {
  title: string;
  description: string;
  preview: ReactNode;
  code: string;
};

type ComponentExamplesProps = {
  title?: string;
  description?: string;
  items: readonly ComponentExampleItem[];
};

export function ComponentExamples({
  title = 'Examples',
  description = 'Common patterns and practical usage examples.',
  items,
}: ComponentExamplesProps) {
  return (
    <section className={styles.root}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{title}</h2>

        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.title} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{item.title}</h3>

              <p className={styles.cardDescription}>{item.description}</p>
            </div>

            <div className={styles.preview}>{item.preview}</div>

            <ComponentCodeBlock code={item.code} />
          </article>
        ))}
      </div>
    </section>
  );
}
