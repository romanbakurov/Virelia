import { SelectContent } from './Content';
import { SelectEmpty } from './Empty';
import { SelectGroup } from './Group';
import { SelectIcon } from './Icon';
import { SelectItem } from './Item';
import { SelectItemBadge } from './ItemBadge';
import { SelectItemDescription } from './ItemDescription';
import { SelectItemIcon } from './ItemIcon';
import { SelectLabel } from './Label';
import { SelectLoading } from './Loading';
import { SelectRoot } from './Root';
import { SelectSearch } from './Search';
import { SelectSeparator } from './Separator';
import { SelectTriggerSlot } from './Trigger';
import { SelectValue } from './Value';

export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTriggerSlot,
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
