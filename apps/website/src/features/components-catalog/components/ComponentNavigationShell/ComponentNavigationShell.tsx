'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import { ComponentSidebar } from '../ComponentSidebar';
import { useComponentNavigation } from '../ComponentNavigationProvider';

import styles from './ComponentNavigationShell.module.css';

type ComponentNavigationShellProps = {
  activeSlug: string;
};

export function ComponentNavigationShell({
  activeSlug,
}: ComponentNavigationShellProps) {
  const { open, closeNavigation } = useComponentNavigation();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNavigation();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeNavigation, open]);

  return (
    <>
      <div className={styles.desktop}>
        <ComponentSidebar activeSlug={activeSlug} />
      </div>

      <div
        className={[styles.mobileLayer, open ? styles.mobileLayerOpen : null]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!open}
      >
        <button
          type='button'
          className={styles.backdrop}
          aria-label='Close component navigation'
          tabIndex={open ? 0 : -1}
          onClick={closeNavigation}
        />

        <div className={styles.mobileSurface}>
          <div className={styles.mobileHeader}>
            <Link
              href='/'
              className={styles.mobileBrand}
              onClick={closeNavigation}
            >
              <Image
                src='/brand/logos/logo-gradient.svg'
                alt='Vellira'
                width={100}
                height={32}
                preload
                fetchPriority='high'
              />
            </Link>
          </div>

          <aside
            id='component-navigation'
            className={styles.mobilePanel}
            aria-label='Component navigation'
          >
            <ComponentSidebar activeSlug={activeSlug} />
          </aside>
        </div>
      </div>
    </>
  );
}
