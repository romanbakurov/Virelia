import { useCallback, useId, useMemo, useRef } from 'react';

import { useFloatingPosition } from '@hooks/useFloatingPosition';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { cn } from '@utils/cn';
import { useDropdown } from '@vellira-ui/core';
import type { KeyboardEvent } from 'react';

import { DropdownContent } from './Content/DropdownContent';
import { DropdownGroup } from './Group/DropdownGroup';
import { DropdownItem } from './Item/DropdownItem';
import { DropdownSeparator } from './Separator/DropdownSeparator';
import { DropdownTrigger } from './Trigger/DropdownTrigger';
import type { DropdownProps } from './types';
import { isGroup, isMenuItem, isSeparator } from './types';

import styles from './Dropdown.module.scss';

export const Dropdown = ({
  label,
  ariaLabel,
  icon,
  trigger,
  items = [],
  onSelect,
  open,
  defaultOpen = false,
  onOpenChange,
  size = 'md',
  className,
  triggerClassName,
  contentClassName,
  itemClassName,
  disabled,
  rotateAngle = 90,
  placement,
  matchTriggerWidth,
  textWrap,
  showArrow = true,
  arrowIcon,
}: DropdownProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const menuId = useId();
  const triggerId = `${menuId}-trigger`;

  const { floatingStyles, setRef, setFloatingRef } = useFloatingPosition({
    placement,
    matchTriggerWidth,
    mobileSheetBreakpoint: 640,
  });

  const navigableEntries = useMemo(
    () =>
      items.flatMap((item, itemIndex) =>
        isMenuItem(item) ? [{ item, itemIndex }] : []
      ),
    [items]
  );
  const navigableItems = useMemo(
    () => navigableEntries.map(({ item }) => item),
    [navigableEntries]
  );
  const navigableIndexByItemIndex = useMemo(
    () =>
      new Map(
        navigableEntries.map(({ itemIndex }, navigableIndex) => [
          itemIndex,
          navigableIndex,
        ])
      ),
    [navigableEntries]
  );

  const handleSelect = useCallback(
    (value: string) => {
      onSelect?.(value);
      buttonRef.current?.focus();
    },
    [onSelect]
  );

  const {
    activeIndex,
    setActiveIndex,
    isOpen,
    closeDropdown,
    toggleDropdown,
    selectItem,
    onKeyDown,
  } = useDropdown({
    items: navigableItems,
    open,
    defaultOpen,
    disabled,
    onOpenChange,
    onSelect: handleSelect,
    getItemValue: (item) => item.value,
    getItemText: (item) =>
      typeof item.label === 'string' ? item.label : item.value,
  });

  const activeDescendantId =
    isOpen && activeIndex >= 0 ? `${menuId}-item-${activeIndex}` : undefined;

  useOutsideClick([buttonRef, menuRef], closeDropdown, isOpen);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement | HTMLUListElement>) => {
      onKeyDown(event);

      if (isOpen && event.key === 'Escape') {
        buttonRef.current?.focus();
      }
    },
    [isOpen, onKeyDown]
  );

  const triggerRef = useCallback(
    (el: HTMLButtonElement | null) => {
      buttonRef.current = el;
      setRef(el);
    },
    [setRef]
  );

  const menuRefCallback = useCallback(
    (el: HTMLUListElement | null) => {
      menuRef.current = el;
      setFloatingRef(el);
      el?.focus();
    },
    [setFloatingRef]
  );

  return (
    <div className={cn(styles.wrapper, className)}>
      <DropdownTrigger
        ref={triggerRef}
        id={triggerId}
        isOpen={isOpen}
        disabled={disabled}
        size={size}
        icon={icon}
        label={label}
        ariaLabel={ariaLabel}
        showArrow={showArrow}
        arrowIcon={arrowIcon}
        rotateAngle={rotateAngle}
        className={triggerClassName}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup='menu'
        {...(isOpen && { 'aria-controls': menuId })}
      >
        {trigger}
      </DropdownTrigger>

      {isOpen && (
        <DropdownContent
          ref={menuRefCallback}
          floatingStyles={floatingStyles}
          menuId={menuId}
          labelledById={trigger ? triggerId : undefined}
          label={
            ariaLabel ??
            (!trigger && typeof label === 'string' ? label : undefined)
          }
          activeDescendantId={activeDescendantId}
          onKeyDown={handleKeyDown}
          className={contentClassName}
        >
          {items.map((item, index) => {
            if (isGroup(item)) {
              return (
                <DropdownGroup key={`group-${item.label}`} label={item.label} />
              );
            }

            if (isSeparator(item)) {
              return <DropdownSeparator key={`separator-${index}`} />;
            }

            if (isMenuItem(item)) {
              const navigableIndex = navigableIndexByItemIndex.get(index) ?? -1;

              return (
                <DropdownItem
                  key={`${item.value}-${index}`}
                  id={`${menuId}-item-${navigableIndex}`}
                  {...item}
                  active={activeIndex === navigableIndex}
                  textWrap={item.textWrap || textWrap}
                  className={itemClassName}
                  onClick={() => {
                    selectItem(item);
                    buttonRef.current?.focus();
                  }}
                  onMouseEnter={() => {
                    if (navigableIndex < 0 || item.disabled) {
                      return;
                    }

                    setActiveIndex(navigableIndex);
                  }}
                >
                  {item.label}
                </DropdownItem>
              );
            }
          })}
        </DropdownContent>
      )}
    </div>
  );
};
