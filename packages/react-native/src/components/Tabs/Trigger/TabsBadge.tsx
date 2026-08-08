import { Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { useTabs } from '../internal/TabsContext';

import { createStyles } from './TabsTrigger.styles';
import type { TabsSlotProps } from './types';

export const TabsBadge = ({ children, style }: TabsSlotProps) => {
  const styles = useThemeStyles(createStyles);
  const { color } = useTabs();
  const { theme } = useTheme();
  const palette = theme.components.tabs[color];

  return (
    <View
      style={[
        styles.tabBadge,
        { backgroundColor: palette.pills.active.bg },
        style,
      ]}
    >
      <Text style={[styles.tabBadgeText, { color: palette.pills.active.fg }]}>
        {children}
      </Text>
    </View>
  );
};

TabsBadge.displayName = 'Tabs.Badge';
