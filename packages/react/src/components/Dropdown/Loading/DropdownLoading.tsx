import { createDropdownSlot } from '../internal/DropdownCollection';

import type { DropdownLoadingProps } from './types';

import styles from '../Content/DropdownContent.module.scss';

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
