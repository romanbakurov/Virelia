import { forwardRef, useId, useRef, useState } from 'react';

import { useFloatingPosition } from '@hooks/useFloatingPosition';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { useKeyboardNavigation } from '@romanbakurov/vellira-core';
import { cn } from '@utils/cn';

import { DropdownContent } from './Content/DropdownContent';
import { DropdownGroup } from './Group/DropdownGroup';
import { DropdownItem } from './Item/DropdownItem';
import { DropdownSeparator } from './Separator/DropdownSeparator';
import { DropdownTrigger } from './Trigger/DropdownTrigger';
import type { DropdownProps } from './types';
import { isGroup, isMenuItem, isSeparator } from './types';

import styles from './Dropdown.module.scss';

export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      label = 'Menu',
      icon,
      trigger,
      items,
      onSelect,
      className,
      disabled,
      rotateAngle = 90,
      placement,
      matchTriggerWidth,
      textWrap,
      showArrow = true,
      arrowIcon,
      id,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLUListElement | null>(null);
    const menuId = useId();
    const triggerId = id ?? `${menuId}-trigger`;

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

    const toggleOpen = () => {
      if (disabled) return;

      setIsOpen((prev) => {
        const next = !prev;
        if (next) {
          setActiveIndex(getFirstEnabledIndex());
        } else {
          setActiveIndex(-1);
        }
        return next;
      });
    };

    const close = () => {
      setIsOpen(false);
      setActiveIndex(-1);
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
    });

    useOutsideClick([buttonRef, menuRef], () => close(), isOpen);

    const triggerRef = (el: HTMLButtonElement | null) => {
      buttonRef.current = el;
      setRef(el);

      if (typeof ref === 'function') {
        ref(el);
        return;
      }

      if (ref) {
        ref.current = el;
      }
    };

    const menuRefCallback = (el: HTMLUListElement | null) => {
      menuRef.current = el;
      setFloatingRef(el);
      el?.focus();
    };
    const triggerContent = trigger ?? (icon && !showArrow ? undefined : label);

    return (
      <div className={cn(styles.wrapper, className)}>
        <DropdownTrigger
          {...props}
          ref={triggerRef}
          id={triggerId}
          isOpen={isOpen}
          disabled={disabled}
          icon={icon}
          label={label}
          showArrow={showArrow}
          arrowIcon={arrowIcon}
          rotateAngle={rotateAngle}
          onClick={toggleOpen}
          onKeyDown={onKeyDown}
          aria-expanded={isOpen}
          aria-haspopup='menu'
          {...(isOpen && { 'aria-controls': menuId })}
        >
          {triggerContent}
        </DropdownTrigger>

        {isOpen && (
          <DropdownContent
            ref={menuRefCallback}
            floatingStyles={floatingStyles}
            menuId={menuId}
            labelledById={triggerContent ? triggerId : undefined}
            label={!triggerContent ? label : undefined}
            activeDescendantId={activeDescendantId}
            onKeyDown={onKeyDown}
          >
            {items.map((item, index) => {
              if (isGroup(item)) {
                return (
                  <DropdownGroup
                    key={`group-${item.label}`}
                    label={item.label}
                  />
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
  }
);

Dropdown.displayName = 'Dropdown';
