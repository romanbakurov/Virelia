import { StyleSheet, type TextStyle } from 'react-native';

import type { NativeTheme } from '../../../theme';

const fontWeight = (value: string): TextStyle['fontWeight'] =>
  value as TextStyle['fontWeight'];

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    tab: {
      minHeight: 44,
      minWidth: 44,
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.tokens.spacing[2],
      justifyContent: 'center',
      paddingHorizontal: theme.tokens.spacing[4],
      paddingVertical: theme.tokens.spacing[2],
      borderWidth: 1,
    },

    tabSm: {
      minHeight: 36,
      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: 6,
    },

    tabLg: {
      minHeight: 52,
      paddingHorizontal: theme.tokens.spacing[5],
      paddingVertical: theme.tokens.spacing[3],
    },

    tabSegmented: {
      minHeight: 32,
      paddingVertical: 5,
      borderRadius: theme.tokens.radius.lg,
    },

    tabSegmentedSm: {
      minHeight: 30,
      paddingVertical: 4,
    },

    tabSegmentedLg: {
      minHeight: 40,
      paddingVertical: 8,
    },

    tabVertical: {
      position: 'relative',
      width: '100%',
      minHeight: 44,
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
      backgroundColor: 'transparent',
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
      backgroundColor: 'transparent',
    },

    verticalIndicatorPressed: {
      backgroundColor: 'transparent',
    },

    tabHovered: {
      backgroundColor: 'transparent',
    },

    tabPressed: {
      backgroundColor: 'transparent',
    },

    tabFocused: {
      borderColor: theme.semantic.focus.ring.color,
    },

    tabDefaultActive: {
      backgroundColor: 'transparent',
    },

    tabDisabled: {
      backgroundColor: theme.components.tabs.disabled.bg,
    },

    tabText: {
      flexShrink: 0,
      textAlign: 'center',
      lineHeight: theme.tokens.typography.lineHeight.md,
      color: theme.components.tabs.primary.trigger.default.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      fontWeight: fontWeight(theme.tokens.typography.weight.regular),
    },

    tabTextSm: {
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
    },

    tabTextLg: {
      fontSize: theme.tokens.typography.size.lg,
      lineHeight: theme.tokens.typography.lineHeight.lg,
    },

    tabTextHover: {
      color: theme.components.tabs.primary.trigger.hover.fg,
    },

    tabTextPressed: {
      color: theme.components.tabs.primary.trigger.active.fg,
    },

    tabTextDisabled: {
      color: theme.components.tabs.disabled.fg,
    },

    tabTextActive: {
      color: theme.components.tabs.primary.trigger.active.fg,
    },

    tabTextPillsActive: {
      color: theme.components.tabs.primary.pills.active.fg,
    },

    tabPills: {
      minHeight: 36,
      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: theme.tokens.spacing[1],
      borderRadius: theme.tokens.radius.md,
    },

    tabPillsActive: {
      backgroundColor: 'transparent',
      borderRadius: theme.tokens.radius.md,
    },

    tabPillsHover: {
      backgroundColor: 'transparent',
    },

    tabPillsPressed: {
      backgroundColor: 'transparent',
    },

    tabIcon: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    tabDescription: {
      fontSize: theme.tokens.typography.size.sm,
      color: theme.components.tabs.primary.trigger.default.fg,
    },

    tabBadge: {
      minHeight: 20,
      minWidth: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.tokens.spacing[2],
      backgroundColor: theme.components.tabs.primary.pills.active.bg,
      borderRadius: theme.tokens.radius.full,
    },

    tabBadgeLg: {
      minHeight: 24,
      minWidth: 24,
    },

    tabBadgeText: {
      color: theme.components.tabs.primary.pills.active.fg,
      fontSize: theme.tokens.typography.size.sm,
      fontWeight: fontWeight(theme.tokens.typography.weight.medium),
    },

    tabIconHover: {
      color: theme.components.tabs.primary.trigger.hover.fg,
    },

    tabIconPressed: {
      color: theme.components.tabs.primary.trigger.active.fg,
    },

    tabIconActive: {
      color: theme.components.tabs.primary.trigger.active.fg,
    },

    tabIconPillsActive: {
      color: theme.components.tabs.primary.pills.active.fg,
    },
  });
