import { Pressable } from 'react-native';

import { useTooltipContext } from '../internal/TooltipContext';

import type { TooltipTriggerProps } from './types';

export const TooltipTrigger = ({
  children,
  disabled,
  onLongPress,
  style,
  ...props
}: TooltipTriggerProps) => {
  const tooltip = useTooltipContext();
  const isDisabled = tooltip.disabled || disabled;

  return (
    <Pressable
      {...props}
      ref={tooltip.triggerRef}
      accessibilityState={{
        ...props.accessibilityState,
        disabled: isDisabled || props.accessibilityState?.disabled,
      }}
      disabled={isDisabled}
      onLongPress={(event) => {
        onLongPress?.(event);

        if (event.defaultPrevented) return;

        tooltip.show();
      }}
      style={style}
    >
      {children}
    </Pressable>
  );
};

TooltipTrigger.displayName = 'Tooltip.Trigger';
