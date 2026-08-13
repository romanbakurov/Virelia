import { Platform, View } from 'react-native';

import { useTheme } from '../../../theme/useTheme';
import { useTooltipContext } from '../internal/TooltipContext';

export function TooltipArrow() {
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
          top: tooltip.arrowPosition.top ?? 0,
          marginTop: -size / 2,
        }
      : {
          left: tooltip.arrowPosition.left ?? 0,
          marginLeft: -size / 2,
        };

  return (
    <View
      pointerEvents={Platform.OS === 'web' ? undefined : 'none'}
      style={{
        position: 'absolute',
        ...(Platform.OS === 'web' ? { pointerEvents: 'none' as const } : {}),
        width: size,
        height: size,
        backgroundColor: theme.components.tooltip.arrow.bg,
        transform: [{ rotate: '45deg' }],
        [staticSide]: -size / 2,
        ...crossAxisStyle,
      }}
    />
  );
}
