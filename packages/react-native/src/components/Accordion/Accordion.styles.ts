import type { TextStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) => {
  const accordion = theme.components.accordion;

  return StyleSheet.create({
    root: {
      width: '100%',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: accordion.root.border,
      borderRadius: theme.tokens.radius.lg,
      backgroundColor: accordion.root.bg,
    },
    rootDisabled: {
      opacity: 0.7,
    },
    item: {
      borderBottomWidth: 1,
      borderBottomColor: accordion.divider,
    },
    trigger: {
      minHeight: theme.tokens.spacing[10],
      justifyContent: 'center',
      paddingHorizontal: theme.tokens.spacing[4],
      paddingVertical: theme.tokens.spacing[3],
      backgroundColor: accordion.trigger.default.bg,
    },
    triggerExpanded: {
      backgroundColor: accordion.trigger.hover.bg,
    },
    triggerPressed: {
      backgroundColor: accordion.trigger.pressed.bg,
    },
    triggerDisabled: {
      backgroundColor: accordion.trigger.disabled.bg,
    },
    triggerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.tokens.spacing[3],
    },
    triggerText: {
      flex: 1,
      color: accordion.trigger.default.fg,
      fontSize: theme.tokens.typography.size.md,
      fontWeight: theme.tokens.typography.weight
        .medium as TextStyle['fontWeight'],
      lineHeight: theme.tokens.typography.lineHeight.md,
    },
    triggerTextDisabled: {
      color: accordion.trigger.disabled.fg,
    },
    indicator: {
      width: theme.tokens.spacing[4],
      height: theme.tokens.spacing[4],
      alignItems: 'center',
      justifyContent: 'center',
    },
    indicatorExpanded: {
      transform: [{ rotate: '180deg' }],
    },
    content: {
      padding: theme.tokens.spacing[4],
      backgroundColor: accordion.content.bg,
    },
    contentHidden: {
      display: 'none',
    },
  });
};
