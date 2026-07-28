'use client';

import Image from 'next/image';
import Link from 'next/link';

import { motion, useReducedMotion } from 'motion/react';

import { ArrowRight, Check } from '@vellira-ui/icons';

import styles from './SiteFooter.module.css';

const productLinks = [
  { label: 'Components', href: '#components' },
  { label: 'Platforms', href: '#platforms' },
  { label: 'Themes', href: '#themes' },
  { label: 'Pro', href: '#pro' },
  { label: 'Roadmap', href: '#roadmap' },
] as const;

const resourceLinks = [
  {
    label: 'Documentation',
    href: 'https://docs.vellira.dev',
  },
  {
    label: 'Storybook',
    href: 'https://storybook.vellira.dev',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/vellira-dev/Vellira',
  },
] as const;

const footerSignals = [
  'Open source',
  'Built in public',
  'Accessible foundations',
] as const;

export function SiteFooter() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} aria-hidden='true' />

      <motion.div
        className={styles.container}
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                y: 36,
                filter: 'blur(8px)',
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        }}
        transition={{
          duration: shouldReduceMotion ? 0.2 : 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className={styles.brandColumn}>
          <Link className={styles.brand} href='/' aria-label='Vellira home'>
            <Image
              src='/brand/logos/logo-gradient.svg'
              alt='Vellira'
              width={112}
              height={36}
            />
          </Link>

          <p>
            Open-source React and React Native components with shared APIs,
            semantic tokens and production-focused quality checks.
          </p>

          <div className={styles.signalList} aria-label='Project signals'>
            {footerSignals.map((signal) => (
              <span key={signal}>
                <Check size={13} aria-hidden='true' />
                {signal}
              </span>
            ))}
          </div>
        </div>

        <nav className={styles.linkGrid} aria-label='Footer navigation'>
          <div className={styles.linkGroup}>
            <h2>Product</h2>

            {productLinks.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div className={styles.linkGroup}>
            <h2>Resources</h2>

            {resourceLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target='_blank'
                rel='noreferrer noopener'
              >
                {link.label}
                <ArrowRight size={13} aria-hidden='true' />
              </a>
            ))}
          </div>
        </nav>

        <aside className={styles.statusCard}>
          <span className={styles.statusEyebrow}>Shared foundation</span>
          <strong>React + React Native</strong>
          <p>
            One component contract, synchronized tokens and real implementation
            paths for web and native teams.
          </p>

          <a
            className={styles.statusLink}
            href='https://github.com/vellira-dev/Vellira'
            target='_blank'
            rel='noreferrer noopener'
          >
            View source
            <ArrowRight size={14} aria-hidden='true' />
          </a>
        </aside>
      </motion.div>

      <div className={styles.bottomBar}>
        <span>© 2026 Vellira</span>
        <span>Independent modules</span>
        <span>One seamless system</span>
      </div>
    </footer>
  );
}

SiteFooter.displayName = 'SiteFooter';
