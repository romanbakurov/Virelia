import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { View } from 'react-native';

import { useTabs } from '../../../hooks';
import { useThemeStyles } from '../../../theme';
import { createStyles } from '../Tabs.styles';
import { TabsProvider } from '../TabsContext';
import type { RegisteredTab, TabsProps } from '../types';

export const TabsRoot = ({
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  variant = 'line',
  color = 'primary',
  size = 'md',
  keepMounted = false,
  lazyMount = false,
  scrollable = false,
  disabled = false,
  style,
}: TabsProps) => {
  const styles = useThemeStyles(createStyles);
  const isControlled = controlledValue !== undefined;
  const [version, setVersion] = useState(0);
  const triggersRef = useRef<RegisteredTab[]>([]);
  const { value, setValue } = useTabs({
    value: controlledValue,
    defaultValue,
    onValueChange,
  });

  const registerTrigger = useCallback(
    (triggerValue: string, triggerDisabled: boolean, mounted: boolean) => {
      const existingIndex = triggersRef.current.findIndex(
        (tab) => tab.value === triggerValue
      );

      if (!mounted) {
        if (existingIndex >= 0) {
          triggersRef.current.splice(existingIndex, 1);
          setVersion((current) => current + 1);
        }

        return;
      }

      const nextTab = { value: triggerValue, disabled: triggerDisabled };

      if (existingIndex >= 0) {
        triggersRef.current[existingIndex] = nextTab;
      } else {
        triggersRef.current.push(nextTab);
      }

      setVersion((current) => current + 1);
    },
    []
  );

  useEffect(() => {
    const enabledTabs = triggersRef.current.filter((tab) => !tab.disabled);
    const selectedExists = triggersRef.current.some(
      (tab) => tab.value === value
    );

    if (isControlled) {
      if (value && !selectedExists && triggersRef.current.length > 0) {
        console.warn(`Tabs: value "${value}" does not match any Tabs.Trigger.`);
      }

      return;
    }

    if (!value || !selectedExists) {
      const firstEnabledValue = enabledTabs[0]?.value;

      if (firstEnabledValue) {
        setValue(firstEnabledValue);
      }
    }
  }, [isControlled, setValue, value, version]);

  const contextValue = useMemo(
    () => ({
      value,
      setValue,
      orientation,
      activationMode,
      variant,
      color,
      size,
      keepMounted,
      lazyMount,
      scrollable,
      disabled,
      registerTrigger,
    }),
    [
      activationMode,
      color,
      disabled,
      keepMounted,
      lazyMount,
      orientation,
      registerTrigger,
      scrollable,
      setValue,
      size,
      value,
      variant,
    ]
  );

  return (
    <TabsProvider value={contextValue}>
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

TabsRoot.displayName = 'Tabs';

export default TabsRoot;
