import { type DimensionValue, Platform, StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    content: {
      width: '100%',
      maxWidth: theme.components.modal.content.size.md,
      maxHeight: theme.components.modal.content
        .nativeMaxHeight as DimensionValue,
      padding: theme.components.modal.content.padding,
      gap: theme.components.modal.content.gap,

      backgroundColor: theme.components.modal.content.bg,
      borderColor: theme.components.modal.content.border,
      borderRadius: theme.components.modal.content.radius,
      borderWidth: theme.components.modal.content.borderWidth,

      ...Platform.select({
        web: {
          boxShadow: `${theme.tokens.shadows.lg.x}px ${theme.tokens.shadows.lg.y}px ${theme.tokens.shadows.lg.blur}px ${theme.tokens.shadows.lg.color}`,
        },
        default: {
          shadowColor: theme.tokens.shadows.lg.color,
          shadowOffset: {
            width: theme.tokens.shadows.lg.x,
            height: theme.tokens.shadows.lg.y,
          },
          shadowOpacity: theme.tokens.shadows.lg.opacity,
          shadowRadius: theme.tokens.shadows.lg.blur,
          elevation: theme.tokens.shadows.lg.elevation,
        },
      }),
    },
  });
