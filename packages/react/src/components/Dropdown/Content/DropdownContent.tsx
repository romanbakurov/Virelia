import { forwardRef } from 'react';

import { cn } from '@utils/cn';
import { Portal } from '@utils/Portal';

import type { DropdownContentProps } from './types';

import styles from './DropdownContent.module.scss';

export const DropdownContent = forwardRef<
  HTMLUListElement,
  DropdownContentProps
>(
  (
    {
      children,
      floatingStyles,
      menuId,
      labelledById,
      label,
      activeDescendantId,
      onKeyDown,
      className,
    },
    ref
  ) => {
    return (
      <Portal>
        <ul
          ref={ref}
          id={menuId}
          role='menu'
          tabIndex={-1}
          aria-labelledby={labelledById}
          aria-label={labelledById ? undefined : label}
          aria-activedescendant={activeDescendantId}
          onKeyDown={onKeyDown}
          style={floatingStyles}
          className={cn(styles.dropdown, className)}
        >
          {children}
        </ul>
      </Portal>
    );
  }
);

DropdownContent.displayName = 'DropdownContent';
