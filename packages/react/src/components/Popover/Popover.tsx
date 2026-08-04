import { PopoverContent } from './Content';
import { PopoverDescription } from './Description';
import { PopoverRoot } from './Root';
import { PopoverTitle } from './Title';
import { PopoverTrigger } from './Trigger';

export const Popover = Object.assign(PopoverRoot, {
  Content: PopoverContent,
  Description: PopoverDescription,
  Title: PopoverTitle,
  Trigger: PopoverTrigger,
});
