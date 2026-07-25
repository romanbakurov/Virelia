import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './TabsTrigger.styles';
import type { TabsSlotProps } from './types';

export const TabsIcon = ({ children, style }: TabsSlotProps) => {
  const styles = useThemeStyles(createStyles);

  return <View style={[styles.tabIcon, style]}>{children}</View>;
};

TabsIcon.displayName = 'Tabs.Icon';
