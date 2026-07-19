import { useState } from 'react';

import { cn } from '@utils/cn';
import { Check, ChevronRight } from '@vellira-ui/icons';
import type { MouseEvent } from 'react';

import {
  createDropdownSlot,
  getItemCompoundSlots,
} from '../internal/DropdownCollection';
import { useDropdownContext } from '../internal/DropdownContext';
import type { DropdownCollectionItem } from '../internal/types';
import type { DropdownItemProps, DropdownSelectEvent } from '../types';

import styles from './DropdownItem.module.scss';

export const DropdownItem = createDropdownSlot<DropdownItemProps>(
  'item',
  'Dropdown.Item'
);

type DropdownItemRowProps = {
  item: DropdownCollectionItem;
  itemIndex: number;
};

export const DropdownItemRow = ({ item, itemIndex }: DropdownItemRowProps) => {
  const context = useDropdownContext();
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    item.type === 'checkbox' ? (item.props.defaultChecked ?? false) : false
  );
  const isActive = context.activeIndex === itemIndex;
  const isSubOpen = context.openSubId === item.id;
  const isCheckbox = item.type === 'checkbox';
  const isRadio = item.type === 'radio';
  const isSubTrigger = item.type === 'subTrigger';
  const isChecked = isCheckbox
    ? (item.props.checked ?? uncontrolledChecked)
    : isRadio
      ? (item.groupProps?.value ?? context.radioValues[item.groupId]) ===
        item.props.value
      : false;
  const disabled = context.loading || item.disabled;
  const props = item.props;
  const slots = getItemCompoundSlots(props.children);
  const icon = slots.icon ?? props.icon;
  const description =
    slots.description ??
    ('description' in props ? props.description : undefined);
  const badge = slots.badge ?? ('badge' in props ? props.badge : undefined);
  const shortcut = slots.shortcut ?? props.shortcut;
  const content = slots.content.length ? slots.content : props.children;
  const itemColor = 'color' in props ? props.color : undefined;
  const href = item.type === 'item' ? item.props.href : undefined;
  const target = item.type === 'item' ? item.props.target : undefined;
  const download = item.type === 'item' ? item.props.download : undefined;
  const itemId = context.getItemId(itemIndex);
  const role = isCheckbox
    ? 'menuitemcheckbox'
    : isRadio
      ? 'menuitemradio'
      : 'menuitem';
  const rel =
    item.type === 'item' && target === '_blank' && !item.props.rel
      ? 'noreferrer noopener'
      : item.type === 'item'
        ? item.props.rel
        : undefined;
  const Component = href ? 'a' : 'li';

  const handleSelect = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    if (isCheckbox && item.type === 'checkbox') {
      const nextChecked = !isChecked;
      setUncontrolledChecked(nextChecked);
      item.props.onCheckedChange?.(nextChecked);
    }

    context.selectItem(item, createDropdownSelectEvent(event));
  };

  return (
    <>
      <Component
        id={itemId}
        role={role}
        href={Component === 'a' && !disabled ? href : undefined}
        target={Component === 'a' && !disabled ? target : undefined}
        rel={Component === 'a' ? rel : undefined}
        download={Component === 'a' && !disabled ? download : undefined}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-checked={isCheckbox || isRadio ? isChecked : undefined}
        aria-haspopup={isSubTrigger ? 'menu' : undefined}
        aria-expanded={isSubTrigger ? isSubOpen : undefined}
        data-active={isActive || undefined}
        data-state={isSubOpen ? 'open' : undefined}
        className={cn(
          styles.item,
          styles[context.size],
          {
            [styles.active]: isActive,
            [styles.disabled]: disabled,
            [styles.danger]: itemColor === 'danger',
            [styles.checked]: isChecked,
          },
          props.className
        )}
        onClick={handleSelect}
        onMouseEnter={() => {
          if (disabled) return;

          context.setActiveIndex(itemIndex);

          if (isSubTrigger) {
            window.setTimeout(() => context.setOpenSubId(item.id), 120);
          }
        }}
      >
        <span className={styles.indicator} aria-hidden='true'>
          {(isCheckbox || isRadio) && isChecked ? <Check /> : null}
        </span>

        {icon && <span className={styles.itemIcon}>{icon}</span>}

        <span className={styles.itemText}>
          <span className={styles.itemLabel}>{content}</span>
          {description && (
            <span className={styles.itemDescription}>{description}</span>
          )}
        </span>

        {badge && <span className={styles.itemBadge}>{badge}</span>}
        {shortcut && <span className={styles.itemShortcut}>{shortcut}</span>}
        {isSubTrigger && (
          <span className={styles.itemShortcut} aria-hidden='true'>
            <ChevronRight />
          </span>
        )}
      </Component>

      {isSubTrigger && isSubOpen && item.subEntries.length > 0 && (
        <ul role='menu' className={styles.subContent}>
          {item.subEntries.map((entry) => {
            if (entry.type === 'label') {
              return (
                <li
                  key={entry.id}
                  role='presentation'
                  className={styles.subLabel}
                >
                  {entry.props.children}
                </li>
              );
            }

            if (entry.type === 'separator') {
              return (
                <li
                  key={entry.id}
                  role='separator'
                  className={styles.subSeparator}
                  aria-hidden='true'
                />
              );
            }

            if (entry.type !== 'item') return null;

            return (
              <SubMenuItemRow
                key={entry.item.id}
                item={entry.item}
                id={`${itemId}-${entry.itemIndex}`}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};

DropdownItemRow.displayName = 'DropdownItemRow';

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

function SubMenuItemRow({
  id,
  item,
}: {
  id: string;
  item: DropdownCollectionItem;
}) {
  const context = useDropdownContext();
  const props = item.props;
  const slots = getItemCompoundSlots(props.children);
  const icon = slots.icon ?? props.icon;
  const content = slots.content.length ? slots.content : props.children;
  const disabled = context.loading || item.disabled;

  return (
    <li
      id={id}
      role='menuitem'
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      className={cn(styles.item, styles[context.size], {
        [styles.disabled]: disabled,
        [styles.danger]: 'color' in props && props.color === 'danger',
      })}
      onClick={(event) => {
        if (disabled) return;

        context.selectItem(item, createDropdownSelectEvent(event));
      }}
    >
      <span className={styles.indicator} aria-hidden='true' />
      {icon && <span className={styles.itemIcon}>{icon}</span>}
      <span className={styles.itemText}>
        <span className={styles.itemLabel}>{content}</span>
      </span>
    </li>
  );
}
