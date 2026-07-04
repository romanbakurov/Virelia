import { useCallback, useMemo, useState } from 'react';

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

  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] =
    useState(defaultActiveIndex);

  const isControlled = controlledActiveIndex !== undefined;
  const activeIndex = isControlled
    ? controlledActiveIndex
    : uncontrolledActiveIndex;

  const setActiveIndex = useCallback(
    (nextIndex: number) => {
      if (!isControlled) {
        setUncontrolledActiveIndex(nextIndex);
      }

      onChange?.(nextIndex);
    },
    [isControlled, onChange]
  );

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
