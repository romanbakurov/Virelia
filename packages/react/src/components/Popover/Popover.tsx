import { PopoverClose } from './Close';
import { PopoverContent } from './Content';
import { PopoverDescription } from './Description';
import { PopoverRoot } from './Root';
import { PopoverTitle } from './Title';
import { PopoverTrigger } from './Trigger';

export const Popover = Object.assign(PopoverRoot, {
  Close: PopoverClose,
  Content: PopoverContent,
  Description: PopoverDescription,
  Title: PopoverTitle,
  Trigger: PopoverTrigger,
});
