import { PopoverAnchor } from './Anchor';
import { PopoverArrow } from './Arrow';
import { PopoverClose } from './Close';
import { PopoverContent } from './Content';
import { PopoverDescription } from './Description';
import { PopoverRoot } from './Root';
import { PopoverTitle } from './Title';
import { PopoverTrigger } from './Trigger';

export const Popover = Object.assign(PopoverRoot, {
  Anchor: PopoverAnchor,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
  Title: PopoverTitle,
  Description: PopoverDescription,
});

Popover.displayName = 'Popover';
