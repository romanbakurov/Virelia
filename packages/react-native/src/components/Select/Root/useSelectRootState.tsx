import { useCallback, useId, useMemo, useRef, useState } from 'react';

import type { ReactNode } from 'react';
import type { TextInput, View } from 'react-native';

import {
  useOverlayDismiss,
  useOverlayFocusRestore,
  useOverlayPresentation,
  useSelect,
} from '../../../hooks';
import { useSelectCollection } from '../../../hooks/behavior/select/useSelectCollection';
import { useSelectSearch } from '../../../hooks/behavior/select/useSelectSearch';
import { useNativeFloatingPosition } from '../../../managers';
import { useFormFieldContext } from '../../../patterns/FormField';
import { resolveSelectAccessibility } from '../internal/resolveSelectAccessibility';
import type { SelectContextValue } from '../internal/types';
import type {
  SelectMultipleProps,
  SelectOption,
  SelectProps,
  SelectSingleProps,
} from '../types';

export function useSelectRootState(props: SelectProps) {
  const {
    label,
    description,
    error,
    invalid = false,
    required = false,
    disabled = false,
    placeholder = 'Select...',
    color = 'primary',
    variant = 'outline',
    size,
    open,
    defaultOpen,
    onOpenChange,
    clearable = false,
    searchable: searchableProp,
    searchPlaceholder,
    loading = false,
    loadingText = 'Loading...',
    onSearch,
    filterOptions,
    filter,
    empty,
    startIcon,
    endIcon,
    prefix,
    suffix,
    renderValue,
    renderOption,
    closeOnSelect,
    maxSelected,
    presentation = 'auto',
    placement = 'bottom-start',
    offset = 8,
    matchTriggerWidth = false,
    dismissOnBackdropPress = true,
    virtual,
    options: optionsProp,
    children,
    style,
    triggerStyle,
    textStyle,
    contentStyle,
    optionStyle,
    searchStyle,
    accessibilityLabel,
    accessibilityHint,
    testID,
  } = props;

  const field = useFormFieldContext();
  const overlayId = useId();
  const hasOwnField = Boolean(label || description || error);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>();
  const triggerRef = useRef<View | null>(null);
  const searchInputRef = useRef<TextInput>(null);
  const selectedFocusValueRef = useRef<string | undefined>(undefined);
  const resolvedPresentation = useOverlayPresentation(presentation);
  const { position, onFloatingLayout } = useNativeFloatingPosition(
    placement,
    offset
  );

  const {
    options,
    rows,
    searchableFromChildren,
    searchPlaceholderFromChildren,
    emptyFromChildren,
    loadingFromChildren,
  } = useSelectCollection(children, optionsProp);

  const resolvedSize = size ?? field?.size ?? 'md';
  const isInvalid =
    invalid || Boolean(error) || (!hasOwnField && Boolean(field?.invalid));
  const isDisabled = disabled || (!hasOwnField && Boolean(field?.disabled));
  const isRequired = required || (!hasOwnField && Boolean(field?.required));

  const controlledValue = props.multiple
    ? props.value
    : props.value === null
      ? ''
      : props.value;

  const controlledDefaultValue = props.multiple
    ? props.defaultValue
    : props.defaultValue === null
      ? ''
      : props.defaultValue;

  const {
    selectedValue,
    setSelectedValue,
    isOpen,
    openDropdown,
    closeDropdown,
    selectValue,
  } = useSelect({
    value: controlledValue as never,
    defaultValue: controlledDefaultValue as never,
    onValueChange: (nextValue: string | string[]) => {
      if (props.multiple) {
        (props as SelectMultipleProps).onValueChange?.(
          nextValue as unknown as string[]
        );
        return;
      }

      (props as SelectSingleProps).onValueChange?.(
        nextValue === '' ? null : (nextValue as string)
      );
    },
    options,
    multiple: props.multiple,
    maxSelected,
    closeOnSelect,
    disabled: isDisabled,
    open,
    defaultOpen,
    onOpenChange,
  } as never) as {
    selectedValue: string | string[];
    setSelectedValue: (value: string | string[]) => void;
    isOpen: boolean;
    openDropdown: () => void;
    closeDropdown: () => void;
    selectValue: (value: string) => void;
  };

  const { restoreFocusAfterClose } = useOverlayFocusRestore({
    active: isOpen,
    triggerRef,
  });

  const closeAndFocusTrigger = useCallback(() => {
    closeDropdown();
    restoreFocusAfterClose();
  }, [closeDropdown, restoreFocusAfterClose]);

  const selectedValues = useMemo<string[]>(() => {
    if (props.multiple) {
      return Array.isArray(selectedValue) ? selectedValue : [];
    }

    return typeof selectedValue === 'string' && selectedValue
      ? [selectedValue]
      : [];
  }, [props.multiple, selectedValue]);

  const selectedOption = useMemo(
    () =>
      options.find((option: SelectOption) =>
        selectedValues.includes(option.value)
      ),
    [options, selectedValues]
  );

  const selectedOptions = useMemo(
    () =>
      options.filter((option: SelectOption) =>
        selectedValues.includes(option.value)
      ),
    [options, selectedValues]
  );

  const optionsByValue = useMemo(
    () =>
      new Map(
        options
          .filter((option: SelectOption) => !option.disabled)
          .map((option: SelectOption) => [option.value, option])
      ),
    [options]
  );

  const { query, setQuery, shouldSearch, filteredRows } = useSelectSearch({
    rows,
    isOpen,
    searchable: searchableProp,
    searchableFromChildren,
    onSearch,
    filterOptions,
    filter,
  });

  const selectedFocusValue = selectedValues.includes(
    selectedFocusValueRef.current ?? ''
  )
    ? selectedFocusValueRef.current
    : selectedValues[0];
  const selectedRowIndex = Math.max(
    0,
    filteredRows.findIndex(
      (row) => row.type === 'item' && row.option.value === selectedFocusValue
    )
  );
  const itemHeight =
    typeof virtual === 'object' ? (virtual.estimatedItemSize ?? 46) : 46;

  const displayValue = useMemo<ReactNode>(() => {
    if (renderValue) {
      return renderValue({
        option: selectedOption,
        options: selectedOptions,
        value: selectedValues[0] ?? '',
        values: selectedValues,
        placeholder,
        multiple: Boolean(props.multiple),
      });
    }

    if (props.multiple && selectedOptions.length > 0) {
      const visibleLabels = selectedOptions
        .slice(0, 2)
        .map((option) => option.label);

      return selectedOptions.length > 2
        ? `${visibleLabels.join(', ')} +${selectedOptions.length - 2}`
        : visibleLabels.join(', ');
    }

    return selectedOption?.label ?? placeholder;
  }, [
    placeholder,
    props.multiple,
    renderValue,
    selectedOption,
    selectedOptions,
    selectedValues,
  ]);

  const { resolvedLabel, resolvedHint, announce } = resolveSelectAccessibility({
    accessibilityLabel,
    accessibilityHint,
    label: !hasOwnField ? undefined : label,
    description: !hasOwnField ? field?.description : description,
    error: !hasOwnField ? field?.error : error,
    invalid: isInvalid,
    placeholder,
    selectedLabel: selectedOption?.label,
    hasFieldContext: !hasOwnField && Boolean(field),
    fieldDescribedBy: field?.ariaDescribedBy,
  });

  const hasValue = selectedValues.length > 0;
  const dismiss = useOverlayDismiss({
    id: overlayId,
    active: isOpen,
    closeOnOutsidePress: dismissOnBackdropPress,
    requestClose: closeAndFocusTrigger,
  });

  const clearValue = useCallback(() => {
    selectedFocusValueRef.current = undefined;
    selectValue('');
    announce('Selection cleared');
  }, [announce, selectValue]);

  const selectOption = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;

      const selectedBefore = selectedValues.includes(option.value);
      const maxReached =
        Boolean(props.multiple) &&
        !selectedBefore &&
        typeof maxSelected === 'number' &&
        selectedValues.length >= maxSelected;

      if (maxReached) return;

      selectedFocusValueRef.current = option.value;
      selectValue(option.value);
      announce(`${option.label} selected`);
    },
    [announce, maxSelected, props.multiple, selectValue, selectedValues]
  );

  const selectGroup = useCallback(
    (values: string[]) => {
      if (!props.multiple || values.length === 0) return;

      const enabledValues = values.filter((value) => optionsByValue.has(value));
      const selectedGroupValues = enabledValues.filter((value) =>
        selectedValues.includes(value)
      );
      const outsideSelectedCount = selectedValues.filter(
        (value) => !enabledValues.includes(value)
      ).length;
      const maxSelectableGroupCount =
        typeof maxSelected === 'number'
          ? Math.max(
              0,
              Math.min(enabledValues.length, maxSelected - outsideSelectedCount)
            )
          : enabledValues.length;

      const shouldClearGroup =
        selectedGroupValues.length > 0 &&
        selectedGroupValues.length >= maxSelectableGroupCount;

      if (shouldClearGroup) {
        selectedFocusValueRef.current = undefined;

        setSelectedValue(
          selectedValues.filter((value) => !enabledValues.includes(value))
        );

        announce('Group selection cleared');

        return;
      }

      const nextValues = [...selectedValues];

      for (const value of enabledValues) {
        if (nextValues.includes(value)) continue;

        if (
          typeof maxSelected === 'number' &&
          nextValues.length >= maxSelected
        ) {
          break;
        }

        nextValues.push(value);
      }

      setSelectedValue(nextValues);
      selectedFocusValueRef.current = nextValues.at(-1);
      announce('Group selected');

      if (closeOnSelect) {
        closeAndFocusTrigger();
      }
    },
    [
      announce,
      closeAndFocusTrigger,
      closeOnSelect,
      maxSelected,
      optionsByValue,
      props.multiple,
      selectedValues,
      setSelectedValue,
    ]
  );

  const resolvedSearchPlaceholder =
    searchPlaceholder ?? searchPlaceholderFromChildren ?? 'Search...';

  const resolvedEmpty = empty ?? emptyFromChildren ?? 'Nothing found';
  const resolvedLoadingContent = loadingFromChildren ?? loadingText;

  const contextValue = useMemo<SelectContextValue>(
    () => ({
      color,
      variant,
      isOpen,
      loading,
      searchable: shouldSearch,
      multiple: Boolean(props.multiple),
      maxSelected,
      virtual,
      resolvedLabel,
      resolvedPresentation,
      zIndex: dismiss.zIndex,
      position,
      onFloatingLayout,
      dismissOnBackdropPress,
      matchTriggerWidth,
      triggerWidth,
      selectedValues,
      selectedOptions,
      optionsByValue,
      filteredRows,
      selectedRowIndex,
      itemHeight,
      query,
      searchPlaceholder: resolvedSearchPlaceholder,
      searchInputRef,
      empty: resolvedEmpty,
      loadingContent: resolvedLoadingContent,
      closeContent: dismiss.requestClose,
      requestOutsideClose: dismiss.requestOutsideClose,
      selectOption,
      selectGroup,
      setQuery,
      renderOption,
      contentStyle,
      optionStyle,
      searchStyle,
    }),
    [
      color,
      variant,
      isOpen,
      loading,
      shouldSearch,
      props.multiple,
      maxSelected,
      virtual,
      resolvedLabel,
      resolvedPresentation,
      dismiss.zIndex,
      position,
      onFloatingLayout,
      dismissOnBackdropPress,
      matchTriggerWidth,
      triggerWidth,
      selectedValues,
      selectedOptions,
      optionsByValue,
      filteredRows,
      selectedRowIndex,
      itemHeight,
      query,
      resolvedSearchPlaceholder,
      searchInputRef,
      resolvedEmpty,
      resolvedLoadingContent,
      dismiss.requestClose,
      dismiss.requestOutsideClose,
      selectOption,
      selectGroup,
      setQuery,
      renderOption,
      contentStyle,
      optionStyle,
      searchStyle,
    ]
  );

  return {
    contextValue,
    displayValue,
    field,
    hasOwnField,
    hasValue,
    isDisabled,
    isInvalid,
    isOpen,
    isRequired,
    clearValue,
    openDropdown,
    resolvedHint,
    resolvedLabel,
    resolvedSize,
    setTriggerWidth,
    triggerRef,
    controlProps: {
      clearable,
      color,
      endIcon,
      loading,
      prefix,
      startIcon,
      suffix,
      testID,
      textStyle,
      triggerStyle,
      variant,
    },
    formFieldProps: {
      description,
      error,
      label,
      style,
    },
  };
}
