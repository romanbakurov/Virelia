import { DropdownArrow } from './Arrow';
import { DropdownCheckboxItem } from './CheckboxItem';
import { DropdownContent } from './Content';
import { DropdownEmpty } from './Empty';
import { DropdownGroup } from './Group';
import { DropdownItem } from './Item';
import { DropdownItemBadge } from './ItemBadge';
import { DropdownItemDescription } from './ItemDescription';
import { DropdownItemIcon } from './ItemIcon';
import { DropdownItemShortcut } from './ItemShortcut';
import { DropdownLabel } from './Label';
import { DropdownLoading } from './Loading';
import { DropdownPortal } from './Portal';
import { DropdownRadioGroup } from './RadioGroup';
import { DropdownRadioItem } from './RadioItem';
import { DropdownRoot } from './Root';
import { DropdownSearch } from './Search';
import { DropdownSeparator } from './Separator';
import { DropdownSub, DropdownSubContent, DropdownSubTrigger } from './Sub';
import { DropdownTrigger } from './Trigger';

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Portal: DropdownPortal,
  Content: DropdownContent,
  Search: DropdownSearch,
  Item: DropdownItem,
  CheckboxItem: DropdownCheckboxItem,
  RadioGroup: DropdownRadioGroup,
  RadioItem: DropdownRadioItem,
  Group: DropdownGroup,
  Label: DropdownLabel,
  Separator: DropdownSeparator,
  Sub: DropdownSub,
  SubTrigger: DropdownSubTrigger,
  SubContent: DropdownSubContent,
  ItemIcon: DropdownItemIcon,
  ItemDescription: DropdownItemDescription,
  ItemBadge: DropdownItemBadge,
  ItemShortcut: DropdownItemShortcut,
  Icon: DropdownItemIcon,
  Description: DropdownItemDescription,
  Badge: DropdownItemBadge,
  Shortcut: DropdownItemShortcut,
  Arrow: DropdownArrow,
  Empty: DropdownEmpty,
  Loading: DropdownLoading,
});

Dropdown.displayName = 'Dropdown';
