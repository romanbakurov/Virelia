import { Children, isValidElement } from 'react';

import type { ReactNode } from 'react';

import type { SelectGroupProps } from '../Group/types';
import type { SelectItemProps } from '../Item/types';
import type { SelectItemBadgeProps } from '../ItemBadge';
import type { SelectItemDescriptionProps } from '../ItemDescription';
import type { SelectItemIconProps } from '../ItemIcon';

import type { SelectCollectionOption, SelectRenderEntry } from './types';
import { getSelectSlotPart } from './types';

export function collectSelectOptions(children: ReactNode) {
  return collectSelectStructure(children).options;
}

export function collectSelectStructure(children: ReactNode): {
  entries: SelectRenderEntry[];
  options: SelectCollectionOption[];
} {
  const entries: SelectRenderEntry[] = [];
  const options: SelectCollectionOption[] = [];
  let generatedEntryId = 0;

  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      const part = getSelectSlotPart(child.type);

      if (part === 'group') {
        const props = child.props as SelectGroupProps;
        const itemValues = getGroupItemValues(props.children);

        entries.push({
          type: 'group',
          id: `group-${generatedEntryId++}`,
          label: props.label,
          selectable: props.selectable,
          selectLabel: props.selectLabel,
          itemValues,
        });
        visit(props.children);
        return;
      }

      if (part === 'item') {
        const props = child.props as SelectItemProps;
        const itemChildren = getItemChildren(props.children, props.value);
        const label = props.label ?? itemChildren.label;
        const optionIndex = options.length;
        const option = {
          asChild: props.asChild,
          children: props.children,
          label,
          value: props.value,
          disabled: props.disabled,
          description: props.description ?? itemChildren.description,
          icon: props.icon ?? itemChildren.icon,
          badge: props.badge ?? itemChildren.badge,
          shortcut: props.shortcut,
          color: props.color,
        };

        options.push(option);
        entries.push({ type: 'option', option, optionIndex });
        return;
      }

      if (part === 'separator') {
        entries.push({
          type: 'separator',
          id: `separator-${generatedEntryId++}`,
        });
        return;
      }

      if (
        part === 'empty' ||
        part === 'icon' ||
        part === 'itemBadge' ||
        part === 'itemDescription' ||
        part === 'itemIcon' ||
        part === 'label' ||
        part === 'loading' ||
        part === 'search' ||
        part === 'value'
      ) {
        return;
      }

      visit((child.props as { children?: ReactNode }).children);
    });
  }

  visit(children);

  return { entries, options };
}

export function hasSelectLayoutChildren(children: ReactNode) {
  let hasLayout = false;

  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (!isValidElement(child) || hasLayout) return;

      const part = getSelectSlotPart(child.type);

      if (part === 'trigger' || part === 'content') {
        hasLayout = true;
        return;
      }

      visit((child.props as { children?: ReactNode }).children);
    });
  }

  visit(children);

  return hasLayout;
}

function getGroupItemValues(children: ReactNode) {
  const values: string[] = [];

  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      const part = getSelectSlotPart(child.type);

      if (part === 'item') {
        values.push((child.props as SelectItemProps).value);
        return;
      }

      visit((child.props as { children?: ReactNode }).children);
    });
  }

  visit(children);

  return values;
}

function getItemChildren(children: ReactNode, fallback: string) {
  let badge: ReactNode;
  let description: ReactNode;
  let icon: ReactNode;
  const labelParts: string[] = [];

  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        labelParts.push(String(child));
        return;
      }

      if (!isValidElement(child)) return;

      const part = getSelectSlotPart(child.type);

      if (part === 'itemBadge') {
        badge = (child.props as SelectItemBadgeProps).children;
        return;
      }

      if (part === 'itemIcon') {
        icon = (child.props as SelectItemIconProps).children;
        return;
      }

      if (part === 'itemDescription') {
        description = (child.props as SelectItemDescriptionProps).children;
        return;
      }

      visit((child.props as { children?: ReactNode }).children);
    });
  }

  visit(children);

  const label = labelParts.join('').trim();

  return {
    badge,
    description,
    icon,
    label: label || fallback,
  };
}
