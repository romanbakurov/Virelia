import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { View } from 'react-native';

import { useTabs } from '../../../hooks';
import { useThemeStyles } from '../../../theme';
import { TabsProvider } from '../internal/TabsContext';
import { createStyles } from '../Tabs.styles';
import type { RegisteredTab, TabsProps, TabsTriggerLayout } from '../types';

export const TabsRoot = ({
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  mode = 'tabs',
  variant = 'line',
  color = 'primary',
  size = 'md',
  keepMounted = false,
  lazyMount = false,
  disabled = false,
  style,
}: TabsProps) => {
  const styles = useThemeStyles(createStyles);
  const isControlled = controlledValue !== undefined;
  const [version, setVersion] = useState(0);
  const [indicatorVersion, setIndicatorVersion] = useState(0);
  const triggersRef = useRef<RegisteredTab[]>([]);
  const triggerLayoutsRef = useRef(new Map<string, TabsTriggerLayout>());
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

  const registerTriggerLayout = useCallback(
    (triggerValue: string, layout: TabsTriggerLayout | undefined) => {
      const previous = triggerLayoutsRef.current.get(triggerValue);

      if (!layout) {
        if (!previous) {
          return;
        }

        triggerLayoutsRef.current.delete(triggerValue);
        setIndicatorVersion((current) => current + 1);
        return;
      }

      if (
        previous &&
        previous.x === layout.x &&
        previous.y === layout.y &&
        previous.width === layout.width &&
        previous.height === layout.height
      ) {
        return;
      }

      triggerLayoutsRef.current.set(triggerValue, layout);
      setIndicatorVersion((current) => current + 1);
    },
    []
  );

  const getTriggerLayout = useCallback((triggerValue: string) => {
    return triggerLayoutsRef.current.get(triggerValue);
  }, []);

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
      mode,
      orientation,
      variant,
      color,
      size,
      keepMounted,
      lazyMount,
      disabled,
      registerTrigger,
      indicatorVersion,
      getTriggerLayout,
      registerTriggerLayout,
    }),
    [
      color,
      disabled,
      keepMounted,
      lazyMount,
      mode,
      orientation,
      getTriggerLayout,
      indicatorVersion,
      registerTriggerLayout,
      registerTrigger,
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
