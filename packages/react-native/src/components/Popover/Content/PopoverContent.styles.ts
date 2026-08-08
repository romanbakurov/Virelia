import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  backdrop: StyleSheet.absoluteFill,

  content: {
    position: 'absolute',
  },
});

export function createPopoverContentStyles(theme: NativeTheme) {
  const tokens = theme.components.popover.content;
  const shadow = tokens.shadow.native;

  return StyleSheet.create({
    content: {
      minWidth: tokens.minWidth,
      maxWidth: tokens.maxWidth,
      padding: tokens.padding,
      gap: tokens.gap,

      backgroundColor: tokens.bg,
      borderColor: tokens.border,
      borderWidth: tokens.borderWidth,
      borderRadius: tokens.radius,

      shadowColor: shadow.color,
      shadowOpacity: shadow.opacity,
      shadowRadius: shadow.blur,
      shadowOffset: {
        width: shadow.x,
        height: shadow.y,
      },
      elevation: shadow.elevation,
    },
  });
}
