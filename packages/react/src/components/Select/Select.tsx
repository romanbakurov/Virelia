import {
  SelectContent,
  SelectEmpty,
  SelectLoading,
  SelectSearch,
} from './Content';
import { SelectGroup, SelectLabel, SelectSeparator } from './Group';
import {
  SelectItem,
  SelectItemBadge,
  SelectItemDescription,
  SelectItemIcon,
} from './Item';
import { SelectRoot } from './Root';
import { SelectIcon, SelectTrigger, SelectValue } from './Trigger';

export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Content: SelectContent,
  Search: SelectSearch,
  Group: SelectGroup,
  Label: SelectLabel,
  Item: SelectItem,
  ItemIcon: SelectItemIcon,
  ItemDescription: SelectItemDescription,
  ItemBadge: SelectItemBadge,
  Separator: SelectSeparator,
  Empty: SelectEmpty,
  Loading: SelectLoading,
});

Select.displayName = 'Select';
