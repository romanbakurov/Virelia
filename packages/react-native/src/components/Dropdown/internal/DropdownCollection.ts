import { Children, isValidElement } from 'react';

import type { ReactNode } from 'react';

import type {
  DropdownContentProps,
  DropdownEmptyProps,
  DropdownGroupProps,
  DropdownItem,
  DropdownItemProps,
  DropdownLabelProps,
  DropdownLoadingProps,
  DropdownMenuItem,
  DropdownSeparatorProps,
  DropdownTriggerProps,
} from '../types';
import { isGroup, isMenuItem, isSeparator } from '../types';

type DropdownSlotComponent<TProps extends object> = {
  (props: TProps): null;
  __velliraDropdownPart?:
    | 'trigger'
    | 'content'
    | 'group'
    | 'label'
    | 'separator'
    | 'item'
    | 'empty'
    | 'loading';
  displayName?: string;
};

export type NativeDropdownEntry =
  | { type: 'label'; id: string; props: DropdownLabelProps }
  | { type: 'separator'; id: string; props: DropdownSeparatorProps }
  | { type: 'empty'; id: string; props: DropdownEmptyProps }
  | { type: 'loading'; id: string; props: DropdownLoadingProps }
  | {
      type: 'item';
      id: string;
      props: DropdownItemProps;
      label: string;
      disabled?: boolean;
    };

export type ParsedNativeDropdownChildren = {
  trigger?: ReactNode;
  triggerProps?: DropdownTriggerProps;
  contentProps?: DropdownContentProps;
  entries: NativeDropdownEntry[];
  items: Array<Extract<NativeDropdownEntry, { type: 'item' }>>;
};

export function createDropdownSlot<TProps extends object>(
  name: NonNullable<DropdownSlotComponent<TProps>['__velliraDropdownPart']>,
  displayName: string
) {
  const Slot: DropdownSlotComponent<TProps> = () => null;
  Slot.__velliraDropdownPart = name;
  Slot.displayName = displayName;
  return Slot;
}

export function parseDropdownChildren(
  children: ReactNode,
  legacyItems: DropdownItem[] = []
): ParsedNativeDropdownChildren {
  let generatedId = 0;
  let trigger: ReactNode;
  let triggerProps: DropdownTriggerProps | undefined;
  let contentProps: DropdownContentProps | undefined;
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

      switch (type.__velliraDropdownPart) {
        case 'trigger':
          triggerProps = child.props as DropdownTriggerProps;
          trigger = triggerProps.children;
          return;

        case 'content':
          contentProps = child.props as DropdownContentProps;
          visit(contentProps.children);
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

  if (entries.length === 0) {
    for (const item of legacyItems) {
      if (isGroup(item)) {
        entries.push({
          type: 'label',
          id: nextId('label'),
          props: { children: item.label },
        });
        continue;
      }

      if (isSeparator(item)) {
        entries.push({
          type: 'separator',
          id: nextId('separator'),
          props: {},
        });
        continue;
      }

      if (isMenuItem(item)) {
        pushItem(fromLegacyItem(item));
      }
    }
  }

  return { contentProps, entries, items, trigger, triggerProps };
}

function fromLegacyItem(item: DropdownMenuItem): DropdownItemProps {
  return {
    children: item.label,
    value: item.value,
    icon: item.icon,
    danger: item.danger,
    disabled: item.disabled,
    textWrap: item.textWrap,
  };
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
