import { useCallback, useId, useRef } from 'react';

import { useFloatingPosition } from '@hooks/useFloatingPosition';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { FormField } from '@patterns/FormField';
import { useSelect } from '@vellira-ui/core';

import { SelectDropdown } from './SelectDropdown/SelectDropdown';
import { SelectTrigger } from './SelectTrigger/SelectTrigger';
import type { SelectProps } from './types';

export const Select = ({
  label,
  description,
  id,
  name,
  'aria-label': ariaLabel,
  value: controlledValue,
  defaultValue,
  onChange,
  options,
  placeholder = 'Select...',
  noOptionsText = 'No options available',
  size = 'md',
  required = false,
  disabled = false,
  error,
  placement = 'bottom-start',
  matchTriggerWidth = true,
  open,
  defaultOpen = false,
  onOpenChange,
  onBlur,
  onFocus,
  className,
  triggerClassName,
  dropdownClassName,
}: SelectProps) => {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;
  const hasError = !!error;
  const errorId = hasError ? `${triggerId}-error` : undefined;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const {
    selectedValue,
    selectedOption,
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
    onChange,
    options,
    disabled,
    open,
    defaultOpen,
    onOpenChange,
  });

  const hasSelectedOption = !!selectedOption;

  const { floatingStyles, setRef, setFloatingRef } = useFloatingPosition({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
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

  useOutsideClick([buttonRef, listRef], closeDropdown, isOpen);

  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      setRef(node);
    },
    [setRef]
  );

  const setDropdownRef = useCallback(
    (node: HTMLUListElement | null) => {
      listRef.current = node;
      setFloatingRef(node);
    },
    [setFloatingRef]
  );

  return (
    <FormField
      id={triggerId}
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      className={className}
    >
      <SelectTrigger
        id={triggerId}
        errorId={errorId}
        isOpen={isOpen}
        disabled={disabled}
        required={required}
        listboxId={listboxId}
        activeIndex={activeIndex}
        ariaLabel={
          ariaLabel ??
          (!label ? selectedOption?.label || placeholder : undefined)
        }
        error={hasError}
        displayText={selectedOption?.label ?? placeholder}
        isPlaceholder={!hasSelectedOption}
        size={size}
        className={triggerClassName}
        buttonRef={setTriggerRef}
        onClick={toggleDropdown}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
      />

      {name && (
        <input
          type='hidden'
          name={name}
          value={selectedValue}
          disabled={disabled}
        />
      )}

      <SelectDropdown
        isOpen={isOpen}
        listboxId={listboxId}
        labelledById={triggerId}
        style={floatingStyles}
        options={options}
        noOptionsText={noOptionsText}
        selectedValue={selectedValue}
        activeIndex={activeIndex}
        className={dropdownClassName}
        setDropdownRef={setDropdownRef}
        onSelect={handleSelect}
        onMouseEnter={setActiveIndex}
      />
    </FormField>
  );
};

Select.displayName = 'Select';
