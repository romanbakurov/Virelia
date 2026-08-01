import { TooltipProvider } from './internal/TooltipContext';
import { TooltipContent } from './Content';
import { TooltipRoot } from './Root';
import { TooltipTrigger } from './Trigger';

export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Provider: TooltipProvider,
});

Tooltip.displayName = 'Tooltip';
