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
    iconSize: 21,
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

  const scrollToTarget = (behavior: ScrollBehavior) => {
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY,
      behavior,
    });
  };

  scrollToTarget('smooth');
  window.setTimeout(() => scrollToTarget('auto'), 420);
  window.setTimeout(() => scrollToTarget('auto'), 900);
  window.setTimeout(() => scrollToTarget('auto'), 1600);
  window.setTimeout(() => scrollToTarget('auto'), 2400);
  window.history.pushState(null, '', hash);
}

function getNavigationSections() {
  return navigation
    .map((item) => ({
      href: item.href,
      element: document.getElementById(item.href.slice(1)),
    }))
    .filter(
      (
        item
      ): item is {
        href: (typeof navigation)[number]['href'];
        element: HTMLElement;
      } => Boolean(item.element)
    )
    .sort(
      (first, second) =>
        first.element.getBoundingClientRect().top +
        window.scrollY -
        (second.element.getBoundingClientRect().top + window.scrollY)
    );
}

export function SiteHeader() {
  const [activeHash, setActiveHash] = useState<
    (typeof navigation)[number]['href']
  >(navigation[0].href);

  useEffect(() => {
    const sections = getNavigationSections();

    if (sections.length === 0) return undefined;

    const updateActiveHash = () => {
      const activationY =
        window.scrollY + Math.min(window.innerHeight * 0.45, 460);
      const activeSection =
        sections.findLast(({ element }) => element.offsetTop <= activationY) ??
        sections[0];

      setActiveHash(activeSection.href);
    };

    updateActiveHash();

    window.addEventListener('scroll', updateActiveHash, { passive: true });
    window.addEventListener('resize', updateActiveHash);
    window.addEventListener('hashchange', updateActiveHash);

    return () => {
      window.removeEventListener('scroll', updateActiveHash);
      window.removeEventListener('resize', updateActiveHash);
      window.removeEventListener('hashchange', updateActiveHash);
    };
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
