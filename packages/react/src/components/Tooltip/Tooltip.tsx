import { TooltipProvider } from './internal/TooltipContext';
import { TooltipArrow } from './Arrow';
import { TooltipContent } from './Content';
import { TooltipRoot } from './Root';
import { TooltipTrigger } from './Trigger';

export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Arrow: TooltipArrow,
  Provider: TooltipProvider,
});

Tooltip.displayName = 'Tooltip';
