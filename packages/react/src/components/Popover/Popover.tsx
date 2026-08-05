import { PopoverArrow } from './Arrow';
import { PopoverClose } from './Close';
import { PopoverContent } from './Content';
import { PopoverDescription } from './Description';
import { PopoverRoot } from './Root';
import { PopoverTitle } from './Title';
import { PopoverTrigger } from './Trigger';

export const Popover = Object.assign(PopoverRoot, {
  Arrow: PopoverArrow,
  Close: PopoverClose,
  Content: PopoverContent,
  Description: PopoverDescription,
  Title: PopoverTitle,
  Trigger: PopoverTrigger,
});
