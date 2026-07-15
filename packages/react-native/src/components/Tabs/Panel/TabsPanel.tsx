import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useTabs } from '../TabsContext';

import { createStyles } from './TabsPanel.styles';
import type { TabsPanelProps } from './types';

export const TabsPanel = ({ index, children, style }: TabsPanelProps) => {
  const styles = useThemeStyles(createStyles);
  const { activeIndex, orientation } = useTabs();

  if (activeIndex !== index) return null;

  return (
    <View
      style={[
        styles.panel,
        orientation === 'vertical' && styles.panelVertical,
        style,
      ]}
    >
      {children}
    </View>
  );
};

TabsPanel.displayName = 'TabsPanel';
