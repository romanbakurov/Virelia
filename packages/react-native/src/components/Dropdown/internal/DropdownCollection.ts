import { Children, isValidElement } from 'react';

import { getCompoundSlot, markCompoundSlot } from '@vellira-ui/core';
import type { ReactNode } from 'react';

import type {
  DropdownContentProps,
  DropdownEmptyProps,
  DropdownGroupProps,
  DropdownItemProps,
  DropdownLabelProps,
  DropdownLoadingProps,
  DropdownSearchProps,
  DropdownSeparatorProps,
  DropdownTriggerProps,
} from '../types';

import type {
  NativeDropdownEntry,
  ParsedNativeDropdownChildren,
} from './types';

type DropdownSlot =
  | 'trigger'
  | 'content'
  | 'group'
  | 'label'
  | 'separator'
  | 'item'
  | 'empty'
  | 'loading'
  | 'search';

type DropdownSlotComponent<TProps extends object> = {
  (props: TProps): null;
  displayName?: string;
};

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
): ParsedNativeDropdownChildren {
  let generatedId = 0;
  let trigger: ReactNode;
  let triggerProps: DropdownTriggerProps | undefined;
  let contentProps: DropdownContentProps | undefined;
  let searchProps: DropdownSearchProps | undefined;
  const entries: NativeDropdownEntry[] = [];
  const items: ParsedNativeDropdownChildren['items'] = [];

  const nextId = (prefix: string) => `${prefix}-${generatedId++}`;

  function pushItem(props: DropdownItemProps) {
    const entry = {
      type: 'item' as const,
      id: nextId('item'),
      props,
      label: getItemLabel(props.children) || props.value || '',
      disabled: props.disabled,
    };

    items.push(entry);
    entries.push(entry);
  }

  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      const type = child.type as DropdownSlotComponent<object>;
      const slot = getCompoundSlot<DropdownSlot>(type);

      if ((type as PortalElementType).__velliraPortal) {
        visit((child.props as { children?: ReactNode }).children);
        return;
      }

      switch (slot) {
        case 'trigger':
          triggerProps = child.props as DropdownTriggerProps;
          trigger = triggerProps.children;
          return;

        case 'content':
          contentProps = child.props as DropdownContentProps;
          visit(contentProps.children);
          return;

        case 'search':
          searchProps = child.props as DropdownSearchProps;
          return;

        case 'group':
          visit((child.props as DropdownGroupProps).children);
          return;

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

        case 'item':
          pushItem(child.props as DropdownItemProps);
          return;

        default:
          visit((child.props as { children?: ReactNode }).children);
      }
    });
  }

  visit(children);

  return { contentProps, entries, items, searchProps, trigger, triggerProps };
}

function getItemLabel(children: ReactNode) {
  const labelParts: string[] = [];

  Children.forEach(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      labelParts.push(String(child));
    }
  });

  return labelParts.join('').trim();
}
