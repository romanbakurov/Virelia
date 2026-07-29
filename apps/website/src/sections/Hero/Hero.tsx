'use client';

import Link from 'next/link';

import { Button } from '@vellira-ui/react';

import { HeroPreview } from './HeroPreview';

import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.background} aria-hidden='true'>
        <div className={styles.grid} />
        <div className={styles.glowPrimary} />
        <div className={styles.glowSecondary} />
        <div className={styles.glowAccent} />
      </div>

      <div className={styles.content}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>React + React Native</span>

          <h1 className={styles.title}>
            Independent modules.
            <span>One seamless system.</span>
          </h1>

          <p className={styles.description}>
            Production-ready React and React Native components with shared APIs,
            accessible behaviour, themes, and design tokens.
          </p>

          <div className={styles.actions}>
            <Button asChild>
              <Link href='https://docs.vellira.dev/getting-started'>
                Get started
              </Link>
            </Button>

            <Button appearance='outline' color='neutral' asChild>
              <Link href='https://docs.vellira.dev/components'>
                Explore components
              </Link>
            </Button>

            <Button appearance='ghost' color='neutral' asChild>
              <Link href='https://github.com/vellira-dev/Vellira'>GitHub</Link>
            </Button>
          </div>
        </div>

        <div className={`${styles.preview} ${styles.previewEnter}`}>
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}
