import { StyleSheet, type TextStyle } from 'react-native';

import type { NativeTheme } from '../../../theme';

const fontWeight = (value: string): TextStyle['fontWeight'] =>
  value as TextStyle['fontWeight'];

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    tab: {
      minHeight: 40,
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.tokens.spacing[2],
      justifyContent: 'center',
      paddingHorizontal: theme.tokens.spacing[4],
      paddingVertical: theme.tokens.spacing[2],
      backgroundColor: theme.components.tabs.trigger.default.bg,
    },

    tabVertical: {
      position: 'relative',
      width: '100%',
      minHeight: 40,
      flexGrow: 0,
      flexShrink: 0,
      justifyContent: 'flex-start',
    },

    horizontalIndicator: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      height: 3,
      backgroundColor: 'transparent',
    },

    horizontalIndicatorActive: {
      backgroundColor: theme.components.tabs.indicator.active.bg,
    },

    verticalIndicator: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 3,
      backgroundColor: 'transparent',
    },

    verticalIndicatorActive: {
      backgroundColor: theme.components.tabs.indicator.active.bg,
    },

    verticalIndicatorPressed: {
      backgroundColor: theme.components.tabs.indicator.hover.bg,
    },

    tabHovered: {
      backgroundColor: theme.components.tabs.trigger.hover.bg,
    },

    tabPressed: {
      backgroundColor: theme.components.tabs.trigger.active.bg,
    },

    tabFocused: {
      borderColor: theme.semantic.focus.ring.color,
    },

    tabDefaultActive: {
      backgroundColor: theme.components.tabs.trigger.active.bg,
    },

    tabDisabled: {
      backgroundColor: theme.components.tabs.trigger.disabled.bg,
    },

    tabText: {
      flexShrink: 0,
      textAlign: 'center',
      lineHeight: theme.tokens.typography.lineHeight.md,
      color: theme.components.tabs.trigger.default.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      fontWeight: fontWeight(theme.tokens.typography.weight.regular),
    },

    tabTextHover: {
      color: theme.components.tabs.trigger.hover.fg,
    },

    tabTextPressed: {
      color: theme.components.tabs.trigger.active.fg,
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

    tabPills: {
      minHeight: 36,
      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: theme.tokens.spacing[1],
      borderRadius: theme.tokens.radius.md,
    },

    tabPillsActive: {
      backgroundColor: theme.components.tabs.pills.active.bg,
      borderRadius: theme.tokens.radius.md,
    },

    tabPillsHover: {
      backgroundColor: theme.components.tabs.pills.hover.bg,
    },

    tabPillsPressed: {
      backgroundColor: theme.components.tabs.pills.active.bg,
    },

    tabIcon: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    tabIconHover: {
      color: theme.components.tabs.trigger.hover.fg,
    },

    tabIconPressed: {
      color: theme.components.tabs.trigger.active.fg,
    },

    tabIconActive: {
      color: theme.components.tabs.trigger.active.fg,
    },

    tabIconPillsActive: {
      color: theme.components.tabs.pills.active.fg,
    },
  });
