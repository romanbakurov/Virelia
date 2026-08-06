import { StyleSheet } from 'react-native';

import type { nativeThemes } from '../../../theme';

type NativeTheme = (typeof nativeThemes)[keyof typeof nativeThemes];

export function createPopoverDescriptionStyles(theme: NativeTheme) {
  return StyleSheet.create({
    description: {
      color: theme.components.popover.description.fg,
      fontSize: theme.tokens.typography.size.sm,
    },
  });
}
