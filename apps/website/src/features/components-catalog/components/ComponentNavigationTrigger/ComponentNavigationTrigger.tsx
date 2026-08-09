'use client';

import { Close, Menu } from '@vellira-ui/icons';
import { Button } from '@vellira-ui/react';

import { useComponentNavigation } from '../ComponentNavigationProvider';
import styles from './ComponentNavigationTrigger.module.css';

export function ComponentNavigationTrigger() {
  const { open, toggleNavigation } = useComponentNavigation();

  const Icon = open ? Close : Menu;

  return (
    <Button
      type='button'
      size='sm'
      appearance='ghost'
      shape='square'
      iconOnly
      className={styles.trigger}
      aria-label={
        open ? 'Close component navigation' : 'Open component navigation'
      }
      aria-expanded={open}
      aria-controls='component-navigation'
      onClick={toggleNavigation}
      iconStart={<Icon />}
    />
  );
}
