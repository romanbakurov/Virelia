import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { resolveSelectGroupSelection } from '@vellira-ui/core';

import type { SelectContentProps } from '../Content/types';
import { hasSelectLayoutChildren } from '../internal/SelectCollection';
import type { SelectContextValue } from '../internal/SelectContext';
import { filterSelectOptions } from '../internal/SelectSearch';
import { useSelectCollection } from '../internal/useSelectCollection';
import type { SelectTriggerProps } from '../Trigger/types';
import type { SelectProps } from '../types';

import {
  useOverlayDismiss,
  useScrollLock,
  useSelect,
  useSelectPosition,
} from '#hooks';
import { useFormFieldContext } from '#patterns/FormField';

export function useSelectRootState(props: SelectProps) {
  const {
    children,
    label,
    description,
    id,
    name,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    multiple = false,
    maxSelected,
    closeOnSelect,
    placeholder = 'Select...',
    empty,
    loadingText = 'Loading...',
    size,
    color = 'primary',
    variant = 'outline',
    required = false,
    disabled = false,
    invalid = false,
    loading = false,
    clearable = false,
    searchable = false,
    virtual,
    modal = false,
    command = false,
    error,
    placement = 'bottom',
    matchTriggerWidth = true,
    avoidCollisions = true,
    portal = true,
    open,
    defaultOpen = false,
    onOpenChange,
    onSearch,
    onClear,
    startIcon,
    endIcon,
    prefix,
    suffix,
    renderValue,
    renderOption,
    onBlur,
    onFocus,
    className,
    triggerClassName,
    dropdownClassName,
  } = props;
  const generatedId = useId();
  const field = useFormFieldContext();
  const hasOwnField = Boolean(label || description || error);
  const triggerId =
    id ?? (!hasOwnField ? field?.controlId : undefined) ?? generatedId;
  const listboxId = `${triggerId}-listbox`;
  const [searchValue, setSearchValue] = useState('');
  const hasError = Boolean(error);
  const errorId = hasError ? `${triggerId}-error` : undefined;
  const descriptionId = description ? `${triggerId}-description` : undefined;
  const resolvedSize = size ?? field?.size ?? 'md';
  const isInvalid =
    invalid || hasError || (!hasOwnField && Boolean(field?.invalid));
  const isDisabled = disabled || (!hasOwnField && Boolean(field?.disabled));
  const isRequired = required || (!hasOwnField && Boolean(field?.required));
  const describedBy = [
    ariaDescribedBy,
    !hasOwnField && !ariaDescribedBy ? field?.ariaDescribedBy : undefined,
    descriptionId,
    errorId,
  ]
    .filter(Boolean)
    .join(' ');

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [isActiveOptionVisible, setIsActiveOptionVisible] = useState(false);
  const isSearchable = searchable || command;
  const { entries: resolvedEntries, options: resolvedOptions } =
    useSelectCollection(children);
  const filteredOptions = useMemo(
    () =>
      filterSelectOptions({
        options: resolvedOptions,
        searchable: isSearchable,
        searchValue,
      }),
    [isSearchable, resolvedOptions, searchValue]
  );

  const internalValue =
    props.multiple === true
      ? props.value
      : props.value === null
        ? ''
        : props.value;

  const internalDefaultValue =
    props.multiple === true
      ? props.defaultValue
      : props.defaultValue === null
        ? ''
        : props.defaultValue;

  const multipleOnValueChange =
    props.multiple === true ? props.onValueChange : undefined;

  const singleOnValueChange =
    props.multiple === true ? undefined : props.onValueChange;

  const handleValueChange = useCallback(
    (nextValue: string | string[]) => {
      if (multiple) {
        multipleOnValueChange?.(
          Array.isArray(nextValue) ? nextValue : nextValue ? [nextValue] : []
        );
        return;
      }

      singleOnValueChange?.(
        Array.isArray(nextValue)
          ? (nextValue[0] ?? null)
          : nextValue === ''
            ? null
            : nextValue
      );
    },
    [multiple, multipleOnValueChange, singleOnValueChange]
  );

  const {
    selectedValue,
    selectedValues,
    isOpen,
    setIsOpen,
    setSelectedValue,
    activeIndex,
    setActiveIndex,
    closeDropdown,
    toggleDropdown,
    selectValue,
    onKeyDown,
  } = useSelect({
    value: internalValue,
    defaultValue: internalDefaultValue,
    onValueChange: handleValueChange,
    options: filteredOptions,
    multiple,
    maxSelected,
    closeOnSelect,
    disabled: isDisabled,
    open,
    defaultOpen,
    onOpenChange,
  });

  const selectedOption = useMemo(
    () =>
      resolvedOptions.find((option) => selectedValues.includes(option.value)),
    [resolvedOptions, selectedValues]
  );
  const selectedOptions = useMemo(
    () =>
      resolvedOptions.filter((option) => selectedValues.includes(option.value)),
    [resolvedOptions, selectedValues]
  );
  const hasSelectedOption = !!selectedOption;
  const singleSelectedValue = Array.isArray(selectedValue)
    ? (selectedValue[0] ?? '')
    : selectedValue;

  const { floatingStyles, setRef, setFloatingRef } = useSelectPosition({
    isOpen,
    onOpenChange: setIsOpen,
    placement,
    matchTriggerWidth,
    avoidCollisions,
  });

  const handleSelect = useCallback(
    (value: string) => {
      selectValue(value);
      buttonRef.current?.focus();
    },
    [selectValue]
  );

  const handleSelectGroup = useCallback(
    (values: string[]) => {
      if (!multiple || values.length === 0) return;

      const nextSelection = resolveSelectGroupSelection({
        selectedValues,
        groupValues: values,
        enabledValues: new Set(
          resolvedOptions
            .filter((option) => !option.disabled)
            .map((option) => option.value)
        ),
        maxSelected,
      });

      if (nextSelection.clearedGroup) {
        setSelectedValue(nextSelection.selectedValues);
        return;
      }

      setSelectedValue(nextSelection.selectedValues);

      if (closeOnSelect) {
        closeDropdown();
        buttonRef.current?.focus();
      }
    },
    [
      closeDropdown,
      closeOnSelect,
      maxSelected,
      multiple,
      resolvedOptions,
      selectedValues,
      setSelectedValue,
    ]
  );

  const handleClear = useCallback(() => {
    selectValue('');
    onClear?.();
    buttonRef.current?.focus();
  }, [onClear, selectValue]);

  const handleTriggerClick = useCallback(() => {
    if (!isOpen) {
      setIsActiveOptionVisible(false);
    }

    toggleDropdown();
  }, [isOpen, toggleDropdown]);

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (shouldShowActiveOption(event, isOpen)) {
        setIsActiveOptionVisible(true);
      }

      onKeyDown(event);
    },
    [isOpen, onKeyDown]
  );

  const handleOptionMouseEnter = useCallback(
    (index: number) => {
      setIsActiveOptionVisible(true);
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const dismiss = useOverlayDismiss({
    active: isOpen,
    id: listboxId,
    zIndexLevel: 'dropdown',
    closeOnEscape: true,
    closeOnOutsidePress: true,
    contentRef: listRef,
    ignoreRefs: [buttonRef],
    requestClose: closeDropdown,
  });

  useEffect(() => {
    if (!isOpen) {
      setIsActiveOptionVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && searchValue) {
      setSearchValue('');
    }
  }, [isOpen, searchValue]);

  useScrollLock({
    active: isOpen,
    enabled: modal,
  });

  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      setRef(node);
    },
    [setRef]
  );

  const setDropdownRef = useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      setFloatingRef(node);
    },
    [setFloatingRef]
  );

  const selectedDisplay = useMemo(
    () =>
      renderValue
        ? renderValue({
            multiple,
            option: selectedOption,
            options: selectedOptions,
            value: singleSelectedValue,
            values: selectedValues,
          })
        : multiple && selectedOptions.length
          ? selectedOptions.map((option) => option.label).join(', ')
          : (selectedOption?.label ?? placeholder),
    [
      multiple,
      placeholder,
      renderValue,
      selectedOption,
      selectedOptions,
      selectedValues,
      singleSelectedValue,
    ]
  );
  const emptyText = empty ?? 'No options available';
  const showClear =
    clearable && selectedValues.length > 0 && !isDisabled && !loading;

  const contentStyle = useMemo(
    () => ({
      ...floatingStyles,
      zIndex: dismiss.zIndex,
    }),
    [dismiss.zIndex, floatingStyles]
  );

  const triggerProps = useMemo<SelectTriggerProps>(
    () => ({
      id: triggerId,
      describedBy: describedBy || undefined,
      labelledBy: !ariaLabel ? ariaLabelledBy : undefined,
      isOpen,
      disabled: isDisabled,
      required: isRequired,
      listboxId,
      activeIndex,
      ariaLabel:
        ariaLabel ??
        (!label && !field?.labelId
          ? selectedOption?.label || placeholder
          : undefined),
      error: isInvalid,
      loading,
      displayText: selectedDisplay,
      isPlaceholder: !hasSelectedOption,
      size: resolvedSize,
      color,
      variant,
      startIcon,
      endIcon,
      prefix,
      suffix,
      clearable: showClear,
      className: triggerClassName,
      buttonRef: setTriggerRef,
      onClear: handleClear,
      onClick: handleTriggerClick,
      onKeyDown: handleTriggerKeyDown,
      onBlur,
      onFocus,
    }),
    [
      activeIndex,
      ariaLabel,
      ariaLabelledBy,
      color,
      describedBy,
      endIcon,
      field?.labelId,
      handleClear,
      handleTriggerClick,
      handleTriggerKeyDown,
      hasSelectedOption,
      isDisabled,
      isInvalid,
      isOpen,
      isRequired,
      label,
      listboxId,
      loading,
      onBlur,
      onFocus,
      placeholder,
      prefix,
      resolvedSize,
      selectedDisplay,
      selectedOption?.label,
      setTriggerRef,
      showClear,
      startIcon,
      suffix,
      triggerClassName,
      triggerId,
      variant,
    ]
  );

  const contentProps = useMemo<SelectContentProps>(
    () => ({
      isOpen,
      listboxId,
      labelledById: triggerId,
      style: contentStyle,
      options: filteredOptions,
      entries: isSearchable || searchValue ? undefined : resolvedEntries,
      multiple,
      color,
      variant,
      searchable: isSearchable,
      command,
      virtual,
      portal,
      searchValue,
      loading,
      loadingText,
      emptyText,
      renderOption,
      selectedValue: singleSelectedValue,
      selectedValues,
      activeIndex,
      visualActiveIndex: isActiveOptionVisible ? activeIndex : -1,
      className: dropdownClassName,
      setDropdownRef,
      onSelect: handleSelect,
      onSelectGroup: handleSelectGroup,
      onMouseEnter: handleOptionMouseEnter,
      onSearchChange: handleSearchChange,
    }),
    [
      activeIndex,
      color,
      command,
      contentStyle,
      dropdownClassName,
      emptyText,
      filteredOptions,
      handleOptionMouseEnter,
      handleSearchChange,
      handleSelect,
      handleSelectGroup,
      isActiveOptionVisible,
      isOpen,
      isSearchable,
      listboxId,
      loading,
      loadingText,
      multiple,
      portal,
      renderOption,
      resolvedEntries,
      searchValue,
      selectedValues,
      setDropdownRef,
      singleSelectedValue,
      triggerId,
      variant,
      virtual,
    ]
  );

  const contextValue = useMemo<SelectContextValue>(
    () => ({ triggerProps, contentProps }),
    [contentProps, triggerProps]
  );

  const hiddenInputs = useMemo(
    () => (
      <>
        {name && multiple && selectedValues.length > 0 && (
          <>
            {selectedValues.map((value) => (
              <input
                key={value}
                type='hidden'
                name={name}
                value={value}
                disabled={isDisabled}
              />
            ))}
          </>
        )}

        {name && !multiple && (
          <input
            type='hidden'
            name={name}
            value={singleSelectedValue}
            disabled={isDisabled}
          />
        )}
      </>
    ),
    [isDisabled, multiple, name, selectedValues, singleSelectedValue]
  );

  const hasCompoundLayout = useMemo(
    () => hasSelectLayoutChildren(children),
    [children]
  );

  return {
    children,
    className,
    contentProps,
    contextValue,
    description,
    error,
    hasCompoundLayout,
    hasExternalField: !hasOwnField && Boolean(field),
    hiddenInputs,
    isDisabled,
    isRequired,
    label,
    resolvedSize,
    triggerId,
    triggerProps,
  };
}

function shouldShowActiveOption(
  event: KeyboardEvent<HTMLButtonElement>,
  isOpen: boolean
) {
  if (event.altKey || event.ctrlKey || event.metaKey) return false;

  if (!isOpen) {
    return (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Enter' ||
      event.key === ' '
    );
  }

  return (
    event.key === 'ArrowDown' ||
    event.key === 'ArrowUp' ||
    event.key === 'Home' ||
    event.key === 'End' ||
    event.key === 'Enter' ||
    event.key === ' ' ||
    event.key.length === 1
  );
}
