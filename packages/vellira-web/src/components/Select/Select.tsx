import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useFloatingPosition } from '@hooks/useFloatingPosition';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { FormField } from '@patterns/FormField';
import {
  useControllableState,
  useKeyboardNavigation,
} from '@romanbakurov/vellira-core';

import { SelectDropdown } from './SelectDropdown/SelectDropdown';
import { SelectTrigger } from './SelectTrigger/SelectTrigger';
import type { SelectProps } from './types';

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      description,
      id,
      name,
      value: controlledValue,
      defaultValue,
      onChange,
      options,
      placeholder = 'Select...',
      size = 'md',
      required = false,
      disabled = false,
      error,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const triggerId = id ?? generatedId;
    const listboxId = `${triggerId}-listbox`;
    const errorId = error ? `${triggerId}-error` : undefined;

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    const [selectedValue, setSelectedValue] = useControllableState({
      value: controlledValue,
      defaultValue: defaultValue ?? '',
      onChange,
    });

    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const selectedOption = useMemo(
      () => options.find((option) => option.value === selectedValue),
      [options, selectedValue]
    );

    const hasSelectedOption = !!selectedOption;

    const { floatingStyles, setRef, setFloatingRef } = useFloatingPosition({
      open: isOpen,
      matchTriggerWidth: true,
      mobileSheetBreakpoint: 640,
    });

    const getInitialActiveIndex = useCallback(() => {
      const selectedIndex = options.findIndex(
        (option) => option.value === selectedValue && !option.disabled
      );

      if (selectedIndex >= 0) return selectedIndex;

      return options.findIndex((option) => !option.disabled);
    }, [options, selectedValue]);

    const openDropdown = useCallback(() => {
      if (disabled) return;

      setActiveIndex(getInitialActiveIndex());
      setIsOpen(true);
    }, [disabled, getInitialActiveIndex]);

    const closeDropdown = useCallback(() => {
      setIsOpen(false);
    }, []);

    const toggleDropdown = useCallback(() => {
      if (disabled) return;

      if (isOpen) {
        closeDropdown();
        return;
      }

      openDropdown();
    }, [closeDropdown, disabled, isOpen, openDropdown]);

    const handleSelect = useCallback(
      (value: string) => {
        setSelectedValue(value);
        closeDropdown();
        buttonRef.current?.focus();
      },
      [closeDropdown, setSelectedValue]
    );

    const { onKeyDown } = useKeyboardNavigation({
      activeIndex,
      setActiveIndex,
      items: options,
      isOpen,
      onOpen: openDropdown,
      onClose: closeDropdown,
      onSelect: () => {
        const activeOption = options[activeIndex];

        if (!activeOption || activeOption.disabled) return;

        handleSelect(activeOption.value);
      },
    });

    useOutsideClick([buttonRef, listRef], closeDropdown, isOpen);

    const setTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        buttonRef.current = node;
        setRef(node);

        if (typeof ref === 'function') {
          ref(node);
          return;
        }

        if (ref) {
          ref.current = node;
        }
      },
      [ref, setRef]
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
          {...props}
          id={triggerId}
          errorId={errorId}
          isOpen={isOpen}
          size={size}
          disabled={disabled}
          required={required}
          listboxId={listboxId}
          activeIndex={activeIndex}
          ariaLabel={!label ? selectedOption?.label || placeholder : undefined}
          error={error}
          displayText={selectedOption?.label ?? placeholder}
          isPlaceholder={!hasSelectedOption}
          buttonRef={setTriggerRef}
          onClick={toggleDropdown}
          onKeyDown={onKeyDown}
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
          selectedValue={selectedValue}
          activeIndex={activeIndex}
          setDropdownRef={setDropdownRef}
          onSelect={handleSelect}
          onMouseEnter={setActiveIndex}
        />
      </FormField>
    );
  }
);

Select.displayName = 'Select';
