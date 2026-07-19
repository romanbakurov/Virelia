import { Children, isValidElement } from 'react';

import type { ReactNode } from 'react';

import type { SelectGroupProps } from '../Group/types';
import type { SelectItemBadgeProps } from '../Item/SelectItemBadge';
import type { SelectItemDescriptionProps } from '../Item/SelectItemDescription';
import type { SelectItemIconProps } from '../Item/SelectItemIcon';
import type { SelectItemProps } from '../Item/types';
import type { SelectOption } from '../types';

import type { SelectRenderEntry, SelectSlotComponent } from './types';

export function collectSelectOptions(children: ReactNode) {
  return collectSelectStructure(children).options;
}

export function collectSelectStructure(children: ReactNode): {
  entries: SelectRenderEntry[];
  options: SelectOption[];
} {
  const entries: SelectRenderEntry[] = [];
  const options: SelectOption[] = [];
  let generatedEntryId = 0;

  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      const type = child.type as SelectSlotComponent<unknown>;

      if (type.__velliraSelectPart === 'group') {
        const props = child.props as SelectGroupProps;

        entries.push({
          type: 'group',
          id: `group-${generatedEntryId++}`,
          label: props.label,
        });
        visit(props.children);
        return;
      }

      if (type.__velliraSelectPart === 'item') {
        const props = child.props as SelectItemProps;
        const itemChildren = getItemChildren(props.children, props.value);
        const label = props.label ?? itemChildren.label;
        const optionIndex = options.length;
        const option = {
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

      if (type.__velliraSelectPart === 'separator') {
        entries.push({
          type: 'separator',
          id: `separator-${generatedEntryId++}`,
        });
        return;
      }

      if (
        type.__velliraSelectPart === 'empty' ||
        type.__velliraSelectPart === 'icon' ||
        type.__velliraSelectPart === 'itemBadge' ||
        type.__velliraSelectPart === 'itemDescription' ||
        type.__velliraSelectPart === 'itemIcon' ||
        type.__velliraSelectPart === 'label' ||
        type.__velliraSelectPart === 'loading' ||
        type.__velliraSelectPart === 'search' ||
        type.__velliraSelectPart === 'value'
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

      const type = child.type as SelectSlotComponent<unknown>;

      if (
        type.__velliraSelectPart === 'trigger' ||
        type.__velliraSelectPart === 'content'
      ) {
        hasLayout = true;
        return;
      }

      visit((child.props as { children?: ReactNode }).children);
    });
  }

  visit(children);

  return hasLayout;
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

      const type = child.type as SelectSlotComponent<unknown>;

      if (type.__velliraSelectPart === 'itemBadge') {
        badge = (child.props as SelectItemBadgeProps).children;
        return;
      }

      if (type.__velliraSelectPart === 'itemIcon') {
        icon = (child.props as SelectItemIconProps).children;
        return;
      }

      if (type.__velliraSelectPart === 'itemDescription') {
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
