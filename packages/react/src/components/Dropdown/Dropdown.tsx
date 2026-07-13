import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

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
  const activeDescendantId =
    isOpen && activeIndex >= 0 ? `${menuId}-item-${activeIndex}` : undefined;

  const getFirstEnabledIndex = useCallback(
    () => navigableItems.findIndex((item) => !item.disabled),
    [navigableItems]
  );

  const getLastEnabledIndex = useCallback(() => {
    for (let index = navigableItems.length - 1; index >= 0; index--) {
      if (!navigableItems[index]?.disabled) {
        return index;
      }
    }

    return -1;
  }, [navigableItems]);

  const syncActiveIndex = useCallback(
    (nextOpen: boolean, initialIndex?: number) => {
      if (nextOpen) {
        setActiveIndex((currentIndex) => {
          if (currentIndex >= 0 && !navigableItems[currentIndex]?.disabled) {
            return currentIndex;
          }

          return initialIndex ?? getFirstEnabledIndex();
        });

        return;
      }

      setActiveIndex(-1);
    },
    [getFirstEnabledIndex, navigableItems]
  );

  useEffect(() => {
    syncActiveIndex(isOpen);
  }, [isOpen, syncActiveIndex]);

  const setOpen = useCallback(
    (next: boolean, initialIndex?: number) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }

      onOpenChange?.(next);
      syncActiveIndex(next, initialIndex);
    },
    [isControlled, onOpenChange, syncActiveIndex]
  );

  const openDropdown = useCallback(
    (initialIndex = getFirstEnabledIndex()) => {
      if (disabled) return;

      setOpen(true, initialIndex);
    },
    [disabled, getFirstEnabledIndex, setOpen]
  );

  const toggleOpen = useCallback(() => {
    if (disabled) return;

    if (isOpen) {
      setOpen(false);
      return;
    }

    openDropdown();
  }, [disabled, isOpen, openDropdown, setOpen]);

  const close = useCallback(() => {
    if (!isOpen) return;

    setOpen(false);
  }, [isOpen, setOpen]);

  const closeAndRestoreFocus = useCallback(() => {
    close();
    buttonRef.current?.focus();
  }, [close]);

  const { onKeyDown } = useKeyboardNavigation({
    activeIndex,
    setActiveIndex,
    items: navigableItems,
    isOpen,
    onOpen: (event) => {
      openDropdown(
        event.key === 'ArrowUp' ? getLastEnabledIndex() : getFirstEnabledIndex()
      );
    },
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
                    if (!item.disabled) {
                      onSelect?.(item.value);
                      closeAndRestoreFocus();
                    }
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
