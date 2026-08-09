import { Children, isValidElement } from 'react';

import { getCompoundSlot, markCompoundSlot } from '@vellira-ui/core';
import type { ReactNode } from 'react';

import type {
  SelectContentProps,
  SelectEmptyProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectLoadingProps,
  SelectSearchProps,
} from '../types';

import type {
  ParsedSelectChildren,
  SelectCollectionRow,
  SelectSlot,
} from './types';

export const createSelectSlot = <TProps extends object>(
  name: SelectSlot,
  displayName: string
) => {
  const Slot = (_props: TProps) => null;
  markCompoundSlot(Slot, name);
  Slot.displayName = displayName;
  return Slot;
};

export const getSelectSlot = (type: unknown) =>
  getCompoundSlot<SelectSlot>(type);

export const defaultSelectFilter = (option: SelectItemProps, query: string) =>
  option.label.toLowerCase().includes(query.trim().toLowerCase());

const getTextFromNode = (node: ReactNode): string | undefined => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  return undefined;
};

const getGroupLabel = (props: SelectGroupProps) => {
  if (props.label) return props.label;

  let label: string | undefined;

  Children.forEach(props.children, (child) => {
    if (label || !isValidElement(child)) return;

    if (getSelectSlot(child.type) === 'label') {
      label = getTextFromNode((child.props as SelectLabelProps).children);
    }
  });

  return label;
};

const getGroupItemValues = (children: ReactNode) => {
  const values: string[] = [];

  const visit = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      const slot = getSelectSlot(child.type);

      if (slot === 'content') {
        visit((child.props as SelectContentProps).children);
        return;
      }

      if (slot === 'group') {
        visit((child.props as SelectGroupProps).children);
        return;
      }

      if (slot === 'item') {
        values.push((child.props as SelectItemProps).value);
      }
    });
  };

  visit(children);

  return values;
};

export const parseSelectChildren = (
  children: ReactNode
): ParsedSelectChildren => {
  const options: SelectItemProps[] = [];
  const rows: SelectCollectionRow[] = [];
  let searchable = false;
  let searchPlaceholder: string | undefined;
  let empty: ReactNode;
  let loading: ReactNode;

  const visit = (node: ReactNode, group?: string) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      const slot = getSelectSlot(child.type);

      if (slot === 'content') {
        visit((child.props as SelectContentProps).children, group);
        return;
      }

      if (slot === 'search') {
        searchable = true;
        searchPlaceholder = (child.props as SelectSearchProps).placeholder;
        return;
      }

      if (slot === 'empty') {
        empty = (child.props as SelectEmptyProps).children;
        return;
      }

      if (slot === 'loading') {
        loading = (child.props as SelectLoadingProps).children;
        return;
      }

      if (slot === 'group') {
        const props = child.props as SelectGroupProps;
        const groupLabel = getGroupLabel(props);

        if (groupLabel) {
          rows.push({
            type: 'group',
            key: `group-${groupLabel}-${rows.length}`,
            label: groupLabel,
            selectable: props.selectable,
            selectLabel: props.selectLabel,
            itemValues: getGroupItemValues(props.children),
          });
        }

        visit(props.children, groupLabel);
        return;
      }

      if (slot === 'label') {
        return;
      }

      if (slot === 'separator') {
        rows.push({ type: 'separator', key: `separator-${rows.length}` });
        return;
      }

      if (slot === 'item') {
        const props = child.props as SelectItemProps;
        const option = {
          value: props.value,
          label: props.label,
          disabled: props.disabled,
          description: props.description,
          icon: props.icon,
          badge: props.badge,
          color: props.color,
          accessibilityLabel: props.accessibilityLabel,
          accessibilityHint: props.accessibilityHint ?? group,
        } satisfies SelectItemProps;

        options.push(option);
        rows.push({
          type: 'item',
          key: `item-${props.value}`,
          option,
        });
      }
    });
  };

  visit(children);

  return { options, rows, searchable, searchPlaceholder, empty, loading };
};
