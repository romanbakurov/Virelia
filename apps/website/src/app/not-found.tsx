import Link from 'next/link';

import { ArrowRight } from '@vellira-ui/icons';

import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby='not-found-title'>
        <span className={styles.eyebrow}>404</span>

        <h1 id='not-found-title'>Page not found</h1>

        <p>
          The page may have moved, or the URL does not match a Vellira route.
        </p>

        <Link className={styles.homeLink} href='/'>
          Back to home
          <ArrowRight size={16} aria-hidden='true' />
        </Link>
      </section>
    </main>
  );
}
