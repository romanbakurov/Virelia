import type { ReactNode } from 'react';

import { createDropdownSlot } from '../internal/DropdownCollection';

import styles from '../Content/DropdownContent.module.scss';

export type DropdownEmptyProps = {
  children?: ReactNode;
};

export const DropdownEmpty = createDropdownSlot<DropdownEmptyProps>(
  'empty',
  'Dropdown.Empty'
);

export const DropdownEmptySurface = ({ children }: DropdownEmptyProps) => (
  <li role='presentation' className={styles.empty}>
    {children ?? 'No actions available'}
  </li>
);

DropdownEmptySurface.displayName = 'DropdownEmptySurface';
