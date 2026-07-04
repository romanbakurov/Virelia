import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useTabs } from '../TabsContext';

import { createStyles } from './TabsList.styles';
import type { TabsListProps } from './types';

export const TabsList = ({ children, style }: TabsListProps) => {
  const styles = useThemeStyles(createStyles);
  const { orientation, appearance } = useTabs();

  return (
    <View
      accessibilityRole='tablist'
      style={[
        styles.list,
        appearance === 'pills' && styles.listPills,
        orientation === 'vertical' && styles.listVertical,
        style,
      ]}
    >
      {children}
    </View>
  );
};

TabsList.displayName = 'TabsList';
