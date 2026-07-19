import { useEffect, useMemo, useRef, useState } from 'react';

import { useSelect } from '@vellira-ui/core';
import type { TextInput } from 'react-native';
import { View } from 'react-native';

import { FormField, useFormFieldContext } from '../../../patterns/FormField';
import { SelectContentSurface } from '../Content';
import { SelectContext } from '../internal/SelectContext';
import { useSelectAccessibility } from '../internal/useSelectAccessibility';
import { useSelectCollection } from '../internal/useSelectCollection';
import { useSelectPresentation } from '../internal/useSelectPresentation';
import { useSelectSearch } from '../internal/useSelectSearch';
import { SelectTrigger } from '../Trigger';
import type {
  SelectMultipleProps,
  SelectOption,
  SelectProps,
  SelectSingleProps,
} from '../types';

export function SelectRoot(props: SelectProps) {
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
    placement = 'bottom',
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
  const hasOwnField = Boolean(label || description || error);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>();
  const searchInputRef = useRef<TextInput>(null);
  const resolvedPresentation = useSelectPresentation(presentation);

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

  const { selectedValue, isOpen, openDropdown, closeDropdown, selectValue } =
    useSelect({
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
      isOpen: boolean;
      openDropdown: () => void;
      closeDropdown: () => void;
      selectValue: (value: string) => void;
    };

  const selectedValues = Array.isArray(selectedValue)
    ? selectedValue
    : selectedValue
      ? [selectedValue]
      : [];
  const selectedOption = options.find((option: SelectOption) =>
    selectedValues.includes(option.value)
  );
  const selectedOptions = options.filter((option: SelectOption) =>
    selectedValues.includes(option.value)
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

  const selectedRowIndex = Math.max(
    0,
    filteredRows.findIndex(
      (row) => row.type === 'item' && selectedValues.includes(row.option.value)
    )
  );
  const itemHeight =
    typeof virtual === 'object' ? (virtual.estimatedItemSize ?? 52) : 52;

  useEffect(() => {
    if (isOpen && shouldSearch) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [isOpen, shouldSearch]);

  const displayValue = useMemo(() => {
    if (renderValue) {
      return renderValue(
        props.multiple ? selectedOptions : (selectedOption ?? null),
        { placeholder, multiple: Boolean(props.multiple) }
      );
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
  ]);

  const { resolvedLabel, resolvedHint, announce } = useSelectAccessibility({
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

  const clearValue = () => {
    selectValue('');
    announce('Selection cleared');
  };

  const selectOption = (option: SelectOption) => {
    if (option.disabled) return;

    const selectedBefore = selectedValues.includes(option.value);
    const maxReached =
      Boolean(props.multiple) &&
      !selectedBefore &&
      typeof maxSelected === 'number' &&
      selectedValues.length >= maxSelected;

    if (maxReached) return;

    selectValue(option.value);
    announce(`${option.label} selected`);
  };

  const contextValue = {
    label,
    description,
    error,
    placeholder,
    color,
    variant,
    size: resolvedSize,
    isOpen,
    hasValue,
    loading,
    clearable,
    searchable: shouldSearch,
    maxSelected,
    virtual,
    resolvedLabel,
    resolvedHint,
    resolvedPresentation,
    placement,
    dismissOnBackdropPress,
    matchTriggerWidth,
    triggerWidth,
    selectedValues,
    selectedOptions,
    rows,
    filteredRows,
    selectedRowIndex,
    itemHeight,
    query,
    searchPlaceholder:
      searchPlaceholder ?? searchPlaceholderFromChildren ?? 'Search...',
    searchInputRef,
    empty: empty ?? emptyFromChildren ?? 'Nothing found',
    loadingContent: loadingFromChildren ?? loadingText,
    closeContent: closeDropdown,
    openContent: openDropdown,
    clearValue,
    selectOption,
    setQuery,
    renderValue,
    renderOption,
    startIcon,
    endIcon,
    prefix,
    suffix,
    triggerStyle,
    textStyle,
    contentStyle,
    optionStyle,
    searchStyle,
    fieldControlId: !hasOwnField ? field?.controlId : undefined,
    fieldLabelId: !hasOwnField ? field?.labelId : undefined,
    fieldDescribedBy: !hasOwnField ? field?.ariaDescribedBy : undefined,
  };

  const control = (
    <SelectContext.Provider value={contextValue}>
      <View
        testID={testID}
        onLayout={(event) => setTriggerWidth(event.nativeEvent.layout.width)}
      >
        <SelectTrigger
          displayText={displayValue}
          isPlaceholder={!hasValue}
          isOpen={isOpen}
          hasValue={hasValue}
          size={resolvedSize}
          color={color}
          variant={variant}
          disabled={isDisabled}
          required={isRequired}
          hasError={isInvalid}
          loading={loading}
          clearable={clearable}
          startIcon={startIcon}
          endIcon={endIcon}
          prefix={prefix}
          suffix={suffix}
          nativeID={!hasOwnField ? field?.controlId : undefined}
          accessibilityLabel={resolvedLabel}
          accessibilityHint={resolvedHint}
          accessibilityLabelledBy={!hasOwnField ? field?.labelId : undefined}
          ariaDescribedBy={!hasOwnField ? field?.ariaDescribedBy : undefined}
          triggerStyle={triggerStyle}
          textStyle={textStyle}
          onPress={openDropdown}
          onClear={clearValue}
        />
        <SelectContentSurface />
      </View>
    </SelectContext.Provider>
  );

  if (!hasOwnField && field) {
    return control;
  }

  return (
    <FormField
      label={label}
      description={description}
      error={error}
      required={isRequired}
      disabled={isDisabled}
      invalid={isInvalid}
      size={resolvedSize}
      style={style}
    >
      {control}
    </FormField>
  );
}

SelectRoot.displayName = 'Select';
