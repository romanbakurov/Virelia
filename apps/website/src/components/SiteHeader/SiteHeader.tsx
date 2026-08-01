'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Book, File } from '@vellira-ui/icons';
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

const externalLinks = [
  {
    label: 'Documentation',
    href: 'https://docs.vellira.dev',
    icon: <File size={16} aria-hidden='true' />,
  },
  {
    label: 'Storybook',
    href: 'https://storybook.vellira.dev',
    icon: <Book size={16} aria-hidden='true' />,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/vellira-dev/vellira',
    icon: (
      <img
        className={styles.actionIcon}
        src='/brand/navigation/github.svg'
        alt=''
        aria-hidden='true'
      />
    ),
  },
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
            preload
            fetchPriority='high'
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
        </nav>

        <div className={styles.actions}>
          <ThemeSwitcher />

          {externalLinks.map((link) => (
            <Button
              key={link.label}
              asChild
              size='sm'
              appearance='ghost'
              shape='square'
              iconOnly
              iconStart={link.icon}
            >
              <a
                href={link.href}
                target='_blank'
                rel='noreferrer noopener'
                aria-label={link.label}
                title={link.label}
              />
            </Button>
          ))}

          <Button asChild size='sm'>
            <a href='#quick-start'>Get started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

SiteHeader.displayName = 'SiteHeader';
