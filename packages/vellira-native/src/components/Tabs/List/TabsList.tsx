import { forwardRef } from 'react';

import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useTabs } from '../TabsContext';

import { createStyles } from './TabsList.styles';
import type { TabsListProps } from './types';

export const TabsList = forwardRef<View, TabsListProps>(
  ({ children, style, testID }, ref) => {
    const styles = useThemeStyles(createStyles);
    const { orientation, appearance } = useTabs();

    return (
      <View
        ref={ref}
        testID={testID}
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
  }
);

TabsList.displayName = 'TabsList';
