import { forwardRef } from 'react';

import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useTabs } from '../TabsContext';

import { createStyles } from './TabsPanel.styles';
import type { TabsPanelProps } from './types';

export const TabsPanel = forwardRef<View, TabsPanelProps>(
  ({ index, children, style, testID }, ref) => {
    const styles = useThemeStyles(createStyles);
    const { activeIndex } = useTabs();

    if (activeIndex !== index) return null;

    return (
      <View ref={ref} testID={testID} style={[styles.panel, style]}>
        {children}
      </View>
    );
  }
);

TabsPanel.displayName = 'TabsPanel';
