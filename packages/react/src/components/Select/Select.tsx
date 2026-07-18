import { useCallback, useId, useMemo, useRef, useState } from 'react';

import { useFloatingPosition } from '@hooks/useFloatingPosition';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { FormField, useFormFieldContext } from '@patterns/FormField';
import { useSelect } from '@vellira-ui/core';

import { SelectDropdown } from './SelectDropdown/SelectDropdown';
import { SelectTrigger } from './SelectTrigger/SelectTrigger';
import {
  collectSelectStructure,
  hasSelectLayoutChildren,
  SelectCompoundContent,
  SelectCompoundGroup,
  SelectCompoundItem,
  SelectCompoundSeparator,
  SelectCompoundTrigger,
} from './SelectCompound';
import { SelectProvider } from './SelectContext';
import type { SelectProps } from './types';

const SelectRoot = ({
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
  noOptionsText,
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
  error,
  placement = 'bottom',
  matchTriggerWidth = true,
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
  const { entries: resolvedEntries, options: resolvedOptions } = useMemo(
    () => collectSelectStructure(children),
    [children]
  );

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchValue) return resolvedOptions;

    const normalizedSearch = searchValue.toLocaleLowerCase();

    return resolvedOptions.filter((option) =>
      `${option.label} ${option.description ?? ''}`
        .toLocaleLowerCase()
        .includes(normalizedSearch)
    );
  }, [resolvedOptions, searchable, searchValue]);

  const {
    selectedValue,
    selectedValues,
    selectedOption,
    selectedOptions,
    isOpen,
    setIsOpen,
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

  const hasSelectedOption = !!selectedOption;
  const singleSelectedValue = Array.isArray(selectedValue)
    ? (selectedValue[0] ?? '')
    : selectedValue;

  const { floatingStyles, setRef, setFloatingRef } = useFloatingPosition({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement:
      placement === 'bottom' || placement === 'top'
        ? `${placement}-start`
        : placement,
    matchTriggerWidth,
    mobileSheetBreakpoint: 640,
  });

  const handleSelect = useCallback(
    (value: string) => {
      selectValue(value);
      buttonRef.current?.focus();
    },
    [selectValue]
  );

  const handleClear = useCallback(() => {
    selectValue('');
    onClear?.();
    buttonRef.current?.focus();
  }, [onClear, selectValue]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  useOutsideClick([buttonRef, listRef], closeDropdown, isOpen);

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
  const emptyText = empty ?? noOptionsText ?? 'No options available';
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
    onClick: toggleDropdown,
    onKeyDown,
    onBlur,
    onFocus,
  };

  const dropdownProps = {
    isOpen,
    listboxId,
    labelledById: triggerId,
    style: floatingStyles,
    options: filteredOptions,
    entries: searchable || searchValue ? undefined : resolvedEntries,
    multiple,
    searchable,
    virtual,
    portal,
    searchValue,
    loading,
    loadingText,
    noOptionsText: emptyText,
    renderOption,
    selectedValue: singleSelectedValue,
    selectedValues,
    activeIndex,
    className: dropdownClassName,
    setDropdownRef,
    onSelect: handleSelect,
    onMouseEnter: setActiveIndex,
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
    <SelectProvider value={{ triggerProps, dropdownProps }}>
      {hiddenInputs}
      {hasCompoundLayout ? (
        children
      ) : (
        <>
          <SelectCompoundTrigger />
          <SelectCompoundContent>{children}</SelectCompoundContent>
        </>
      )}
    </SelectProvider>
  );

  const defaultControl = (
    <SelectProvider value={{ triggerProps, dropdownProps }}>
      {hiddenInputs}
      <SelectTrigger {...triggerProps} />
      <SelectDropdown {...dropdownProps} />
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

export const Select = Object.assign(SelectRoot, {
  Trigger: SelectCompoundTrigger,
  Content: SelectCompoundContent,
  Group: SelectCompoundGroup,
  Item: SelectCompoundItem,
  Separator: SelectCompoundSeparator,
});

(Select as { displayName?: string }).displayName = 'Select';
