import type { ComponentCatalogEntry } from '../../types';
import { ComponentHeaderActions } from '../ComponentHeaderActions';

import styles from './ComponentHeader.module.css';

type ComponentHeaderProps = {
  component: ComponentCatalogEntry;
};

export function ComponentHeader({ component }: ComponentHeaderProps) {
  return (
    <header className={styles.root}>
      <div className={styles.eyebrow}>
        <span className={styles.category}>{component.category}</span>
        <span className={styles.status}>{component.status}</span>
      </div>

      <h1 className={styles.title}>{component.name}</h1>

      <p className={styles.description}>{component.description}</p>

      <ComponentHeaderActions component={component} />
    </header>
  );
}
