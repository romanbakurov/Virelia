import { cn } from '@utils/cn';

import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownSeparatorProps } from '../types';

import styles from './DropdownSeparator.module.scss';

export const DropdownSeparator = createDropdownSlot<DropdownSeparatorProps>(
  'separator',
  'Dropdown.Separator'
);

export const DropdownSeparatorSurface = ({
  className,
}: DropdownSeparatorProps) => (
  <li
    role='separator'
    className={cn(styles.separator, className)}
    aria-hidden='true'
  />
);

DropdownSeparatorSurface.displayName = 'DropdownSeparatorSurface';
