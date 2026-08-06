import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import type { nativeThemes } from '../../../theme';

type NativeTheme = (typeof nativeThemes)[keyof typeof nativeThemes];
type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

export function createPopoverArrowStyles({
  theme,
  side,
  arrowPosition,
}: {
  theme: NativeTheme;
  side: PopoverSide;
  arrowPosition: Pick<ViewStyle, 'top' | 'left'>;
}) {
  const tokens = theme.components.popover.arrow;
  const halfSize = tokens.size / 2;

  const position: ViewStyle =
    side === 'top' || side === 'bottom'
      ? {
          left: arrowPosition.left ?? 0,
          transform: [{ translateX: -halfSize }, { rotate: '45deg' }],
        }
      : {
          top: arrowPosition.top ?? 0,
          transform: [{ translateY: -halfSize }, { rotate: '45deg' }],
        };

  const border: ViewStyle = {
    borderColor: tokens.border,
  };

  switch (side) {
    case 'top':
      position.bottom = -halfSize;
      border.borderRightWidth = 1;
      border.borderBottomWidth = 1;
      break;

    case 'bottom':
      position.top = -halfSize;
      border.borderLeftWidth = 1;
      border.borderTopWidth = 1;
      break;

    case 'left':
      position.right = -halfSize;
      border.borderRightWidth = 1;
      border.borderTopWidth = 1;
      break;

    case 'right':
      position.left = -halfSize;
      border.borderLeftWidth = 1;
      border.borderBottomWidth = 1;
      break;
  }

  return StyleSheet.create({
    arrow: {
      position: 'absolute',
      width: tokens.size,
      height: tokens.size,
      backgroundColor: tokens.bg,
      ...position,
      ...border,
    },
  });
}
