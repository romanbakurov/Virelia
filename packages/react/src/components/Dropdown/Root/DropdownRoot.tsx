import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn } from '@utils/cn';
import {
  overlayManager,
  useDismissManager,
  useDropdown,
} from '@vellira-ui/core';
import type { KeyboardEvent, MouseEvent } from 'react';

import { useFloatingPosition } from '@/managers/FloatingManager';

import { DropdownContent } from '../Content';
import { toCssSize } from '../internal/composeEventHandlers';
import { parseDropdownChildren } from '../internal/DropdownCollection';
import {
  DropdownProvider,
  DropdownTriggerProvider,
} from '../internal/DropdownContext';
import type { DropdownCollectionItem } from '../internal/types';
import type { DropdownProps, DropdownSelectEvent } from '../types';

import styles from '../Dropdown.module.scss';

export const DropdownRoot = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  size = 'md',
  color = 'primary',
  placement = 'bottom-start',
  offset = 2,
  matchTriggerWidth = false,
  minWidth,
  maxWidth,
  portal = true,
  avoidCollisions = true,
  modal = false,
  closeOnSelect = true,
  loop = true,
  disabled = false,
  loading = false,
  loadingText = 'Loading actions...',
  className,
}: DropdownProps) => {
  const generatedId = useId();
  const triggerId = `${generatedId}-trigger`;
  const contentId = `${generatedId}-menu`;
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const [openSubId, setOpenSubId] = useState<string | undefined>();
  const [radioValues, setRadioValues] = useState<
    Record<string, string | undefined>
  >({});

  const parsed = useMemo(() => parseDropdownChildren(children), [children]);
  const allItems = useMemo(
    () => collectDropdownItems(parsed.items),
    [parsed.items]
  );
  const navigableItems = useMemo(
    () =>
      parsed.items.map((item) => ({
        disabled: item.disabled,
        label: item.label,
      })),
    [parsed.items]
  );

  useEffect(() => {
    setRadioValues((current) => {
      const next = { ...current };

      allItems.forEach((item) => {
        if (item.type !== 'radio') return;
        if (next[item.groupId] !== undefined) return;

        next[item.groupId] =
          item.groupProps?.value ?? item.groupProps?.defaultValue;
      });

      return next;
    });
  }, [allItems]);

  const { floatingStyles, setRef, setFloatingRef } = useFloatingPosition({
    open,
    onOpenChange,
    placement,
    matchTriggerWidth,
    avoidCollisions,
    offset,
    mobileSheetBreakpoint: 640,
  });

  const {
    activeIndex,
    setActiveIndex,
    isOpen,
    closeDropdown,
    toggleDropdown,
    onKeyDown,
  } = useDropdown({
    items: navigableItems,
    open,
    defaultOpen,
    disabled,
    onOpenChange,
    getItemValue: (_item, index) => parsed.items[index]?.id ?? '',
    getItemText: (item) => item.label,
    loop,
  });

  useEffect(() => {
    if (!isOpen) return;

    overlayManager.add(contentId);

    return () => {
      overlayManager.remove(contentId);
    };
  }, [contentId, isOpen]);

  useEffect(() => {
    if (!modal || !isOpen) return;

    overlayManager.lockScroll();

    return () => {
      overlayManager.unlockScroll();
    };
  }, [isOpen, modal]);

  const closeAndFocusTrigger = useCallback(() => {
    closeDropdown();
    triggerRef.current?.focus();
  }, [closeDropdown]);

  const selectItem = useCallback(
    (item: DropdownCollectionItem, event: DropdownSelectEvent) => {
      if (item.disabled || loading) return;

      if (item.type === 'subTrigger') {
        setOpenSubId(item.id);
        return;
      }

      if (item.type === 'item') {
        item.props.onSelect?.(event);
      }

      if (item.type === 'radio') {
        setRadioValues((current) => ({
          ...current,
          [item.groupId]: item.props.value,
        }));
        item.groupProps?.onValueChange?.(item.props.value);
      }

      const shouldClose =
        item.props.closeOnSelect ??
        (item.type === 'checkbox' ? false : closeOnSelect);

      if (!event.defaultPrevented && shouldClose) {
        closeAndFocusTrigger();
      }
    },
    [closeAndFocusTrigger, closeOnSelect, loading]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const activeItem = parsed.items[activeIndex];

      if (event.key === 'ArrowRight' && activeItem?.type === 'subTrigger') {
        event.preventDefault();
        setOpenSubId(activeItem.id);
        return;
      }

      if (event.key === 'ArrowLeft' && openSubId) {
        event.preventDefault();
        setOpenSubId(undefined);
        return;
      }

      if ((event.key === 'Enter' || event.key === ' ') && activeItem) {
        event.preventDefault();
        const selectEvent = createDropdownSelectEvent(event);
        selectItem(activeItem, selectEvent);
        return;
      }

      onKeyDown(event);

      if (event.key === 'Escape') {
        triggerRef.current?.focus();
      }
    },
    [activeIndex, onKeyDown, openSubId, parsed.items, selectItem]
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      toggleDropdown();
    },
    [toggleDropdown]
  );

  const setTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;
      setRef(node);
    },
    [setRef]
  );

  const setContentRef = useCallback(
    (node: HTMLElement | null) => {
      contentRef.current = node;
      setFloatingRef(node);
      node?.focus();
    },
    [setFloatingRef]
  );

  useDismissManager({
    active: isOpen,
    closeOnEscape: true,
    closeOnOutsidePress: true,
    contentRef,
    ignoreRefs: [triggerRef],
    isTopOverlay: () => overlayManager.isTop(contentId),
    requestClose: closeDropdown,
  });

  const surfaceStyle = {
    ...floatingStyles,
    minWidth: toCssSize(minWidth),
    maxWidth: toCssSize(maxWidth),
  };

  const triggerContext = {
    disabled,
    isOpen,
    contentId,
    triggerId,
    setTriggerRef,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  const dropdownContext = {
    activeIndex,
    closeOnSelect,
    color,
    contentId,
    contentProps: parsed.content?.props,
    disabled,
    entries: parsed.entries,
    getItemId: (index: number) => `${contentId}-item-${index}`,
    isOpen,
    items: parsed.items,
    loading,
    loadingText,
    maxWidth,
    minWidth,
    openSubId,
    onKeyDown: handleKeyDown,
    portal,
    radioValues,
    selectItem,
    setActiveIndex,
    setContentRef,
    setOpenSubId,
    setRadioValue: (groupId: string, value: string) => {
      setRadioValues((current) => ({ ...current, [groupId]: value }));
    },
    size,
    surfaceStyle,
    triggerId,
  };

  return (
    <DropdownTriggerProvider value={triggerContext}>
      <DropdownProvider value={dropdownContext}>
        <div
          className={cn(styles.wrapper, className)}
          data-disabled={disabled || undefined}
        >
          {parsed.trigger ?? null}
          {parsed.content ?? <DropdownContent />}
        </div>
      </DropdownProvider>
    </DropdownTriggerProvider>
  );
};

DropdownRoot.displayName = 'DropdownRoot';

function createDropdownSelectEvent(
  originalEvent: DropdownSelectEvent['originalEvent']
) {
  let defaultPrevented = false;

  return {
    originalEvent,
    preventDefault: () => {
      defaultPrevented = true;
    },
    get defaultPrevented() {
      return defaultPrevented;
    },
  };
}

function collectDropdownItems(items: DropdownCollectionItem[]) {
  const result: DropdownCollectionItem[] = [];

  items.forEach((item) => {
    result.push(item);

    if (item.type === 'subTrigger') {
      result.push(...collectDropdownItems(item.subItems));
    }
  });

  return result;
}
