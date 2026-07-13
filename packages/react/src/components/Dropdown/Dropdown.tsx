import { useId, useRef, useState } from 'react';

import { useFloatingPosition } from '@hooks/useFloatingPosition';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { cn } from '@utils/cn';
import { useKeyboardNavigation } from '@vellira-ui/core';

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
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(-1);
  const isControlled = open !== undefined;
  const isOpen = open ?? uncontrolledOpen;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const menuId = useId();
  const triggerId = `${menuId}-trigger`;

  const { floatingStyles, setRef, setFloatingRef } = useFloatingPosition({
    placement,
    matchTriggerWidth,
    mobileSheetBreakpoint: 640,
  });

  const navigableItems = items.filter(isMenuItem);
  const activeDescendantId =
    isOpen && activeIndex >= 0 ? `${menuId}-item-${activeIndex}` : undefined;

  const getFirstEnabledIndex = () =>
    navigableItems.findIndex((item) => !item.disabled);

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }

    onOpenChange?.(next);

    if (next) {
      setActiveIndex(getFirstEnabledIndex());
    } else {
      setActiveIndex(-1);
    }
  };

  const toggleOpen = () => {
    if (disabled) return;

    setOpen(!isOpen);
  };

  const close = () => {
    if (!isOpen) return;

    setOpen(false);
  };

  const closeAndRestoreFocus = () => {
    close();
    buttonRef.current?.focus();
  };

  const { onKeyDown } = useKeyboardNavigation({
    activeIndex,
    setActiveIndex,
    items: navigableItems,
    isOpen,
    onOpen: toggleOpen,
    onSelect: () => {
      const item = navigableItems[activeIndex];
      if (!item || item.disabled) return;

      onSelect?.(item.value);
      closeAndRestoreFocus();
    },
    onClose: closeAndRestoreFocus,
    getItemText: (item) =>
      typeof item.label === 'string' ? item.label : item.value,
  });

  useOutsideClick([buttonRef, menuRef], () => close(), isOpen);

  const triggerRef = (el: HTMLButtonElement | null) => {
    buttonRef.current = el;
    setRef(el);
  };

  const menuRefCallback = (el: HTMLUListElement | null) => {
    menuRef.current = el;
    setFloatingRef(el);
    el?.focus();
  };

  return (
    <div className={cn(styles.wrapper, className)}>
      <DropdownTrigger
        ref={triggerRef}
        id={triggerId}
        isOpen={isOpen}
        disabled={disabled}
        icon={icon}
        label={label}
        ariaLabel={ariaLabel}
        showArrow={showArrow}
        arrowIcon={arrowIcon}
        rotateAngle={rotateAngle}
        className={triggerClassName}
        onClick={toggleOpen}
        onKeyDown={onKeyDown}
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
          onKeyDown={onKeyDown}
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
              const navigableIndex = navigableItems.findIndex(
                (i) => i === item
              );

              return (
                <DropdownItem
                  key={item.value}
                  id={`${menuId}-item-${navigableIndex}`}
                  {...item}
                  active={activeIndex === navigableIndex}
                  textWrap={item.textWrap || textWrap}
                  className={itemClassName}
                  onClick={() => {
                    if (!item.disabled) {
                      onSelect?.(item.value);
                      closeAndRestoreFocus();
                    }
                  }}
                  onMouseEnter={() => {
                    if (navigableIndex < 0 || item.disabled) return;

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
