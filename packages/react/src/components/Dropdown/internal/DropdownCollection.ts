import { Children, isValidElement } from 'react';

import { markCompoundSlot } from '@vellira-ui/core';
import type { ReactElement, ReactNode } from 'react';

import type {
  DropdownArrowProps,
  DropdownCheckboxItemProps,
  DropdownContentProps,
  DropdownEmptyProps,
  DropdownGroupProps,
  DropdownItemBadgeProps,
  DropdownItemDescriptionProps,
  DropdownItemIconProps,
  DropdownItemProps,
  DropdownItemShortcutProps,
  DropdownLabelProps,
  DropdownLoadingProps,
  DropdownRadioGroupProps,
  DropdownRadioItemProps,
  DropdownSeparatorProps,
  DropdownSubContentProps,
  DropdownSubProps,
  DropdownSubTriggerProps,
} from '../types';

import type {
  DropdownCollectionItem,
  DropdownParseContext,
  DropdownRenderEntry,
  DropdownSlot,
  DropdownSlotComponent,
  ParsedDropdownChildren,
} from './types';
import { getDropdownSlotPart } from './types';

type PortalElementType = {
  __velliraPortal?: true;
};

export function createDropdownSlot<TProps extends object>(
  name: DropdownSlot,
  displayName: string
) {
  const Slot: DropdownSlotComponent<TProps> = () => null;
  markCompoundSlot(Slot, name);
  Slot.displayName = displayName;
  return Slot;
}

export function parseDropdownChildren(
  children: ReactNode
): ParsedDropdownChildren {
  let generatedId = 0;
  let trigger: ParsedDropdownChildren['trigger'];
  let content: ParsedDropdownChildren['content'];
  let portal: ParsedDropdownChildren['portal'];
  let search: ParsedDropdownChildren['search'];
  const entries: DropdownRenderEntry[] = [];
  const items: DropdownCollectionItem[] = [];

  const nextId = (prefix: string) => `${prefix}-${generatedId++}`;

  function pushItem(item: DropdownCollectionItem) {
    items.push(item);
    entries.push({ type: 'item', item, itemIndex: items.length - 1 });
  }

  function visit(node: ReactNode, context: DropdownParseContext = {}) {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      const part = getDropdownSlotPart(child.type);
      const type = child.type as DropdownSlotComponent<unknown>;

      if ((type as PortalElementType).__velliraPortal) {
        portal = child as ParsedDropdownChildren['portal'];
        visit((child.props as { children?: ReactNode }).children, context);
        return;
      }

      switch (part) {
        case 'trigger':
          trigger = child as ParsedDropdownChildren['trigger'];
          return;

        case 'content':
          content = child as ParsedDropdownChildren['content'];
          visit((child.props as DropdownContentProps).children, context);
          return;

        case 'search':
          search = child as ParsedDropdownChildren['search'];
          return;

        case 'arrow':
          entries.push({
            type: 'arrow',
            id: nextId('arrow'),
            props: child.props as DropdownArrowProps,
          });
          return;

        case 'group': {
          const id = nextId('group');
          const props = child.props as DropdownGroupProps;

          entries.push({ type: 'groupStart', id, props });
          visit(props.children, context);
          entries.push({ type: 'groupEnd', id });
          return;
        }

        case 'label':
          entries.push({
            type: 'label',
            id: nextId('label'),
            props: child.props as DropdownLabelProps,
          });
          return;

        case 'separator':
          entries.push({
            type: 'separator',
            id: nextId('separator'),
            props: child.props as DropdownSeparatorProps,
          });
          return;

        case 'empty':
          entries.push({
            type: 'empty',
            id: nextId('empty'),
            props: child.props as DropdownEmptyProps,
          });
          return;

        case 'loading':
          entries.push({
            type: 'loading',
            id: nextId('loading'),
            props: child.props as DropdownLoadingProps,
          });
          return;

        case 'item': {
          const props = child.props as DropdownItemProps;
          pushItem({
            type: 'item',
            id: nextId('item'),
            props,
            label: getItemLabel(props.children),
            disabled: props.disabled,
          });
          return;
        }

        case 'checkboxItem': {
          const props = child.props as DropdownCheckboxItemProps;
          pushItem({
            type: 'checkbox',
            id: nextId('checkbox'),
            props,
            label: getItemLabel(props.children),
            disabled: props.disabled,
          });
          return;
        }

        case 'radioGroup': {
          const props = child.props as DropdownRadioGroupProps;
          const radioGroupId = nextId('radio-group');

          visit(props.children, {
            ...context,
            radioGroupId,
            radioGroupProps: props,
          });
          return;
        }

        case 'radioItem': {
          const props = child.props as DropdownRadioItemProps;
          pushItem({
            type: 'radio',
            id: nextId('radio'),
            props,
            groupId: context.radioGroupId ?? nextId('radio-group'),
            groupProps: context.radioGroupProps,
            label: getItemLabel(props.children),
            disabled: props.disabled,
          });
          return;
        }

        case 'sub': {
          const subProps = child.props as DropdownSubProps;
          const sub = collectSubParts(subProps.children);

          if (!sub.trigger) return;

          const props = sub.trigger.props as DropdownSubTriggerProps;
          const subMenu = parseDropdownChildren(sub.content?.props.children);

          pushItem({
            type: 'subTrigger',
            id: nextId('sub'),
            props,
            label: getItemLabel(props.children),
            disabled: props.disabled,
            content: sub.content?.props.children,
            subEntries: subMenu.entries,
            subItems: subMenu.items,
          });
          return;
        }

        case 'itemBadge':
        case 'itemDescription':
        case 'itemIcon':
        case 'itemShortcut':
        case 'subContent':
        case 'subTrigger':
          return;

        default:
          visit((child.props as { children?: ReactNode }).children, context);
      }
    });
  }

  visit(children);

  return { content, entries, items, portal, search, trigger };
}

export function getItemCompoundSlots(children: ReactNode) {
  let badge: ReactNode;
  let description: ReactNode;
  let icon: ReactNode;
  let shortcut: ReactNode;
  const content: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      content.push(child);
      return;
    }

    const part = getDropdownSlotPart(child.type);

    if (part === 'itemIcon') {
      icon = (child.props as DropdownItemIconProps).children;
      return;
    }

    if (part === 'itemDescription') {
      description = (child.props as DropdownItemDescriptionProps).children;
      return;
    }

    if (part === 'itemBadge') {
      badge = (child.props as DropdownItemBadgeProps).children;
      return;
    }

    if (part === 'itemShortcut') {
      shortcut = (child.props as DropdownItemShortcutProps).children;
      return;
    }

    content.push(child);
  });

  return {
    badge,
    content,
    description,
    icon,
    shortcut,
  };
}

function collectSubParts(children: ReactNode) {
  let trigger: ReactElement<DropdownSubTriggerProps> | undefined;
  let content: ReactElement<DropdownSubContentProps> | undefined;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const part = getDropdownSlotPart(child.type);

    if (part === 'subTrigger') {
      trigger = child as ReactElement<DropdownSubTriggerProps>;
    }

    if (part === 'subContent') {
      content = child as ReactElement<DropdownSubContentProps>;
    }
  });

  return { content, trigger };
}

function getItemLabel(children: ReactNode) {
  const labelParts: string[] = [];

  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        labelParts.push(String(child));
        return;
      }

      if (!isValidElement(child)) return;

      const part = getDropdownSlotPart(child.type);

      if (
        part === 'itemBadge' ||
        part === 'itemDescription' ||
        part === 'itemIcon' ||
        part === 'itemShortcut'
      ) {
        return;
      }

      visit((child.props as { children?: ReactNode }).children);
    });
  }

  visit(children);

  return labelParts.join('').trim();
}
