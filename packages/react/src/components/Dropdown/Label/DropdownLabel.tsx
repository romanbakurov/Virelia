import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownLabelProps } from '../types';

import styles from '../Group/DropdownGroup.module.scss';

import { cn } from '#utils/cn';

export const DropdownLabel = createDropdownSlot<DropdownLabelProps>(
  'label',
  'Dropdown.Label'
);

export const DropdownLabelSurface = ({
  children,
  className,
}: DropdownLabelProps) => (
  <li role='presentation' className={cn(styles.group, className)}>
    {children}
  </li>
);

DropdownLabelSurface.displayName = 'DropdownLabelSurface';
