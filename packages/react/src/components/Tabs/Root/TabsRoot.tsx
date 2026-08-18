import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { TabsContext } from '../internal/TabsContext';
import type { TabsContextValue } from '../internal/types';
import { useTabsCollection } from '../internal/useTabsCollection';
import { useTabsKeyboard } from '../internal/useTabsKeyboard';

import type { TabsProps } from './types';

import styles from '../Tabs.module.scss';

import { useTabs } from '#hooks';
import { cn } from '#utils/cn';

export const TabsRoot = ({
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  dir = 'ltr',
  loop = true,
  mode = 'tabs',
  variant = 'line',
  color = 'primary',
  size = 'md',
  keepMounted = false,
  lazyMount = false,
  disabled = false,
  className,
  ...props
}: TabsProps) => {
  const baseId = useId();
  const isControlled = controlledValue !== undefined;

  const { value, setValue } = useTabs({
    value: controlledValue,
    defaultValue,
    onValueChange,
  });

  const selectedValueRef = useRef(value);
  const pendingFallbackValueRef = useRef<string | undefined>(undefined);
  const lastSelectedValueRef = useRef<string | undefined>(undefined);
  const [focusedValue, setFocusedValue] = useState<string | undefined>(value);
  const {
    version,
    triggersRef,
    contentsRef,
    registerTrigger: registerCollectionTrigger,
    registerContent,
  } = useTabsCollection();

  const registerTrigger = useCallback(
    (
      triggerValue: string,
      element: HTMLElement | null,
      triggerDisabled = false
    ) => {
      if (!element) {
        const selectedValue = selectedValueRef.current;
        const currentTabs = triggersRef.current;
        const removedIndex = currentTabs.findIndex(
          (tab) => tab.value === triggerValue
        );

        if (selectedValue === triggerValue && removedIndex >= 0) {
          const enabledTabs = currentTabs.filter(
            (tab) => !tab.disabled && tab.value !== triggerValue
          );
          const nextTab = enabledTabs.find((tab) => {
            const currentIndex = currentTabs.findIndex(
              (item) => item.value === tab.value
            );

            return currentIndex > removedIndex;
          });
          const previousTab = [...enabledTabs].reverse().find((tab) => {
            const currentIndex = currentTabs.findIndex(
              (item) => item.value === tab.value
            );

            return currentIndex < removedIndex;
          });

          pendingFallbackValueRef.current =
            nextTab?.value ?? previousTab?.value;

          if (!isControlled && pendingFallbackValueRef.current) {
            setValue(pendingFallbackValueRef.current);
            setFocusedValue(pendingFallbackValueRef.current);
            pendingFallbackValueRef.current = undefined;
          }
        }
      }

      registerCollectionTrigger(
        triggerValue,
        element,
        disabled || triggerDisabled
      );
    },
    [
      disabled,
      isControlled,
      registerCollectionTrigger,
      setFocusedValue,
      setValue,
      triggersRef,
    ]
  );

  const { onKeyDown } = useTabsKeyboard({
    focusedValue,
    setValue,
    setFocusedValue,
    getTabs: () => triggersRef.current,
    orientation,
    activationMode,
    dir,
    loop,
  });

  const getTriggerId = useCallback(
    (triggerValue: string) => `${baseId}-trigger-${triggerValue}`,
    [baseId]
  );

  const getContentId = useCallback(
    (contentValue: string) => `${baseId}-content-${contentValue}`,
    [baseId]
  );

  const contextValue: TabsContextValue = {
    value,
    focusedValue,
    collectionVersion: version,
    setValue,
    setFocusedValue,

    mode,
    orientation,
    activationMode,
    dir,
    loop,

    variant,
    color,
    size,

    keepMounted,
    lazyMount,
    disabled,

    registerTrigger,
    registerContent,
    onTriggerKeyDown: onKeyDown,
    getTriggerId,
    getContentId,
  };

  useEffect(() => {
    selectedValueRef.current = value;
  }, [value]);

  useEffect(() => {
    const enabledTabs = triggersRef.current.filter((tab) => !tab.disabled);
    const selectedTab = enabledTabs.find((tab) => tab.value === value);
    const selectedExists = triggersRef.current.some(
      (tab) => tab.value === value
    );
    const fallbackValue =
      pendingFallbackValueRef.current ?? enabledTabs[0]?.value;

    pendingFallbackValueRef.current = undefined;

    if (isControlled) {
      if (
        process.env.NODE_ENV !== 'production' &&
        value &&
        !selectedExists &&
        triggersRef.current.length > 0
      ) {
        console.warn(`Tabs: value "${value}" does not match any Tabs.Trigger.`);
      }

      if (!selectedTab && !focusedValue && enabledTabs[0]) {
        setFocusedValue(enabledTabs[0].value);
      }

      return;
    }

    if (!value || !selectedExists) {
      if (fallbackValue) {
        setValue(fallbackValue);
        setFocusedValue(fallbackValue);
      } else {
        setFocusedValue(undefined);
      }

      return;
    }

    if (selectedTab && lastSelectedValueRef.current !== value) {
      setFocusedValue(value);
      lastSelectedValueRef.current = value;
    }
  }, [focusedValue, isControlled, setValue, triggersRef, value, version]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;

    if (mode === 'navigation') return;

    const triggerValues = triggersRef.current.map((tab) => tab.value);
    const contentValues = contentsRef.current.map((content) => content.value);
    const duplicatedValue = triggerValues.find(
      (triggerValue, index) => triggerValues.indexOf(triggerValue) !== index
    );

    if (duplicatedValue) {
      console.warn(
        `Tabs.Trigger values must be unique. Duplicate value: "${duplicatedValue}".`
      );
    }

    for (const triggerValue of triggerValues) {
      if (!contentValues.includes(triggerValue)) {
        console.warn(
          `Tabs.Trigger value "${triggerValue}" does not match any Tabs.Content.`
        );
      }
    }

    for (const contentValue of contentValues) {
      if (!triggerValues.includes(contentValue)) {
        console.warn(
          `Tabs.Content value "${contentValue}" does not match any Tabs.Trigger.`
        );
      }
    }
  }, [contentsRef, mode, triggersRef, version]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        {...props}
        className={cn(
          styles.tabs,
          orientation === 'vertical' && styles.vertical,
          className
        )}
        data-mode={mode}
        data-orientation={orientation}
        dir={dir}
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-disabled={disabled ? '' : undefined}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

TabsRoot.displayName = 'Tabs';
