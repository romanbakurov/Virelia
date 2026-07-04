import { StyleSheet, type TextStyle } from 'react-native';

import type { NativeTheme } from '../../../theme';

const fontWeight = (value: string): TextStyle['fontWeight'] =>
  value as TextStyle['fontWeight'];

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    tab: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.tokens.spacing[2],
      justifyContent: 'center',
      paddingHorizontal: theme.tokens.spacing[4],
      paddingVertical: theme.tokens.spacing[2],
      backgroundColor: theme.components.tabs.trigger.default.bg,
      borderWidth: 0,
    },

    tabVertical: {
      flex: 0,
      width: '100%',
      justifyContent: 'flex-start',
    },

    tabActive: {
      backgroundColor: theme.components.tabs.trigger.active.bg,
    },

    tabUnderline: {
      borderBottomColor: 'transparent',
      borderBottomWidth: 3,
      borderRadius: 0,
    },

    tabUnderlineActive: {
      borderBottomColor: theme.components.tabs.indicator.active.bg,
    },

    tabDisabled: {
      backgroundColor: theme.components.tabs.trigger.disabled.bg,
    },

    tabText: {
      color: theme.components.tabs.trigger.default.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      fontWeight: fontWeight(theme.tokens.typography.weight.regular),
    },

    tabTextDisabled: {
      color: theme.components.tabs.trigger.disabled.fg,
    },

    tabTextActive: {
      color: theme.components.tabs.trigger.active.fg,
    },

    tabTextPillsActive: {
      color: theme.components.tabs.pills.active.fg,
    },

    tabPillsActive: {
      backgroundColor: theme.components.tabs.pills.active.bg,
      borderRadius: theme.tokens.radius.md,
    },

    tabDefaultActive: {
      backgroundColor: theme.components.tabs.trigger.active.bg,
    },

    tabIcon: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    tabIconActive: {
      color: theme.components.tabs.trigger.active.fg,
    },

    tabIconPillsActive: {
      color: theme.components.tabs.pills.active.fg,
    },
  });
