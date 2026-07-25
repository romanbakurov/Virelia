import { ScrollView, View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useTabs } from '../TabsContext';

import { createStyles } from './TabsList.styles';
import type { TabsListProps } from './types';

export const TabsList = ({
  children,
  scrollable: scrollableProp,
  style,
}: TabsListProps) => {
  const styles = useThemeStyles(createStyles);
  const { orientation, variant, scrollable: rootScrollable } = useTabs();
  const scrollable = scrollableProp ?? rootScrollable;
  const listStyle = [
    styles.list,
    variant === 'pills' && styles.listPills,
    orientation === 'vertical' && styles.listVertical,
    style,
  ];

  if (scrollable && orientation === 'horizontal') {
    return (
      <ScrollView
        horizontal
        accessibilityRole='tablist'
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={listStyle}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View accessibilityRole='tablist' style={listStyle}>
      {children}
    </View>
  );
};

TabsList.displayName = 'TabsList';
