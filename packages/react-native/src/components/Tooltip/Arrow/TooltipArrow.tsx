import { Platform, View } from 'react-native';

import { useTheme } from '../../../theme/useTheme';
import { useTooltipContext } from '../internal/TooltipContext';

import type { TooltipArrowProps } from './types';

const nativePointerEventsNone =
  Platform.OS === 'web' ? undefined : ({ pointerEvents: 'none' } as const);
const webPointerEventsNone =
  Platform.OS === 'web' ? { pointerEvents: 'none' as const } : undefined;

export const TooltipArrow = ({ style }: TooltipArrowProps) => {
  const { theme } = useTheme();
  const tooltip = useTooltipContext();
  const size = theme.components.tooltip.arrow.size;
  const side = tooltip.placement.split('-')[0] as
    'top' | 'right' | 'bottom' | 'left';
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[side];
  const crossAxisStyle =
    side === 'left' || side === 'right'
      ? {
          top: '50%' as const,
          marginTop: -size / 2,
        }
      : {
          left: '50%' as const,
          marginLeft: -size / 2,
        };

  return (
    <View
      {...nativePointerEventsNone}
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          backgroundColor: theme.components.tooltip.arrow.bg,
          transform: [{ rotate: '45deg' }],
          [staticSide]: -size / 2,
          ...crossAxisStyle,
        },
        webPointerEventsNone,
        style,
      ]}
    />
  );
};

TooltipArrow.displayName = 'Tooltip.Arrow';
