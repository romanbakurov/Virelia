'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@vellira-ui/react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import styles from './SiteHeader.module.css';

const navigation = [
  { label: 'Components', href: '#components' },
  { label: 'Platforms', href: '#platforms' },
  { label: 'Themes', href: '#themes' },
  { label: 'Pro', href: '#pro' },
  { label: 'Roadmap', href: '#roadmap' },
] as const;

function scrollToAnchor(hash: string) {
  const target = document.getElementById(hash.slice(1));

  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.pushState(null, '', hash);
}

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
            <a
              key={item.label}
              className={styles.navigationLink}
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                scrollToAnchor(item.href);
              }}
            >
              {item.label}
            </a>
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
            <a href='#quick-start'>Get started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

SiteHeader.displayName = 'SiteHeader';
