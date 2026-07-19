import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownItemShortcutProps } from '../types';

export const DropdownItemShortcut =
  createDropdownSlot<DropdownItemShortcutProps>(
    'itemShortcut',
    'Dropdown.ItemShortcut'
  );
