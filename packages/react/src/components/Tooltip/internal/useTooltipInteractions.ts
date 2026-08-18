import { useFocus, useHover, useInteractions } from '@floating-ui/react';

import type { TooltipDelayConfig } from './types';

import type { UseFloatingPositionReturn } from '#managers/FloatingManager';

export function useTooltipInteractions({
  context,
  delay,
  disabled,
  interactive,
}: {
  context: UseFloatingPositionReturn['context'];
  delay: TooltipDelayConfig;
  disabled: boolean;
  interactive: boolean;
}) {
  const hover = useHover(context, {
    delay,
    enabled: !disabled,
    move: false,
    handleClose: interactive ? undefined : null,
  });
  const focus = useFocus(context, {
    enabled: !disabled,
  });

  return useInteractions([hover, focus]);
}
