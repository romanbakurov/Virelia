import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownGroupProps } from '../types';

export const DropdownGroup = createDropdownSlot<DropdownGroupProps>(
  'group',
  'Dropdown.Group'
);

export const DropdownGroupSurface = () => null;

DropdownGroupSurface.displayName = 'DropdownGroupSurface';
