import { createDropdownSlot } from './internal/DropdownCollection';
import { DropdownRoot } from './Root';
import type {
  DropdownContentProps,
  DropdownEmptyProps,
  DropdownGroupProps,
  DropdownItemProps,
  DropdownLabelProps,
  DropdownLoadingProps,
  DropdownSearchProps,
  DropdownSeparatorProps,
  DropdownTriggerProps,
} from './types';

const DropdownTriggerSlot = createDropdownSlot<DropdownTriggerProps>(
  'trigger',
  'Dropdown.Trigger'
);
const DropdownContentSlot = createDropdownSlot<DropdownContentProps>(
  'content',
  'Dropdown.Content'
);
const DropdownItemSlot = createDropdownSlot<DropdownItemProps>(
  'item',
  'Dropdown.Item'
);
const DropdownGroupSlot = createDropdownSlot<DropdownGroupProps>(
  'group',
  'Dropdown.Group'
);
const DropdownLabelSlot = createDropdownSlot<DropdownLabelProps>(
  'label',
  'Dropdown.Label'
);
const DropdownSeparatorSlot = createDropdownSlot<DropdownSeparatorProps>(
  'separator',
  'Dropdown.Separator'
);
const DropdownEmptySlot = createDropdownSlot<DropdownEmptyProps>(
  'empty',
  'Dropdown.Empty'
);
const DropdownLoadingSlot = createDropdownSlot<DropdownLoadingProps>(
  'loading',
  'Dropdown.Loading'
);
const DropdownSearchSlot = createDropdownSlot<DropdownSearchProps>(
  'search',
  'Dropdown.Search'
);

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTriggerSlot,
  Content: DropdownContentSlot,
  Search: DropdownSearchSlot,
  Item: DropdownItemSlot,
  Group: DropdownGroupSlot,
  Label: DropdownLabelSlot,
  Separator: DropdownSeparatorSlot,
  Empty: DropdownEmptySlot,
  Loading: DropdownLoadingSlot,
});
