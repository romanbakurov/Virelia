import { StyleSheet } from 'react-native';

import type { nativeThemes } from '../../../theme';
import { toNativeFontWeight } from '../../../theme';

type NativeTheme = (typeof nativeThemes)[keyof typeof nativeThemes];

export function createPopoverTitleStyles(theme: NativeTheme) {
  return StyleSheet.create({
    title: {
      color: theme.components.popover.title.fg,
      fontSize: theme.tokens.typography.size.md,
      fontWeight: toNativeFontWeight(theme.tokens.typography.weight.semibold),
    },
  });
}
