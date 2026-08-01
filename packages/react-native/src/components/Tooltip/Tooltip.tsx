import { TooltipContent } from './Content';
import { TooltipRoot } from './Root';
import { TooltipTrigger } from './Trigger';

export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});

Tooltip.displayName = 'Tooltip';
