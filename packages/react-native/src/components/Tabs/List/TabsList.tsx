import { ScrollView, View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useTabs } from '../internal/TabsContext';

import { createStyles } from './TabsList.styles';
import type { TabsListProps } from './types';

export const TabsList = ({
  children,
  scrollable: scrollableProp,
  style,
}: TabsListProps) => {
  const styles = useThemeStyles(createStyles);
  const { orientation, variant } = useTabs();
  const scrollable = scrollableProp ?? false;
  const listStyle = [
    styles.list,
    variant === 'line' && styles.listLine,
    variant === 'segmented' && styles.listSegmented,
    orientation === 'vertical' && styles.listVertical,
    variant === 'line' && orientation === 'vertical' && styles.listLineVertical,
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
