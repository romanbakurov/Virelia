import { useCallback, useEffect, useId, useMemo, useRef } from 'react';

import { useDropdown } from '@vellira-ui/core';
import type { Component } from 'react';
import {
  AccessibilityInfo,
  findNodeHandle,
  FlatList,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useNativeDismiss } from '../../managers';
import { useThemeStyles } from '../../theme';

import { DropdownContent } from './Content/DropdownContent';
import { DropdownGroup } from './Group/DropdownGroup';
import type { NativeDropdownEntry } from './internal/DropdownCollection';
import {
  createDropdownSlot,
  parseDropdownChildren,
} from './internal/DropdownCollection';
import { DropdownItem } from './Item/DropdownItem';
import { DropdownSeparator } from './Separator/DropdownSeparator';
import { DropdownTrigger } from './Trigger/DropdownTrigger';
import { createStyles } from './Dropdown.styles';
import type {
  DropdownContentProps,
  DropdownEmptyProps,
  DropdownGroupProps,
  DropdownItemProps,
  DropdownLabelProps,
  DropdownLoadingProps,
  DropdownProps,
  DropdownSelectEvent,
  DropdownSeparatorProps,
  DropdownTriggerProps,
} from './types';

function DropdownRoot({
  children,
  label = 'Menu',
  trigger,
  icon,
  arrowIcon,
  showArrow = true,
  open,
  defaultOpen = false,
  onOpenChange,
  presentation = 'auto',
  closeOnSelect = true,
  disabled = false,
  loading = false,
  loadingText = 'Loading actions...',
  size = 'md',
  style,
  triggerStyle,
  contentStyle,
  itemStyle,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: DropdownProps) {
  const styles = useThemeStyles(createStyles);
  const overlayId = useId();
  const { width } = useWindowDimensions();
  const triggerRef = useRef<Component | number | null>(null);
  const parsed = useMemo(() => parseDropdownChildren(children), [children]);
  const resolvedPresentation =
    presentation === 'auto'
      ? width < 768
        ? 'sheet'
        : 'popover'
      : presentation;
  const menuAccessibilityLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;

    return typeof label === 'string' ? label : 'Menu';
  }, [accessibilityLabel, label]);

  const navigableItems = useMemo(
    () =>
      parsed.items.map((item) => ({
        disabled: item.disabled,
        label: item.label,
        value: item.id,
      })),
    [parsed.items]
  );

  const { isOpen, closeDropdown, toggleDropdown } = useDropdown({
    items: navigableItems,
    open,
    defaultOpen,
    disabled,
    onOpenChange,
    getItemValue: (item) => item.value,
    getItemText: (item) =>
      typeof item.label === 'string' ? item.label : item.value,
  });

  useEffect(() => {
    if (!isOpen) return;

    AccessibilityInfo.announceForAccessibility(
      `${menuAccessibilityLabel} opened`
    );
  }, [isOpen, menuAccessibilityLabel]);

  const focusTrigger = useCallback(() => {
    if (typeof findNodeHandle !== 'function') return;

    const handle = findNodeHandle(triggerRef.current);

    if (handle && AccessibilityInfo.setAccessibilityFocus) {
      AccessibilityInfo.setAccessibilityFocus(handle);
    }
  }, []);

  const closeAndFocusTrigger = useCallback(() => {
    closeDropdown();
    requestAnimationFrame(focusTrigger);
  }, [closeDropdown, focusTrigger]);
  const dismiss = useNativeDismiss({
    id: overlayId,
    visible: isOpen,
    onClose: closeAndFocusTrigger,
  });

  const handleSelect = useCallback(
    (entry: Extract<NativeDropdownEntry, { type: 'item' }>) => {
      if (entry.disabled || loading) return;

      const event = createDropdownSelectEvent();

      entry.props.onSelect?.(event);

      const shouldClose = entry.props.closeOnSelect ?? closeOnSelect;

      if (!event.defaultPrevented && shouldClose) {
        closeAndFocusTrigger();
      }
    },
    [closeAndFocusTrigger, closeOnSelect, loading]
  );

  const handleTriggerPress = useCallback(() => {
    toggleDropdown();
  }, [toggleDropdown]);

  const renderEntry = useCallback(
    ({ item }: { item: NativeDropdownEntry }) => {
      if (item.type === 'label') {
        return <DropdownGroup label={item.props.children} />;
      }

      if (item.type === 'separator') {
        return <DropdownSeparator />;
      }

      if (item.type === 'empty') {
        return <Text style={styles.emptyText}>{item.props.children}</Text>;
      }

      if (item.type === 'loading') {
        return <Text style={styles.emptyText}>{item.props.children}</Text>;
      }

      return (
        <DropdownItem
          label={item.props.children}
          value={item.props.value ?? item.id}
          icon={item.props.icon}
          danger={item.props.danger}
          disabled={item.props.disabled}
          textWrap={item.props.textWrap}
          itemStyle={itemStyle}
          textStyle={textStyle}
          onSelect={() => handleSelect(item)}
        />
      );
    },
    [handleSelect, itemStyle, styles.emptyText, textStyle]
  );

  const data: NativeDropdownEntry[] = loading
    ? [
        {
          type: 'loading',
          id: 'loading',
          props: { children: loadingText },
        },
      ]
    : parsed.entries;

  const contentStyleFromSlot = parsed.contentProps?.style;
  const presentationFromSlot =
    parsed.contentProps?.presentation === 'auto'
      ? undefined
      : parsed.contentProps?.presentation;

  return (
    <View style={[styles.root, style]}>
      <DropdownTrigger
        label={label}
        trigger={trigger ?? parsed.trigger}
        icon={icon}
        arrowIcon={arrowIcon}
        showArrow={showArrow}
        disabled={disabled || parsed.triggerProps?.disabled}
        isOpen={isOpen}
        size={size}
        triggerRef={(node) => {
          triggerRef.current = node as Component | number | null;
        }}
        triggerStyle={triggerStyle}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        onPress={handleTriggerPress}
      />

      <DropdownContent
        isOpen={isOpen}
        onClose={dismiss.requestClose}
        contentStyle={[contentStyle, contentStyleFromSlot]}
        accessibilityLabel={menuAccessibilityLabel}
        presentation={presentationFromSlot ?? resolvedPresentation}
      >
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderEntry}
          keyboardShouldPersistTaps='handled'
          removeClippedSubviews={data.length > 24}
        />
      </DropdownContent>
    </View>
  );
}

DropdownRoot.displayName = 'Dropdown';

function createDropdownSelectEvent(): DropdownSelectEvent {
  let defaultPrevented = false;

  return {
    preventDefault: () => {
      defaultPrevented = true;
    },
    get defaultPrevented() {
      return defaultPrevented;
    },
  };
}

const DropdownTriggerSlot = createDropdownSlot<DropdownTriggerProps>(
  'trigger',
  'Dropdown.Trigger'
);
const DropdownContentSlot = createDropdownSlot<DropdownContentProps>(
  'content',
  'Dropdown.Content'
);
const DropdownItemSlot = createDropdownSlot<DropdownItemProps>(
  'item',
  'Dropdown.Item'
);
const DropdownGroupSlot = createDropdownSlot<DropdownGroupProps>(
  'group',
  'Dropdown.Group'
);
const DropdownLabelSlot = createDropdownSlot<DropdownLabelProps>(
  'label',
  'Dropdown.Label'
);
const DropdownSeparatorSlot = createDropdownSlot<DropdownSeparatorProps>(
  'separator',
  'Dropdown.Separator'
);
const DropdownEmptySlot = createDropdownSlot<DropdownEmptyProps>(
  'empty',
  'Dropdown.Empty'
);
const DropdownLoadingSlot = createDropdownSlot<DropdownLoadingProps>(
  'loading',
  'Dropdown.Loading'
);

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTriggerSlot,
  Content: DropdownContentSlot,
  Item: DropdownItemSlot,
  Group: DropdownGroupSlot,
  Label: DropdownLabelSlot,
  Separator: DropdownSeparatorSlot,
  Empty: DropdownEmptySlot,
  Loading: DropdownLoadingSlot,
});
