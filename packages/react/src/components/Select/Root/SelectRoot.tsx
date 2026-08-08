import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FormField, useFormFieldContext } from '@patterns/FormField';

import { useOverlayDismiss, useScrollLock, useSelect } from '@/hooks';

import { SelectContent, SelectContentSurface } from '../Content/SelectContent';
import { hasSelectLayoutChildren } from '../internal/SelectCollection';
import { SelectProvider } from '../internal/SelectContext';
import { useSelectCollection } from '../internal/useSelectCollection';
import { useSelectPosition } from '../internal/useSelectPosition';
import { useSelectSearch } from '../internal/useSelectSearch';
import { SelectTrigger, SelectTriggerSurface } from '../Trigger/SelectTrigger';
import type { SelectProps } from '../types';

export const SelectRoot = ({
  children,
  label,
  description,
  id,
  name,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  value: controlledValue,
  defaultValue,
  onValueChange,
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
}: SelectProps) => {
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
  const filteredOptions = useSelectSearch({
    options: resolvedOptions,
    searchable: isSearchable,
    searchValue,
  });

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
    value: controlledValue,
    defaultValue,
    onValueChange: onValueChange as
      ((value: string | string[]) => void) | undefined,
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

      const enabledValues = values.filter((value) =>
        resolvedOptions.some(
          (option) => option.value === value && !option.disabled
        )
      );
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
        setSelectedValue(
          selectedValues.filter((value) => !enabledValues.includes(value))
        );
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

  const selectedDisplay = renderValue
    ? renderValue(selectedOption)
    : multiple && selectedOptions.length
      ? selectedOptions.map((option) => option.label).join(', ')
      : (selectedOption?.label ?? placeholder);
  const emptyText = empty ?? 'No options available';
  const showClear =
    clearable && selectedValues.length > 0 && !isDisabled && !loading;

  const triggerProps = {
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
  };

  const contentProps = {
    isOpen,
    listboxId,
    labelledById: triggerId,
    style: {
      ...floatingStyles,
      zIndex: dismiss.zIndex,
    },
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
  };

  const hiddenInputs = (
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
  );

  const hasCompoundLayout = hasSelectLayoutChildren(children);

  const control = (
    <SelectProvider value={{ triggerProps, contentProps }}>
      {hiddenInputs}
      {hasCompoundLayout ? (
        children
      ) : (
        <>
          <SelectTrigger />
          <SelectContent>{children}</SelectContent>
        </>
      )}
    </SelectProvider>
  );

  const defaultControl = (
    <SelectProvider value={{ triggerProps, contentProps }}>
      {hiddenInputs}
      <SelectTriggerSurface {...triggerProps} />
      <SelectContentSurface {...contentProps} />
    </SelectProvider>
  );

  if (!hasOwnField && field) {
    return children ? control : defaultControl;
  }

  return (
    <FormField
      id={triggerId}
      label={label}
      description={description}
      error={error}
      required={isRequired}
      disabled={isDisabled}
      bindControl={false}
      className={className}
    >
      {children ? control : defaultControl}
    </FormField>
  );
};

SelectRoot.displayName = 'SelectRoot';

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
