import Link from 'next/link';

import type { ComponentCatalogEntry } from '../../types';

import styles from './RelatedComponents.module.css';

type RelatedComponentsProps = {
  components: readonly ComponentCatalogEntry[];
};

export function RelatedComponents({ components }: RelatedComponentsProps) {
  if (components.length === 0) {
    return null;
  }

  return (
    <section className={styles.root}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Related components</h2>

        <p className={styles.description}>
          Explore components that are commonly used alongside this one.
        </p>
      </div>

      <div className={styles.grid}>
        {components.map((component) => (
          <Link
            key={component.slug}
            href={`/components/${component.slug}`}
            className={styles.card}
          >
            <div>
              <div className={styles.meta}>
                <span>{component.category}</span>
                <span className={styles.status}>{component.status}</span>
              </div>

              <h3 className={styles.cardTitle}>{component.name}</h3>

              <p className={styles.cardDescription}>{component.description}</p>
            </div>

            <span className={styles.linkLabel}>
              View component
              <span aria-hidden='true'>→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
