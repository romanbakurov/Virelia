'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { externalNavigation, marketingNavigation } from '@/config/navigation';

import { Button } from '@vellira-ui/react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import styles from './SiteHeader.module.css';

let pendingAnchorScrollTimers: number[] = [];

function cancelPendingAnchorScroll() {
  for (const timer of pendingAnchorScrollTimers) {
    window.clearTimeout(timer);
  }

  pendingAnchorScrollTimers = [];
}

function scrollToAnchor(hash: string) {
  const target = document.getElementById(hash.slice(1));

  if (!target) {
    return;
  }

  cancelPendingAnchorScroll();

  const scrollToTarget = (behavior: ScrollBehavior) => {
    target.scrollIntoView({ behavior, block: 'start' });
  };

  scrollToTarget('smooth');
  window.history.pushState(null, '', hash);

  pendingAnchorScrollTimers = [700, 1500].map((delay) =>
    window.setTimeout(() => {
      if (window.location.hash !== hash) {
        return;
      }

      scrollToTarget('auto');
    }, delay)
  );
}

function getNavigationSections() {
  return marketingNavigation
    .filter((item) => item.type === 'section')
    .map((item) => ({
      href: item.href,
      hash: item.hash,
      element: document.getElementById(item.hash.slice(1)),
    }))
    .filter(
      (
        item
      ): item is typeof item & {
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
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== '/') {
      setActiveHref(pathname);
      return;
    }

    const updateActiveHref = () => {
      const sections = getNavigationSections();

      if (sections.length === 0) {
        setActiveHref(null);
        return;
      }

      const activationY =
        window.scrollY + Math.min(window.innerHeight * 0.45, 460);

      const activeSection =
        sections.findLast(({ element }) => element.offsetTop <= activationY) ??
        sections[0];

      setActiveHref(activeSection.href);
    };

    updateActiveHref();

    window.addEventListener('scroll', updateActiveHref, { passive: true });
    window.addEventListener('resize', updateActiveHref);
    window.addEventListener('hashchange', updateActiveHref);
    window.addEventListener('wheel', cancelPendingAnchorScroll, {
      passive: true,
    });
    window.addEventListener('touchstart', cancelPendingAnchorScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', updateActiveHref);
      window.removeEventListener('resize', updateActiveHref);
      window.removeEventListener('hashchange', updateActiveHref);
      window.removeEventListener('wheel', cancelPendingAnchorScroll);
      window.removeEventListener('touchstart', cancelPendingAnchorScroll);
      cancelPendingAnchorScroll();
    };
  }, [pathname]);

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
          {marketingNavigation.map((item) => (
            <Link
              key={item.label}
              className={styles.navigationLink}
              href={item.href}
              aria-current={activeHref === item.href ? 'page' : undefined}
              onClick={(event) => {
                if (item.type !== 'section' || pathname !== '/') {
                  return;
                }

                event.preventDefault();
                setActiveHref(item.href);
                scrollToAnchor(item.hash);
              }}
            >
              <span>{item.label}</span>

              {'badge' in item && (
                <span className={styles.navigationBadge}>{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeSwitcher />

          <div className={styles.externalActions}>
            {externalNavigation.map((link) => (
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
            <a href='https://docs.vellira.dev/getting-started'>Get started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

SiteHeader.displayName = 'SiteHeader';
