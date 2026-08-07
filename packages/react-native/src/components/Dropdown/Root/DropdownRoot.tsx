import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  AccessibilityInfo,
  findNodeHandle,
  FlatList,
  Platform,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useDropdown, useOverlayDismiss } from '../../../hooks';
import { useNativeFloatingPosition } from '../../../managers';
import { useThemeStyles } from '../../../theme';
import { DropdownContent } from '../Content/DropdownContent';
import { createStyles } from '../Dropdown.styles';
import { DropdownGroup } from '../Group/DropdownGroup';
import type { NativeDropdownEntry } from '../internal/DropdownCollection';
import { parseDropdownChildren } from '../internal/DropdownCollection';
import {
  createDropdownSelectEvent,
  filterDropdownEntries,
} from '../internal/DropdownUtils';
import { DropdownItem } from '../Item/DropdownItem';
import { DropdownSeparator } from '../Separator/DropdownSeparator';
import { DropdownTrigger } from '../Trigger/DropdownTrigger';
import type { DropdownProps } from '../types';

export function DropdownRoot({
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
  placement = 'bottom-start',
  offset = 8,
  closeOnSelect = true,
  color = 'primary',
  disabled = false,
  loading = false,
  loadingText = 'Loading actions...',
  searchable = false,
  command = false,
  searchValue,
  defaultSearchValue = '',
  searchPlaceholder,
  onSearch,
  empty,
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
  const [uncontrolledSearchValue, setUncontrolledSearchValue] =
    useState(defaultSearchValue);
  const resolvedSearchValue = searchValue ?? uncontrolledSearchValue;
  const { width } = useWindowDimensions();
  const triggerRef = useRef<View | null>(null);

  const setTriggerRef = useCallback((node: unknown) => {
    if (
      node &&
      typeof node === 'object' &&
      'measureInWindow' in node &&
      typeof node.measureInWindow === 'function'
    ) {
      triggerRef.current = node as View;
      return;
    }

    triggerRef.current = null;
  }, []);

  const parsed = useMemo(() => parseDropdownChildren(children), [children]);
  const contentCommand = parsed.contentProps?.command ?? false;
  const isSearchable =
    searchable || command || contentCommand || !!parsed.searchProps;
  const resolvedPresentation =
    presentation === 'auto'
      ? width < 768
        ? 'sheet'
        : 'popover'
      : presentation;

  const contentStyleFromSlot = parsed.contentProps?.style;

  const presentationFromSlot =
    parsed.contentProps?.presentation === 'auto'
      ? undefined
      : parsed.contentProps?.presentation;

  const contentPresentation = presentationFromSlot ?? resolvedPresentation;

  const { position, updatePosition, onFloatingLayout } =
    useNativeFloatingPosition(placement, offset);

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
  const filteredParsed = useMemo(() => {
    if (!isSearchable || !resolvedSearchValue.trim()) return parsed;

    return filterDropdownEntries(parsed, resolvedSearchValue);
  }, [isSearchable, parsed, resolvedSearchValue]);

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
    if (!isOpen || contentPresentation !== 'popover') return;

    updatePosition(triggerRef);
  }, [isOpen, contentPresentation, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    AccessibilityInfo.announceForAccessibility(
      `${menuAccessibilityLabel} opened`
    );
  }, [isOpen, menuAccessibilityLabel]);

  const focusTrigger = useCallback(() => {
    if (Platform.OS === 'web') {
      const triggerNode = triggerRef.current;

      if (
        triggerNode &&
        typeof triggerNode === 'object' &&
        'focus' in triggerNode &&
        typeof triggerNode.focus === 'function'
      ) {
        triggerNode.focus();
      }

      return;
    }

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
  const dismiss = useOverlayDismiss({
    id: overlayId,
    active: isOpen,
    requestClose: closeAndFocusTrigger,
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
  const handleSearchChange = useCallback(
    (value: string) => {
      if (searchValue === undefined) {
        setUncontrolledSearchValue(value);
      }

      onSearch?.(value);
    },
    [onSearch, searchValue]
  );

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
          rootColor={color}
          color={item.props.color}
          icon={item.props.icon}
          disabled={item.props.disabled}
          textWrap={item.props.textWrap}
          itemStyle={itemStyle}
          textStyle={textStyle}
          onSelect={() => handleSelect(item)}
        />
      );
    },
    [color, handleSelect, itemStyle, styles.emptyText, textStyle]
  );

  const data: NativeDropdownEntry[] = loading
    ? [
        {
          type: 'loading',
          id: 'loading',
          props: { children: loadingText },
        },
      ]
    : isSearchable && filteredParsed.items.length === 0
      ? [
          {
            type: 'empty',
            id: 'empty',
            props: { children: empty ?? 'No actions found' },
          },
        ]
      : filteredParsed.entries;

  return (
    <View style={[styles.root, style]}>
      <DropdownTrigger
        asChild={Boolean(parsed.trigger)}
        label={label}
        trigger={trigger ?? parsed.trigger}
        icon={icon}
        arrowIcon={arrowIcon}
        showArrow={showArrow}
        color={color}
        disabled={disabled || parsed.triggerProps?.disabled}
        isOpen={isOpen}
        size={size}
        triggerRef={setTriggerRef}
        triggerStyle={triggerStyle}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        onPress={handleTriggerPress}
      />

      <DropdownContent
        isOpen={isOpen}
        onClose={dismiss.requestClose}
        color={color}
        contentStyle={[contentStyle, contentStyleFromSlot]}
        accessibilityLabel={menuAccessibilityLabel}
        presentation={contentPresentation}
        position={position}
        onFloatingLayout={onFloatingLayout}
        searchable={isSearchable}
        searchValue={resolvedSearchValue}
        searchPlaceholder={
          parsed.searchProps?.placeholder ??
          searchPlaceholder ??
          (command || contentCommand
            ? 'Type a command...'
            : 'Search actions...')
        }
        searchAccessibilityLabel={parsed.searchProps?.accessibilityLabel}
        onSearchChange={handleSearchChange}
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
