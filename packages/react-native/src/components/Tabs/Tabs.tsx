import { useMemo } from 'react';

import { useTabs } from '@vellira-ui/core';
import { View } from 'react-native';

import { useThemeStyles } from '../../theme';

import { createStyles } from './Tabs.styles';
import { TabsProvider } from './TabsContext';
import type { TabsProps } from './types';

export const TabsRoot = ({
  children,
  activeIndex: controlledActiveIndex,
  defaultActiveIndex = 0,
  onChange,
  orientation = 'horizontal',
  appearance = 'pills',
  style,
}: TabsProps) => {
  const styles = useThemeStyles(createStyles);
  const { activeIndex, setActiveIndex } = useTabs({
    activeIndex: controlledActiveIndex,
    defaultActiveIndex,
    onChange,
    orientation,
  });

  const value = useMemo(
    () => ({ activeIndex, appearance, orientation, setActiveIndex }),
    [activeIndex, appearance, orientation, setActiveIndex]
  );

  return (
    <TabsProvider value={value}>
      <View
        style={[
          styles.root,
          orientation === 'vertical' && styles.rootVertical,
          style,
        ]}
      >
        {children}
      </View>
    </TabsProvider>
  );
};

TabsRoot.displayName = 'TabsRoot';

export default TabsRoot;
