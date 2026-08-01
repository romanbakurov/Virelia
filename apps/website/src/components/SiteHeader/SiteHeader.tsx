'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@vellira-ui/react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import styles from './SiteHeader.module.css';

const navigation = [
  { label: 'Components', href: '#components' },
  { label: 'Themes', href: '#themes' },
  { label: 'Platforms', href: '#platforms' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Pro', href: '#pro', badge: 'NEW' },
] as const;

const externalLinks = [
  {
    label: 'Documentation',
    href: 'https://docs.vellira.dev',
    icon: '/brand/navigation/documentation.svg',
    iconSize: 21,
  },
  {
    label: 'Storybook',
    href: 'https://storybook.vellira.dev',
    icon: '/brand/navigation/storybook.svg',
    iconSize: 20,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/vellira-dev/vellira',
    icon: '/brand/navigation/github.svg',
    iconSize: 20,
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
  const [activeHash, setActiveHash] = useState<
    (typeof navigation)[number]['href']
  >(navigation[0].href);

  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio - first.intersectionRatio
          )
          .at(0);

        if (visible?.target.id) {
          setActiveHash(
            `#${visible.target.id}` as (typeof navigation)[number]['href']
          );
        }
      },
      {
        rootMargin: '-30% 0px -60% 0px',
        threshold: [0.1, 0.35, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

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
              aria-current={activeHash === item.href ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault();
                setActiveHash(item.href);
                scrollToAnchor(item.href);
              }}
            >
              <span>{item.label}</span>
              {'badge' in item && (
                <span className={styles.navigationBadge}>{item.badge}</span>
              )}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeSwitcher />

          <div className={styles.externalActions}>
            {externalLinks.map((link) => (
              <Button
                key={link.label}
                asChild
                size='sm'
                appearance='ghost'
                shape='square'
                iconOnly
                className={styles.externalAction}
                iconStart={
                  <span
                    className={styles.actionIcon}
                    style={
                      {
                        '--action-icon': `url(${link.icon})`,
                        '--action-icon-size': `${link.iconSize}px`,
                      } as CSSProperties
                    }
                    aria-hidden='true'
                  />
                }
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
          </div>

          <Button asChild size='sm' className={styles.ctaButton}>
            <a href='#quick-start'>Get started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

SiteHeader.displayName = 'SiteHeader';
