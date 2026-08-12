'use client';

import type { CSSProperties } from 'react';
import { Close, Menu } from '@vellira-ui/icons';
import { Button } from '@vellira-ui/react';

import { useComponentNavigation } from '../ComponentNavigationProvider';

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
      style={
        {
          '--icon-size': '22px',
        } as CSSProperties
      }
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
