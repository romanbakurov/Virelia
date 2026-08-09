'use client';

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

      {open && (
        <div className={styles.mobileLayer}>
          <button
            type='button'
            className={styles.backdrop}
            aria-label='Close component navigation'
            onClick={closeNavigation}
          />

          <aside
            id='component-navigation'
            className={styles.mobilePanel}
            aria-label='Component navigation'
          >
            <ComponentSidebar activeSlug={activeSlug} />
          </aside>
        </div>
      )}
    </>
  );
}
