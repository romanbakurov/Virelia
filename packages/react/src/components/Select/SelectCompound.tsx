import { Children, isValidElement } from 'react';

import type { SelectColor } from '@vellira-ui/types';
import type { ReactElement, ReactNode } from 'react';

import { SelectDropdown } from './SelectDropdown/SelectDropdown';
import { SelectTrigger as SelectTriggerPrimitive } from './SelectTrigger/SelectTrigger';
import { useSelectContext } from './SelectContext';
import type { SelectOption } from './types';

type SelectCompoundPart =
  'content' | 'group' | 'item' | 'separator' | 'trigger';

type SelectCompoundComponent<P> = ((props: P) => ReactElement | null) & {
  __velliraSelectPart?: SelectCompoundPart;
  displayName?: string;
};

export interface SelectCompoundTriggerProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectCompoundContentProps {
  children?: ReactNode;
  className?: string;
}

export interface SelectCompoundGroupProps {
  children?: ReactNode;
  label: ReactNode;
}

export interface SelectCompoundItemProps {
  value: string;
  children?: ReactNode;
  label?: string;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  shortcut?: string;
  color?: SelectColor;
}

export interface SelectCompoundSeparatorProps {
  children?: never;
}

export type SelectRenderEntry =
  | {
      type: 'group';
      id: string;
      label: ReactNode;
    }
  | {
      type: 'option';
      option: SelectOption;
      optionIndex: number;
    }
  | {
      type: 'separator';
      id: string;
    };

export const SelectCompoundTrigger = ({
  children,
  className,
}: SelectCompoundTriggerProps) => {
  const { triggerProps } = useSelectContext();

  return (
    <SelectTriggerPrimitive
      {...triggerProps}
      displayText={children ?? triggerProps.displayText}
      className={[triggerProps.className, className].filter(Boolean).join(' ')}
    />
  );
};

SelectCompoundTrigger.__velliraSelectPart = 'trigger';
SelectCompoundTrigger.displayName = 'Select.Trigger';

export const SelectCompoundContent = ({
  className,
}: SelectCompoundContentProps) => {
  const { dropdownProps } = useSelectContext();

  return (
    <SelectDropdown
      {...dropdownProps}
      className={[dropdownProps.className, className].filter(Boolean).join(' ')}
    />
  );
};

SelectCompoundContent.__velliraSelectPart = 'content';
SelectCompoundContent.displayName = 'Select.Content';

export const SelectCompoundGroup: SelectCompoundComponent<
  SelectCompoundGroupProps
> = () => null;

SelectCompoundGroup.__velliraSelectPart = 'group';
SelectCompoundGroup.displayName = 'Select.Group';

export const SelectCompoundItem: SelectCompoundComponent<
  SelectCompoundItemProps
> = () => null;

SelectCompoundItem.__velliraSelectPart = 'item';
SelectCompoundItem.displayName = 'Select.Item';

export const SelectCompoundSeparator: SelectCompoundComponent<
  SelectCompoundSeparatorProps
> = () => null;

SelectCompoundSeparator.__velliraSelectPart = 'separator';
SelectCompoundSeparator.displayName = 'Select.Separator';

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

      const type = child.type as SelectCompoundComponent<unknown>;

      if (type.__velliraSelectPart === 'group') {
        const props = child.props as SelectCompoundGroupProps;

        entries.push({
          type: 'group',
          id: `group-${generatedEntryId++}`,
          label: props.label,
        });
        visit(props.children);
        return;
      }

      if (type.__velliraSelectPart === 'item') {
        const props = child.props as SelectCompoundItemProps;
        const label = props.label ?? getTextLabel(props.children, props.value);
        const optionIndex = options.length;
        const option = {
          label,
          value: props.value,
          disabled: props.disabled,
          description: props.description,
          icon: props.icon,
          badge: props.badge,
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

      const type = child.type as SelectCompoundComponent<unknown>;

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

function getTextLabel(children: ReactNode, fallback: string) {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  return fallback;
}
