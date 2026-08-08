import { useEffect, useState } from 'react';

import { View } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useTabs } from '../internal/TabsContext';

import { createStyles } from './TabsContent.styles';
import type { TabsContentProps } from './types';

export const TabsContent = ({
  value,
  children,
  forceMount = false,
  style,
}: TabsContentProps) => {
  const styles = useThemeStyles(createStyles);
  const {
    value: selectedValue,
    orientation,
    keepMounted,
    lazyMount,
  } = useTabs();
  const isActive = selectedValue === value;
  const [hasMounted, setHasMounted] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setHasMounted(true);
    }
  }, [isActive]);

  const shouldMount =
    forceMount ||
    isActive ||
    (keepMounted && !lazyMount) ||
    (keepMounted && lazyMount && hasMounted);

  if (!shouldMount) return null;

  return (
    <View
      style={[
        styles.panel,
        orientation === 'vertical' && styles.panelVertical,
        style,
      ]}
      accessibilityElementsHidden={!isActive}
      importantForAccessibility={isActive ? 'auto' : 'no-hide-descendants'}
    >
      {children}
    </View>
  );
};

TabsContent.displayName = 'Tabs.Content';
