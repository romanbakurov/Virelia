import { Text, View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './TabsTrigger.styles';
import type { TabsSlotProps } from './types';

export const TabsBadge = ({ children, style }: TabsSlotProps) => {
  const styles = useThemeStyles(createStyles);

  return (
    <View style={[styles.tabBadge, style]}>
      <Text style={styles.tabBadgeText}>{children}</Text>
    </View>
  );
};

TabsBadge.displayName = 'Tabs.Badge';
