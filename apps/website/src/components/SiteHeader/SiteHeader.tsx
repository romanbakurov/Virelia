'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@vellira-ui/react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import styles from './SiteHeader.module.css';

const navigation = [
  { label: 'Components', href: '#components' },
  { label: 'Themes', href: '#themes' },
  { label: 'Pro', href: '#pro' },
  { label: 'Roadmap', href: '/roadmap' },
] as const;

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href='/' className={styles.brand}>
          <Image
            src='/brand/logos/logo-gradient.svg'
            alt='Vellira'
            width={100}
            height={32}
            priority
          />
        </Link>

        <nav className={styles.navigation} aria-label='Primary navigation'>
          {navigation.map((item) => (
            <Link
              key={item.label}
              className={styles.navigationLink}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}

          <a
            className={styles.navigationLink}
            href='https://docs.vellira.dev'
            target='_blank'
            rel='noreferrer noopener'
          >
            Docs
          </a>

          <a
            className={styles.navigationLink}
            href='https://github.com/vellira-dev/Vellira'
            target='_blank'
            rel='noreferrer noopener'
          >
            GitHub
          </a>
        </nav>

        <div className={styles.actions}>
          <ThemeSwitcher />

          <Button asChild size='sm'>
            <a
              href='https://docs.vellira.dev/getting-started'
              target='_blank'
              rel='noreferrer noopener'
            >
              Get started
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

SiteHeader.displayName = 'SiteHeader';
