import type { ReactNode } from 'react';

import { createDropdownSlot } from '../internal/DropdownCollection';

import styles from '../Content/DropdownContent.module.scss';

export type DropdownLoadingProps = {
  /** Loading state content shown while items are loading. */
  children?: ReactNode;
};

export const DropdownLoading = createDropdownSlot<DropdownLoadingProps>(
  'loading',
  'Dropdown.Loading'
);

export const DropdownLoadingSurface = ({ children }: DropdownLoadingProps) => (
  <li role='presentation' aria-live='polite' className={styles.empty}>
    {children ?? 'Loading actions...'}
  </li>
);

DropdownLoadingSurface.displayName = 'DropdownLoadingSurface';
