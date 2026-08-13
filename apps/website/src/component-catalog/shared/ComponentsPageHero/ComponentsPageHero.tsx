import { Container } from '@/components/layout/Container';

import styles from './ComponentsPageHero.module.css';

export function ComponentsPageHero() {
  return (
    <header className={styles.root}>
      <Container size='wide'>
        <div className={styles.content}>
          <div className={styles.eyebrow}>React components</div>

          <h1 className={styles.title}>
            Build interfaces
            <br />
            with Vellira
          </h1>

          <p className={styles.description}>
            Explore accessible, production-ready React components with
            interactive examples and detailed documentation.
          </p>
        </div>
      </Container>
    </header>
  );
}
